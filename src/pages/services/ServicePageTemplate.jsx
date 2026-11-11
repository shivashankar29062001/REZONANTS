import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Icon } from '../../components/Icon'
import { useTranslation } from '../../i18n/TranslationContext'
import './ServicePage.css'

export function ServicePageTemplate({
  title,
  tagline,
  description,
  heroImage,
  hideHeroTitle = false,
  overviewImage,
  sectionHeadline,
  sectionDescription,
  featuresTitle,
  features = [],
  benefits = [],
  technologies = [],
  caseStudies = [],
  ctaText,
  showCta = true,
}) {
  const { t } = useTranslation()

  useEffect(() => {
    const reveals = () => Array.from(document.querySelectorAll('.reveal'))
    const revealEl = (el) => el.classList.add('revealed')
    const isInView = (el) => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      return r.top < vh && r.bottom > 0
    }
    const revealInView = () => {
      reveals().forEach((el) => {
        if (!el.classList.contains('revealed') && isInView(el)) revealEl(el)
      })
    }

    if (!('IntersectionObserver' in window)) {
      reveals().forEach(revealEl)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealEl(entry.target)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    reveals().forEach((el) => io.observe(el))

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        revealInView()
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    revealInView()

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <section className={`service-hero reveal${heroImage ? ' has-hero-bg' : ''}`}>
        {heroImage && (
          <div className="service-hero-media">
            <img
              src={heroImage}
              alt={title}
              onError={(e) => {
                if (e.currentTarget.src !== `${import.meta.env.BASE_URL}img/shared-services-hero.jpg`) {
                  e.currentTarget.src = `${import.meta.env.BASE_URL}img/shared-services-hero.jpg`
                }
              }}
            />
            <div className="service-hero-overlay" />
            <div className="container">
              {!hideHeroTitle && <h1>{title}</h1>}
            </div>
          </div>
        )}
      </section>

      {(tagline || description) && (
        <section className="section service-hero-content reveal">
          <div className="container">
            <div className="service-hero-content-inner">
              {tagline && (
                <span className="eyebrow">
                  <span className="eyebrow-bar" aria-hidden="true" />
                  {tagline}
                </span>
              )}
              {description && <p className="service-hero-sub">{description}</p>}
            </div>
          </div>
        </section>
      )}

      {(sectionHeadline || sectionDescription || overviewImage) && (
        <section className="section service-overview reveal">
          <div className="container">
            <div className="service-overview-layout">
              <div className="section-head reveal">
                <span className="eyebrow">
                  <span className="eyebrow-bar" aria-hidden="true" />
                  {t('servicePage.serviceOverview')}
                </span>
                {sectionHeadline && <h2>{sectionHeadline}</h2>}
                {sectionDescription && <p className="service-overview-desc">{sectionDescription}</p>}
              </div>
              {overviewImage && (
                <div className="service-overview-image reveal">
                  <img
                    src={overviewImage}
                    alt={`${title} overview`}
                    onError={(e) => {
                      if (e.currentTarget.src !== `${import.meta.env.BASE_URL}img/shared-services-hero.jpg`) {
                        e.currentTarget.src = `${import.meta.env.BASE_URL}img/shared-services-hero.jpg`
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {features.length > 0 && (
        <section className="section service-features">
          <div className="container">
            {featuresTitle && (
              <div className="section-head reveal">
                <span className="eyebrow">
                  <span className="eyebrow-bar" aria-hidden="true" />
                  {t('servicePage.whatWeOffer')}
                </span>
                <h2>{featuresTitle}</h2>
              </div>
            )}
            <div className="service-features-grid">
              {features.map((feature, i) => (
                <article key={feature} className="service-feature-card reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="service-feature-icon">
                    <Icon name="check" />
                  </span>
                  <h3>{feature}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {benefits.length > 0 && (
        <section className="section service-benefits">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">
                <span className="eyebrow-bar" aria-hidden="true" />
                  {t('servicePage.whyChooseRezonants')}
              </span>
              <h2>{t('servicePage.benefitsOfWorking')}</h2>
            </div>
            <ul className="benefits-list">
              {benefits.map((benefit, i) => (
                <li key={benefit} className="benefit-item reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                  <span className="benefit-icon">
                    <Icon name="badgeCheck" />
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {technologies.length > 0 && (
        <section className="section service-technologies">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">
                <span className="eyebrow-bar" aria-hidden="true" />
                  {t('servicePage.techStack')}
              </span>
              <h2>{t('servicePage.technologiesWeUse')}</h2>
            </div>
            <div className="tech-tags">
              {technologies.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {caseStudies.length > 0 && (
        <section className="section service-case-studies">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">
                <span className="eyebrow-bar" aria-hidden="true" />
                  {t('servicePage.ourWork')}
              </span>
              <h2>{t('servicePage.relatedProjects')}</h2>
            </div>
            <div className="case-studies-grid">
              {caseStudies.map((study, i) => (
                <article key={study.title} className="case-study-card reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="case-study-image" style={{ backgroundImage: `url(${study.image})` }} />
                  <div className="case-study-content">
                    <span className="case-study-tag">{study.category}</span>
                    <h3>{study.title}</h3>
                    <p>{study.description}</p>
                    <Link to={study.link} className="case-study-link">
                      {t('servicePage.viewCaseStudy')}
                      <Icon name="arrow" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {showCta && (
        <section className="section service-cta">
          <div className="container">
            <div className="service-cta-card reveal">
              <h2>{t('servicePage.readyToDiscuss', { title: title.toLowerCase() })}</h2>
              <p>{t('servicePage.seniorEngineersReady')}</p>
              <Link to="/book-consultation" className="btn btn-primary btn-lg">
                {ctaText || t('servicePage.startProject')}
                <Icon name="arrow" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}