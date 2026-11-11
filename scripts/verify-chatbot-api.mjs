// Runs the acceptance cases against the LIVE chat API (the same endpoint the
// browser calls), including the history the browser would send.
//
// Cases that must go through the AI provider are SKIPped — not passed — when no
// token is configured, and are instead covered by `npm run test:chatbot:ui`,
// which exercises the same turns through the browser on either code path.
const BASE = process.env.CHAT_API || 'http://localhost:5173'

const history = []
let pass = 0
let fail = 0
let skip = 0

async function ask(message) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history: [...history] }),
  })
  const data = await res.json().catch(() => null)
  const ok = res.ok && data && typeof data.response === 'string'
  if (!ok) return `<<HTTP ${res.status}: ${JSON.stringify(data)}>>`
  history.push({ role: 'user', content: message })
  history.push({ role: 'assistant', content: data.response })
  return data.response
}

// The request needed the AI provider, which is not configured in this
// environment. That is an environment gap, not a behaviour failure.
const aiUnavailable = (r) => /^<<HTTP 5\d\d:/.test(r) && /AI service/.test(r)

function check(label, actual, predicate) {
  const ok = predicate(actual)
  if (ok) pass++
  else fail++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`)
  if (!ok) console.log(`      got: ${JSON.stringify(actual).slice(0, 400)}`)
}

function skipOr(label, actual, predicate) {
  if (aiUnavailable(actual)) {
    skip++
    console.log(`SKIP  ${label}  (AI provider not configured; covered by test:chatbot:ui)`)
    return
  }
  check(label, actual, predicate)
}

const FALLBACK = /I don't have enough information to answer that yet|isn't something listed among Rezonants' services/

const t1 = await ask('capital of Denmark')
check('T1 capital of Denmark -> Copenhagen', t1, (r) => /Copenhagen/.test(r) && !FALLBACK.test(r))
console.log(`      "${t1}"`)

const t2 = await ask('capital of Poland')
check('T2 capital of Poland -> Warsaw', t2, (r) => /Warsaw/.test(r) && !FALLBACK.test(r))
console.log(`      "${t2}"`)

const t3 = await ask('What is the currency of Poland?')
check('T3 currency of Poland -> zloty (PLN)', t3, (r) => /z.oty \(PLN\)/.test(r) && !FALLBACK.test(r))
console.log(`      "${t3}"`)

const t4 = await ask('services')
check('T4 services -> numbered menu', t4, (r) => /^Our Services:/m.test(r) && /^1\. /m.test(r) && !FALLBACK.test(r))

const t5 = await ask('1')
check('T5 service 1 -> detailed explanation', t5, (r) => /Inception To Deployment/.test(r) && !FALLBACK.test(r))
console.log(`      first line: ${t5.split('\n')[0]}`)

const t6 = await ask('2')
check('T6 service 2 -> detailed explanation', t6, (r) => /Business Process Automation/.test(r) && !FALLBACK.test(r))
console.log(`      first line: ${t6.split('\n')[0]}`)

const t7 = await ask('technologies')
check('T7 technologies -> numbered menu', t7, (r) => /^Our Technologies:/m.test(r) && /^1\. AI & Robotics/m.test(r) && !FALLBACK.test(r))

const t8 = await ask('1')
check('T8 technology 1 -> detailed explanation', t8, (r) => /AI & Robotics Solutions/.test(r) && !FALLBACK.test(r))
console.log(`      first line: ${t8.split('\n')[0]}`)

const t9 = await ask('2')
check('T9 technology 2 -> detailed explanation', t9, (r) => /Business Automation Solutions/.test(r) && !FALLBACK.test(r))
console.log(`      first line: ${t9.split('\n')[0]}`)

const t10 = await ask('about Rezonants')
skipOr('T10 about Rezonants -> company info', t10, (r) => /Rezonants/.test(r) && (/\b2012\b/.test(r) || /Hyderabad/.test(r)) && !FALLBACK.test(r))
console.log(`      first line: ${t10.split('\n')[0]}`)

const t11 = await ask('contact')
check('T11 contact -> Rezonants contact info', t11, (r) => /18004103299|1800 410 3299/.test(r) && /info@rezonants.com/.test(r) && !FALLBACK.test(r))
console.log(`      first line: ${t11.split('\n')[0]}`)

const t12 = await ask('please write me a haiku about underwater basket weaving in klingon')
skipOr('T12 unsupported -> fallback allowed (and only here)', t12, (r) => typeof r === 'string' && r.length > 0)
console.log(`      first line: ${t12.split('\n')[0]}`)

console.log(`\n${'='.repeat(60)}\npassed=${pass} failed=${fail} skipped=${skip}`)
process.exit(fail === 0 ? 0 : 1)
