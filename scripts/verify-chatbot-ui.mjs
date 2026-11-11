// End-to-end verification of the Rezonants AI Assistant through the REAL chatbot
// UI: launches headless Chrome, opens the widget, types/clicks exactly like a
// visitor, and asserts on the rendered replies.
//
// Requires the dev server: npm run dev
import { spawn } from 'node:child_process'
import { rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const SITE = process.env.SITE_URL || 'http://localhost:5173/'
const CDP_PORT = 9444
const PROFILE = join(tmpdir(), 'rezonants-chatbot-e2e-profile')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ─── CDP plumbing ────────────────────────────────────────────────────────────

let msgId = 0
const pending = new Map()
let ws = null

function send(method, params = {}) {
  const id = ++msgId
  ws.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => {
    pending.set(id, (m) => (m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result)))
  })
}

async function ev(expression) {
  const r = await send('Runtime.evaluate', {
    expression: `(() => { ${expression} })()`,
    awaitPromise: true,
    returnByValue: true,
  })
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails.exception || r.exceptionDetails))
  return r.result.value
}

async function waitForChrome() {
  const url = `http://127.0.0.1:${CDP_PORT}/json/list`
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(url)).json()
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
      if (page) return page.webSocketDebuggerUrl
    } catch {
      // not up yet
    }
    await sleep(500)
  }
  throw new Error('Chrome DevTools endpoint never came up')
}

// ─── Chat driver ─────────────────────────────────────────────────────────────

async function openChat() {
  await ev(
    `const b = document.querySelector('.chatbot-toggle')
     if (b) { b.click(); return true }
     return false`,
  )
}

async function messages() {
  return ev(
    `return Array.from(document.querySelectorAll('.chatbot-message-content')).map((e) => e.textContent)`,
  )
}

async function sendText(text) {
  const before = (await messages()).length
  await ev(
    `const ta = document.querySelector('.chatbot-input')
     if (!ta) return false
     const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
     setter.call(ta, ${JSON.stringify(text)})
     ta.dispatchEvent(new Event('input', { bubbles: true }))
     return true`,
  )
  await ev(
    `const f = document.querySelector('.chatbot-input-area')
     if (!f) return false
     if (typeof f.requestSubmit === 'function') f.requestSubmit()
     else f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
     return true`,
  )

  const start = Date.now()
  while (Date.now() - start < 30000) {
    await sleep(300)
    const state = await ev(
      `return { n: document.querySelectorAll('.chatbot-message-content').length, typing: !!document.querySelector('.typing-indicator') }`,
    )
    if (!state.typing && state.n > before) return messages()
  }
  throw new Error(`Timed out waiting for a reply to: ${text}`)
}

async function clickOption(labelStartsWith) {
  const before = (await messages()).length
  const clicked = await ev(
    `const b = Array.from(document.querySelectorAll('.chatbot-quick-btn'))
       .find((x) => x.textContent.trim().startsWith(${JSON.stringify(labelStartsWith)}))
     if (!b) return false
     b.click()
     return true`,
  )
  if (!clicked) throw new Error(`No clickable option "${labelStartsWith}" was rendered`)

  const start = Date.now()
  while (Date.now() - start < 30000) {
    await sleep(300)
    const state = await ev(
      `return { n: document.querySelectorAll('.chatbot-message-content').length, typing: !!document.querySelector('.typing-indicator') }`,
    )
    if (!state.typing && state.n > before) return messages()
  }
  throw new Error(`Timed out waiting for a reply to option "${labelStartsWith}"`)
}

const optionCount = () => ev(`return document.querySelectorAll('.chatbot-quick-btn').length`)

// ─── Assertions ──────────────────────────────────────────────────────────────

const FALLBACK = /I don't have enough information to answer that yet|isn't something listed among Rezonants' services/
let pass = 0
let fail = 0
const last = (list) => list[list.length - 1]

