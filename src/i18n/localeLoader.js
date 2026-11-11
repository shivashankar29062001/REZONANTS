import i18n from './i18n.js'
import { SUPPORTED_LANGUAGES } from './languages.js'

/**
 * Locale aliases mapping non-standard or alternative language tags to
 * the canonical directory name in src/i18n/locales/
 */
export const LOCALE_ALIASES = {
  'zh-CN': 'zh',
  'nb': 'no',
  'tl': 'fil',
}

export const SUPPORTED_CODE_SET = new Set(SUPPORTED_LANGUAGES.map((l) => l.code))

/**
 * Resolves a given language code into a supported canonical locale code.
 * Falls back to 'en' if not supported.
 */
export function resolveCanonicalLocale(code) {
  if (!code || typeof code !== 'string') return 'en'
  const trimmed = code.trim()
  if (trimmed === 'en' || trimmed.toLowerCase().startsWith('en-')) return 'en'

  // Exact match in aliases
  if (LOCALE_ALIASES[trimmed]) return LOCALE_ALIASES[trimmed]

  // Exact match in supported languages (preserves case, e.g. zh-TW)
  if (SUPPORTED_CODE_SET.has(trimmed)) return trimmed

  // Check lowercase
  const lower = trimmed.toLowerCase()
  if (LOCALE_ALIASES[lower]) return LOCALE_ALIASES[lower]
  if (SUPPORTED_CODE_SET.has(lower)) return lower

  // Check base language code (e.g. 'es-ES' -> 'es')
  const base = lower.split('-')[0]
  if (LOCALE_ALIASES[base]) return LOCALE_ALIASES[base]
  if (SUPPORTED_CODE_SET.has(base)) return base

  return 'en'
}

// In-memory cache of loaded languages (English is bundled at startup)
const loadedLocales = new Set(['en'])

// In-flight promise cache to avoid duplicate network requests for the same locale
const inFlightRequests = new Map()

// Dynamic import glob: Vite creates separate on-demand code-split chunks for all 114 non-English languages
// English is statically bundled in i18n.js and does not need a dynamic loader
const localeLoaders = import.meta.glob([
  './locales/*/translation.json',
  '!./locales/en/translation.json',
])

// Test/SSR hook to allow mocking or custom loader injection
let customLocaleLoader = null
export function setCustomLocaleLoader(fn) {
  customLocaleLoader = fn
}

/**
 * Dynamically loads and registers a locale's translation bundle into i18n.
 * Caches in memory once loaded. Reuses in-flight promise if requested concurrently.
 * Returns a Promise that resolves to true if the locale is loaded, or false on error.
 */
export function loadLocale(code) {
  const canonical = resolveCanonicalLocale(code)

  // English is already statically loaded and registered
  if (canonical === 'en') {
    return Promise.resolve(true)
  }

  // Already loaded and registered in i18n
  if (loadedLocales.has(canonical) && i18n.hasResourceBundle(canonical, 'translation')) {
    return Promise.resolve(true)
  }

  // Reuse in-flight fetch promise if already loading
  if (inFlightRequests.has(canonical)) {
    return inFlightRequests.get(canonical)
  }

  const loaderKey = `./locales/${canonical}/translation.json`
  const hasViteLoader = localeLoaders && typeof localeLoaders[loaderKey] === 'function'

  const loadPromise = (async () => {
    try {
      let data = null

      if (typeof customLocaleLoader === 'function') {
        data = await customLocaleLoader(canonical)
      } else if (hasViteLoader) {
        const module = await localeLoaders[loaderKey]()
        data = module.default || module
      }

      if (!data) {
        console.warn(`[Translation] No locale file available for: ${canonical}`)
        return false
      }

      // Register translation bundle in i18n
      i18n.addResourceBundle(canonical, 'translation', data, true, true)

      // Register any aliases pointing to this canonical locale
      for (const [alias, target] of Object.entries(LOCALE_ALIASES)) {
        if (target === canonical) {
          i18n.addResourceBundle(alias, 'translation', data, true, true)
        }
      }

      loadedLocales.add(canonical)
      return true
    } catch (err) {
      console.error(`[Translation] Failed to load locale bundle "${canonical}":`, err)
      return false
    } finally {
      inFlightRequests.delete(canonical)
    }
  })()

  inFlightRequests.set(canonical, loadPromise)
  return loadPromise
}

export function isLocaleLoaded(code) {
  const canonical = resolveCanonicalLocale(code)
  return loadedLocales.has(canonical) && i18n.hasResourceBundle(canonical, 'translation')
}

export function getSavedTabLanguage() {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const saved = window.sessionStorage.getItem('rezonants_tab_lang')
      if (saved) {
        const canonical = resolveCanonicalLocale(saved)
        if (canonical === 'en' || SUPPORTED_CODE_SET.has(canonical)) {
          return canonical
        }
      }
    }
  } catch {
    // Ignore storage restrictions
  }
  return 'en'
}

// Eagerly trigger background pre-load of saved tab language if present on boot
if (typeof window !== 'undefined') {
  const savedBootLang = getSavedTabLanguage()
  if (savedBootLang && savedBootLang !== 'en') {
    loadLocale(savedBootLang).catch(() => {})
  }
}
