import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import i18n from './i18n.js'
import { isRtlLanguage } from './languages.js'
import {
  getSavedTabLanguage,
  isLocaleLoaded,
  loadLocale,
  resolveCanonicalLocale,
} from './localeLoader.js'

/* ── context ─────────────────────────────────────────────────────────────── */

const TranslationContext = createContext({
  lang: 'en',
  loading: false,
  isRtl: false,
  setLanguage: () => {},
  t: (key) => key,
})

export function TranslationProvider({ children }) {
  const initialSaved = typeof window !== 'undefined' ? getSavedTabLanguage() : 'en'
  const [lang, setLang] = useState(initialSaved || 'en')
  const [loading, setLoading] = useState(Boolean(initialSaved && initialSaved !== 'en'))

  // Sequential request tracking to eliminate rapid language-switching race conditions
  const activeRequestIdRef = useRef(0)

  const isRtl = useMemo(() => isRtlLanguage(lang), [lang])

  const setLanguage = useCallback(async (code) => {
    if (!code) return
    const canonical = resolveCanonicalLocale(code)
    const requestId = ++activeRequestIdRef.current
    setLoading(true)

    try {
      // If language is not English and not yet loaded into memory, fetch on-demand
      if (canonical !== 'en' && !isLocaleLoaded(canonical)) {
        const loaded = await loadLocale(canonical)

        // Stale request detection: if a newer switch was triggered while fetching, discard
        if (requestId !== activeRequestIdRef.current) {
          return
        }

        if (!loaded) {
          console.warn(`[Translation] Failed to load locale "${code}". Retaining current language.`)
          return
        }
      }

      // Check again if superseded before committing language change
      if (requestId !== activeRequestIdRef.current) {
        return
      }

      await i18n.changeLanguage(canonical)

      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem('rezonants_tab_lang', canonical)
        }
      } catch {
        // Silently ignore storage errors
      }

      setLang(canonical)

      if (typeof document !== 'undefined') {
        const rtl = isRtlLanguage(canonical)
        document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr')
        document.documentElement.setAttribute('lang', canonical)
      }
    } catch (err) {
      console.error('[Translation] Error switching language to:', code, err)
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setLoading(false)
      }
    }
  }, [])

  // Restore saved language on tab refresh
  useEffect(() => {
    const saved = getSavedTabLanguage()
    if (saved && saved !== 'en') {
      setLanguage(saved)
    } else {
      setLoading(false)
    }
  }, [setLanguage])

  // Sync with external i18next language changes
  useEffect(() => {
    const handler = (lng) => {
      setLang(lng)
      if (typeof document !== 'undefined') {
        const rtl = isRtlLanguage(lng)
        document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr')
        document.documentElement.setAttribute('lang', lng)
      }
    }
    i18n.on('languageChanged', handler)

    // Initial DOM setup for lang and dir
    const initialLng = i18n.language || 'en'
    if (typeof document !== 'undefined') {
      const rtl = isRtlLanguage(initialLng)
      document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr')
      document.documentElement.setAttribute('lang', initialLng)
    }

    return () => i18n.off('languageChanged', handler)
  }, [])

  const value = useMemo(
    () => ({
      lang,
      loading,
      isRtl,
      setLanguage,
      t: i18n.t.bind(i18n),
    }),
    [lang, loading, isRtl, setLanguage]
  )

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  return useContext(TranslationContext)
}

export { i18n }
