import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from '../../i18n/TranslationContext'
import { PERSPECTIVES_DATA } from '../../data/perspectivesData.js'

export function usePerspectiveScrollReveal() {
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
    setTimeout(revealInView, 80)

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}

export function PerspectiveBreadcrumb({ currentTitle }) {
  const { t } = useTranslation()
  return (
    <nav className="perspective-breadcrumb" aria-label="Breadcrumb">
      <Link to="/">{t('nav.about') === 'About' ? 'Home' : t('hero.since').split('—')[0].trim() || 'Home'}</Link>
      <span className="perspective-breadcrumb-sep" aria-hidden="true">/</span>
      <Link to="/perspectives">{t('nav.perspectives')}</Link>
      <span className="perspective-breadcrumb-sep" aria-hidden="true">/</span>
      <span className="perspective-breadcrumb-current" aria-current="page">
        {currentTitle}
      </span>
    </nav>
  )
}

export function PerspectiveHero({
  category,
  title,
  subtitle,
  date = 'Sep 2026',
  readTime = '7 min read',
  image,
  imageAlt,
  imageCaption = 'Enterprise Technology Insight — Architecture & Strategy',
}) {
  const { t } = useTranslation()
  return (
    <header className="perspective-hero">
      <PerspectiveBreadcrumb currentTitle={title} />
      <div className="perspective-category-badge">
        <span className="perspective-category-dot" aria-hidden="true" />
        {category}
      </div>
      <h1 className="perspective-title">{title}</h1>
      <p className="perspective-lead">{subtitle}</p>

      <div className="perspective-meta-bar">
        <div className="perspective-meta-item">
          <span className="perspective-meta-label">{t('perspectives.topic', { defaultValue: 'Topic:' })}</span>
          <span className="perspective-meta-val">{category}</span>
        </div>
        <div className="perspective-meta-item">
          <span className="perspective-meta-label">{t('perspectives.published', { defaultValue: 'Published:' })}</span>
          <span className="perspective-meta-val">{date}</span>
        </div>
        <div className="perspective-meta-item">
          <span className="perspective-meta-label">{t('perspectives.readingTime', { defaultValue: 'Reading Time:' })}</span>
          <span className="perspective-meta-val">{readTime}</span>
        </div>
        <div className="perspective-meta-item">
          <span className="perspective-meta-label">{t('perspectives.author', { defaultValue: 'Author:' })}</span>
          <span className="perspective-meta-val">{t('perspectives.authorName', { defaultValue: 'Rezonants Enterprise Architecture Studio' })}</span>
        </div>
      </div>

      {image && (
        <div className="perspective-hero-media reveal">
          <img
            src={`${import.meta.env.BASE_URL}${image.replace(/^\//, '')}`}
            alt={imageAlt || title}
            className="perspective-hero-img"
            width="1280"
            height="720"
            loading="eager"
            fetchPriority="high"
          />
          <div className="perspective-hero-overlay" aria-hidden="true" />
          <div className="perspective-hero-caption">
            <span>{category}</span>
            <span>{imageCaption}</span>
          </div>
        </div>
      )}
    </header>
  )
}

