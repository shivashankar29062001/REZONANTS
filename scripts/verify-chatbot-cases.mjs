import { resolveMenuReply, answerGeneralKnowledge, parseMenuOptions } from '../src/lib/chatMenus.js'

let pass = 0
let fail = 0
const history = []
function show(label, value) {
  console.log(`\n### ${label}\n---\n${value}\n`)
}
function check(label, actual, predicate) {
  const ok = predicate(actual)
  if (ok) pass++
  else fail++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`)
  if (!ok) console.log(`      got: ${JSON.stringify(actual)}`)
}

// TEST 1-3: general knowledge
check('T1 capital of Denmark -> Copenhagen', answerGeneralKnowledge('capital of Denmark'), (r) => /Copenhagen/.test(r || ''))
check('T1b What is the capital of Denmark?', answerGeneralKnowledge('What is the capital of Denmark?'), (r) => /Copenhagen/.test(r || ''))
check('T2 capital of Poland -> Warsaw', answerGeneralKnowledge('capital of Poland'), (r) => /Warsaw/.test(r || ''))
check('T2b capital of Poland?', answerGeneralKnowledge('capital of Poland?'), (r) => /Warsaw/.test(r || ''))
check('T3 currency of Poland -> zloty', answerGeneralKnowledge('What is the currency of Poland?'), (r) => /z.oty \(PLN\)/.test(r || ''))
check('T3b currency of Poland', answerGeneralKnowledge('currency of Poland'), (r) => /PLN/.test(r || ''))
check('T-extra capital of India -> New Delhi', answerGeneralKnowledge('capital of India'), (r) => /New Delhi/.test(r || ''))
check('T-extra largest planet -> Jupiter', answerGeneralKnowledge('largest planet'), (r) => /Jupiter/.test(r || ''))
check('T-extra what is SQL Server?', answerGeneralKnowledge('What is SQL Server?'), (r) => (r || '').length > 60 && /SQL Server/.test(r || ''))
check('T-nonmatch: services is not GK', answerGeneralKnowledge('services'), (r) => r === null)
check('T-nonmatch: about rezonants is not GK', answerGeneralKnowledge('about Rezonants'), (r) => r === null)
check('T-nonmatch: gibberish', answerGeneralKnowledge('qwertyuiop asdfghjkl'), (r) => r === null)

// Priority order: Rezonants/company information (8) outranks general knowledge
// (9), so a passing mention of a technology must not be hijacked by the
// glossary — only genuine definition questions may be.
check('no-hijack: tell me about your ai services', answerGeneralKnowledge('tell me about your ai services'), (r) => r === null)
check('no-hijack: tell me about python', answerGeneralKnowledge('tell me about python'), (r) => r === null)
check('no-hijack: our cloud migration services', answerGeneralKnowledge('our cloud migration services'), (r) => r === null)
check('definition: What is AI?', answerGeneralKnowledge('What is AI?'), (r) => typeof r === 'string' && r.length > 60)
check('definition: what is a database?', answerGeneralKnowledge('what is a database?'), (r) => /relational|data/i.test(r || ''))

// TEST 4: services menu
const servicesMenu = resolveMenuReply('services', history)
check('T4 services -> menu', servicesMenu, (r) => typeof r === 'string' && /^Our Services:/m.test(r) && /^1\. Inception To Deployment/m.test(r) && /^9\. Shared Services/m.test(r))
show('services menu', servicesMenu)

for (const phrase of ['service', 'our services', 'What services do you provide?', 'Tell me about your services', 'What services do you offer?', 'services?', 'service menu']) {
  check(`T4-variant "${phrase}" -> services menu`, resolveMenuReply(phrase, history), (r) => typeof r === 'string' && /^Our Services:/m.test(r || ''))
}

// TEST 5-6: numbered service selection
const afterServices = [{ role: 'assistant', content: servicesMenu }]
check('T5 select 1 -> service 1 detail', resolveMenuReply('1', afterServices), (r) => /Inception To Deployment/.test(r || '') && /Requirements Engineering/.test(r || ''))
const svc2 = resolveMenuReply('2', afterServices)
check('T6 select 2 -> service 2 detail', svc2, (r) => /Business Process Automation/.test(r || '') && !/Inception To Deployment/.test(r || ''))
show('service option 2', svc2)
check('T5/6 out of range 99', resolveMenuReply('99', afterServices), (r) => /isn't one of the services/.test(r || ''))
check('option 3 phrasing', resolveMenuReply('option 3', afterServices), (r) => /Center of Excellence/.test(r || ''))
check('ordinal second', resolveMenuReply('second', afterServices), (r) => /Business Process Automation/.test(r || ''))

// TEST 7-9: technologies menu
const techMenu = resolveMenuReply('technologies', history)
check('T7 technologies -> menu', techMenu, (r) => typeof r === 'string' && /^Our Technologies:/m.test(r) && /^1\. AI & Robotics Solutions/m.test(r) && /^8\. One-Stop Technology Solutions/m.test(r))
show('technologies menu', techMenu)
for (const phrase of ['technology', 'Our technologies', 'What technologies do you use?', 'tech', 'technologies?']) {
  check(`T7-variant "${phrase}" -> technologies menu`, resolveMenuReply(phrase, history), (r) => typeof r === 'string' && /^Our Technologies:/m.test(r || ''))
}
const afterTech = [{ role: 'assistant', content: techMenu }]
const tech1 = resolveMenuReply('1', afterTech)
check('T8 tech 1 -> AI & Robotics detail', tech1, (r) => /AI & Robotics Solutions/.test(r || '') && /Rezonants uses it/.test(r || ''))
const tech2 = resolveMenuReply('2', afterTech)
check('T9 tech 2 -> Business Automation detail', tech2, (r) => /Business Automation Solutions/.test(r || '') && /Rezonants uses it/.test(r || ''))
show('technology option 1', tech1)

// Priority: most recent menu wins
const both = [
  { role: 'assistant', content: servicesMenu },
  { role: 'assistant', content: techMenu },
]
check('active menu = most recent (tech)', resolveMenuReply('1', both), (r) => /AI & Robotics Solutions/.test(r || ''))

// TEST 12: unknown -> must be null so caller can fall back
check('T12 number with NO active menu -> null', resolveMenuReply('2', []), (r) => r === null)
check('T12 random text -> null', resolveMenuReply('please do my homework in klingon', history), (r) => r === null)

// Must NOT hijack topic-specific questions
check('no-hijack: cloud migration services', resolveMenuReply('tell me about cloud migration services', history), (r) => r === null)
check('no-hijack: managed services', resolveMenuReply('managed services', history), (r) => r === null)
check('no-hijack: our technology stack', resolveMenuReply('what is your technology stack', history), (r) => r === null)
check('no-hijack: do you provide services?', resolveMenuReply('do you provide services?', history), (r) => typeof r === 'string' && /^Our Services:/m.test(r || ''))

// TEST 10: Products menu
const productsMenu = resolveMenuReply('products', history)
check('T10 products -> menu', productsMenu, (r) => typeof r === 'string' && /^Here are our products:/m.test(r) && /^1\. Featured Products/m.test(r) && /^6\. App Development/m.test(r))
show('products menu', productsMenu)
for (const phrase of ['product', 'our products', 'What products do you offer?', 'Tell me about your products', 'what products do you have']) {
  check(`T10-variant "${phrase}" -> products menu`, resolveMenuReply(phrase, history), (r) => typeof r === 'string' && /^Here are our products:/m.test(r || ''))
}

const afterProducts = [{ role: 'assistant', content: productsMenu }]
const prod1 = resolveMenuReply('1', afterProducts)
check('T11 product 1 -> Featured Products detail', prod1, (r) => /Featured Products/.test(r || '') && /Rezonants AI Suite/.test(r || '') && /Benefits:/.test(r || ''))
const prod2 = resolveMenuReply('2', afterProducts)
check('T11 product 2 -> ERP Solutions detail', prod2, (r) => /ERP Solutions/.test(r || '') && /Rezonants ERP Core/.test(r || '') && /Benefits:/.test(r || ''))
show('product option 1', prod1)

// Natural phrasing follow-ups
check('natural "Tell me about number 2"', resolveMenuReply('Tell me about number 2', afterServices), (r) => /Business Process Automation/.test(r || ''))
check('natural "Tell me about 3"', resolveMenuReply('Tell me about 3', afterTech), (r) => /Cloud Migration Solutions/.test(r || ''))
check('natural "explain number 1"', resolveMenuReply('explain number 1', afterProducts), (r) => /Featured Products/.test(r || ''))

// Switching categories: Services -> Technologies -> Products
const switchHistory = [
  { role: 'assistant', content: servicesMenu },
  { role: 'user', content: '2' },
  { role: 'assistant', content: svc2 },
  { role: 'assistant', content: productsMenu },
]
check('switched to products: 1 -> Featured Products', resolveMenuReply('1', switchHistory), (r) => /Featured Products/.test(r || ''))

// parse round-trip
check('parse services menu', parseMenuOptions(servicesMenu), (r) => r && r.type === 'services' && r.options.length === 9 && r.options[0].label === 'Inception To Deployment')
check('parse technologies menu', parseMenuOptions(techMenu), (r) => r && r.type === 'technologies' && r.options.length === 8)
check('parse products menu', parseMenuOptions(productsMenu), (r) => r && r.type === 'products' && r.options.length === 6 && r.options[0].label === 'Featured Products')
check('parse non-menu -> null', parseMenuOptions('Hello! How can I help?'), (r) => r === null)

console.log(`\n${'='.repeat(50)}\npassed=${pass} failed=${fail}`)
process.exit(fail === 0 ? 0 : 1)

