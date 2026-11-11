import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from '../i18n/TranslationContext'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import './CustomDevelopmentPage.css'

export default function CustomDevelopmentPage() {
  const { t } = useTranslation()
  useDocumentMeta({
    title: 'Inception To Deployment — Rezonants',
    description:
      'End-to-end development of new digital solutions from business requirements and solution architecture through development, integration, testing, deployment, and ongoing support.',
  })

  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)

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
      { threshold: 0.12 }
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
    setTimeout(revealInView, 50)

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const handleBookConsultation = () => {
    navigate('/book-consultation', { state: { service: 'Inception To Deployment' } })
  }

  const coreCapabilitiesDefault = [
    'Requirements Engineering',
    'Solution Architecture',
    'Application Development',
    'API Integration',
    'Quality Assurance',
    'DevOps',
    'Deployment',
    'Support & Maintenance',
  ]
  const rawCaps = t('servicesDetails.customDevelopment.coreCapabilities', { returnObjects: true })
  const coreCapabilities = Array.isArray(rawCaps) && rawCaps.length ? rawCaps : coreCapabilitiesDefault

  return (
    <div className="cd-page">
      {/* Hero Section */}
      <section className="cd-hero">
        <img
          src={`${import.meta.env.BASE_URL}img/build-from-scratch-hero.jpg`}
          alt="End-to-end digital solutions built from scratch"
          className="cd-hero-bg"
        />
        <div className="cd-hero-copy reveal">
          <div className="cd-eyebrow">{t('services.pages.customDevelopment.eyebrow', { defaultValue: 'End-to-End Digital Engineering' })}</div>
          <h1>
            {t('services.pages.customDevelopment.titlePart1', { defaultValue: 'Inception To' })}{' '}
            <em>{t('services.pages.customDevelopment.titlePart2', { defaultValue: 'Deployment' })}</em>
          </h1>
          <p>
            {t('services.items.buildFromScratch.description', { defaultValue: 'End-to-end development of new digital solutions from business requirements and solution architecture through development, integration, testing, deployment, and ongoing support.' })}
          </p>
          <div className="cd-hero-actions">
            <button type="button" className="cd-btn-primary" onClick={handleBookConsultation}>
              {t('services.pages.customDevelopment.bookConsultation', { defaultValue: 'Book a Consultation' })}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <Link to="/services/solution-engineering" className="cd-btn-outline">
              {t('services.pages.customDevelopment.exploreEngineering', { defaultValue: 'Explore Solution Engineering' })}
            </Link>
          </div>
        </div>
      </section>

      {/* Core Capabilities Ribbon */}
      <section style={{ background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)', padding: '24px 0' }}>
        <div className="cd-wrap">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary-hover)', fontWeight: '700' }}>
              {t('services.coreCapabilities', { defaultValue: 'Core Capabilities' })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {coreCapabilities.map((cap) => (
                <span
                  key={cap}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '999px',
                    color: 'var(--text-heading)',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                  {cap}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Rows */}
      <section className="cd-section">
        <div className="cd-wrap">
          {/* Row 1: End-to-End Digital Solutions */}
          <div className="cd-row reveal">
            <div className="cd-text-col">
              <div className="cd-eyebrow">{t('servicesDetails.customDevelopment.row1Eyebrow', { defaultValue: 'Full Lifecycle Delivery' })}</div>
              <h2>{t('servicesDetails.customDevelopment.row1Title', { defaultValue: 'End-to-End Development from Requirements to Scale' })}</h2>
              <p>
                {t('servicesDetails.customDevelopment.row1P1', { defaultValue: 'Every new digital initiative starts with unique requirements, operational workflows, and strategic objectives that cannot be met by one-size-fits-all software. We specialize in building custom, high-performance software systems completely from scratch.' })}
              </p>
              <p>
                {t('servicesDetails.customDevelopment.row1P2', { defaultValue: 'From initial requirements discovery and technical architecture design to agile sprint development, API ecosystem integration, robust testing pipelines, and automated cloud deployments, our senior engineering teams take full ownership of your product lifecycle.' })}
              </p>
            </div>
            <div className="cd-img-col">
              <div className="cd-img-frame">
                <img src={`${import.meta.env.BASE_URL}img/build-from-scratch.jpg`} alt="End-to-end development of new digital solutions from scratch" />
              </div>
            </div>
          </div>

          {/* Row 2: Solution Architecture & Engineering (Reverse) */}
          <div className="cd-row reverse reveal">
            <div className="cd-text-col">
              <div className="cd-eyebrow">{t('servicesDetails.customDevelopment.row2Eyebrow', { defaultValue: 'Solution Architecture & Engineering' })}</div>
              <h2>{t('servicesDetails.customDevelopment.row2Title', { defaultValue: 'Scalable Systems Built for Enterprise Growth' })}</h2>
              <p>
                {t('servicesDetails.customDevelopment.row2P1', { defaultValue: 'We design resilient software architectures tailored to withstand heavy production loads. From modular microservices and event-driven backends to high-throughput data streams and GraphQL/REST APIs, we build platforms that scale effortlessly.' })}
              </p>
              <p>
                {t('servicesDetails.customDevelopment.row2P2', { defaultValue: 'By establishing clean, modular codebases paired with automated testing and continuous security compliance, we ensure your software foundation is maintainable, auditable, and ready for long-term evolution.' })}
              </p>
            </div>
            <div className="cd-img-col">
              <div className="cd-img-frame">
                <img src={`${import.meta.env.BASE_URL}img/build-scratch-architecture.jpg`} alt="Scalable Microservices and Solution Architecture" />
              </div>
            </div>
          </div>

          {/* Row 3: DevOps, QA & Continuous Deployment */}
          <div className="cd-row reveal">
            <div className="cd-text-col">
              <div className="cd-eyebrow">{t('servicesDetails.customDevelopment.row3Eyebrow', { defaultValue: 'Quality Assurance & DevOps' })}</div>
              <h2>{t('servicesDetails.customDevelopment.row3Title', { defaultValue: 'Agile Delivery with Automated Pipelines' })}</h2>
              <p>
                {t('servicesDetails.customDevelopment.row3P1', { defaultValue: 'Our delivery model embeds automated unit, integration, and end-to-end regression testing alongside containerized CI/CD workflows (Docker, Kubernetes, AWS/Azure/GCP).' })}
              </p>
              <p>
                {t('servicesDetails.customDevelopment.row3P2', { defaultValue: 'With transparent sprint demos, real-time observability, and milestone-driven velocity, we ensure rapid time-to-market without compromising security, stability, or user experience.' })}
              </p>
            </div>
            <div className="cd-img-col">
              <div className="cd-img-frame">
                <img src={`${import.meta.env.BASE_URL}img/build-scratch-devops.jpg`} alt="Continuous Delivery and Automated QA Pipelines" />
              </div>
            </div>
          </div>

          {/* Row 4: Ongoing Support & Maintenance (Reverse) */}
          <div className="cd-row reverse reveal">
            <div className="cd-text-col">
              <div className="cd-eyebrow">{t('servicesDetails.customDevelopment.row4Eyebrow', { defaultValue: 'Deployment & Support' })}</div>
              <h2>{t('servicesDetails.customDevelopment.row4Title', { defaultValue: 'Reliable 24/7 Operations and Long-Term Evolution' })}</h2>
              <p>
                {t('servicesDetails.customDevelopment.row4P1', { defaultValue: 'Going live is just the beginning. We provide proactive monitoring, SLA-backed maintenance, cloud infrastructure optimization, performance tuning, and ongoing feature rollouts.' })}
              </p>
              <p>
                {t('servicesDetails.customDevelopment.row4P2', { defaultValue: 'Our engineering team acts as a natural extension of your organization, ensuring zero downtime and continuous technological superiority in your market.' })}
              </p>
            </div>
            <div className="cd-img-col">
              <div className="cd-img-frame">
                <img src={`${import.meta.env.BASE_URL}img/build-scratch-support.jpg`} alt="24/7 Cloud Support and Production Maintenance" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="cd-capabilities-section">
        <div className="cd-wrap">
          <div className="cd-section-header reveal">
            <h2>{t('servicesDetails.customDevelopment.pillarsTitle', { defaultValue: 'Core Capabilities' })}</h2>
            <p>{t('servicesDetails.customDevelopment.pillarsSub', { defaultValue: 'Complete full-stack capabilities engineered to take your ideas from zero to production.' })}</p>
          </div>
          <div className="cd-grid">
            <div className="cd-card reveal">
              <div className="cd-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3>{t('servicesDetails.customDevelopment.pillar1Title', { defaultValue: 'Requirements Engineering' })}</h3>
              <p>{t('servicesDetails.customDevelopment.pillar1Desc', { defaultValue: 'Deep-dive business analysis, functional specifications, and user journey mapping to define exact solution boundaries.' })}</p>
            </div>
            <div className="cd-card reveal">
              <div className="cd-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3>{t('servicesDetails.customDevelopment.pillar2Title', { defaultValue: 'Solution Architecture' })}</h3>
              <p>{t('servicesDetails.customDevelopment.pillar2Desc', { defaultValue: 'Scalable cloud-native architectures, database modeling, microservices design, and zero-trust security foundations.' })}</p>
            </div>
            <div className="cd-card reveal">
              <div className="cd-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
              <h3>{t('servicesDetails.customDevelopment.pillar3Title', { defaultValue: 'Application Development' })}</h3>
              <p>{t('servicesDetails.customDevelopment.pillar3Desc', { defaultValue: 'Modern full-stack web and mobile applications engineered with clean code, type-safety, and reactive UI standards.' })}</p>
            </div>
            <div className="cd-card reveal">
              <div className="cd-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </div>
              <h3>{t('servicesDetails.customDevelopment.pillar4Title', { defaultValue: 'API Integration' })}</h3>
              <p>{t('servicesDetails.customDevelopment.pillar4Desc', { defaultValue: 'High-throughput REST/GraphQL APIs, webhook orchestrations, payment gateways, and seamless third-party ERP/CRM sync.' })}</p>
            </div>
            <div className="cd-card reveal">
              <div className="cd-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3>{t('servicesDetails.customDevelopment.pillar5Title', { defaultValue: 'Quality Assurance' })}</h3>
              <p>{t('servicesDetails.customDevelopment.pillar5Desc', { defaultValue: 'Rigorous test automation, load/stress testing, vulnerability scans, and regression test suites.' })}</p>
            </div>
            <div className="cd-card reveal">
              <div className="cd-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
              </div>
              <h3>{t('servicesDetails.customDevelopment.pillar6Title', { defaultValue: 'DevOps & Deployment' })}</h3>
              <p>{t('servicesDetails.customDevelopment.pillar6Desc', { defaultValue: 'Automated CI/CD pipelines, container orchestration (Docker/K8s), infrastructure as code, and zero-downtime releases.' })}</p>
            </div>
            <div className="cd-card reveal">
              <div className="cd-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>{t('servicesDetails.customDevelopment.pillar7Title', { defaultValue: 'Support & Maintenance' })}</h3>
              <p>{t('servicesDetails.customDevelopment.pillar7Desc', { defaultValue: '24/7 proactive monitoring, health telemetry, performance audits, security patching, and ongoing SLA maintenance.' })}</p>
            </div>
            <div className="cd-card reveal">
              <div className="cd-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>{t('servicesDetails.customDevelopment.pillar8Title', { defaultValue: 'Continuous Innovation' })}</h3>
              <p>{t('servicesDetails.customDevelopment.pillar8Desc', { defaultValue: 'Regular feature velocity, data analytics integration, AI enhancement, and architectural modernizations.' })}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cd-cta-section">
        <div className="cd-wrap">
          <div className="cd-cta-box reveal">
            <h2>{t('servicesDetails.customDevelopment.ctaTitle', { defaultValue: 'Ready to Build Your Solution from Inception to Deployment?' })}</h2>
            <p>
              {t('servicesDetails.customDevelopment.ctaSub', { defaultValue: 'Partner with Rezonants to architect, engineer, and deploy your custom digital platform from business requirements to production reality.' })}
            </p>
            <button type="button" className="cd-btn-primary" onClick={handleBookConsultation}>
              {t('servicesDetails.customDevelopment.ctaButton', { defaultValue: 'Book a Solution Consultation' })}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
