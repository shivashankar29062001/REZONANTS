/**
 * Cookie consent core — types, storage and consent application.
 *
 * The consent record is persisted to localStorage (source of truth) and the
 * current preference state is mirrored onto the document as
 * `data-consent-*` attributes plus a `CustomEvent` so third-party / first-party
 * scripts can react to consent changes without bundling it all here.
 */

export type CookieCategory = 'essential' | 'analytics' | 'marketing'

export type ConsentChoice = 'accept' | 'reject' | 'custom'

export interface CookiePreferences {
  analytics: boolean
  marketing: boolean
}

export interface CookieConsentRecord {
  /** What the visitor chose (accept all / reject / custom). */
  choice: ConsentChoice
  /** Per-category preference state. Essential is always true by definition. */
  preferences: CookiePreferences
  /** ISO timestamp of the decision. */
  timestamp: string
  /** Bump to re-prompt returning visitors after a policy/version change. */
  version: number
}

/** Bump when cookie policy or category set changes. */
export const CONSENT_VERSION = 1

export const CONSENT_STORAGE_KEY = 'rezonants_cookie_consent'

/** Dispatched on `window` whenever consent changes. */
export const CONSENT_EVENT = 'rezonants:cookie-consent'

export const DEFAULT_PREFERENCES: CookiePreferences = {
  analytics: false,
  marketing: false,
}

export const ACCEPT_ALL_PREFERENCES: CookiePreferences = {
  analytics: true,
  marketing: true,
}

function isCookiePreferences(value: unknown): value is CookiePreferences {
  if (typeof value !== 'object' || value === null) return false
  const prefs = value as Record<string, unknown>
  return (
    typeof prefs.analytics === 'boolean' &&
    typeof prefs.marketing === 'boolean'
  )
}

export function isConsentRecord(value: unknown): value is CookieConsentRecord {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return (
    (record.choice === 'accept' ||
      record.choice === 'reject' ||
      record.choice === 'custom') &&
    isCookiePreferences(record.preferences) &&
    typeof record.timestamp === 'string' &&
    typeof record.version === 'number'
  )
}

export function createRecord(
  choice: ConsentChoice,
  preferences: CookiePreferences,
): CookieConsentRecord {
  return {
    choice,
    preferences,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  }
}

export function getStoredConsent(): CookieConsentRecord | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isConsentRecord(parsed) || parsed.version !== CONSENT_VERSION) {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    // localStorage can throw (privacy modes, quota, disabled).
    return null
  }
}

export function saveConsent(record: CookieConsentRecord): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record))
  } catch {
    // Never block the UI because storage is unavailable.
  }
}

export function clearConsent(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY)
  } catch {
    // ignore
  }
}

/**
 * Reflect the preference state onto the DOM so scripts can gate themselves:
 *  - `data-consent-analytics` / `data-consent-marketing` on <html>
 *  - `rezonants:cookie-consent` CustomEvent on window
 *  - lazy `script[data-cookie-category][data-src]` placeholders are loaded
 *    when their category is enabled and removed again when disabled.
 */
export function applyConsent(record: CookieConsentRecord): void {
  if (typeof document === 'undefined') return

  const { preferences } = record
  document.documentElement.dataset.consentAnalytics = String(preferences.analytics)
  document.documentElement.dataset.consentMarketing = String(preferences.marketing)

  loadConsentScripts(preferences)

  window.dispatchEvent(
    new CustomEvent<CookieConsentRecord>(CONSENT_EVENT, { detail: record }),
  )
}

/** Mark consent as "not decided yet" so nothing non-essential runs. */
export function resetConsentDom(): void {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.consentAnalytics = 'false'
  document.documentElement.dataset.consentMarketing = 'false'
}

const LOADED_SCRIPT_ID_PREFIX = 'rezonants-consent-loaded-'

function loadConsentScripts(preferences: CookiePreferences): void {
  const placeholders = Array.from(
    document.querySelectorAll<HTMLScriptElement>('script[data-cookie-category][data-src]'),
  )

  for (const placeholder of placeholders) {
    const category = placeholder.dataset.cookieCategory as CookieCategory | undefined
    if (!category || category === 'essential') {
      // Essential scripts load immediately at parse time — nothing to do here.
      continue
    }

    const enabled = Boolean(preferences[category])
    const loadedId = placeholder.dataset.loadedId
    const loadedScript = loadedId ? document.getElementById(loadedId) : null

    if (enabled && !loadedScript) {
      const id = `${LOADED_SCRIPT_ID_PREFIX}${category}`
      const script = document.createElement('script')
      script.id = id
      script.async = true
      script.src = placeholder.dataset.src ?? ''
      placeholder.dataset.loadedId = id
      placeholder.after(script)
    } else if (!enabled && loadedScript) {
      loadedScript.remove()
      delete placeholder.dataset.loadedId
    }
  }
}