export function ArchitectureFlowDiagram({
  badge = 'System Flow',
  title = 'Architecture Model',
  steps = [],
}) {
  return (
    <div className="p-diagram-wrap reveal">
      <div className="p-diagram-title-row">
        <strong style={{ color: 'var(--text-h, var(--text-heading))', fontSize: '1.05rem', fontWeight: 700 }}>
          {title}
        </strong>
        <span className="p-diagram-badge">{badge}</span>
      </div>
      <div className="p-diagram-flow">
        {steps.map((step, idx) => (
          <div key={idx} style={{ display: 'contents' }}>
            <div className="p-flow-step">
              <span className="p-flow-step-num">STAGE 0{idx + 1}</span>
              <h4 className="p-flow-step-title">{step.title}</h4>
              <p className="p-flow-step-desc">{step.desc}</p>
            </div>
            {idx < steps.length - 1 && (
              <div className="p-flow-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function TechnologyGrid({ rows = [] }) {
  const { t } = useTranslation()
  return (
    <div className="reveal">
      <table className="p-tech-table">
        <thead>
          <tr>
            <th>{t('perspectives.techArea', { defaultValue: 'Technology Area' })}</th>
            <th>{t('perspectives.purpose', { defaultValue: 'Purpose' })}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td className="p-tech-area-cell">
                <span className="p-tech-badge-dot" aria-hidden="true" />
                {row.area}
              </td>
              <td>{row.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function BusinessImpactGrid({ outcomes = [] }) {
  return (
    <div className="p-outcomes-grid reveal">
      {outcomes.map((item, idx) => (
        <div className="p-outcome-card" key={idx}>
          <div className="p-outcome-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="p-outcome-text">{item}</span>
        </div>
      ))}
    </div>
  )
}

export function KeyPerspectiveBox({
  eyebrow = 'STRATEGIC PERSPECTIVE',
  title = 'The Core Philosophy',
  lead,
  points = [],
}) {
  return (
    <div className="p-key-perspective-box reveal">
      <span className="p-key-eyebrow">{eyebrow}</span>
      <h3 className="p-key-heading">{title}</h3>
      {lead && <p>{lead}</p>}
      {points.length > 0 && (
        <ul className="p-key-bullets">
          {points.map((pt, idx) => (
            <li key={idx}>{pt}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function PerspectiveCTA({
  heading,
  description,
  buttonText,
  serviceContext,
}) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const btnLabel = buttonText || t('perspectives.talkToExperts', { defaultValue: 'Talk to Our Experts' })

  const handleBooking = () => {
    navigate('/book-consultation', {
      state: { service: serviceContext || 'Enterprise Perspectives Consultation' },
    })
  }

  return (
    <section className="p-cta-section">
      <div className="p-cta-card reveal">
        <h2 className="p-cta-heading">{heading}</h2>
        <p className="p-cta-text">{description}</p>
        <div className="p-cta-actions">
          <button type="button" className="p-btn-primary" onClick={handleBooking}>
            {btnLabel}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <Link to="/perspectives" className="p-btn-secondary">
            {t('perspectives.viewAll', { defaultValue: 'View All Perspectives' })}
          </Link>
        </div>
      </div>
    </section>
  )
}

export function RelatedPerspectives({ currentId }) {
  const others = PERSPECTIVES_DATA.filter((p) => p.id !== currentId).slice(0, 2)
  const { t } = useTranslation()

  return (
    <section className="p-related-section">
      <span className="p-eyebrow">{t('perspectives.exploreMore', { defaultValue: 'EXPLORE MORE PERSPECTIVES' })}</span>
      <h3 className="p-heading">{t('perspectives.continueExploring', { defaultValue: 'Continue Exploring Enterprise Technology Insights' })}</h3>
      <div className="p-related-grid">
        {others.map((p) => {
          const localizedP = t(`perspectivesData.${p.id}`, { returnObjects: true, defaultValue: p }) || p
          const title = localizedP.title || p.title
          const cat = localizedP.category || localizedP.tag || p.category || p.tag
          return (
            <Link to={p.path} key={p.id} className="p-related-card reveal">
              <div className="p-related-media">
                <img
                  src={`${import.meta.env.BASE_URL}${(p.imageOptimized || p.image).replace(/^\//, '')}`}
                  alt={title}
                  className="p-related-img"
                  loading="lazy"
                />
              </div>
              <div className="p-related-body">
                <span className="p-related-cat">{cat}</span>
                <h4 className="p-related-title">{title}</h4>
                <span className="p-related-action">
                  {t('perspectives.readPerspective', { defaultValue: 'Read Perspective' })} →
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
