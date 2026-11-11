import { spawn } from 'node:child_process'
import { rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const SITE = process.env.SITE_URL || 'http://localhost:5173'
const CDP_PORT = 9445
const PROFILE = join(tmpdir(), 'rezonants-full-suite-profile')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

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
      // retry
    }
    await sleep(500)
  }
  throw new Error('Chrome DevTools endpoint never came up')
}

async function navigateTo(url) {
  await send('Page.navigate', { url })
  await sleep(1200)
  const start = Date.now()
  while (Date.now() - start < 15000) {
    const ready = await ev(`return document.readyState === 'complete' && !!document.querySelector('#main')`)
    if (ready) return
    await sleep(300)
  }
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
  throw new Error(`Timed out waiting for reply to: ${text}`)
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
  if (!clicked) throw new Error(`No clickable option starting with "${labelStartsWith}"`)

  const start = Date.now()
  while (Date.now() - start < 30000) {
    await sleep(300)
    const state = await ev(
      `return { n: document.querySelectorAll('.chatbot-message-content').length, typing: !!document.querySelector('.typing-indicator') }`,
    )
    if (!state.typing && state.n > before) return messages()
  }
  throw new Error(`Timed out waiting for option "${labelStartsWith}" reply`)
}

let pass = 0
let fail = 0
const last = (list) => list[list.length - 1]

