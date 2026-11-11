import {
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  isValidPhoneNumber,
} from 'libphonenumber-js'
import examples from 'libphonenumber-js/mobile/examples'

export const DEFAULT_COUNTRY = 'IN'

const PRIORITY_ORDER = ['IN', 'US', 'GB', 'AE', 'AU', 'CA']

let regionNames = null
try {
  if (typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function') {
    regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
  }
} catch {
  regionNames = null
}

export function flagEmoji(iso2) {
  if (!/^[A-Za-z]{2}$/.test(iso2)) return ''
  return String.fromCodePoint(
    ...iso2
      .toUpperCase()
      .split('')
      .map((c) => 127397 + c.charCodeAt(0)),
  )
}

function countryName(code) {
  try {
    return regionNames?.of(code) || code
  } catch {
    return code
  }
}

export const COUNTRIES = getCountries()
  .map((code) => {
    let maxLength = 15
    try {
      const example = getExampleNumber(code, examples)
      if (example) maxLength = Math.min(15, example.nationalNumber.length)
    } catch {
      /* keep default */
    }
    return {
      code,
      name: countryName(code),
      dial: getCountryCallingCode(code),
      flag: flagEmoji(code),
      maxLength,
    }
  })
  .sort((a, b) => {
    const ai = PRIORITY_ORDER.indexOf(a.code)
    const bi = PRIORITY_ORDER.indexOf(b.code)
    if (ai !== -1 || bi !== -1) {
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    }
    return a.name.localeCompare(b.name)
  })

const COUNTRIES_BY_CODE = Object.fromEntries(COUNTRIES.map((c) => [c.code, c]))

export function getCountryMeta(code) {
  return COUNTRIES_BY_CODE[code] || COUNTRIES_BY_CODE[DEFAULT_COUNTRY]
}

export function sanitizePhoneDigits(value, countryCode) {
  const meta = getCountryMeta(countryCode)
  const digits = String(value).replace(/\D+/g, '')
  return digits.slice(0, Math.max(meta.maxLength, 0))
}

export function normalizePastedDigits(value, countryCode) {
  const meta = getCountryMeta(countryCode)
  let digits = String(value).replace(/\D+/g, '')
  if (meta.dial && digits.startsWith(meta.dial)) {
    const withoutDial = digits.slice(meta.dial.length)
    if (withoutDial && withoutDial.length <= meta.maxLength) digits = withoutDial
  }
  return digits.slice(0, Math.max(meta.maxLength, 0))
}

export function formatE164(digits, countryCode) {
  const meta = getCountryMeta(countryCode)
  return `+${meta.dial}${digits}`
}

/**
 * Returns null when valid, otherwise { key, count?, countryName? }.
 * Keys: 'required' | 'tooLong' | 'incomplete' | 'invalid'
 */
export function validatePhoneDigits(digits, countryCode) {
  const meta = getCountryMeta(countryCode)
  const clean = String(digits || '').replace(/\D+/g, '')
  if (!clean) return { key: 'required' }
  if (clean.length > meta.maxLength) return { key: 'tooLong', count: meta.maxLength }
  try {
    if (isValidPhoneNumber(formatE164(clean, countryCode))) return null
  } catch {
    /* fall through */
  }
  if (clean.length < meta.maxLength) return { key: 'incomplete', count: meta.maxLength }
  return { key: 'invalid', countryName: meta.name }
}

export function phoneValidationMessage(t, result) {
  if (!result) return null
  switch (result.key) {
    case 'required':
      return t('phoneInput.required', 'Phone number is required.')
    case 'tooLong':
      return t('phoneInput.tooLong', {
        defaultValue: 'Phone number cannot contain more than {{count}} digits.',
        count: result.count,
      })
    case 'incomplete':
      return t('phoneInput.incomplete', {
        defaultValue: 'Phone number must contain exactly {{count}} digits.',
        count: result.count,
      })
    default:
      return t('phoneInput.invalid', {
        defaultValue: 'Enter a valid phone number for {{country}}.',
        country: result.countryName,
      })
  }
}
