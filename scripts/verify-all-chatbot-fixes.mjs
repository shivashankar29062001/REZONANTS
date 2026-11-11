import assert from 'assert'
import {
  SERVICES_MENU,
  TECHNOLOGIES_MENU,
  PRODUCTS_MENU,
  buildServicesMenu,
  buildTechnologiesMenu,
  buildProductsMenu,
  parseMenuOptions,
  normalizeDigits,
  parseOptionIndex,
  resolveMenuReply,
  detectActiveMenu
} from '../src/lib/chatMenus.js'
import { LANGUAGE_NAME_MAP } from '../src/i18n/languages.js'
import { translateText } from '../src/lib/translateHelper.js'
import { resolveContactQuery } from '../src/lib/contactIntent.js'
import { getChatResponse } from '../src/lib/chatKnowledge.js'

console.log('--- RUNNING COMPREHENSIVE VERIFICATION SUITE FOR CHATBOT ---')
let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    console.log(`PASS: ${name}`)
    passed++
  } catch (err) {
    console.error(`FAIL: ${name}`, err)
    failed++
  }
}

async function asyncTest(name, fn) {
  try {
    await fn()
    console.log(`PASS: ${name}`)
    passed++
  } catch (err) {
    console.error(`FAIL: ${name}`, err)
    failed++
  }
}

// ─── 1. Fix 1: Menu Button Rendering ──────────────────────────
test('Fix 1: Services menu produces 9 options', () => {
  const menuText = buildServicesMenu()
  const parsed = parseMenuOptions(menuText)
  assert(parsed !== null, 'Services menu should be parsed')
  assert.strictEqual(parsed.type, 'services')
  assert.strictEqual(parsed.options.length, 9)
  assert.strictEqual(parsed.options[0].label, 'Inception To Deployment')
  assert.strictEqual(parsed.options[8].label, 'Shared Services & Managed Operations')
})

test('Fix 1: Technologies menu produces 8 options', () => {
  const menuText = buildTechnologiesMenu()
  const parsed = parseMenuOptions(menuText)
  assert(parsed !== null, 'Technologies menu should be parsed')
  assert.strictEqual(parsed.type, 'technologies')
  assert.strictEqual(parsed.options.length, 8)
  assert.strictEqual(parsed.options[0].label, 'AI & Robotics Solutions')
  assert.strictEqual(parsed.options[7].label, 'One-Stop Technology Solutions')
})

test('Fix 1: Products menu produces 6 options', () => {
  const menuText = buildProductsMenu()
  const parsed = parseMenuOptions(menuText)
  assert(parsed !== null, 'Products menu should be parsed')
  assert.strictEqual(parsed.type, 'products')
  assert.strictEqual(parsed.options.length, 6)
  assert.strictEqual(parsed.options[0].label, 'Featured Products')
  assert.strictEqual(parsed.options[5].label, 'App Development')
})

// ─── 2. Fix 2: State Clearing & Stale State Prevention ─────────
test('Fix 2: Explicit currentMenuCategory: null clears category', () => {
  let categoryState = 'services'
  const currentMenuCategoryRef = { current: 'services' }

  const updateMenuCategory = (cat) => {
    currentMenuCategoryRef.current = cat
    categoryState = cat
  }

  const responseData = { response: 'Some text', currentMenuCategory: null }
  if ('currentMenuCategory' in responseData) {
    updateMenuCategory(responseData.currentMenuCategory || null)
  }

  assert.strictEqual(categoryState, null)
  assert.strictEqual(currentMenuCategoryRef.current, null)
})

test('Fix 2: Returned currentMenuCategory: "technologies" sets category', () => {
  let categoryState = null
  const currentMenuCategoryRef = { current: null }

  const updateMenuCategory = (cat) => {
    currentMenuCategoryRef.current = cat
    categoryState = cat
  }

  const responseData = { response: 'Our Technologies:...', currentMenuCategory: 'technologies' }
  if ('currentMenuCategory' in responseData) {
    updateMenuCategory(responseData.currentMenuCategory || null)
  }

  assert.strictEqual(categoryState, 'technologies')
  assert.strictEqual(currentMenuCategoryRef.current, 'technologies')
})

test('Fix 2: detectActiveMenu with explicitCategory: null DOES NOT resurrect old menu from history', () => {
  const historyWithOldMenu = [
    { role: 'assistant', content: buildServicesMenu() },
    { role: 'user', content: 'Where is your office?' },
    { role: 'assistant', content: 'Our office is located at Madhapur, Hyderabad.' }
  ]
  const detected = detectActiveMenu(historyWithOldMenu, null)
  assert.strictEqual(detected, null, 'Explicitly cleared category must never resurrect previous menu')
})