function check(label, value, predicate) {
  const ok = predicate(value)
  if (ok) pass++
  else fail++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`)
  if (!ok) console.log(`      got: ${JSON.stringify(value)?.slice(0, 500)}`)
}

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
      `${SITE}/`,
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
  await send('Page.enable')

  console.log(`\n=== 1. VERIFYING DIRECT URL ACCESS & REFRESH ===`)

  // Test 1: Direct navigation to /services
  await navigateTo(`${SITE}/services`)
  await sleep(600)
  const servPath = await ev(`return window.location.pathname`)
  check('Direct /services pathname is /services', servPath, (p) => p === '/services')

  const servScrollY = await ev(`return window.scrollY`)
  const servElement = await ev(`
    const el = document.getElementById('services')
    return el ? { top: el.getBoundingClientRect().top, found: true } : { found: false }
  `)
  check('Services section exists and is scrolled to on direct /services visit', servScrollY, (y) => y > 300)
  console.log(`      scrollY: ${servScrollY}, section found: ${servElement.found}`)

  // Test 1b: Refresh /services
  await send('Page.reload')
  await sleep(1000)
  const refreshServScrollY = await ev(`return window.scrollY`)
  check('Services section is scrolled to after refreshing /services', refreshServScrollY, (y) => y > 300)
  console.log(`      scrollY after refresh: ${refreshServScrollY}`)

  // Test 2: Direct navigation to /technologies
  await navigateTo(`${SITE}/technologies`)
  await sleep(600)
  const techPath = await ev(`return window.location.pathname`)
  check('Direct /technologies pathname is /technologies', techPath, (p) => p === '/technologies')

  const techScrollY = await ev(`return window.scrollY`)
  check('Direct /technologies does NOT scroll the page', techScrollY, (y) => y <= 20)
  console.log(`      scrollY on direct /technologies: ${techScrollY}`)

  // Test 2b: Refresh /technologies
  await send('Page.reload')
  await sleep(1000)
  const refreshTechScrollY = await ev(`return window.scrollY`)
  check('Refresh /technologies stays un-scrolled', refreshTechScrollY, (y) => y <= 20)
  console.log(`      scrollY after refresh: ${refreshTechScrollY}`)

  console.log(`\n=== 2. VERIFYING TOP NAVIGATION CLICK & DROPDOWNS ===`)

  // Navigate to homepage first
  await navigateTo(`${SITE}/`)
  await sleep(500)
  await ev(`window.scrollTo(0, 0)`)
  await sleep(300)

  // Click Services in top nav
  await ev(`
    const btn = Array.from(document.querySelectorAll('.services-toggle'))
      .find(b => b.textContent.includes('Services'))
    if (btn) btn.click()
  `)
  await sleep(800)

  const clickServPath = await ev(`return window.location.pathname`)
  check('Clicking Services updates URL to /services', clickServPath, (p) => p === '/services')

  const clickServScroll = await ev(`return window.scrollY`)
  check('Clicking Services smoothly scrolls to Services section', clickServScroll, (y) => y > 300)
  console.log(`      scrollY after clicking Services: ${clickServScroll}`)

  const servDropdownOpen = await ev(`
    const dd = document.querySelector('.services-dropdown.is-open')
    return dd ? Array.from(dd.querySelectorAll('.services-dropdown-item')).map(a => a.textContent.trim()) : []
  `)
  check('Services dropdown opened with 9 items', servDropdownOpen.length, (n) => n === 9)

  // Click Technologies in top nav
  await ev(`
    const btn = Array.from(document.querySelectorAll('.services-toggle'))
      .find(b => b.textContent.includes('Technologies'))
    if (btn) btn.click()
  `)
  await sleep(600)

  const clickTechPath = await ev(`return window.location.pathname`)
  check('Clicking Technologies updates URL to /technologies', clickTechPath, (p) => p === '/technologies')

  const techDropdownOpen = await ev(`
    const dd = document.querySelectorAll('.services-dropdown.is-open')
    return dd.length > 0
  `)
  check('Technologies dropdown opened', techDropdownOpen, (o) => o === true)

  // Test Back / Forward navigation
  await ev(`window.history.back()`)
  await sleep(600)
  const backPath = await ev(`return window.location.pathname`)
  check('Browser Back navigation restores /services', backPath, (p) => p === '/services')

  console.log(`\n=== 3. VERIFYING CHATBOT REQUIREMENTS ===`)

  // Open chatbot
  await ev(`
    const b = document.querySelector('.chatbot-toggle')
    if (b) b.click()
  `)
  await sleep(600)

  // 1. General knowledge question
  let list = await sendText('Capital of Denmark')
  check('General knowledge: Capital of Denmark -> Copenhagen', last(list), (r) => /Copenhagen/i.test(r))
  console.log(`      Bot: "${last(list)}"`)

  // 2. Services inquiry
  list = await sendText('What services do you provide?')
  check('Services inquiry displays numbered Services list', last(list), (r) =>
    /^Our Services:/m.test(r) && /^1\. Inception To Deployment/m.test(r) && /^2\. Business Process Automation/m.test(r)
  )

  // 3. Select Service 2
  list = await sendText('2')
  check('Select 2 explains Business Process Automation clearly', last(list), (r) =>
    /Business Process Automation/i.test(r) && /Purpose:/i.test(r) && /How Rezonants/i.test(r)
  )
  console.log(`      Bot: "${last(list).split('\n')[0]}"`)

  // 4. Natural follow-up on active service
  list = await sendText('What are its benefits?')
  check('Natural follow-up "What are its benefits?" explains benefits/purpose', last(list), (r) =>
    r.length > 30 && !/don't have enough information/i.test(r)
  )
  console.log(`      Bot: "${last(list).split('\n')[0]}"`)

  // 5. Technologies inquiry
  list = await sendText('What technologies do you use?')
  check('Technologies inquiry displays numbered Technologies list', last(list), (r) =>
    /^Our Technologies:/m.test(r) && /^1\. AI & Robotics/m.test(r) && /^3\. Cloud Migration/m.test(r)
  )

  // 6. Select Technology 3
  list = await sendText('3')
  check('Select 3 explains Cloud Migration Solutions clearly', last(list), (r) =>
    /Cloud Migration Solutions/i.test(r) && /Purpose:/i.test(r) && /How Rezonants/i.test(r)
  )
  console.log(`      Bot: "${last(list).split('\n')[0]}"`)

  // 7. Natural phrasing: "Tell me about number 2"
  list = await sendText('Tell me about number 2')
  check('Natural phrasing "Tell me about number 2" explains Business Automation', last(list), (r) =>
    /Business Automation Solutions/i.test(r)
  )
  console.log(`      Bot: "${last(list).split('\n')[0]}"`)

  // 8. Products inquiry
  list = await sendText('What products do you offer?')
  check('Products inquiry displays numbered Products list', last(list), (r) =>
    /^Here are our products:/m.test(r) && /^1\. Featured Products/m.test(r) && /^2\. ERP Solutions/m.test(r)
  )

  // 9. Select Product 1
  list = await sendText('1')
  check('Select 1 explains Featured Products with Purpose, Features, and Benefits', last(list), (r) =>
    /Featured Products/i.test(r) && /Purpose:/i.test(r) && /Key Features:/i.test(r) && /Benefits:/i.test(r)
  )
  console.log(`      Bot: "${last(list).split('\n')[0]}"`)

  // 10. Switch to Service by typing "Services"
  list = await sendText('Services')
  check('Switching to Services displays Services list', last(list), (r) =>
    /^Our Services:/m.test(r)
  )

  // 11. Select 4
  list = await sendText('4')
  check('Selecting 4 under Services explains Custom Development', last(list), (r) =>
    /Custom Development & Customization/i.test(r)
  )
  console.log(`      Bot: "${last(list).split('\n')[0]}"`)

  // 12. Invalid number handling
  list = await sendText('99')
  check('Invalid number returns polite range prompt', last(list), (r) =>
    /Please enter a valid number/i.test(r) || /Please select a valid number/i.test(r)
  )
  console.log(`      Bot: "${last(list)}"`)

  // 13. New chat functionality & context reset
  const resetClicked = await ev(`
    const btn = document.querySelector('.chatbot-reset')
    if (btn) { btn.click(); return true }
    return false
  `)
  check('New chat button exists and was clicked', resetClicked, (c) => c === true)
  await sleep(600)
  list = await sendText('2')
  check('Bare number without category asks whether Services, Technologies, or Products', last(list), (r) =>
    /Did you mean Services, Technologies, or Products/i.test(r)
  )
  console.log(`      Bot: "${last(list)}"`)

  // 14. Contact and location info
  list = await sendText('Where are you located?')
  check('Location question returns Hyderabad office address', last(list), (r) =>
    /Madhapur|Hyderabad|SBR Towers/i.test(r)
  )

  list = await sendText('Give me your phone number and email')
  check('Contact question returns toll-free phone and info@rezonants.com', last(list), (r) =>
    /18004103299|1800 410 3299/i.test(r) && /info@rezonants.com/i.test(r)
  )

  console.log(`\n============================================================`)
  console.log(`FULL SUITE RESULTS: passed=${pass} failed=${fail}`)
} finally {
  if (ws) try { ws.close() } catch { /* ignore */ }
  if (chrome) try { chrome.kill() } catch { /* ignore */ }
}

process.exit(fail === 0 ? 0 : 1)
