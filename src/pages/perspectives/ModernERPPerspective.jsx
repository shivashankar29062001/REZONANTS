import { useDocumentMeta } from '../../lib/useDocumentMeta'
import { useTranslation } from '../../i18n/TranslationContext'
import {
  usePerspectiveScrollReveal,
  PerspectiveHero,
  BusinessImpactGrid,
  KeyPerspectiveBox,
  PerspectiveCTA,
  RelatedPerspectives,
} from './PerspectiveComponents.jsx'
import './PerspectivesDetail.css'

export default function ModernERPPerspective() {
  const { t } = useTranslation()
  const art = t('perspectivesArticles.modernErp', { returnObjects: true }) || {}

  useDocumentMeta({
    title: art.title ? `${art.title} | Perspectives | Rezonants` : 'Accelerating Business Transformation with Modern ERP | Perspectives | Rezonants',
    description:
      art.subtitle || 'Explore how modern ERP platforms connect finance, procurement, supply chain and business operations through a unified digital foundation.',
    keywords:
      'modern ERP, enterprise resource planning, business operations, supply chain, cloud ERP, financial management',
  })

  usePerspectiveScrollReveal()

  // 6 Connected Business Functions
  const connectedFunctions = [
    {
      title: 'Finance & Accounting',
      desc: 'Real-time general ledger, automated reconciliation, and multi-currency consolidation across global subsidiaries.',
      icon: '📊',
    },
    {
      title: 'Procurement & Vendor Management',
      desc: 'Automated purchase orders, vendor evaluation scorecards, and contract compliance tracking with touchless approvals.',
      icon: '🤝',
    },
    {
      title: 'Supply Chain & Inventory',
      desc: 'End-to-end stock visibility, demand-driven replenishment, warehouse automation, and multi-node logistics optimization.',
      icon: '📦',
    },
    {
      title: 'Manufacturing & Operations',
      desc: 'Production scheduling, material requirement planning (MRP), shop-floor telemetry, and predictive asset maintenance.',
      icon: '🏭',
    },
    {
      title: 'Sales & Customer Order Management',
      desc: 'Omnichannel order capture, real-time credit checks, dynamic pricing rules, and synchronized fulfillment tracking.',
      icon: '🛍️',
    },
    {
      title: 'Human Capital & Workforce',
      desc: 'Unified employee records, automated payroll integration, time-and-expense tracking, and workforce planning analytics.',
      icon: '👥',
    },
  ]

  // 4 Modern ERP Architectural Capabilities
  const modernCapabilities = [
    {
      title: 'Cloud-Native Architecture',
      desc: 'Elastic scalability, automatic security patching, continuous quarterly feature releases, and zero on-premise hardware overhead.',
      icon: '☁️',
    },
    {
      title: 'API-First Integration',
      desc: 'Standards-based REST and event-driven webhooks connecting seamlessly with third-party logistics, CRMs, banks, and ecommerce.',
      icon: '🔌',
    },
    {
      title: 'Dynamic Workflow Management',
      desc: 'Configurable business process rules that adapt to shifting organizational structures, compliance mandates, and subsidiary needs.',
      icon: '🔄',
    },
    {
      title: 'Enterprise Scalability',
      desc: 'Architected to support multi-entity hierarchies, complex global tax jurisdictions, and surging transaction volumes effortlessly.',
      icon: '🌐',
    },
  ]

  // Qualitative Business Benefits
  const erpBusinessBenefits = [
    'Better operational visibility with a single source of enterprise truth across all departments',
    'Reduced manual processes through automated invoice matching, approvals, and reconciliations',
    'Improved cross-functional collaboration by eliminating disconnected departmental spreadsheets',
    'Better data consistency across inventory, financial ledgers, and procurement pipelines',
    'Faster executive and operational decision-making supported by live operational telemetry',
  ]

  const erpStrategyPoints = [
    'Treat ERP as the foundational operating model of the business, not merely a back-office accounting upgrade',
    'Standardize operational processes where applicable to reduce custom code sprawl',
    'Connect operational applications through robust, governed APIs and master data models',
    'Implement in phased, low-risk milestone waves rather than disruptive big-bang cutovers',
  ]

  return (
    <div className="perspective-page">
      <div className="perspective-wrap">
        <PerspectiveHero
          category={art.category || "MODERN ERP"}
          title={art.title || "Accelerating Business Transformation with Modern ERP"}
          subtitle={art.subtitle || "Explore how modern ERP platforms connect finance, procurement, supply chain and business operations through a unified digital foundation."}
          date="August 2026"
          readTime="6 min read"
          image="/img/perspectives/accelerating-business-transformation-modern-erp.jpg"
          imageAlt="Modern ERP platform connecting enterprise business operations"
          imageCaption={art.imageCaption || "Enterprise Technology Perspective — ERP & Connected Business Operations"}
        />

        {/* Section: Why Modern ERP Matters */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec1Eyebrow || "THE OPERATIONAL BACKBONE"}</span>
            <h2 className="p-heading">{art.sec1Heading || "Why Modern ERP Matters"}</h2>
            <p className="p-subtext">
              {art.sec1Subtext || "ERP is no longer just back-office accounting. It is the operating model of the modern enterprise expressed in software."}
            </p>
          </div>

          <div className="p-editorial-grid">
            <div className="p-editorial-text reveal">
              <p>
                {art.sec1P1 || "In fast-moving enterprise landscapes, traditional Enterprise Resource Planning systems often struggle. Built in an era of batch processing and isolated local servers, legacy ERPs were heavily customized, difficult to upgrade, and painfully opaque. Crucial business operations functioned in parallel siloes, relying on fragile overnight exports to synchronize ledgers with warehouses."}
              </p>
              <p>
                {art.sec1P2 || "Modern, cloud-native ERP fundamentally redefines this dynamic. It operates as the unified digital backbone of the enterprise—a living foundation where finance, procurement, supply chain, inventory, and human resources transact on a shared data model."}
              </p>
              <p>
                {art.sec1P3 || "By bringing core operations into a single harmonized environment, modern ERP eliminates the operational blind spots that slow down growth, enabling leaders to steer the business using real-time signals rather than stale historical summaries."}
              </p>
            </div>

            <div className="p-editorial-media reveal">
              <img
                src={`${import.meta.env.BASE_URL}img/business-process-automation.jpg`}
                alt="Automated ERP process orchestration"
                className="p-editorial-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section: Connected Business Functions */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec2Eyebrow || "INTEGRATED ECOSYSTEM"}</span>
            <h2 className="p-heading">{art.sec2Heading || "Connected Business Functions"}</h2>
            <p className="p-subtext">
              {art.sec2Subtext || "Real organizational value emerges when core business functions transact together on a shared digital foundation."}
            </p>
          </div>

          <div className="p-card-grid-3">
            {(art.connectedFunctions || connectedFunctions).map((fn, idx) => (
              <div className="p-feature-card reveal" key={idx}>
                <div className="p-card-icon-box">{fn.icon}</div>
                <h3 className="p-card-title">{fn.title}</h3>
                <p className="p-card-desc">{fn.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Unified Operations */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec3Eyebrow || "CROSS-FUNCTIONAL HARMONY"}</span>
            <h2 className="p-heading">{art.sec3Heading || "Unified Operations & Information Flow"}</h2>
            <p className="p-subtext">
              {art.sec3Subtext || "Breaking down communication walls between departments to enable fluid, synchronized enterprise workflows."}
            </p>
          </div>

          <div className="p-editorial-grid p-reverse">
            <div className="p-editorial-text reveal">
              <p>
                {art.sec3P1 || "Operational silos are rarely people problems; they are architectural problems. When customer service, procurement, and warehouse teams work in disconnected applications, every handoff requires manual emails, spreadsheets, and phone calls. Errors multiply, invoices get held up, and customer commitments slip."}
              </p>
              <p>
                {art.sec3P2 || "Modern ERP addresses this through unified data lineage and event-driven process orchestration:"}
              </p>
              <ul className="p-feature-list">
                {(art.sec3List || [
                  { bold: 'Synchronized order-to-cash:', text: ' When a customer order is placed, inventory reserves automatically, shipping labels generate, and billing ledgers update instantaneously.' },
                  { bold: 'Procure-to-pay transparency:', text: ' Purchase orders, goods receipts, and vendor invoices match automatically with 3-way reconciliation, flagging only exceptions for human review.' },
                  { bold: 'Unified labor and operational costing:', text: ' Project timesheets, payroll allocations, and direct operational expenditures map directly to cost centers in real time.' }
                ]).map((item, idx) => (
                  <li className="p-feature-item" key={idx}>
                    <span className="p-feature-bullet">✓</span>
                    <span><strong>{item.bold}</strong>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-editorial-media reveal">
              <img
                src={`${import.meta.env.BASE_URL}img/end-to-end-solution-framework.jpg`}
                alt="Unified enterprise operations framework"
                className="p-editorial-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section: Real-Time Business Visibility */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec4Eyebrow || "ENTERPRISE TELEMETRY"}</span>
            <h2 className="p-heading">{art.sec4Heading || "Real-Time Business Visibility"}</h2>
            <p className="p-subtext">
              {art.sec4Subtext || "Consolidating operational metrics into transparent executive dashboards that reflect current business realities."}
            </p>
          </div>

          <div className="p-editorial-grid">
            <div className="p-editorial-text reveal">
              <p>
                {art.sec4P1 || "Operating an enterprise without unified visibility is like flying in dense fog with delayed instruments. Modern ERP provides real-time telemetry across every business dimension:"}
              </p>
              <ul className="p-feature-list">
                {(art.sec4List || [
                  { bold: 'Live executive dashboards:', text: ' Instantaneous views of gross margins, operating cash flows, open liabilities, and order backlogs without waiting for period-end closing.' },
                  { bold: 'Self-service operational reporting:', text: ' Departmental heads can build custom queries and drill down from enterprise-level summaries to individual transaction line items.' },
                  { bold: 'Centralized master information:', text: ' Eliminating contradictory numbers by establishing single governed master data for customers, vendors, and product catalogs.' },
                  { bold: 'Proactive anomaly alerts:', text: ' Automated alerts notify managers immediately when margins drop below threshold, inventory runs low, or supplier deliveries slip.' }
                ]).map((item, idx) => (
                  <li className="p-feature-item" key={idx}>
                    <span className="p-feature-bullet">✓</span>
                    <span><strong>{item.bold}</strong>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-editorial-media reveal">
              <img
                src={`${import.meta.env.BASE_URL}img/proto-rapid-sec.jpg`}
                alt="Real-time ERP dashboard and reporting"
                className="p-editorial-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section: Modern ERP Capabilities */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec5Eyebrow || "CORE PLATFORM ARCHITECTURE"}</span>
            <h2 className="p-heading">{art.sec5Heading || "Modern ERP Capabilities"}</h2>
            <p className="p-subtext">
              {art.sec5Subtext || "The architectural attributes that separate contemporary ERP platforms from rigid legacy installations."}
            </p>
          </div>

          <div className="p-card-grid-3">
            {(art.modernCapabilities || modernCapabilities).map((cap, idx) => (
              <div className="p-feature-card reveal" key={idx}>
                <div className="p-card-icon-box">{cap.icon}</div>
                <h3 className="p-card-title">{cap.title}</h3>
                <p className="p-card-desc">{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Business Benefits */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec6Eyebrow || "QUALITATIVE IMPACT"}</span>
            <h2 className="p-heading">{art.sec6Heading || "Business Benefits"}</h2>
            <p className="p-subtext">
              {art.sec6Subtext || "Connecting core business operations into a unified digital foundation yields measurable organizational resilience."}
            </p>
          </div>

          <BusinessImpactGrid outcomes={art.erpBusinessBenefits || erpBusinessBenefits} />
        </section>

        {/* Key Perspective */}
        <KeyPerspectiveBox
          eyebrow={art.keyPerspectiveEyebrow || "ERP TRANSFORMATION PHILOSOPHY"}
          title={art.keyPerspectiveTitle || "Pragmatic Modernization Over Monolithic Overhaul"}
          lead={art.keyPerspectiveLead || "Modern ERP transformation succeeds when organizations treat it as an evolutionary operating upgrade rather than an all-or-nothing IT disruption:"}
          points={art.erpStrategyPoints || erpStrategyPoints}
        />

        {/* CTA */}
        <PerspectiveCTA
          heading={art.ctaHeading || "Modernize Your Enterprise Operations"}
          description={art.ctaDescription || "Explore how modern ERP platforms connect finance, procurement, supply chain and business operations through a unified digital foundation."}
          buttonText={art.ctaButton || "Talk to Our Experts"}
          serviceContext="Modern ERP & Business Operations"
        />

        {/* Related Perspectives */}
        <RelatedPerspectives currentId="modern-erp" />
      </div>
    </div>
  )
}
