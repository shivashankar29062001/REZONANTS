import { useCookieConsent } from '../components/cookie/CookieConsentProvider'
import { useTranslation } from '../i18n/TranslationContext'

export function PrivacyPolicyPage() {
  const { openPreferences } = useCookieConsent()
  const { t } = useTranslation()

  const SECTIONS: { title: string; body: string[] }[] = [
    {
      title: t('privacy.section1.title'),
      body: [t('privacy.section1.body')],
    },
    {
      title: t('privacy.section2.title'),
      body: (() => {
        const val = t('privacy.section2.body', { returnObjects: true })
        return Array.isArray(val) ? val : [String(val)]
      })(),
    },
    {
      title: t('privacy.section3.title'),
      body: [t('privacy.section3.body')],
    },
    {
      title: t('privacy.section4.title'),
      body: [t('privacy.section4.body')],
    },
    {
      title: t('privacy.section5.title'),
      body: [t('privacy.section5.body')],
    },
    {
      title: t('privacy.section6.title'),
      body: [t('privacy.section6.body')],
    },
  ]

  return (
    <>
      <section className="hero-section subpage-hero">
        <div className="container">
          <div className="subpage-hero-content">
            <span className="badge">{t('privacy.badge')}</span>
            <h1>{t('privacy.title')}</h1>
            <p>
              {t('privacy.description')}
            </p>
            <p className="privacy-updated">{t('privacy.lastUpdated')}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="privacy-layout">
            <div className="privacy-note card">
              <h3>{t('privacy.managingPreferences')}</h3>
              <p>
                {t('privacy.managingPreferencesDesc')}
              </p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={openPreferences}
              >
                {t('privacy.manageCookiePreferences')}
              </button>
            </div>

            {SECTIONS.map((section) => (
              <article key={section.title} className="privacy-section">
                <h2>{section.title}</h2>
                {section.body.map((paragraph: string) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}

            <article className="privacy-section">
              <h2>{t('privacy.contactUs')}</h2>
              <p>
                {t('privacy.contactUsText')}
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}

export default PrivacyPolicyPage
