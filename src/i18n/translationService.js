/**
 * Automatic translation service.
 *
 * When the user picks a non-English language the service:
 *   1. Checks localStorage for a cached translation bundle.
 *   2. If missing, flattens the English source bundle, sends every value to the
 *      backend `/api/translate` endpoint for batch machine-translation.
 *   3. Reconstructs the nested translation object from the flat results.
 *   4. Stores the bundle in localStorage so subsequent visits are instant.
 *
 * The API key lives only on the server — the browser never sees it.
 */

const CACHE_PREFIX = 'rezonants-i18n-'
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000 // 30 days

/* ── helpers ──────────────────────────────────────────────────────────────── */

/** Flatten a nested object into { 'dotted.path': value } */
function flatten(obj, prefix = '') {
  const result = {}
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(result, flatten(val, path))
    } else {
      result[path] = String(val)
    }
  }
  return result
}

/** Reconstruct a nested object from { 'dotted.path': value } */
function unflatten(flat) {
  const root = {}
  for (const [path, val] of Object.entries(flat)) {
    const parts = path.split('.')
    let cur = root
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in cur)) cur[parts[i]] = {}
      cur = cur[parts[i]]
    }
    cur[parts[parts.length - 1]] = val
  }
  return root
}

/* ── cache ────────────────────────────────────────────────────────────────── */

function cacheKey(lang) {
  return `${CACHE_PREFIX}${lang}`
}

function readCache(lang) {
  try {
    const raw = localStorage.getItem(cacheKey(lang))
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(cacheKey(lang))
      return null
    }
    return data
  } catch {
    return null
  }
}

function writeCache(lang, data) {
  try {
    localStorage.setItem(
      cacheKey(lang),
      JSON.stringify({ data, ts: Date.now() }),
    )
  } catch {
    // storage full – silently ignore
  }
}

/* ── API call ─────────────────────────────────────────────────────────────── */

async function fetchTranslations(texts, targetLang) {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts, target: targetLang, source: 'en' }),
  })
  if (!res.ok) throw new Error(`Translation API ${res.status}`)
  const { translations } = await res.json()
  return translations
}

/* ── public API ───────────────────────────────────────────────────────────── */

/**
 * Return a full translation bundle for `lang`.
 * For English this is a no-op; for every other language it fetches from the
 * API (with caching) and returns the nested object ready for i18next.
 */
export async function loadTranslations(lang, enBundle) {
  if (lang === 'en') return enBundle

  const cached = readCache(lang)
  if (cached) return cached

  const flat = flatten(enBundle)
  const keys = Object.keys(flat)
  const values = Object.values(flat)

  // Google Translate v2 handles large batches, but we chunk at 100 texts to
  // stay well under the 128 KB request-body limit.
  const CHUNK = 100
  const translatedFlat = {}
  for (let i = 0; i < values.length; i += CHUNK) {
    const chunk = values.slice(i, i + CHUNK)
    const keysChunk = keys.slice(i, i + CHUNK)
    try {
      const translated = await fetchTranslations(chunk, lang)
      keysChunk.forEach((k, idx) => {
        translatedFlat[k] = translated[idx]
      })
    } catch {
      // On failure, keep the English originals for this chunk so the site
      // never shows blank text.
      keysChunk.forEach((k, idx) => {
        translatedFlat[k] = values[i + idx]
      })
    }
  }

  const bundle = unflatten(translatedFlat)
  writeCache(lang, bundle)
  return bundle
}

/**
 * Clear cached translations (useful for testing or if a user wants a
 * "hard refresh" of translations).
 */
export function clearTranslationCache(lang) {
  if (lang) {
    localStorage.removeItem(cacheKey(lang))
  } else {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  }
}
