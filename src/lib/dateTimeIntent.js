// General date/time intent handling for the Rezonants chatbot.
//
// Answers questions like "present time", "what is today's date?",
// "what is the time in China?", "what is the date and time in Japan?".
//
// Design rules:
// - Default location is India (Asia/Kolkata) when the visitor names none.
// - Time is always 12-hour with AM/PM unless the visitor explicitly asks
//   for 24-hour format; date is rendered as "19 September 2026".
// - Timezones come from IANA identifiers resolved with Intl.DateTimeFormat,
//   so daylight-saving rules are handled automatically — no fixed offsets.
// - Countries with several time zones (Russia, USA, ...) get a clarifying
//   question instead of a single made-up "country time".
// - Returns null for anything that is not a date/time question, so the
//   caller keeps its normal flow (Rezonants knowledge, greetings, fallback).

const DEFAULT_ZONE = 'Asia/Kolkata'
const DEFAULT_LOCATION_LABEL = 'India'

// Countries spanning multiple time zones: ask which city instead of guessing.
const MULTI_ZONE_COUNTRIES = {
  russia: ['Russia', 'Moscow or Vladivostok'],
  usa: ['the USA', 'New York or Los Angeles'],
  'united states': ['the USA', 'New York or Los Angeles'],
  america: ['the USA', 'New York or Los Angeles'],
  canada: ['Canada', 'Toronto or Vancouver'],
  australia: ['Australia', 'Sydney or Perth'],
  brazil: ['Brazil', 'São Paulo or Manaus'],
  mexico: ['Mexico', 'Mexico City or Tijuana'],
  indonesia: ['Indonesia', 'Jakarta or Bali'],
}

// Single-zone countries (or a sensible representative zone) -> IANA zone.
const COUNTRY_ZONES = {
  india: 'Asia/Kolkata',
  'sri lanka': 'Asia/Colombo',
  nepal: 'Asia/Kathmandu',
  bangladesh: 'Asia/Dhaka',
  pakistan: 'Asia/Karachi',
  china: 'Asia/Shanghai',
  japan: 'Asia/Tokyo',
  'south korea': 'Asia/Seoul',
  korea: 'Asia/Seoul',
  'north korea': 'Asia/Pyongyang',
  taiwan: 'Asia/Taipei',
  'hong kong': 'Asia/Hong_Kong',
  singapore: 'Asia/Singapore',
  malaysia: 'Asia/Kuala_Lumpur',
  thailand: 'Asia/Bangkok',
  vietnam: 'Asia/Ho_Chi_Minh',
  philippines: 'Asia/Manila',
  uae: 'Asia/Dubai',
  'united arab emirates': 'Asia/Dubai',
  qatar: 'Asia/Qatar',
  'saudi arabia': 'Asia/Riyadh',
  saudi: 'Asia/Riyadh',
  israel: 'Asia/Jerusalem',
  iran: 'Asia/Tehran',
  iraq: 'Asia/Baghdad',
  turkey: 'Europe/Istanbul',
  lebanon: 'Asia/Beirut',
  jordan: 'Asia/Amman',
  germany: 'Europe/Berlin',
  france: 'Europe/Paris',
  'united kingdom': 'Europe/London',
  uk: 'Europe/London',
  england: 'Europe/London',
  ireland: 'Europe/Dublin',
  spain: 'Europe/Madrid',
  italy: 'Europe/Rome',
  portugal: 'Europe/Lisbon',
  netherlands: 'Europe/Amsterdam',
  belgium: 'Europe/Brussels',
  switzerland: 'Europe/Zurich',
  austria: 'Europe/Vienna',
  sweden: 'Europe/Stockholm',
  norway: 'Europe/Oslo',
  denmark: 'Europe/Copenhagen',
  finland: 'Europe/Helsinki',
  poland: 'Europe/Warsaw',
  greece: 'Europe/Athens',
  ukraine: 'Europe/Kyiv',
  romania: 'Europe/Bucharest',
  hungary: 'Europe/Budapest',
  'czech republic': 'Europe/Prague',
  iceland: 'Atlantic/Reykjavik',
  egypt: 'Africa/Cairo',
  nigeria: 'Africa/Lagos',
  kenya: 'Africa/Nairobi',
  'south africa': 'Africa/Johannesburg',
  morocco: 'Africa/Casablanca',
  ethiopia: 'Africa/Addis_Ababa',
  ghana: 'Africa/Accra',
  tanzania: 'Africa/Dar_es_Salaam',
  'new zealand': 'Pacific/Auckland',
  argentina: 'America/Argentina/Buenos_Aires',
  chile: 'America/Santiago',
  colombia: 'America/Bogota',
  peru: 'America/Lima',
}

