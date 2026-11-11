import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from '../i18n/TranslationContext'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import './EndToEndSolutionsPage.css'

export default function EndToEndSolutionsPage() {
  const { t } = useTranslation()
  useDocumentMeta({
    title: `${t('services.items.endToEndSolutionFramework.label', { defaultValue: 'End-to-End Solution Framework' })} — Rezonants`,
    description: t('services.items.endToEndSolutionFramework.description', {
      defaultValue:
        'A comprehensive delivery approach covering the complete technology lifecycle—from strategy, requirements, and architecture to development, integration, deployment, governance, monitoring, and support.',
    }),
  })
  const navigate = useNavigate()
  useEffect(() => {
    window.scrollTo(0, 0)
    const reveals = () => Array.from(document.querySelectorAll('.reveal')); const revealEl = (el) => el.classList.add('revealed')
    const isInView = (el) => { const r = el.getBoundingClientRect(); const vh = window.innerHeight || document.documentElement.clientHeight; return r.top < vh && r.bottom > 0 }
    const revealInView = () => reveals().forEach((el) => { if (!el.classList.contains('revealed') && isInView(el)) revealEl(el) })
    if (!('IntersectionObserver' in window)) { reveals().forEach(revealEl); return }
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { revealEl(entry.target); io.unobserve(entry.target) } }), { threshold: 0.12 })
    reveals().forEach((el) => io.observe(el))
    let raf=0; const onScroll=()=>{ if(raf) return; raf=requestAnimationFrame(()=>{raf=0; revealInView()})}
    window.addEventListener('scroll', onScroll,{passive:true}); window.addEventListener('resize', onScroll); revealInView(); setTimeout(revealInView,50)
    return ()=>{ io.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if(raf) cancelAnimationFrame(raf)}
  }, [])
  const handleBook = () => navigate('/book-consultation', { state: { service: 'End-to-End Solution Framework' } })

  const rawCaps = t('servicesDetails.endToEndSolutions.coreCapabilities', { returnObjects: true })
  const coreCapabilities = Array.isArray(rawCaps) && rawCaps.length ? rawCaps : [
    'Strategy',
    'Requirements',
    'Architecture',
    'Development',
    'Integration',
    'Testing',
    'Security',
    'Deployment',
    'Governance',
    'Monitoring',
    'Managed Support',
  ]

  return (
    <div className="e2e-page">
      <section className="e2e-hero">
        <img
          src={`${import.meta.env.BASE_URL}img/end-to-end-solution-framework.jpg`}
          alt={t('services.items.endToEndSolutionFramework.label', { defaultValue: 'End-to-End Solution Framework' })}
          className="e2e-hero-bg"
        />
        <div className="e2e-hero-copy reveal">
          <div className="e2e-eyebrow">{t('services.pages.endToEndSolutions.eyebrow', { defaultValue: 'Complete Technology Lifecycle' })}</div>
          <h1>
            {t('services.pages.endToEndSolutions.titlePart1', { defaultValue: 'End-to-End' })}{' '}
            <em>{t('services.pages.endToEndSolutions.titlePart2', { defaultValue: 'Solution Framework' })}</em>
          </h1>
          <p>
            {t('services.items.endToEndSolutionFramework.description', {
              defaultValue:
                'A comprehensive delivery approach covering the complete technology lifecycle—from strategy, requirements, and architecture to development, integration, deployment, governance, monitoring, and support.',
            })}
          </p>
          <div className="e2e-hero-actions">
            <button type="button" className="e2e-btn-primary" onClick={handleBook}>
              {t('services.pages.endToEndSolutions.startJourney', { defaultValue: 'Start Your Lifecycle Journey' })}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <Link to="/services/digital-transformation" className="e2e-btn-outline">
              {t('services.pages.endToEndSolutions.exploreTransformation', { defaultValue: 'Explore Transformation' })}
            </Link>
          </div>
        </div>
      </section>

      {/* Core Capabilities Ribbon */}
      <div style={{ background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)', padding: '20px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ color: 'var(--primary-hover)', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            {t('services.coreCapabilities', { defaultValue: 'Core Capabilities' })}
          </span>
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

      <section className="e2e-section"><div className="e2e-wrap">
        <div className="e2e-row reveal"><div className="e2e-text-col"><div className="e2e-eyebrow">{t('servicesDetails.endToEndSolutions.row1Eyebrow', { defaultValue: 'Strategy & Architecture' })}</div><h2>{t('servicesDetails.endToEndSolutions.row1Title', { defaultValue: 'Requirements Engineering & Solution Design' })}</h2><p>{t('servicesDetails.endToEndSolutions.row1P1', { defaultValue: 'Collaborative workshops, business domain mapping, and cloud architecture specifications designed to eliminate risk before a line of code is written.' })}</p><p>{t('servicesDetails.endToEndSolutions.row1P2', { defaultValue: 'We define data models, security frameworks, and scalability milestones that set up long-term success.' })}</p></div><div className="e2e-img-col"><div className="e2e-img-frame"><img src={`${import.meta.env.BASE_URL}img/one-stop-overview.jpg`} alt="Solution Framework Design" /></div></div></div>
        <div className="e2e-row reverse reveal"><div className="e2e-text-col"><div className="e2e-eyebrow">{t('servicesDetails.endToEndSolutions.row2Eyebrow', { defaultValue: 'Engineering & Quality' })}</div><h2>{t('servicesDetails.endToEndSolutions.row2Title', { defaultValue: 'Full-Stack Development & Automated Testing' })}</h2><p>{t('servicesDetails.endToEndSolutions.row2P1', { defaultValue: 'Modular microservices, type-safe APIs, and responsive frontends combined with automated unit, integration, and security scans.' })}</p><p>{t('servicesDetails.endToEndSolutions.row2P2', { defaultValue: 'Continuous integration pipelines with GitHub Actions, Terraform, and automated security guardrails.' })}</p></div><div className="e2e-img-col"><div className="e2e-img-frame"><img src={`${import.meta.env.BASE_URL}img/custom-dev-sec3.jpg`} alt="Build" /></div></div></div>
        <div className="e2e-row reveal"><div className="e2e-text-col"><div className="e2e-eyebrow">{t('servicesDetails.endToEndSolutions.row3Eyebrow', { defaultValue: 'Deployment & Operations' })}</div><h2>{t('servicesDetails.endToEndSolutions.row3Title', { defaultValue: 'Cloud Deployment & 24/7 Managed Monitoring' })}</h2><p>{t('servicesDetails.endToEndSolutions.row3P1', { defaultValue: 'Multi-cloud orchestration on AWS/Azure/GCP with automated rollback, zero-downtime cutovers, and real-time observability.' })}</p><p>{t('servicesDetails.endToEndSolutions.row3P2', { defaultValue: 'We provide SLA-backed maintenance and continuous telemetry monitoring to evolve your product seamlessly.' })}</p></div><div className="e2e-img-col"><div className="e2e-img-frame"><img src={`${import.meta.env.BASE_URL}img/one-stop-solutions-hero.png`} alt="Operate" /></div></div></div>
        <div className="e2e-row reverse reveal"><div className="e2e-text-col"><div className="e2e-eyebrow">{t('servicesDetails.endToEndSolutions.row4Eyebrow', { defaultValue: 'Enterprise Governance' })}</div><h2>{t('servicesDetails.endToEndSolutions.row4Title', { defaultValue: 'Unified Governance & Ongoing Support' })}</h2><p>{t('servicesDetails.endToEndSolutions.row4P1', { defaultValue: 'Single-point accountability across your entire digital stack — transparent sprint velocity, predictable budgeting, and continuous innovation.' })}</p><p>{t('servicesDetails.endToEndSolutions.row4P2', { defaultValue: 'Regular feature rollouts and modernization cycles keep your enterprise ahead of the competition.' })}</p></div><div className="e2e-img-col"><div className="e2e-img-frame"><img src={`${import.meta.env.BASE_URL}img/proto-pilot-sec.jpg`} alt="Why" /></div></div></div>
      </div></section>
      <section className="e2e-capabilities-section"><div className="e2e-wrap"><div className="e2e-section-header reveal"><h2>{t('servicesDetails.endToEndSolutions.pillarsTitle', { defaultValue: 'Lifecycle Framework Pillars' })}</h2><p>{t('servicesDetails.endToEndSolutions.pillarsSub', { defaultValue: 'Every phase engineered with enterprise rigor.' })}</p></div><div className="e2e-grid">
        <div className="e2e-card reveal"><div className="e2e-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg></div><h3>{t('servicesDetails.endToEndSolutions.pillar1Title', { defaultValue: 'Strategy & Requirements' })}</h3><p>{t('servicesDetails.endToEndSolutions.pillar1Desc', { defaultValue: 'Domain discovery, architectural roadmaps, and stakeholder alignment to eliminate execution risks.' })}</p></div>
        <div className="e2e-card reveal"><div className="e2e-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div><h3>{t('servicesDetails.endToEndSolutions.pillar2Title', { defaultValue: 'Architecture & Build' })}</h3><p>{t('servicesDetails.endToEndSolutions.pillar2Desc', { defaultValue: 'Resilient cloud-native microservices, API integrations, and continuous QA testing.' })}</p></div>
        <div className="e2e-card reveal"><div className="e2e-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg></div><h3>{t('servicesDetails.endToEndSolutions.pillar3Title', { defaultValue: 'Security & Deployment' })}</h3><p>{t('servicesDetails.endToEndSolutions.pillar3Desc', { defaultValue: 'Zero-trust security compliance, containerized releases, and automated cloud deployments.' })}</p></div>
        <div className="e2e-card reveal"><div className="e2e-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div><h3>{t('servicesDetails.endToEndSolutions.pillar4Title', { defaultValue: 'Governance & Support' })}</h3><p>{t('servicesDetails.endToEndSolutions.pillar4Desc', { defaultValue: '24/7 SLA monitoring, health telemetry, and ongoing evolutionary engineering.' })}</p></div>
      </div></div></section>
      <section className="e2e-cta-section"><div className="e2e-wrap"><div className="e2e-cta-box reveal"><h2>{t('servicesDetails.endToEndSolutions.ctaTitle', { defaultValue: 'Need a Complete Lifecycle Partner?' })}</h2><p>{t('servicesDetails.endToEndSolutions.ctaSub', { defaultValue: 'We own the full technology lifecycle so your team can focus on core business outcomes.' })}</p><button type="button" className="e2e-btn-primary" onClick={handleBook}>{t('servicesDetails.endToEndSolutions.ctaButton', { defaultValue: 'Partner for the Full Lifecycle' })} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button></div></div></section>
    </div>
  )
}
