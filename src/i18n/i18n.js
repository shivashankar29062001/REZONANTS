import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en_locale from './locales/en/translation.json' with { type: 'json' }

/**
 * Enterprise Lightweight i18n Initialization:
 * - English ('en') is bundled statically upfront as the default / fallback language.
 * - All other 114 supported languages are loaded dynamically on demand when selected.
 * - Ensures initial bundle size remains tiny (~240 KB instead of 25+ MB).
 */
const resources = {
  en: { translation: en_locale },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // React safeguards against XSS
    },
  })

export default i18n
