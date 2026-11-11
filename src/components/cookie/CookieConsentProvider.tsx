import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ACCEPT_ALL_PREFERENCES,
  DEFAULT_PREFERENCES,
  applyConsent,
  clearConsent,
  createRecord,
  getStoredConsent,
  resetConsentDom,
  saveConsent,
} from '../../lib/cookieConsent'
import type { CookieConsentRecord, CookiePreferences } from '../../lib/cookieConsent'

interface CookieConsentContextValue {
  /** The stored decision, or `null` before the visitor has chosen. */
  consent: CookieConsentRecord | null
  /** True once the visitor has made any choice. */
  decided: boolean
  /** Last-known preference state (defaults when undecided). */
  preferences: CookiePreferences
  isPreferencesOpen: boolean
  openPreferences: () => void
  closePreferences: () => void
  acceptAll: () => void
  rejectNonEssential: () => void
  savePreferences: (preferences: CookiePreferences) => void
  /** Clear the saved decision and show the banner again. */
  resetConsent: () => void
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null)

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsentRecord | null>(() =>
    getStoredConsent(),
  )
  const [isPreferencesOpen, setPreferencesOpen] = useState(false)

  // Reflect the current state onto the document (attributes, event, scripts).
  useEffect(() => {
    if (consent) {
      applyConsent(consent)
    } else {
      resetConsentDom()
    }
  }, [consent])

  const persist = useCallback(
    (choice: 'accept' | 'reject' | 'custom', preferences: CookiePreferences) => {
      const record = createRecord(choice, preferences)
      saveConsent(record)
      setConsent(record)
      setPreferencesOpen(false)
    },
    [],
  )

  const acceptAll = useCallback(
    () => persist('accept', ACCEPT_ALL_PREFERENCES),
    [persist],
  )

  const rejectNonEssential = useCallback(
    () => persist('reject', DEFAULT_PREFERENCES),
    [persist],
  )

  const savePreferences = useCallback(
    (preferences: CookiePreferences) => persist('custom', preferences),
    [persist],
  )

  const openPreferences = useCallback(() => setPreferencesOpen(true), [])
  const closePreferences = useCallback(() => setPreferencesOpen(false), [])

  const resetConsent = useCallback(() => {
    clearConsent()
    setConsent(null)
    setPreferencesOpen(false)
  }, [])

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      consent,
      decided: consent !== null,
      preferences: consent?.preferences ?? DEFAULT_PREFERENCES,
      isPreferencesOpen,
      openPreferences,
      closePreferences,
      acceptAll,
      rejectNonEssential,
      savePreferences,
      resetConsent,
    }),
    [
      consent,
      isPreferencesOpen,
      openPreferences,
      closePreferences,
      acceptAll,
      rejectNonEssential,
      savePreferences,
      resetConsent,
    ],
  )

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent(): CookieConsentContextValue {
  const context = useContext(CookieConsentContext)
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider')
  }
  return context
}