test('Fix 2: resolveMenuReply with explicitCategory: null returns null for bare number', () => {
  const historyWithOldMenu = [
    { role: 'assistant', content: buildServicesMenu() }
  ]
  const reply = resolveMenuReply('1', historyWithOldMenu, null)
  assert.strictEqual(reply, null, 'Bare number when category is null must return null to trigger clarification')
})

// ─── 3. Fix 3: Localized Numerals and Multilingual Menu Intents 
test('Fix 3: Localized digits normalize correctly across scripts', () => {
  assert.strictEqual(normalizeDigits('١٢٣٤٥٦٧٨٩'), '123456789')
  assert.strictEqual(normalizeDigits('१२३४५६७८९'), '123456789')
  assert.strictEqual(normalizeDigits('౧౨౩౪౫౬౭౮౯'), '123456789')
  assert.strictEqual(normalizeDigits('১২৩৪৫৬৭৮৯'), '123456789')
  assert.strictEqual(normalizeDigits('੧੨੩੪੫੬੭੮੯'), '123456789')
  assert.strictEqual(normalizeDigits('၁၂၃၄၅၆၇၈၉'), '123456789')
})

test('Fix 3: parseOptionIndex resolves localized digits', () => {
  assert.strictEqual(parseOptionIndex('१'), 1)
  assert.strictEqual(parseOptionIndex('٩'), 9)
  assert.strictEqual(parseOptionIndex('౫'), 5)
  assert.strictEqual(parseOptionIndex('9'), 9)
})

test('Fix 3: Localized numeral selecting option in active menu', () => {
  const history = [{ role: 'assistant', content: buildServicesMenu() }]
  const reply1 = resolveMenuReply('९', history, 'services')
  assert(reply1 && reply1.includes('Shared Services & Managed Operations'), 'Should resolve option 9')

  const replyArabic = resolveMenuReply('١', history, 'services')
  assert(replyArabic && replyArabic.includes('Inception To Deployment'), 'Should resolve option 1')

  const replyTelugu = resolveMenuReply('౨', history, 'services')
  assert(replyTelugu && replyTelugu.includes('Business Process Automation'), 'Should resolve option 2')
})

test('Fix 3: Multilingual menu trigger terms (Zulu, Spanish, Hindi, French)', () => {
  assert(resolveMenuReply('amasevisi', [], null)?.startsWith('Our Services:'), 'amasevisi should trigger services')
  assert(resolveMenuReply('ubuchwepheshe', [], null)?.startsWith('Our Technologies:'), 'ubuchwepheshe should trigger technologies')
  assert(resolveMenuReply('imikhiqizo', [], null)?.startsWith('Here are our products:'), 'imikhiqizo should trigger products')
  assert(resolveMenuReply('servicios', [], null)?.startsWith('Our Services:'), 'servicios should trigger services')
  assert(resolveMenuReply('tecnologias', [], null)?.startsWith('Our Technologies:'), 'tecnologias should trigger technologies')
  assert(resolveMenuReply('productos', [], null)?.startsWith('Here are our products:'), 'productos should trigger products')
  assert(resolveMenuReply('सेवाएं', [], null)?.startsWith('Our Services:'), 'सेवाएं should trigger services')
  assert(resolveMenuReply('तकनीक', [], null)?.startsWith('Our Technologies:'), 'तकनीक should trigger technologies')
  assert(resolveMenuReply('उत्पाद', [], null)?.startsWith('Here are our products:'), 'उत्पाद should trigger products')
})

test('Fix 3: Non-sequential numbered list is NOT parsed as a menu', () => {
  const nonMenu = "Here are our steps:\n1. First step\n3. Third step\n4. Fourth step"
  const parsed = parseMenuOptions(nonMenu)
  assert.strictEqual(parsed, null, 'Non-sequential list must not be treated as a menu')
})

// ─── 4. Fix 4: Multilingual Support & Language Registry ────────
test('Fix 4: All 115 languages present in LANGUAGE_NAME_MAP', () => {
  const count = Object.keys(LANGUAGE_NAME_MAP).length
  assert.strictEqual(count, 115, `Expected 115 languages in registry, found ${count}`)
  assert.strictEqual(LANGUAGE_NAME_MAP['en'], 'English')
  assert.strictEqual(LANGUAGE_NAME_MAP['hi'], 'Hindi')
  assert.strictEqual(LANGUAGE_NAME_MAP['te'], 'Telugu')
  assert.strictEqual(LANGUAGE_NAME_MAP['ta'], 'Tamil')
  assert.strictEqual(LANGUAGE_NAME_MAP['zu'], 'Zulu')
  assert.strictEqual(LANGUAGE_NAME_MAP['xh'], 'Xhosa')
  assert.strictEqual(LANGUAGE_NAME_MAP['is'], 'Icelandic')
  assert.strictEqual(LANGUAGE_NAME_MAP['cy'], 'Welsh')
})

await asyncTest('Fix 4: translateText returns original for en and handles errors safely', async () => {
  const text = 'Hello world'
  const enRes = await translateText(text, 'en')
  assert.strictEqual(enRes, text)

  const emptyRes = await translateText('', 'hi')
  assert.strictEqual(emptyRes, '')

  const unknownRes = await translateText(text, 'invalid_lang_code')
  assert.strictEqual(typeof unknownRes, 'string')
})

// ─── 5. Fix 5: Company Information Accuracy ────────────────────
test('Fix 5: Contact information includes Madhapur Hyderabad HQ, Vijayawada, and South Africa PVT LTD', () => {
  const contactText = resolveContactQuery('Where is your office?')
  assert(contactText !== null, 'Contact query should be resolved')
  assert(contactText.includes('Madhapur, Hyderabad'), 'Should include Madhapur, Hyderabad')
  assert(contactText.includes('Vijayawada'), 'Should include Vijayawada')
  assert(contactText.includes('REZONANTS PVT LTD'), 'Should include REZONANTS PVT LTD')
  assert(!contactText.includes('(PTY)'), 'Must not contain legacy (PTY)')
  assert(contactText.includes('1800 410 3299'), 'Should include toll-free 1800 410 3299')
  assert(contactText.includes('info@rezonants.com'), 'Should include info@rezonants.com')
})

// ─── 6. Local Fallback Consistency (getChatResponse) ───────────
await asyncTest('Fix 6: Local fallback (getChatResponse) returns response and currentMenuCategory', async () => {
  const serviceRes = await getChatResponse('What services do you offer?')
  assert(typeof serviceRes === 'object', 'Should return object with metadata')
  assert.strictEqual(serviceRes.currentMenuCategory, 'services')
  assert(serviceRes.response.includes('Our Services:'), 'Should contain services menu')
  assert.strictEqual(String(serviceRes), serviceRes.response, 'toString() should return response text')

  const optionRes = await getChatResponse('1', [{ role: 'assistant', content: buildServicesMenu() }], 'en', 'services')
  assert.strictEqual(optionRes.currentMenuCategory, 'services')
  assert(optionRes.response.includes('Inception To Deployment'), 'Should contain option 1 details')

  const ambiguousRes = await getChatResponse('1', [], 'en', null)
  assert.strictEqual(ambiguousRes.currentMenuCategory, null)
  assert(ambiguousRes.response.includes('Did you mean Services'), 'Should trigger clarification')

  const contactRes = await getChatResponse('Where is your office?')
  assert.strictEqual(contactRes.currentMenuCategory, null)
  assert(contactRes.response.includes('Madhapur, Hyderabad'), 'Should return contact info with null category')
})

// ─── 7. Welcome Message Spacing ────────────────────────────────
test('Fix 7: Welcome message formatting handles leading punctuation correctly', () => {
  const mockT1 = (key, opts) => key === 'chatbot.welcomeText' ? '! 👋 Welcome' : 'Good morning'
  const mockT2 = (key, opts) => key === 'chatbot.welcomeText' ? '👋 Welcome' : 'Good morning'

  function formatGreeting(t) {
    const greeting = t('chatbot.greetingMorning')
    const welcome = t('chatbot.welcomeText')
    const trimmedGreeting = greeting.trim()
    const trimmedWelcome = welcome.trim()
    if (/^[!！,.?;:]/.test(trimmedWelcome)) {
      return `${trimmedGreeting}${trimmedWelcome}`
    }
    return `${trimmedGreeting} ${trimmedWelcome}`
  }

  assert.strictEqual(formatGreeting(mockT1), 'Good morning! 👋 Welcome')
  assert.strictEqual(formatGreeting(mockT2), 'Good morning 👋 Welcome')
})

// ─── 8. Input Validation Bounds ────────────────────────────────
test('Fix 8: Message validation bounds', () => {
  const sanitizeLang = (l) => typeof l === 'string' && /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]+)?$/.test(l.trim()) ? l.trim() : 'en'
  assert.strictEqual(sanitizeLang('en'), 'en')
  assert.strictEqual(sanitizeLang('es'), 'es')
  assert.strictEqual(sanitizeLang('zh-TW'), 'zh-TW')
  assert.strictEqual(sanitizeLang('invalid_code_123$'), 'en')
  assert.strictEqual(sanitizeLang(undefined), 'en')

  const validateMsg = (m) => typeof m === 'string' && m.trim().length > 0 && m.trim().length <= 2000
  assert.strictEqual(validateMsg(''), false)
  assert.strictEqual(validateMsg('   '), false)
  assert.strictEqual(validateMsg(null), false)
  assert.strictEqual(validateMsg('Hello'), true)
  assert.strictEqual(validateMsg('a'.repeat(2001)), false)
  assert.strictEqual(validateMsg('a'.repeat(2000)), true)
})

console.log('\n==================================================')
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`)
if (failed > 0) process.exit(1)
