import { Link } from 'react-router-dom'
import { Fragment, useEffect, useState } from 'react'
import { Icon } from '../components/Icon'
import { useTranslation } from '../i18n/TranslationContext'
import './services/ServicePage.css'

const CATEGORIES = [
  {
    id: 'featured',
    title: 'Featured Products',
    sub: 'Simplify operations, connect teams, automate processes, and drive smarter business growth.',
    items: [
      { title: 'AI Automation & Intelligent Agents', description: 'Automate repetitive tasks and deploy intelligent AI agents that improve productivity, decision-making, and business outcomes.' },
      { title: 'IT Service & Digital Support', description: 'Deliver faster, smarter IT support with streamlined service management, automation, and digital workflows.' },
      { title: 'Enterprise AI Governance', description: 'Build responsible AI adoption with strong governance, security, compliance, transparency, and risk controls.' },
      { title: 'Intelligent IT Operations', description: 'Transform IT operations with AI-driven monitoring, automation, predictive insights, and proactive issue resolution.' },
      { title: 'Customer Experience Management', description: 'Create personalized customer journeys with intelligent engagement, automation, analytics, and seamless digital experiences.' },
      { title: 'Business Strategy & Portfolio Optimization', description: 'Align technology investments with business goals to optimize portfolios, improve efficiency, and drive sustainable growth.' },
      { title: 'IT Asset & Technology Lifecycle', description: 'Manage IT assets throughout their lifecycle with better visibility, automation, cost control, and technology planning.' },
      { title: 'Enterprise Risk & Compliance', description: 'Identify, assess, and manage enterprise risks while strengthening compliance, controls, and organizational resilience.' },
      { title: 'Cybersecurity & Threat Operations', description: 'Protect digital environments with proactive threat detection, security operations, incident response, and continuous monitoring.' },
      { title: 'Field Workforce Automation', description: 'Empower field teams with intelligent scheduling, mobile workflows, automation, and real-time operational visibility.' },
      { title: 'Employee Experience & HR Services', description: 'Simplify employee services with digital workflows, self-service solutions, automation, and personalized employee experiences.' },
      { title: 'Unified Digital Workplace', description: 'Connect people, processes, applications, and collaboration tools through a secure, intelligent, and seamless digital workplace.' },
    ],
    promoTitle: 'Meet the Autonomous Workforce',
    promoText: 'Transform your operations with AI agents that work alongside your team to handle complex, repetitive tasks.',
  },
  {
    id: 'erp',
    title: 'ERP Solutions',
    heading: 'One Platform, Ready for Anything',
    sub: 'Empowering businesses with connected, intelligent, and scalable enterprise management solutions.',
    items: [
      { title: 'Business Process Automation', description: 'Streamline finance, HR, sales, procurement, and daily operations.' },
      { title: 'Integrated Business Management', description: 'Connect departments, data, and workflows on a unified platform.' },
      { title: 'Finance & Accounting', description: 'Improve financial visibility, reporting, budgeting, and compliance.' },
      { title: 'HR & Payroll', description: 'Simplify employee management, attendance, payroll, and HR processes.' },
      { title: 'Supply Chain Management', description: 'Optimize procurement, inventory, vendors, and logistics.' },
      { title: 'Sales & Customer Management', description: 'Manage leads, customers, orders, and sales performance efficiently.' },
      { title: 'Real-Time Analytics & Reporting', description: 'Turn business data into actionable insights for faster decisions.' },
      { title: 'Cloud ERP Solutions', description: 'Enable secure, scalable, and accessible enterprise management from anywhere.' },
    ],
    promoTitle: 'Modular ERP for Growth',
    promoText: 'Deploy modular ERP features rapidly without the complexity of traditional multi-year systems.',
  },
  {
    id: 'it',
    title: 'IT Solutions',
    heading: 'Our IT Solutions',
    sub: 'Transform IT operations with intelligent, proactive, and scalable digital solutions that improve performance, productivity, and business continuity.',
    items: [
      { title: 'IT Service Management', description: 'Streamline IT services, incidents, requests, and workflows for faster resolution.' },
      { title: 'IT Operations Management', description: 'Monitor infrastructure and applications with proactive, data-driven IT operations.' },
      { title: 'IT Asset Management', description: 'Manage technology assets efficiently while reducing costs, risks, and lifecycle complexity.' },
      { title: 'Enterprise Architecture', description: 'Align business strategy with the right technology architecture and investments.' },
      { title: 'Cloud Governance', description: 'Improve cloud security, compliance, performance, and cost management.' },
      { title: 'Digital Operations', description: 'Automate IT processes and gain real-time visibility across your technology environment.' },
      { title: 'Observability & Monitoring', description: 'Detect performance issues early and maintain reliable digital experiences.' },
      { title: 'Strategic Portfolio Management', description: 'Connect IT investments with business priorities and measurable outcomes.' },
    ],
    promoTitle: 'Reliable IT Infrastructure',
    promoText: 'Build a resilient technology foundation with managed cloud, security, and DevOps services.',
  },
  {
    id: 'crm',
    title: 'CRM Solutions',
    heading: 'Our CRM Solutions',
    sub: 'Deliver connected, personalized, and intelligent customer experiences across the entire customer journey.',
    items: [
      { title: 'Customer Service Management', description: 'Improve customer support with faster resolution, self-service, and intelligent workflows.' },
      { title: 'Sales Automation', description: 'Automate sales activities, manage leads, and help teams close opportunities faster.' },
      { title: 'Sales & Order Management', description: 'Streamline the journey from lead to order and improve revenue visibility.' },
      { title: 'Field Service Management', description: 'Optimize field operations, scheduling, dispatch, and technician productivity.' },
      { title: 'Customer Experience Management', description: 'Create seamless and personalized experiences across every customer touchpoint.' },
      { title: 'CRM Analytics & Insights', description: 'Turn customer data into actionable insights for smarter business decisions.' },
      { title: 'Marketing Automation', description: 'Automate campaigns, customer engagement, and lead nurturing.' },
      { title: 'AI-Powered CRM', description: 'Use intelligent automation and AI insights to improve productivity and customer engagement.' },
    ],
    promoTitle: 'Close More Deals',
    promoText: 'Empower your sales and support teams with unified customer data and intelligent automation.',
  },
  {
    id: 'hrms',
    title: 'HRMS Solutions',
    heading: 'Our HRMS Solutions',
    sub: 'Empower your workforce with intelligent, integrated, and automated HR solutions that simplify employee management and improve the workplace experience.',
    items: [
      { title: 'Core HR Management', description: 'Manage employee information, organizational structures, and HR processes efficiently.' },
      { title: 'Payroll Management', description: 'Automate payroll, salary processing, deductions, and compliance.' },
      { title: 'Employee Self-Service', description: 'Give employees easy access to HR services, requests, documents, and information.' },
      { title: 'Attendance & Leave Management', description: 'Simplify attendance tracking, leave requests, shifts, and working hours.' },
      { title: 'Recruitment & Onboarding', description: 'Streamline hiring, candidate management, onboarding, and employee integration.' },
      { title: 'Performance Management', description: 'Set goals, track performance, and support continuous employee development.' },
      { title: 'Learning & Development', description: 'Manage training programs, skills development, and employee growth.' },
      { title: 'HR Analytics & Reporting', description: 'Turn workforce data into actionable insights for better HR decisions.' },
      { title: 'AI-Powered HR Automation', description: 'Automate repetitive HR tasks and deliver faster, personalized employee experiences.' },
    ],
    promoTitle: 'Simplify HR Operations',
    promoText: 'Automate HR workflows from recruitment to retirement with a modern, employee-first platform.',
  },
  {
    id: 'appdev',
    title: 'App Development',
    heading: 'Our App Development Services',
    sub: 'Build secure, scalable, and high-performance applications that accelerate business growth and simplify complex processes.',
    items: [
      { title: 'Custom Application Development', description: 'Build tailored applications designed around your unique business requirements.' },
      { title: 'Web & Mobile App Development', description: 'Deliver seamless digital experiences across web, mobile, and multiple devices.' },
      { title: 'Enterprise Application Development', description: 'Develop scalable solutions that integrate with your existing business systems.' },
      { title: 'Low-Code & No-Code Development', description: 'Accelerate application delivery with flexible low-code development platforms.' },
      { title: 'API & System Integration', description: 'Connect applications, platforms, and third-party systems for seamless data flow.' },
      { title: 'Application Modernization', description: 'Transform legacy applications into modern, scalable, and efficient solutions.' },
      { title: 'AI-Powered Applications', description: 'Integrate AI, automation, and intelligent capabilities into business applications.' },
      { title: 'Application Support & Maintenance', description: 'Ensure continuous performance, security, updates, and reliability.' },
    ],
    promoTitle: 'Build Apps Users Love',
    promoText: 'From idea to launch, our team designs and develops high-quality mobile and web applications that scale.',
  },
]

