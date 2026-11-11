import { useEffect, useMemo, useRef, useState } from 'react'
import { getExampleNumber } from 'libphonenumber-js'
import { useTranslation } from '../i18n/TranslationContext'
import examples from 'libphonenumber-js/mobile/examples'
import {
  COUNTRIES,
  getCountryMeta,
  normalizePastedDigits,
  phoneValidationMessage,
  sanitizePhoneDigits,
  validatePhoneDigits,
} from '../lib/phone'

function Flag({ country }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span className="phone-flag-fallback" aria-hidden="true">
        {country.code}
      </span>
    )
  }
  return (
    <img
      className="phone-flag-img"
      src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png 2x`}
      width="23"
      height="17"
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

export default function PhoneInput({
  id,
  name,
  value,
  country,
  onChange,
  error,
  autoComplete = 'tel',
}) {
  const { t } = useTranslation()
  const meta = getCountryMeta(country)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)

  const wrapRef = useRef(null)
  const btnRef = useRef(null)
  const searchRef = useRef(null)
  const listRef = useRef(null)

  const placeholder = useMemo(() => {
    try {
      const example = getExampleNumber(country, examples)
      return example ? example.formatNational() : ''
    } catch {
      return ''
    }
  }, [country])

  const selected = meta
  const validationResult = validatePhoneDigits(value, country)
  const liveError =
    validationResult && validationResult.key !== 'required'
      ? phoneValidationMessage(t, validationResult)
      : null
  const showError = error || (value ? liveError : null)

  const normalizedQuery = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!normalizedQuery) return COUNTRIES
    const dialQuery = normalizedQuery.replace(/[^0-9]/g, '')
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(normalizedQuery) ||
        c.code.toLowerCase() === normalizedQuery ||
        (dialQuery && c.dial.startsWith(dialQuery)),
    )
  }, [normalizedQuery])

  useEffect(() => {
    setHighlighted(0)
  }, [normalizedQuery, open])

  useEffect(() => {
    if (!open) return
    const onMouseDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    requestAnimationFrame(() => searchRef.current?.focus())
  }, [open])

  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.children[highlighted]
    el?.scrollIntoView({ block: 'nearest' })
  }, [highlighted, open, filtered.length])

  const selectCountry = (code) => {
    onChange({ phone: sanitizePhoneDigits(value, code), country: code })
    setOpen(false)
    setQuery('')
    btnRef.current?.focus()
  }

  const handleInputChange = (e) => {
    onChange({ phone: sanitizePhoneDigits(e.target.value, country), country })
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const choice = filtered[highlighted]
      if (choice) selectCountry(choice.code)
    }
  }

  return (
    <div
      ref={wrapRef}
      className={`phone-field${showError ? ' has-error' : ''}`}
      data-phone-field=""
    >
      <div className="phone-field-row">
        <div className="phone-country">
          <button
            ref={btnRef}
            type="button"
            id={`${id}-country`}
            className="phone-country-btn"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`${id}-country-list`}
            aria-label={`${t('phoneInput.countryCodeLabel', { defaultValue: 'Country calling code' })}: ${selected.name} (+${selected.dial})`}
            onClick={() => setOpen((o) => !o)}
          >
            <Flag country={selected} />
            <span className="phone-country-dial">+{selected.dial}</span>
            <svg
              className="phone-caret"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {open && (
            <div className="phone-dropdown">
              <input
                ref={searchRef}
                type="text"
                className="phone-search"
                placeholder={t('phoneInput.searchPlaceholder', {
                  defaultValue: 'Search country or code…',
                })}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                aria-label={t('phoneInput.searchPlaceholder', {
                  defaultValue: 'Search country or code…',
                })}
              />
              <ul
                className="phone-options"
                id={`${id}-country-list`}
                role="listbox"
                aria-label={t('phoneInput.countryCodeLabel', {
                  defaultValue: 'Country calling code',
                })}
              >
                {filtered.length === 0 && (
                  <li className="phone-no-results">
                    {t('phoneInput.noResults', { defaultValue: 'No countries found.' })}
                  </li>
                )}
                {filtered.map((c, i) => (
                  <li key={c.code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={c.code === country}
                      className={`phone-option${i === highlighted ? ' is-highlighted' : ''}${c.code === country ? ' is-selected' : ''}`}
                      onMouseEnter={() => setHighlighted(i)}
                      onClick={() => selectCountry(c.code)}
                    >
                      <Flag country={c} />
                      <span className="phone-option-name">{c.name}</span>
                      <span className="phone-option-dial">+{c.dial}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <input
          id={id}
          name={name}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={autoComplete}
          className={`phone-number-input${showError ? ' input-error' : ''}`}
          value={value}
          onChange={handleInputChange}
          onPaste={(e) => {
            e.preventDefault()
            const text = e.clipboardData?.getData('text') || ''
            onChange({ phone: normalizePastedDigits(text, country), country })
          }}
          placeholder={placeholder}
          maxLength={meta.maxLength + 4}
          aria-invalid={showError ? 'true' : undefined}
          aria-describedby={showError ? `${id}-error` : undefined}
        />
      </div>
      {showError && (
        <span className="error-message" id={`${id}-error`} role="alert">
          {showError}
        </span>
      )}
    </div>
  )
}