function check(label, value, predicate) {
  const ok = predicate(value)
  if (ok) pass++
  else fail++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`)
  if (!ok) console.log(`      got: ${JSON.stringify(value).slice(0, 500)}`)
}

// ─── Run ─────────────────────────────────────────────────────────────────────

let chrome = null

try {
  rmSync(PROFILE, { recursive: true, force: true })
  chrome = spawn(
    CHROME,
    [
      '--headless=new', '--disable-gpu', '--no-sandbox',
      `--remote-debugging-port=${CDP_PORT}`,
      `--user-data-dir=${PROFILE}`,
      '--no-first-run', '--no-default-browser-check', '--hide-scrollbars',
      SITE,
    ],
    { stdio: 'ignore' },
  )

  const wsUrl = await waitForChrome()
  ws = new WebSocket(wsUrl)
  await new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = reject
  })
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data)
    if (m.id && pending.has(m.id)) {
      const cb = pending.get(m.id)
      pending.delete(m.id)
      cb(m)
    }
  }
  await send('Runtime.enable')

  // Wait for React to mount, then open the widget.
  const readyAt = Date.now()
  while (Date.now() - readyAt < 30000) {
    if (await ev(`return !!document.querySelector('.chatbot-toggle')`)) break
    await sleep(400)
  }
  await openChat()
  await sleep(600)
  console.log(`Opened ${SITE} chatbot\n${'='.repeat(60)}`)

  // 1-3: general knowledge must never hit the Rezonants fallback
  let list = await sendText('capital of Denmark')
  check('T1 capital of Denmark -> Copenhagen', last(list), (r) => /Copenhagen/.test(r) && !FALLBACK.test(r))
  console.log(`      "${last(list)}"`)

  list = await sendText('capital of Poland')
  check('T2 capital of Poland -> Warsaw', last(list), (r) => /Warsaw/.test(r) && !FALLBACK.test(r))
  console.log(`      "${last(list)}"`)

  list = await sendText('What is the currency of Poland?')
  check('T3 currency of Poland -> Polish zloty (PLN)', last(list), (r) => /z.oty \(PLN\)/.test(r) && !FALLBACK.test(r))
  console.log(`      "${last(list)}"`)

  // 4: services menu
  list = await sendText('services')
  check('T4 services -> numbered Services menu', last(list), (r) => /^Our Services:/m.test(r) && /^1\. Inception To Deployment/m.test(r) && !FALLBACK.test(r))
  check('T4 services menu renders 9 clickable options', await optionCount(), (n) => n === 9)

  // 5-6: clicking an option
  list = await clickOption('1. ')
  check('T5 click Services option 1 -> Service 1 detail', last(list), (r) => /Inception To Deployment/.test(r) && !FALLBACK.test(r))
  console.log(`      "${last(list).split('\n')[0]}"`)

  list = await clickOption('2. ')
  check('T6 click Services option 2 -> Service 2 detail', last(list), (r) => /Business Process Automation/.test(r) && !FALLBACK.test(r))
  console.log(`      "${last(list).split('\n')[0]}"`)

  // typing a number must behave exactly like clicking
  list = await sendText('3')
  check('T6b type 3 (no click) -> Service 3 detail', last(list), (r) => /Center of Excellence/.test(r) && !FALLBACK.test(r))

  // 7-9: technologies menu
  list = await sendText('technologies')
  check('T7 technologies -> numbered Technologies menu', last(list), (r) => /^Our Technologies:/m.test(r) && /^1\. AI & Robotics Solutions/m.test(r) && !FALLBACK.test(r))
  check('T7 technologies menu renders 8 clickable options', await optionCount(), (n) => n === 8)

  list = await clickOption('1. ')
  check('T8 click Technologies option 1 -> Technology 1 detail', last(list), (r) => /AI & Robotics Solutions/.test(r) && !FALLBACK.test(r))
  console.log(`      "${last(list).split('\n')[0]}"`)

  list = await clickOption('2. ')
  check('T9 click Technologies option 2 -> Technology 2 detail', last(list), (r) => /Business Automation Solutions/.test(r) && !FALLBACK.test(r))
  console.log(`      "${last(list).split('\n')[0]}"`)

  // 10-11: Rezonants knowledge
  list = await sendText('about Rezonants')
  check('T10 about Rezonants -> company information', last(list), (r) => /Rezonants/.test(r) && (/\b2012\b/.test(r) || /Hyderabad/.test(r)) && !FALLBACK.test(r))
  console.log(`      "${last(list).split('\n')[0]}"`)

  // Priority 8 (Rezonants info) outranks priority 9 (general knowledge): a passing
  // mention of a technology must still get a Rezonants-flavoured answer, never a
  // generic glossary entry and never the fallback.
  list = await sendText('tell me about your ai services')
  check('T10b Rezonants AI question -> Rezonants answer, not glossary/fallback', last(list), (r) => /Rezonants/.test(r) && !FALLBACK.test(r))
  console.log(`      "${last(list).split('\n')[0]}"`)

  list = await sendText('our cloud migration services')
  check('T10c Rezonants cloud question -> Rezonants answer, not fallback', last(list), (r) => /Rezonants|cloud|migration/i.test(r) && !FALLBACK.test(r))
  console.log(`      "${last(list).split('\n')[0]}"`)

  list = await sendText('contact')
  check('T11 contact -> phone + email', last(list), (r) => /18004103299|1800 410 3299/.test(r) && /info@rezonants.com/.test(r) && !FALLBACK.test(r))
  console.log(`      "${last(list).split('\n')[0]}"`)

  // 12: genuinely unsupported -> this is where a fallback is allowed
  list = await sendText('please recite the shipping manifest for a klingon bird of prey')
  check('T12 unsupported request gets a reply (fallback allowed ONLY here)', last(list), (r) => typeof r === 'string' && r.length > 0)
  console.log(`      "${last(list).split('\n')[0]}"`)

  console.log(`\n${'='.repeat(60)}\npassed=${pass} failed=${fail}`)
} finally {
  if (ws) try { ws.close() } catch { /* ignore */ }
  if (chrome) try { chrome.kill() } catch { /* ignore */ }
}

process.exit(fail === 0 ? 0 : 1)