// Major cities -> IANA zone (so "what time is it in London?" works).
const CITY_ZONES = {
  // India
  delhi: 'Asia/Kolkata',
  'new delhi': 'Asia/Kolkata',
  mumbai: 'Asia/Kolkata',
  bengaluru: 'Asia/Kolkata',
  bangalore: 'Asia/Kolkata',
  hyderabad: 'Asia/Kolkata',
  chennai: 'Asia/Kolkata',
  kolkata: 'Asia/Kolkata',
  pune: 'Asia/Kolkata',
  vijayawada: 'Asia/Kolkata',
  // East Asia
  tokyo: 'Asia/Tokyo',
  osaka: 'Asia/Tokyo',
  kyoto: 'Asia/Tokyo',
  beijing: 'Asia/Shanghai',
  shanghai: 'Asia/Shanghai',
  shenzhen: 'Asia/Shanghai',
  seoul: 'Asia/Seoul',
  busan: 'Asia/Seoul',
  taipei: 'Asia/Taipei',
  // South-East Asia
  jakarta: 'Asia/Jakarta',
  bali: 'Asia/Makassar',
  denpasar: 'Asia/Makassar',
  bangkok: 'Asia/Bangkok',
  'kuala lumpur': 'Asia/Kuala_Lumpur',
  manila: 'Asia/Manila',
  hanoi: 'Asia/Ho_Chi_Minh',
  'ho chi minh': 'Asia/Ho_Chi_Minh',
  saigon: 'Asia/Ho_Chi_Minh',
  // Middle East
  dubai: 'Asia/Dubai',
  'abu dhabi': 'Asia/Dubai',
  doha: 'Asia/Qatar',
  riyadh: 'Asia/Riyadh',
  jeddah: 'Asia/Riyadh',
  istanbul: 'Europe/Istanbul',
  'tel aviv': 'Asia/Jerusalem',
  jerusalem: 'Asia/Jerusalem',
  tehran: 'Asia/Tehran',
  // Europe
  london: 'Europe/London',
  manchester: 'Europe/London',
  dublin: 'Europe/Dublin',
  paris: 'Europe/Paris',
  berlin: 'Europe/Berlin',
  munich: 'Europe/Berlin',
  frankfurt: 'Europe/Berlin',
  amsterdam: 'Europe/Amsterdam',
  brussels: 'Europe/Brussels',
  zurich: 'Europe/Zurich',
  geneva: 'Europe/Zurich',
  vienna: 'Europe/Vienna',
  rome: 'Europe/Rome',
  milan: 'Europe/Rome',
  madrid: 'Europe/Madrid',
  barcelona: 'Europe/Madrid',
  lisbon: 'Europe/Lisbon',
  moscow: 'Europe/Moscow',
  'saint petersburg': 'Europe/Moscow',
  'st petersburg': 'Europe/Moscow',
  vladivostok: 'Asia/Vladivostok',
  novosibirsk: 'Asia/Novosibirsk',
  kyiv: 'Europe/Kyiv',
  kiev: 'Europe/Kyiv',
  athens: 'Europe/Athens',
  warsaw: 'Europe/Warsaw',
  prague: 'Europe/Prague',
  stockholm: 'Europe/Stockholm',
  oslo: 'Europe/Oslo',
  copenhagen: 'Europe/Copenhagen',
  helsinki: 'Europe/Helsinki',
  reykjavik: 'Atlantic/Reykjavik',
  // North America
  'new york': 'America/New_York',
  nyc: 'America/New_York',
  boston: 'America/New_York',
  washington: 'America/New_York',
  miami: 'America/New_York',
  atlanta: 'America/New_York',
  toronto: 'America/Toronto',
  montreal: 'America/Toronto',
  vancouver: 'America/Vancouver',
  chicago: 'America/Chicago',
  dallas: 'America/Chicago',
  houston: 'America/Chicago',
  denver: 'America/Denver',
  phoenix: 'America/Phoenix',
  'los angeles': 'America/Los_Angeles',
  'san francisco': 'America/Los_Angeles',
  seattle: 'America/Los_Angeles',
  'las vegas': 'America/Los_Angeles',
  'mexico city': 'America/Mexico_City',
  tijuana: 'America/Tijuana',
  // South America
  'sao paulo': 'America/Sao_Paulo',
  'rio de janeiro': 'America/Sao_Paulo',
  'buenos aires': 'America/Argentina/Buenos_Aires',
  lima: 'America/Lima',
  bogota: 'America/Bogota',
  santiago: 'America/Santiago',
  caracas: 'America/Caracas',
  // Africa
  cairo: 'Africa/Cairo',
  lagos: 'Africa/Lagos',
  nairobi: 'Africa/Nairobi',
  johannesburg: 'Africa/Johannesburg',
  sandton: 'Africa/Johannesburg',
  'cape town': 'Africa/Johannesburg',
  durban: 'Africa/Johannesburg',
  'addis ababa': 'Africa/Addis_Ababa',
  accra: 'Africa/Accra',
  casablanca: 'Africa/Casablanca',
  // Oceania
  sydney: 'Australia/Sydney',
  melbourne: 'Australia/Melbourne',
  brisbane: 'Australia/Brisbane',
  perth: 'Australia/Perth',
  canberra: 'Australia/Sydney',
  adelaide: 'Australia/Adelaide',
  darwin: 'Australia/Darwin',
  hobart: 'Australia/Hobart',
  auckland: 'Pacific/Auckland',
  wellington: 'Pacific/Auckland',
}

