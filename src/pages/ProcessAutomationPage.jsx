import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from '../i18n/TranslationContext'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import './DigitalTransformationPage.css'

export default function ProcessAutomationPage() {
  const { t } = useTranslation()
  useDocumentMeta({
    title: 'Business Process Automation — Rezonants',
    description:
      'Design and implementation of intelligent automation solutions that streamline business processes, eliminate repetitive manual activities, improve operational efficiency, and accelerate business outcomes.',
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

  const handleBook = () => {
    navigate('/book-consultation', { state: { service: 'Business Process Automation' } })
  }

  const coreCapabilitiesDefault = [
    'Workflow Automation',
    'RPA',
    'Intelligent Automation',
    'AI Automation',
    'Process Optimization',
    'API Integration',
    'Process Orchestration',
  ]
  const rawCaps = t('servicesDetails.processAutomation.coreCapabilities', { returnObjects: true })
  const coreCapabilities = Array.isArray(rawCaps) && rawCaps.length ? rawCaps : coreCapabilitiesDefault

  return (
    <div className="dt-page">
      <section className="dt-hero">
        <img
          src={`${import.meta.env.BASE_URL}img/business-process-automation.jpg`}
          alt="Business Process Automation Hero"
          className="dt-hero-bg"
        />
        <div className="dt-hero-copy reveal">
          <div className="dt-eyebrow">{t('services.pages.processAutomation.eyebrow', { defaultValue: 'Intelligent Process Operations' })}</div>
          <h1>
            {t('services.pages.processAutomation.titlePart1', { defaultValue: 'Business Process' })}{' '}
            <em>{t('services.pages.processAutomation.titlePart2', { defaultValue: 'Automation' })}</em>
          </h1>
          <p>
            {t('services.items.businessProcessAutomation.description', { defaultValue: 'Design and implementation of intelligent automation solutions that streamline business processes, eliminate repetitive manual activities, improve operational efficiency, and accelerate business outcomes.' })}
          </p>
          <div className="dt-hero-actions">
            <button type="button" className="dt-btn-primary" onClick={handleBook}>
              {t('services.pages.processAutomation.bookDiscovery', { defaultValue: 'Book Automation Discovery' })}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <Link to="/services/center-of-excellence" className="dt-btn-outline">
              {t('services.pages.processAutomation.exploreCoE', { defaultValue: 'Explore Center of Excellence' })}
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

      {/* Alternating Breakdown Rows */}
      <section className="dt-section">
        <div className="dt-wrap">
          {/* Row 1: RPA & Workflow Orchestration */}
          <div className="dt-row reveal">
            <div className="dt-text-col">
              <div className="dt-eyebrow">{t('servicesDetails.processAutomation.row1Eyebrow', { defaultValue: 'Robotic Process Automation' })}</div>
              <h2>{t('servicesDetails.processAutomation.row1Title', { defaultValue: 'Intelligent Bots for High-Volume Operations' })}</h2>
              <p>
                {t('servicesDetails.processAutomation.row1P1', { defaultValue: 'Eliminate repetitive manual data entry, cross-system reconciliations, and document routing. We deploy enterprise RPA bots that execute structured tasks 24/7 with zero error rate.' })}
              </p>
              <p>
                {t('servicesDetails.processAutomation.row1P2', { defaultValue: 'By connecting legacy desktop interfaces, SAP/ERP backends, and cloud databases, software bots free your team to focus on strategic business initiatives.' })}
              </p>
            </div>
            <div className="dt-img-col">
              <div className="dt-img-frame">
                <img
                  src={`${import.meta.env.BASE_URL}img/bpa-workflow-orchestration.jpg`}
                  alt="RPA Bots and Intelligent Workflow Orchestration"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Document & Invoice Automation (Reverse) */}
          <div className="dt-row reverse reveal">
            <div className="dt-text-col">
              <div className="dt-eyebrow">{t('servicesDetails.processAutomation.row2Eyebrow', { defaultValue: 'Intelligent Document Processing' })}</div>
              <h2>{t('servicesDetails.processAutomation.row2Title', { defaultValue: 'OCR, Machine Learning & Document AI' })}</h2>
              <p>
                {t('servicesDetails.processAutomation.row2P1', { defaultValue: 'Automatically ingest, classify, and extract data from invoices, contracts, identity documents, and claims. Our AI-driven pipelines validate fields against internal databases and trigger automated approval workflows.' })}
              </p>
              <p>
                {t('servicesDetails.processAutomation.row2P2', { defaultValue: 'Achieve straight-through processing rates exceeding 95% while drastically reducing turnaround times from days to seconds.' })}
              </p>
            </div>
            <div className="dt-img-col">
              <div className="dt-img-frame">
                <img
                  src={`${import.meta.env.BASE_URL}img/devops-automation-sec.jpg`}
                  alt="Intelligent Invoice and Document Processing"
                />
              </div>
            </div>
          </div>

          {/* Row 3: API Integration & Orchestration */}
          <div className="dt-row reveal">
            <div className="dt-text-col">
              <div className="dt-eyebrow">{t('servicesDetails.processAutomation.row3Eyebrow', { defaultValue: 'Process Orchestration' })}</div>
              <h2>{t('servicesDetails.processAutomation.row3Title', { defaultValue: 'End-to-End Cross-Platform Synchronization' })}</h2>
              <p>
                {t('servicesDetails.processAutomation.row3P1', { defaultValue: 'Connect CRM, ERP, HRMS, and banking APIs into unified real-time data flows. We implement event-driven triggers, message queues, and automated fallback handlers.' })}
              </p>
              <p>
                {t('servicesDetails.processAutomation.row3P2', { defaultValue: 'Information flows seamlessly across departments without human intervention, eliminating operational silos and communication delays.' })}
              </p>
            </div>
            <div className="dt-img-col">
              <div className="dt-img-frame">
                <img
                  src={`${import.meta.env.BASE_URL}img/cloud-integration-sec.jpg`}
                  alt="Cross-Platform API Integration and Orchestration"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Process Telemetry & Continuous Optimization (Reverse) */}
          <div className="dt-row reverse reveal">
            <div className="dt-text-col">
              <div className="dt-eyebrow">{t('servicesDetails.processAutomation.row4Eyebrow', { defaultValue: 'Continuous Telemetry' })}</div>
              <h2>{t('servicesDetails.processAutomation.row4Title', { defaultValue: 'Real-Time Process Analytics & Kaizen Insights' })}</h2>
              <p>
                {t('servicesDetails.processAutomation.row4P1', { defaultValue: 'Track process execution times, bottleneck heatmaps, error frequencies, and financial ROI in real-time executive dashboards.' })}
              </p>
              <p>
                {t('servicesDetails.processAutomation.row4P2', { defaultValue: 'Continuous machine learning diagnostics discover new automation opportunities, keeping your enterprise operating at maximum efficiency.' })}
              </p>
            </div>
            <div className="dt-img-col">
              <div className="dt-img-frame">
                <img
                  src={`${import.meta.env.BASE_URL}img/proto-rapid-sec.jpg`}
                  alt="Process Telemetry and Real-Time Analytics"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Grid */}
      <section className="dt-capabilities-section">
        <div className="dt-wrap">
          <div className="dt-section-header reveal">
            <h2>{t('servicesDetails.processAutomation.pillarsTitle', { defaultValue: 'Automation Pillars' })}</h2>
            <p>{t('servicesDetails.processAutomation.pillarsSub', { defaultValue: 'Proven building blocks for intelligent enterprise operations.' })}</p>
          </div>
          <div className="dt-grid">
            <div className="dt-card reveal">
              <div className="dt-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
              </div>
              <h3>{t('servicesDetails.processAutomation.pillar1Title', { defaultValue: 'Workflow Automation' })}</h3>
              <p>{t('servicesDetails.processAutomation.pillar1Desc', { defaultValue: 'Multi-step human-in-the-loop and digital workflows orchestrated with automated routing and escalations.' })}</p>
            </div>
            <div className="dt-card reveal">
              <div className="dt-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3>{t('servicesDetails.processAutomation.pillar2Title', { defaultValue: 'Robotic Process Automation' })}</h3>
              <p>{t('servicesDetails.processAutomation.pillar2Desc', { defaultValue: 'Rule-based software bots executing routine data entry, reconciliation, and cross-application tasks.' })}</p>
            </div>
            <div className="dt-card reveal">
              <div className="dt-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 1-2 0v-.07A7 7 0 1 1 13 4.07V5a1 1 0 0 1-2 0v-.93A8.93 8.93 0 0 0 3.07 12H4a1 1 0 0 1 0 2h-.93A8.93 8.93 0 0 0 11 20.93V20a1 1 0 0 1 2 0v.93A8.93 8.93 0 0 0 20.93 14H20a1 1 0 0 1 0-2h.93A8.93 8.93 0 0 0 13 3.07z"></path>
                </svg>
              </div>
              <h3>{t('servicesDetails.processAutomation.pillar3Title', { defaultValue: 'Intelligent AI Automation' })}</h3>
              <p>{t('servicesDetails.processAutomation.pillar3Desc', { defaultValue: 'Cognitive AI agents that interpret context, summarize unstructured text, and make automated decisions.' })}</p>
            </div>
            <div className="dt-card reveal">
              <div className="dt-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3>{t('servicesDetails.processAutomation.pillar4Title', { defaultValue: 'Process Optimization' })}</h3>
              <p>{t('servicesDetails.processAutomation.pillar4Desc', { defaultValue: 'Process mining, bottleneck detection, and Kaizen workflows that continuously reduce operational costs.' })}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="dt-cta-section" style={{ padding: '0 24px 80px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="dt-wrap">
          <div className="dt-cta-box reveal" style={{ background: 'linear-gradient(135deg, var(--bg-soft) 0%, var(--bg-green) 100%)', border: '1px solid var(--border)', borderRadius: '20px', padding: '56px 32px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--text-heading)', margin: '0 0 16px' }}>{t('servicesDetails.processAutomation.ctaTitle', { defaultValue: 'Ready to Automate Your Business Workflows?' })}</h2>
            <p style={{ color: 'var(--text-body)', fontSize: '16px', maxWidth: '640px', margin: '0 auto 32px' }}>
              {t('servicesDetails.processAutomation.ctaSub', { defaultValue: 'Connect with our automation architects to identify high-ROI opportunities and deploy intelligent digital workflows.' })}
            </p>
            <button type="button" className="dt-btn-primary" onClick={handleBook}>
              {t('servicesDetails.processAutomation.ctaButton', { defaultValue: 'Book an Automation Consultation' })}
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
