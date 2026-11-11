import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from '../../i18n/TranslationContext'
import { TECHNOLOGIES_DATA } from '../../data/technologiesData'
import { useDocumentMeta } from '../../lib/useDocumentMeta'
import '../DigitalTransformationPage.css'

export default function TechnologyDetailPage({ fixedId }) {
  const { t } = useTranslation()
  const { techId } = useParams()
  const currentId = fixedId || techId || 'ai-robotics-solutions'

  const tech =
    TECHNOLOGIES_DATA.find(
      (t) => t.id === currentId || t.slug === currentId || t.slug.includes(currentId)
    ) || TECHNOLOGIES_DATA[0]

  useDocumentMeta({
    title: `${tech.title} — Rezonants`,
    description: tech.tagline + ' ' + (tech.overview[0] || ''),
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
  }, [currentId])

  const handleBook = () => {
    navigate('/book-consultation', { state: { service: tech.title } })
  }

  // Define unique 4-row image pairs for each technology
  const techRowImages = {
    'ai-robotics-solutions': [
      `${import.meta.env.BASE_URL}img/bpa-workflow-orchestration.jpg`,
      `${import.meta.env.BASE_URL}img/digital-transformation.jpg`,
      `${import.meta.env.BASE_URL}img/proto-rapid-sec.jpg`,
      `${import.meta.env.BASE_URL}img/build-scratch-devops.jpg`,
    ],
    'business-automation-solutions': [
      `${import.meta.env.BASE_URL}img/business-process-automation.jpg`,
      `${import.meta.env.BASE_URL}img/devops-automation-sec.jpg`,
      `${import.meta.env.BASE_URL}img/cloud-integration-sec.jpg`,
      `${import.meta.env.BASE_URL}img/build-scratch-support.jpg`,
    ],
    'cloud-migration-solutions': [
      `${import.meta.env.BASE_URL}img/carousel-1.jpg`,
      `${import.meta.env.BASE_URL}img/carousel-2.jpg`,
      `${import.meta.env.BASE_URL}img/feature.jpg`,
      `${import.meta.env.BASE_URL}img/hero-poster.jpg`,
    ],
    'data-center-solutions': [
      `${import.meta.env.BASE_URL}img/solution-arch-design.jpg`,
      `${import.meta.env.BASE_URL}img/custom-dev-sec3.jpg`,
      `${import.meta.env.BASE_URL}img/cloud-integration-sec.jpg`,
      `${import.meta.env.BASE_URL}img/shared-services-managed-operations.jpg`,
    ],
    'cognitive-analytics-ai': [
      `${import.meta.env.BASE_URL}img/custom-dev-hero.jpg`,
      `${import.meta.env.BASE_URL}img/custom-dev-sec2.jpg`,
      `${import.meta.env.BASE_URL}img/proto-concept-sec.jpg`,
      `${import.meta.env.BASE_URL}img/build-scratch-architecture.jpg`,
    ],
    'information-reporting-systems': [
      `${import.meta.env.BASE_URL}img/one-stop-solutions-hero.png`,
      `${import.meta.env.BASE_URL}img/proto-pilot-sec.jpg`,
      `${import.meta.env.BASE_URL}img/custom-dev-sec1.jpg`,
      `${import.meta.env.BASE_URL}img/shared-services-hero.jpg`,
    ],
    'managed-services': [
      `${import.meta.env.BASE_URL}img/build-scratch-support.jpg`,
      `${import.meta.env.BASE_URL}img/case-shared-services.jpg`,
      `${import.meta.env.BASE_URL}img/shared-services-hero.jpg`,
      `${import.meta.env.BASE_URL}img/proto-pilot-sec.jpg`,
    ],
    'one-stop-technology-solutions': [
      `${import.meta.env.BASE_URL}img/one-stop-overview.jpg`,
      `${import.meta.env.BASE_URL}img/build-scratch-architecture.jpg`,
      `${import.meta.env.BASE_URL}img/build-scratch-devops.jpg`,
      `${import.meta.env.BASE_URL}img/build-from-scratch.jpg`,
    ],
  }

  const rowImgs = techRowImages[tech.id] || [
    `${import.meta.env.BASE_URL}img/bpa-workflow-orchestration.jpg`,
    `${import.meta.env.BASE_URL}img/devops-automation-sec.jpg`,
    `${import.meta.env.BASE_URL}img/cloud-integration-sec.jpg`,
    `${import.meta.env.BASE_URL}img/proto-rapid-sec.jpg`,
  ]

  const localizedTech = t(`technologiesDetails.${tech.id}`, { returnObjects: true, defaultValue: tech }) || tech
  const localizedCommon = t('technologiesCommon', { returnObjects: true, defaultValue: {} }) || {}

  const techKey = {
    'ai-robotics-solutions': 'aiRobotics',
    'business-automation-solutions': 'businessAutomation',
    'cloud-migration-solutions': 'cloudMigrations',
    'data-center-solutions': 'dataCenters',
    'cognitive-analytics-ai': 'cognitiveAnalytics',
    'information-reporting-systems': 'informationReporting',
    'managed-services': 'managedServices',
    'one-stop-technology-solutions': 'oneStopSolutions',
  }[tech.slug || tech.id]
  const localizedTitle = localizedTech.title || (techKey ? t(`technologies.options.${techKey}`, { defaultValue: tech.title }) : tech.title)

  return (
    <div className="dt-page">
      {/* Hero Section */}
      <section className="dt-hero">
        <img
          src={`${import.meta.env.BASE_URL}${tech.image}`}
          alt={localizedTitle}
          className="dt-hero-bg"
        />
        <div className="dt-hero-copy reveal">
          <div className="dt-eyebrow">{localizedTech.heroBadge || localizedCommon.heroBadge || 'Enterprise Technology Solutions'}</div>
          <h1>
            {localizedTitle}
          </h1>
          <p>{localizedTech.tagline || tech.tagline}</p>
          <div className="dt-hero-actions">
            <button type="button" className="dt-btn-primary" onClick={handleBook}>
              {localizedCommon.bookDiscovery || t('technologies.bookDiscovery', { defaultValue: 'Book Technology Discovery' })}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <a
              href="#gallery"
              className="dt-btn-outline"
              onClick={(e) => {
                e.preventDefault()
                navigate('/', { state: { scrollTo: 'gallery' } })
              }}
            >
              {localizedCommon.exploreAll || t('technologies.exploreAll', { defaultValue: 'Explore All Technologies' })}
            </a>
          </div>
        </div>
      </section>

      {/* Core Capabilities Ribbon */}
      <div style={{ background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)', padding: '20px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ color: 'var(--primary-hover)', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            {localizedCommon.coreCapabilities || t('services.coreCapabilities', { defaultValue: 'Core Capabilities' })}
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {(localizedTech.capabilities || tech.capabilities).map((cap) => (
              <span
                key={cap.title || cap}
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
                {cap.title || cap}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Alternating Breakdown Rows */}
      <section className="dt-section">
        <div className="dt-wrap">
          {/* Row 1: Overview */}
          <div className="dt-row reveal">
            <div className="dt-text-col">
              <div className="dt-eyebrow">{localizedCommon.overviewEyebrow || 'Enterprise Overview'}</div>
              <h2>{localizedCommon.overviewTitle || 'Intelligent Technology for Measurable Outcomes'}</h2>
              {(localizedTech.overview || tech.overview).map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
            <div className="dt-img-col">
              <div className="dt-img-frame">
                <img src={rowImgs[0]} alt={`${localizedTitle} Overview`} />
              </div>
            </div>
          </div>

          {/* Row 2: Transformation (Reverse) */}
          <div className="dt-row reverse reveal">
            <div className="dt-text-col">
              <div className="dt-eyebrow">{localizedCommon.transformationEyebrow || 'Operational Transformation'}</div>
              <h2>{localizedCommon.transformationTitle || 'Transforming Business Through Intelligent Workflows'}</h2>
              {(localizedTech.transformation || tech.transformation) && (localizedTech.transformation || tech.transformation).map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
            <div className="dt-img-col">
              <div className="dt-img-frame">
                <img src={rowImgs[1]} alt={`${localizedTitle} Transformation`} />
              </div>
            </div>
          </div>

          {/* Row 3: Lifecycle Framework */}
          <div className="dt-row reveal">
            <div className="dt-text-col">
              <div className="dt-eyebrow">{localizedCommon.deliveryEyebrow || 'Structured Delivery Approach'}</div>
              <h2>{localizedCommon.deliveryTitle || 'End-to-End Execution & Continuous Optimization'}</h2>
              <p>
                {localizedCommon.deliveryIntro || 'Our proven implementation approach follows a rigorous delivery lifecycle:'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '16px 0 20px' }}>
                {(localizedTech.lifecycleSteps || tech.lifecycleSteps).map((step, idx) => (
                  <span
                    key={step}
                    style={{
                      background: 'var(--bg-soft)',
                      border: '1px solid var(--border)',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--text-heading)',
                    }}
                  >
                    {idx + 1}. {step}
                  </span>
                ))}
              </div>
              <p>
                {localizedCommon.deliveryOutro || 'This structured sequence ensures tight alignment with business goals, robust security posture, and measurable ROI benchmarks at every phase.'}
              </p>
            </div>
            <div className="dt-img-col">
              <div className="dt-img-frame">
                <img src={rowImgs[2]} alt={`${localizedTitle} Lifecycle`} />
              </div>
            </div>
          </div>

          {/* Row 4: Security & Governance (Reverse) */}
          <div className="dt-row reverse reveal">
            <div className="dt-text-col">
              <div className="dt-eyebrow">{localizedCommon.securityEyebrow || 'Security & Governance'}</div>
              <h2>{localizedCommon.securityTitle || 'Enterprise-Grade Reliability & Compliance Safeguards'}</h2>
              <p>{localizedTech.security || tech.security}</p>
              <p>
                {localizedCommon.securityOutro || 'We embed strict role-based access control, automated vulnerability scanning, model governance, and multi-tier encryption to ensure your production environment remains resilient and fully compliant.'}
              </p>
            </div>
            <div className="dt-img-col">
              <div className="dt-img-frame">
                <img src={rowImgs[3]} alt={`${localizedTitle} Security & Governance`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities 4-Pillars Grid */}
      <section className="dt-capabilities-section">
        <div className="dt-wrap">
          <div className="dt-section-header reveal">
            <h2>{localizedCommon.capabilitiesTitle || t('technologies.coreCapabilities', { defaultValue: 'Core Technology Capabilities' })}</h2>
            <p>{localizedCommon.capabilitiesSub || 'Comprehensive technical competencies engineered to scale your digital operations.'}</p>
          </div>
          <div className="dt-grid">
            {(localizedTech.capabilities || tech.capabilities).slice(0, 4).map((cap, idx) => (
              <div key={idx} className="dt-card reveal">
                <div className="dt-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <h3>{cap.title || cap}</h3>
                <p>{cap.desc || ''}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="dt-cta-section" style={{ padding: '0 24px 80px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="dt-wrap">
          <div className="dt-cta-box reveal" style={{ background: 'linear-gradient(135deg, var(--bg-soft) 0%, var(--bg-green) 100%)', border: '1px solid var(--border)', borderRadius: '20px', padding: '56px 32px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--text-heading)', margin: '0 0 16px' }}>
              {localizedTech.ctaHeadline || tech.ctaHeadline || 'Ready to transform your technology environment?'}
            </h2>
            <p style={{ color: 'var(--text-body)', fontSize: '16px', maxWidth: '640px', margin: '0 auto 32px' }}>
              {localizedTech.ctaSub || tech.ctaSub || 'Contact our team to discuss your requirements and build the right solution for your organization.'}
            </p>
            <button type="button" className="dt-btn-primary" onClick={handleBook}>
              {localizedCommon.bookConsultation || t('technologies.bookConsultation', { defaultValue: 'Book a Consultation' })}
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