function titleCase(key) {
  return key
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Normalized key -> { zone, display, multi, examples }
function buildLocationMap() {
  const map = new Map()
  const add = (key, display, zone, multi, examples) => {
    if (!map.has(key)) map.set(key, { zone, display, multi: !!multi, examples })
  }
  for (const [key, [display, examples]] of Object.entries(MULTI_ZONE_COUNTRIES)) {
    add(key, display, null, true, examples)
  }
  for (const [key, zone] of Object.entries(COUNTRY_ZONES)) {
    add(key, titleCase(key), zone, false)
  }
  // Country aliases whose display name differs from the key.
  const DISPLAY_OVERRIDES = {
    usa: 'the USA',
    'united states': 'the USA',
    america: 'the USA',
    uk: 'the UK',
    'united kingdom': 'the UK',
    uae: 'the UAE',
    'united arab emirates': 'the UAE',
  }
  for (const [key, display] of Object.entries(DISPLAY_OVERRIDES)) {
    const meta = map.get(key)
    if (meta) meta.display = display
  }
  for (const [key, zone] of Object.entries(CITY_ZONES)) {
    const display = key === 'sao paulo' ? 'São Paulo' : titleCase(key)
    add(key, display, zone, false)
  }
  // Longest keys first so "new york" wins over shorter overlapping words.
  return [...map.entries()]
    .sort((a, b) => b[0].length - a[0].length)
    .map(([key, meta]) => ({
      meta,
      re: new RegExp(`\\b${key.split(' ').join('\\s+')}\\b`),
    }))
}

const LOCATION_MATCHERS = buildLocationMap()

// Lowercase, strip diacritics/apostrophes, collapse punctuation to spaces.
function normalizeKey(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9\s./-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function findLocation(q) {
  for (const { re, meta } of LOCATION_MATCHERS) {
    if (re.test(q)) return meta
  }
  return null
}

// The visitor asks about the current date (today), not e.g. a deadline.
const DATE_INTENT_RE =
  /\bdate\b|\bwhat day\b|\bday (?:is it|today)\b|\btodays day\b|\bwhats today\b|\bwhat is today\b/

// Not clock questions even though they contain "date".
const NOT_DATE_RE =
  /\b(?:expiry|expiration|expire|due|release|launch|deadline|effective|start|end|closing|published|delivery|arrival|shipping)\s+date\b|\bdate of birth\b|\bup to date\b|\bupdat(?:e|es|ed|ing)\b/

// The visitor asks about the current time, not e.g. "turnaround time".
const TIME_INTENT_RE = /\btime\b|\bclock\b/

// Office-hours questions ("what time do you open?") stay with the
// existing Rezonants knowledge base, so exclude them here. (Bare "hour" is
// deliberately not listed so "24 hour format" isn't caught by it.)
const OFFICE_HOURS_RE =
  /\b(open|opens|opening|opened|close|closes|closing|closed|hours|timings|timing|shifts|shift)\b/

// "response time", "part-time", "real-time", ... are not clock questions.
// (Single words like "uptime" never match \btime\b, so they need no entry.)
const NOT_CLOCK_TIME_RE =
  /\b(?:turnaround|lead|delivery|response|processing|part|full|real|spare|waste|travel|commute|cook|cooking|render|build|load|loading|wait|waiting|hold|holding)(?:\s*-\s*|\s+)time\b/

// A bare "time"/"clock" word only counts as a clock question when the
// sentence reads as one (question word, common imperative, or "time in X").
const TIME_CONTEXT_RE =
  /^(?:what|whats|present|current|tell|is|the|now|time|do|could|can|any|please|give|show|hi|hey|hello)\b|\btime (?:in|at|for|now|today)\b|\btime now\b|\bcurrent time\b|\bpresent time\b|\bwhat time\b|\blocal time\b/

// Explicit 24-hour request.
const WANT_24H_RE = /\b24\s*(?:hour|hr|h)\b|24h|military time\b/

export function formatDateInZone(date = new Date(), timeZone = DEFAULT_ZONE) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const parts = {}
  for (const p of dtf.formatToParts(date)) {
    if (p.type !== 'literal') parts[p.type] = p.value
  }
  return `${parts.day} ${parts.month} ${parts.year}`
}

export function formatTimeInZone(date = new Date(), timeZone = DEFAULT_ZONE, hour12 = true) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12,
  }).format(date)
}

