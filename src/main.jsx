import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './lib/auth.jsx'
import { CookieConsentProvider } from './components/cookie/CookieConsentProvider.tsx'
import { TranslationProvider } from './i18n/TranslationContext'
import i18n from './i18n/i18n.js'
import { getSavedTabLanguage, loadLocale } from './i18n/localeLoader.js'
import { isRtlLanguage } from './i18n/languages.js'

const rawBase = import.meta.env.BASE_URL || '/'
const basename = rawBase === '/' ? '' : rawBase.replace(/\/$/, '')

// Pre-render initialization: ensure saved non-English tab language is active before frame 1
const savedLang = typeof window !== 'undefined' ? getSavedTabLanguage() : 'en'
if (savedLang && savedLang !== 'en') {
  try {
    const loaded = await loadLocale(savedLang)
    if (loaded) {
      await i18n.changeLanguage(savedLang)
      if (typeof document !== 'undefined') {
        const rtl = isRtlLanguage(savedLang)
        document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr')
        document.documentElement.setAttribute('lang', savedLang)
      }
    } else {
      try {
        window.sessionStorage.removeItem('rezonants_tab_lang')
      } catch {
        // Silently ignore storage errors
      }
      await i18n.changeLanguage('en')
    }
  } catch (err) {
    console.error('[Startup] Failed to restore saved locale:', err)
    try {
      window.sessionStorage.removeItem('rezonants_tab_lang')
    } catch {
      // Silently ignore storage errors
    }
    await i18n.changeLanguage('en')
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename || undefined}>
      <TranslationProvider>
        <AuthProvider>
          <CookieConsentProvider>
            <App />
          </CookieConsentProvider>
        </AuthProvider>
      </TranslationProvider>
    </BrowserRouter>
  </StrictMode>,
)
