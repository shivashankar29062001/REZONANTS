import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from '../i18n/TranslationContext'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import './MigrationServicesPage.css'

export default function MigrationServicesPage() {
  const { t } = useTranslation()
  useDocumentMeta({
    title: `${t('services.items.migrationModernization.label', { defaultValue: 'Migration & Modernization' })} — Rezonants`,
    description: t('services.items.migrationModernization.description', {
      defaultValue:
        'Secure and structured migration of applications, data, platforms, infrastructure, and workloads from legacy or existing environments to modern, scalable, and optimized technology platforms.',
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
  const handleBook = () => navigate('/book-consultation', { state: { service: 'Migration & Modernization' } })

  const rawCaps = t('servicesDetails.migrationServices.coreCapabilities', { returnObjects: true })
  const coreCapabilities = Array.isArray(rawCaps) && rawCaps.length ? rawCaps : [
    'Cloud Migration',
    'Application Migration',
    'Data Migration',
    'Platform Migration',
    'Legacy Modernization',
    'ETL',
    'Data Validation',
    'Cutover Planning',
    'Performance Optimization',
  ]

  return (
    <div className="ms-page">
      <section className="ms-hero">
        <img
          src={`${import.meta.env.BASE_URL}img/migration-modernization.jpg`}
          alt={t('services.items.migrationModernization.label', { defaultValue: 'Migration & Modernization' })}
          className="ms-hero-bg"
        />
        <div className="ms-hero-copy reveal">
          <div className="ms-eyebrow">{t('services.pages.migrationServices.eyebrow', { defaultValue: 'Cloud & Infrastructure Transformation' })}</div>
          <h1>
            {t('services.pages.migrationServices.titlePart1', { defaultValue: 'Migration &' })}{' '}
            <em>{t('services.pages.migrationServices.titlePart2', { defaultValue: 'Modernization' })}</em>
          </h1>
          <p>
            {t('services.items.migrationModernization.description', {
              defaultValue:
                'Secure and structured migration of applications, data, platforms, infrastructure, and workloads from legacy or existing environments to modern, scalable, and optimized technology platforms.',
            })}
          </p>
          <div className="ms-hero-actions">
            <button type="button" className="ms-btn-primary" onClick={handleBook}>
              {t('services.pages.migrationServices.planMigration', { defaultValue: 'Plan Your Migration' })}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <Link to="/services/digital-transformation" className="ms-btn-outline">
              {t('services.pages.migrationServices.exploreTransformation', { defaultValue: 'Explore Transformation' })}
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

      <section className="ms-section"><div className="ms-wrap">
        <div className="ms-row reveal"><div className="ms-text-col"><div className="ms-eyebrow">{t('servicesDetails.migrationServices.row1Eyebrow', { defaultValue: 'Cloud Migration' })}</div><h2>{t('servicesDetails.migrationServices.row1Title', { defaultValue: 'Multi-Cloud Strategy & Lift-and-Optimize' })}</h2><p>{t('servicesDetails.migrationServices.row1P1', { defaultValue: 'Seamless workload migration across AWS, Azure, and Google Cloud with automated discovery, wave planning, and zero business interruption.' })}</p><p>{t('servicesDetails.migrationServices.row1P2', { defaultValue: 'We balance rehosting, replatforming, and refactoring to optimize total cost of ownership (TCO) and agility.' })}</p></div><div className="ms-img-col"><div className="ms-img-frame"><img src={`${import.meta.env.BASE_URL}img/carousel-1.jpg`} alt="Cloud migration" /></div></div></div>
        <div className="ms-row reverse reveal"><div className="ms-text-col"><div className="ms-eyebrow">{t('servicesDetails.migrationServices.row2Eyebrow', { defaultValue: 'Data & Database Migration' })}</div><h2>{t('servicesDetails.migrationServices.row2Title', { defaultValue: 'Secure ETL & Automated Data Validation' })}</h2><p>{t('servicesDetails.migrationServices.row2P1', { defaultValue: 'Automated database replication, schema translation, and high-throughput ETL pipelines with 100% data integrity verification.' })}</p><p>{t('servicesDetails.migrationServices.row2P2', { defaultValue: 'Zero-downtime cutover rehearsal ensures complete data consistency and business continuity.' })}</p></div><div className="ms-img-col"><div className="ms-img-frame"><img src={`${import.meta.env.BASE_URL}img/carousel-2.jpg`} alt="Database" /></div></div></div>
        <div className="ms-row reveal"><div className="ms-text-col"><div className="ms-eyebrow">{t('servicesDetails.migrationServices.row3Eyebrow', { defaultValue: 'Platform Modernization' })}</div><h2>{t('servicesDetails.migrationServices.row3Title', { defaultValue: 'Containerization & Kubernetes Orchestration' })}</h2><p>{t('servicesDetails.migrationServices.row3P1', { defaultValue: 'Modernize legacy monoliths into scalable microservices orchestrated via Kubernetes (EKS, AKS, GKE) with automated IaC blueprints.' })}</p><p>{t('servicesDetails.migrationServices.row3P2', { defaultValue: 'Post-migration performance profiling and cost optimization ensure immediate ROI.' })}</p></div><div className="ms-img-col"><div className="ms-img-frame"><img src={`${import.meta.env.BASE_URL}img/feature.jpg`} alt="Kubernetes" /></div></div></div>
        <div className="ms-row reverse reveal"><div className="ms-text-col"><div className="ms-eyebrow">{t('servicesDetails.migrationServices.row4Eyebrow', { defaultValue: 'Cutover Planning' })}</div><h2>{t('servicesDetails.migrationServices.row4Title', { defaultValue: 'Automated Testing & Rollback Safety Nets' })}</h2><p>{t('servicesDetails.migrationServices.row4P1', { defaultValue: 'Battle-tested cutover runbooks, automated regression suites, and instant rollback mechanisms for complete peace of mind.' })}</p><p>{t('servicesDetails.migrationServices.row4P2', { defaultValue: 'Post-migration health telemetry and 24/7 hypercare guarantee flawless production stability.' })}</p></div><div className="ms-img-col"><div className="ms-img-frame"><img src={`${import.meta.env.BASE_URL}img/hero-poster.jpg`} alt="Validation" /></div></div></div>
      </div></section>
      <section className="ms-capabilities-section"><div className="ms-wrap"><div className="ms-section-header reveal"><h2>{t('servicesDetails.migrationServices.pillarsTitle', { defaultValue: 'Migration Assurances' })}</h2><p>{t('servicesDetails.migrationServices.pillarsSub', { defaultValue: 'De-risked moves backed by enterprise SLAs.' })}</p></div><div className="ms-grid">
        <div className="ms-card reveal"><div className="ms-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg></div><h3>{t('servicesDetails.migrationServices.pillar1Title', { defaultValue: 'Zero-Downtime Cutover' })}</h3><p>{t('servicesDetails.migrationServices.pillar1Desc', { defaultValue: 'Canary releases and database dual-write sync to ensure uninterrupted user access.' })}</p></div>
        <div className="ms-card reveal"><div className="ms-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div><h3>{t('servicesDetails.migrationServices.pillar2Title', { defaultValue: 'Automated Data Validation' })}</h3><p>{t('servicesDetails.migrationServices.pillar2Desc', { defaultValue: 'Checksum comparisons, schema integrity audits, and automated ETL reconciliation.' })}</p></div>
        <div className="ms-card reveal"><div className="ms-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg></div><h3>{t('servicesDetails.migrationServices.pillar3Title', { defaultValue: 'Rollback Safety Nets' })}</h3><p>{t('servicesDetails.migrationServices.pillar3Desc', { defaultValue: 'Strict disaster recovery protocols and rehearsal drills to contain risk at every phase.' })}</p></div>
        <div className="ms-card reveal"><div className="ms-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div><h3>{t('servicesDetails.migrationServices.pillar4Title', { defaultValue: 'Performance & Cost Optimization' })}</h3><p>{t('servicesDetails.migrationServices.pillar4Desc', { defaultValue: 'Cloud rightsizing, autoscaling policies, and cost governance dashboards included.' })}</p></div>
      </div></div></section>
      <section className="ms-cta-section"><div className="ms-wrap"><div className="ms-cta-box reveal"><h2>{t('servicesDetails.migrationServices.ctaTitle', { defaultValue: 'Ready to Migrate with Complete Confidence?' })}</h2><p>{t('servicesDetails.migrationServices.ctaSub', { defaultValue: 'Partner with Rezonants for structured, risk-free cloud and data modernization.' })}</p><button type="button" className="ms-btn-primary" onClick={handleBook}>{t('servicesDetails.migrationServices.ctaButton', { defaultValue: 'Plan Your Migration Workshop' })} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button></div></div></section>
    </div>
  )
}