/**
 * Resolve a general date/time question to a ready-to-send reply.
 *
 * @param {string} text - The visitor's raw message.
 * @param {{ name?: string|null, greeting?: string|null }} [opts]
 *   `name`/`greeting` optionally personalize the default-location time reply
 *   (e.g. "Good morning, Ishan. The current time is 10:43 AM."). The server
 *   path omits them.
 * @returns {string|null} The reply, or null when the message is not a
 *   date/time question (caller continues its normal flow).
 */
export function resolveDateTimeQuery(text, opts = {}) {
  const raw = typeof text === 'string' ? text : ''
  const q = normalizeKey(raw)
  if (!q) return null

  // Never hijack office-hours or compound-"time" phrasings.
  if (OFFICE_HOURS_RE.test(q)) return null
  if (NOT_CLOCK_TIME_RE.test(q)) return null
  if (NOT_DATE_RE.test(q)) return null

  const wantsDate = DATE_INTENT_RE.test(q)
  const wantsTime = TIME_INTENT_RE.test(q) && TIME_CONTEXT_RE.test(q)
  if (!wantsDate && !wantsTime) return null

  const loc = findLocation(q)

  // Multi-zone country: ask which city rather than inventing one time.
  if (loc && loc.multi) {
    return `${loc.display} has multiple time zones. Which city would you like the time for, such as ${loc.examples}?`
  }

  const zone = (loc && loc.zone) || DEFAULT_ZONE
  const wants24h = WANT_24H_RE.test(q)
  const now = new Date()

  if (wantsDate && wantsTime) {
    const d = formatDateInZone(now, zone)
    const t = formatTimeInZone(now, zone, !wants24h)
    return loc
      ? `The current date and time in ${loc.display} is ${d}, ${t}.`
      : `Today is ${d}, and the current time is ${t}.`
  }

  if (wantsDate) {
    const d = formatDateInZone(now, zone)
    return loc ? `Today's date in ${loc.display} is ${d}.` : `Today's date is ${d}.`
  }

  const t = formatTimeInZone(now, zone, !wants24h)
  if (!loc && opts.name && opts.greeting) {
    return `${opts.greeting}, ${opts.name}. The current time is ${t}.`
  }
  return `The current time in ${(loc && loc.display) || DEFAULT_LOCATION_LABEL} is ${t}.`
}