export default function ProductsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    return CATEGORIES.some((c) => c.id === hash) ? hash : 'featured'
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.replace('#', '')
      setActiveTab(CATEGORIES.some((c) => c.id === hash) ? hash : 'featured')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

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
    if (!('IntersectionObserver' in window)) { reveals().forEach(revealEl); return }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { revealEl(entry.target); io.unobserve(entry.target) } })
    }, { threshold: 0.12 })
    reveals().forEach((el) => io.observe(el))
    let raf = 0
    const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; revealInView() }) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    revealInView()
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  const active = CATEGORIES.find((c) => c.id === activeTab) || CATEGORIES[0]

  return (
    <>
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div className="products-page-layout">
            <aside className="products-sidebar">
              {CATEGORIES.map((cat, idx) => (
                <Fragment key={cat.id}>
                  {idx === 1 && <div className="mega-menu-sidebar-heading">{t('products.sidebar.solutions', { defaultValue: 'Solutions' })}</div>}
                  <button
                    type="button"
                    className={`mega-menu-tab-btn ${activeTab === cat.id ? 'is-active' : ''}`}
                    onClick={() => setActiveTab(cat.id)}
                  >
                    <span>{t(`products.catalog.${cat.id}.title`, { defaultValue: t(`products.${cat.id}.title`, { defaultValue: cat.title }) })}</span>
                    <span className="mega-menu-tab-chevron"><Icon name="chevronRight" /></span>
                  </button>
                </Fragment>
              ))}
            </aside>

            <div className="products-content" key={active.id}>
              <div className="mega-menu-main-header">
                <h3 className="mega-menu-title">{t(`products.catalog.${active.id}.heading`, { defaultValue: t(`products.${active.id}.title`, { defaultValue: active.heading || active.title }) })}</h3>
                <p className="mega-menu-subtitle">{t(`products.catalog.${active.id}.sub`, { defaultValue: t(`products.${active.id}.sub`, { defaultValue: active.sub }) })}</p>
              </div>
              <div className="mega-menu-divider" />
              <div className="mega-menu-grid-title">{t(`products.catalog.${active.id}.heading`, { defaultValue: active.heading || active.title }).toUpperCase()}</div>
              <div className={`mega-menu-grid ${active.id === 'featured' ? 'mega-menu-grid--two-col' : ''}`}>
                {active.items.map((prod, idx) => {
                  const itemTitle = t(`products.catalog.${active.id}.items.${idx}.title`, { defaultValue: prod.title })
                  const itemDesc = t(`products.catalog.${active.id}.items.${idx}.description`, { defaultValue: prod.description })
                  return (
                    <Link key={idx} to="/book-consultation" className="mega-menu-grid-item">
                      <h4>{itemTitle}</h4>
                      <p>{itemDesc}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
