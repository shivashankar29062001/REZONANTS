import { useEffect, useRef, useState } from 'react'
import { useBodyScrollLock } from '../../lib/useBodyScrollLock'
import { useFocusTrap } from '../../lib/useFocusTrap'
import { DEFAULT_PREFERENCES } from '../../lib/cookieConsent'
import type { CookiePreferences } from '../../lib/cookieConsent'
import { Switch } from '../Switch'
import { useCookieConsent } from './CookieConsentProvider'
import { useTranslation } from '../../i18n/TranslationContext'

interface CookieOption {
  key: keyof CookiePreferences
  titleKey: string
  descKey: string
}

export function CookiePreferenceModal() {
  const { t } = useTranslation()
  const {
    isPreferencesOpen,
    preferences,
    closePreferences,
    savePreferences,
  } = useCookieConsent()

  const panelRef = useRef<HTMLDivElement>(null)
  const analyticsSwitchRef = useRef<HTMLButtonElement>(null)
  const [prefs, setPrefs] = useState<CookiePreferences>(DEFAULT_PREFERENCES)

  // Initialise toggles from the current consent on every open.
  useEffect(() => {
    if (isPreferencesOpen) {
      setPrefs(preferences)
      analyticsSwitchRef.current?.focus()
    }
  }, [isPreferencesOpen, preferences])

  useFocusTrap(panelRef, isPreferencesOpen)
  useBodyScrollLock(isPreferencesOpen)

  useEffect(() => {
    if (!isPreferencesOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closePreferences()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isPreferencesOpen, closePreferences])

  if (!isPreferencesOpen) return null

  const toggle = (key: keyof CookiePreferences) => {
    setPrefs((current) => ({ ...current, [key]: !current[key] }))
  }

  const OPTIONS: CookieOption[] = [
    {
      key: 'analytics',
      titleKey: 'cookiePreferences.analytics',
      descKey: 'cookiePreferences.analyticsDesc',
    },
    {
      key: 'marketing',
      titleKey: 'cookiePreferences.marketing',
      descKey: 'cookiePreferences.marketingDesc',
    },
  ]

  return (
    <div
      className="cookie-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-title"
      onClick={closePreferences}
    >
      <div
        className="cookie-modal-panel"
        ref={panelRef}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={closePreferences}
          aria-label="Close cookie preferences"
        >
          &times;
        </button>

        <div className="cookie-modal-header">
          <h2 id="cookie-modal-title">{t('cookiePreferences.title')}</h2>
          <p>
            {t('cookiePreferences.description')}
          </p>
        </div>

        <div className="cookie-options">
          <div className="cookie-option">
            <div className="cookie-option-text">
              <strong>{t('cookiePreferences.essential')}</strong>
              <p>{t('cookiePreferences.essentialDesc')}</p>
            </div>
            <Switch
              id="cookie-essential"
              label="Essential cookies (required, always enabled)"
              checked
              disabled
            />
          </div>

          {OPTIONS.map((option) => (
            <div className="cookie-option" key={option.key}>
              <div className="cookie-option-text">
                <strong>{t(option.titleKey)}</strong>
                <p>{t(option.descKey)}</p>
              </div>
              <Switch
                id={`cookie-${option.key}`}
                label={`${t(option.titleKey)} cookies`}
                checked={prefs[option.key]}
                onChange={() => toggle(option.key)}
                innerRef={option.key === 'analytics' ? analyticsSwitchRef : undefined}
              />
            </div>
          ))}
        </div>

        <div className="cookie-modal-actions">
          <button type="button" className="btn btn-outline" onClick={closePreferences}>
            {t('cookiePreferences.cancel')}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => savePreferences(prefs)}
          >
            {t('cookiePreferences.savePreferences')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookiePreferenceModal
