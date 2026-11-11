import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from '../i18n/TranslationContext'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import './DigitalTransformationPage.css'

export default function DigitalTransformationPage() {
  const { t } = useTranslation()
  useDocumentMeta({
    title: `${t('services.items.digitalTransformation.label', { defaultValue: 'Digital Transformation' })} — Rezonants`,
    description: t('services.items.digitalTransformation.description', {
      defaultValue:
        'Modernization of business operations, technology ecosystems, and customer experiences through cloud, AI, automation, data, and modern application technologies.',
    }),
  })
  const navigate = useNavigate()
  useEffect(() => {
    window.scrollTo(0, 0)
    const reveals = () => Array.from(document.querySelectorAll('.reveal'))
    const revealEl = (el) => el.classList.add('revealed')
    const isInView = (el) => { const r = el.getBoundingClientRect(); const vh = window.innerHeight || document.documentElement.clientHeight; return r.top < vh && r.bottom > 0 }
    const revealInView = () => reveals().forEach((el) => { if (!el.classList.contains('revealed') && isInView(el)) revealEl(el) })
    if (!('IntersectionObserver' in window)) { reveals().forEach(revealEl); return }
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { revealEl(entry.target); io.unobserve(entry.target) } }), { threshold: 0.12 })
    reveals().forEach((el) => io.observe(el))
    let raf = 0
    const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; revealInView() }) }
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); revealInView(); setTimeout(revealInView, 50)
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])
  const handleBook = () => navigate('/book-consultation', { state: { service: 'Digital Transformation' } })

  const coreCapabilitiesDefault = [
    'Digital Strategy',
    'Cloud Transformation',
    'AI & Automation',
    'Application Modernization',
    'Legacy Modernization',
    'Data & Analytics',
    'Customer Experience',
    'Technology Modernization',
  ]

  const rawCaps = t('servicesDetails.digitalTransformation.coreCapabilities', { returnObjects: true })
  const coreCapabilities = Array.isArray(rawCaps) && rawCaps.length ? rawCaps : coreCapabilitiesDefault

  return (
    <div className="dt-page">
      <section className="dt-hero">
        <img src={`${import.meta.env.BASE_URL}img/digital-transformation.jpg`} alt="Digital Transformation hero" className="dt-hero-bg" />
        <div className="dt-hero-copy reveal">
          <div className="dt-eyebrow">{t('servicesDetails.digitalTransformation.eyebrow', { defaultValue: 'Enterprise Modernization' })}</div>
          <h1>
            {t('servicesDetails.digitalTransformation.titlePart1', { defaultValue: 'Digital' })}{' '}
            <em>{t('servicesDetails.digitalTransformation.titlePart2', { defaultValue: 'Transformation' })}</em>
          </h1>
          <p>{t('servicesDetails.digitalTransformation.description', { defaultValue: 'Modernization of business operations, technology ecosystems, and customer experiences through cloud, AI, automation, data, and modern application technologies.' })}</p>
          <div className="dt-hero-actions">
            <button type="button" className="dt-btn-primary" onClick={handleBook}>
              {t('servicesDetails.digitalTransformation.bookWorkshop', { defaultValue: 'Book Transformation Workshop' })}{' '}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <Link to="/services/end-to-end-solution-framework" className="dt-btn-outline">
              {t('servicesDetails.digitalTransformation.exploreFramework', { defaultValue: 'Explore Solution Framework' })}
            </Link>
          </div>
        </div>
      </section>

      {/* Core Capabilities Ribbon */}
      <div style={{ background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)', padding: '20px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ color: 'var(--primary-hover)', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            {t('servicesDetails.digitalTransformation.coreCapabilitiesTitle', { defaultValue: 'Core Capabilities' })}
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {coreCapabilities.map((cap, idx) => (
              <span
                key={idx}
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

      <section className="dt-section">
        <div className="dt-wrap">
          <div className="dt-row reveal">
            <div className="dt-text-col"><div className="dt-eyebrow">{t('servicesDetails.digitalTransformation.row1Eyebrow', { defaultValue: 'Strategy & Roadmap' })}</div><h2>{t('servicesDetails.digitalTransformation.row1Title', { defaultValue: 'From Vision to Executable Roadmap' })}</h2><p>{t('servicesDetails.digitalTransformation.row1P1', { defaultValue: 'We partner with enterprise leaders to define digital strategy, business cases, and phased roadmaps with quick wins and de-risked execution.' })}</p><p>{t('servicesDetails.digitalTransformation.row1P2', { defaultValue: 'Prioritized initiatives, TCO models, and KPIs ensure every technology modernization effort ties directly to revenue, efficiency, and customer satisfaction outcomes.' })}</p></div>
            <div className="dt-img-col"><div className="dt-img-frame"><img src={`${import.meta.env.BASE_URL}img/custom-dev-hero.jpg`} alt="Strategy roadmap" /></div></div>
          </div>
          <div className="dt-row reverse reveal">
            <div className="dt-text-col"><div className="dt-eyebrow">{t('servicesDetails.digitalTransformation.row2Eyebrow', { defaultValue: 'Legacy Modernization' })}</div><h2>{t('servicesDetails.digitalTransformation.row2Title', { defaultValue: 'Modernize Without Breaking the Business' })}</h2><p>{t('servicesDetails.digitalTransformation.row2P1', { defaultValue: 'Re-platform monoliths to microservices, APIs, and cloud-native patterns with zero-downtime cutovers and automated regression validation.' })}</p><p>{t('servicesDetails.digitalTransformation.row2P2', { defaultValue: 'We modernize applications, databases, and integration layers while preserving compliance and security posture.' })}</p></div>
            <div className="dt-img-col"><div className="dt-img-frame"><img src={`${import.meta.env.BASE_URL}img/custom-dev-sec2.jpg`} alt="Legacy modernization" /></div></div>
          </div>
          <div className="dt-row reveal">
            <div className="dt-text-col"><div className="dt-eyebrow">{t('servicesDetails.digitalTransformation.row3Eyebrow', { defaultValue: 'Cloud, AI & Data' })}</div><h2>{t('servicesDetails.digitalTransformation.row3Title', { defaultValue: 'Cloud Adoption & Data-Driven Intelligence' })}</h2><p>{t('servicesDetails.digitalTransformation.row3P1', { defaultValue: 'Adopt AWS, Azure, and GCP, build modern data pipelines, and embed machine learning agents to drive autonomous decisions.' })}</p><p>{t('servicesDetails.digitalTransformation.row3P2', { defaultValue: 'From real-time event streaming to unified dashboards, transformation becomes measurable and sustainable.' })}</p></div>
            <div className="dt-img-col"><div className="dt-img-frame"><img src={`${import.meta.env.BASE_URL}img/cloud-integration-sec.jpg`} alt="Cloud data CX" /></div></div>
          </div>
          <div className="dt-row reverse reveal">
            <div className="dt-text-col"><div className="dt-eyebrow">{t('servicesDetails.digitalTransformation.row4Eyebrow', { defaultValue: 'Customer Experience' })}</div><h2>{t('servicesDetails.digitalTransformation.row4Title', { defaultValue: 'Modern Omnichannel Experiences' })}</h2><p>{t('servicesDetails.digitalTransformation.row4P1', { defaultValue: 'Redesign customer journeys across responsive web, iOS, Android, and self-service portals with personalized interfaces.' })}</p><p>{t('servicesDetails.digitalTransformation.row4P2', { defaultValue: 'Platform engineering, telemetry, and automated feedback loops make digital innovation continuous.' })}</p></div>
            <div className="dt-img-col"><div className="dt-img-frame"><img src={`${import.meta.env.BASE_URL}img/proto-concept-sec.jpg`} alt="Customer Experience" /></div></div>
          </div>
        </div>
      </section>
      <section className="dt-capabilities-section">
        <div className="dt-wrap">
          <div className="dt-section-header reveal"><h2>{t('servicesDetails.digitalTransformation.pillarsTitle', { defaultValue: 'Transformation Pillars' })}</h2><p>{t('servicesDetails.digitalTransformation.pillarsSub', { defaultValue: 'Outcome-focused levers that ensure sustainable digital leadership.' })}</p></div>
          <div className="dt-grid">
            <div className="dt-card reveal"><div className="dt-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg></div><h3>{t('servicesDetails.digitalTransformation.pillar1Title', { defaultValue: 'Digital Strategy & Governance' })}</h3><p>{t('servicesDetails.digitalTransformation.pillar1Desc', { defaultValue: 'Phased transformation blueprints with business case modeling, architecture governance, and milestone risk tracking.' })}</p></div>
            <div className="dt-card reveal"><div className="dt-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div><h3>{t('servicesDetails.digitalTransformation.pillar2Title', { defaultValue: 'Cloud & Data Platform' })}</h3><p>{t('servicesDetails.digitalTransformation.pillar2Desc', { defaultValue: 'AWS/Azure/GCP multi-cloud foundations, automated pipelines, and enterprise data analytics enablement.' })}</p></div>
            <div className="dt-card reveal"><div className="dt-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg></div><h3>{t('servicesDetails.digitalTransformation.pillar3Title', { defaultValue: 'AI & Automation' })}</h3><p>{t('servicesDetails.digitalTransformation.pillar3Desc', { defaultValue: 'Intelligent process automation, cognitive AI agents, and predictive telemetry to optimize daily operations.' })}</p></div>
            <div className="dt-card reveal"><div className="dt-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div><h3>{t('servicesDetails.digitalTransformation.pillar4Title', { defaultValue: 'Customer Experience' })}</h3><p>{t('servicesDetails.digitalTransformation.pillar4Desc', { defaultValue: 'High-converting omnichannel digital portals and personalized interfaces built for maximum user retention.' })}</p></div>
          </div>
        </div>
      </section>
      <section className="dt-cta-section"><div className="dt-wrap"><div className="dt-cta-box reveal"><h2>{t('servicesDetails.digitalTransformation.ctaTitle', { defaultValue: 'Ready to Transform Your Enterprise?' })}</h2><p>{t('servicesDetails.digitalTransformation.ctaSub', { defaultValue: 'Partner with Rezonants for phased, de-risked digital transformation tied to measurable business outcomes.' })}</p><button type="button" className="dt-btn-primary" onClick={handleBook}>{t('servicesDetails.digitalTransformation.ctaButton', { defaultValue: 'Book a Digital Transformation Call' })} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button></div></div></section>
    </div>
  )
}
