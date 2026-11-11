import { useDocumentMeta } from '../../lib/useDocumentMeta'
import { useTranslation } from '../../i18n/TranslationContext'
import {
  usePerspectiveScrollReveal,
  PerspectiveHero,
  ArchitectureFlowDiagram,
  TechnologyGrid,
  BusinessImpactGrid,
  KeyPerspectiveBox,
  PerspectiveCTA,
  RelatedPerspectives,
} from './PerspectiveComponents.jsx'
import './PerspectivesDetail.css'

export default function BusinessTransformationPerspective() {
  const { t } = useTranslation()
  const art = t('perspectivesArticles.businessTransformation', { returnObjects: true }) || {}

  useDocumentMeta({
    title: art.title ? `${art.title} | Perspectives | Rezonants` : 'Modernizing Business Applications for a Data-Driven Enterprise | Perspectives | Rezonants',
    description:
      art.subtitle || 'How modern application architecture and connected data improve operational efficiency, scalability, and business visibility across the enterprise.',
    keywords:
      'business transformation, application modernization, enterprise architecture, connected data, APIs, system integration',
  })

  usePerspectiveScrollReveal()

  // Architecture Flow 1: Fragmented Legacy Landscape
  const legacyLandscapeFlow = [
    {
      title: 'Business Applications',
      desc: 'Disparate legacy CRM, ERP, and departmental tools running in silos.',
    },
    {
      title: 'Multiple Data Sources',
      desc: 'Fragmented operational tables, CSV extracts, and ad-hoc schemas.',
    },
    {
      title: 'Disconnected Databases',
      desc: 'Isolated on-premise and uncoordinated cloud data repositories.',
    },
    {
      title: 'Reports & Business Users',
      desc: 'Manual reconciliations, conflicting spreadsheets, and delayed reporting.',
    },
  ]

  // Architecture Flow 2: Target Connected Enterprise Architecture
  const modernArchitectureFlow = [
    {
      title: 'Business Applications',
      desc: 'Core operational platforms and modern responsive interfaces.',
    },
    {
      title: 'API / Integration Layer',
      desc: 'Secure, event-driven API gateway connecting enterprise workflows.',
    },
    {
      title: 'Data Services',
      desc: 'Unified master data models, pipelines, and optimized storage engines.',
    },
    {
      title: 'Analytics & Reporting',
      desc: 'Real-time telemetry, semantic models, and automated reporting.',
    },
    {
      title: 'Business Decision Makers',
      desc: 'Live operational dashboards providing unified executive visibility.',
    },
  ]

  // Technology Foundation Table
  const techFoundationRows = [
    { area: 'Enterprise Applications', purpose: 'Business process management' },
    { area: 'APIs', purpose: 'System integration' },
    { area: 'Databases', purpose: 'Structured business data' },
    { area: 'Data Integration', purpose: 'Connecting multiple sources' },
    { area: 'Analytics', purpose: 'Business insights' },
    { area: 'Cloud Infrastructure', purpose: 'Scalability and flexibility' },
    { area: 'Monitoring', purpose: 'Reliability and performance' },
  ]

  // Business Impact / Qualitative Value
  const businessImpactOutcomes = [
    'Improved operational visibility across cross-functional units',
    'Better data consistency and single source of enterprise truth',
    'Reduced manual reporting effort and automated data compilation',
    'Improved application performance and reduced transaction latency',
    'Easier system integration through standardized, secure APIs',
    'Greater scalability to support organic growth and acquisition',
    'Better foundation for future innovation and intelligence adoption',
  ]

  // Core perspective philosophical points
  const keyPerspectivePoints = [
    'Understanding business processes and real operational workflows',
    'Connecting systems through dependable integration standards',
    'Improving data quality, governance, and master data models',
    'Modernizing applications without destabilizing day-to-day operations',
    'Creating scalable architecture suited for elastic growth',
    'Enabling better business visibility for proactive decision-making',
  ]

  return (
    <div className="perspective-page">
      <div className="perspective-wrap">
        <PerspectiveHero
          category={art.category || "BUSINESS TRANSFORMATION"}
          title={art.title || "Modernizing Business Applications for a Data-Driven Enterprise"}
          subtitle={art.subtitle || "A modern application and data foundation can help enterprises improve operational efficiency, connect business systems and create better visibility across their operations."}
          date="September 2026"
          readTime="7 min read"
          image="/img/perspectives/modernizing-business-applications.jpg"
          imageAlt="Modern enterprise applications and connected data architecture"
          imageCaption={art.imageCaption || "Enterprise Technology Perspective — Application Architecture & Connected Data"}
        />

        {/* Section: The Business Challenge */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec1Eyebrow || "THE BUSINESS CHALLENGE"}</span>
            <h2 className="p-heading">{art.sec1Heading || "Navigating Complexity in a Growing Enterprise"}</h2>
            <p className="p-subtext">
              {art.sec1Subtext || "As businesses scale, technology ecosystems inevitably expand. What begins as focused solutions for individual departments can evolve into a tangled web of disparate systems."}
            </p>
          </div>

          <div className="p-editorial-grid">
            <div className="p-editorial-text reveal">
              <p>
                {art.sec1P1 || "In a typical enterprise environment, growth often introduces multiple generations of software. Finance, supply chain, customer service, and field operations often operate on separate software stacks acquired or built at different times. Over years of operational evolution, these systems develop their own data formats, update cadences, and integration quirks."}
              </p>
              <p>
                {art.sec1P2 || "The friction manifests across the enterprise through common operational bottlenecks:"}
              </p>
              <ul className="p-feature-list">
                {(art.sec1List || [
                  { bold: 'Multiple disconnected business applications', text: ' that require duplicate data entry and manual cross-referencing.' },
                  { bold: 'Disconnected databases', text: ' operating without centralized governance or unified master records.' },
                  { bold: 'Manual reporting overhead', text: ', where analytical teams spend days stitching together exports rather than uncovering insights.' },
                  { bold: 'Data inconsistencies', text: ' across departments, creating conflicting answers to fundamental operational questions.' },
                  { bold: 'Application maintenance overhead and scalability limits', text: ', as brittle legacy point-to-point connections struggle to support growing transaction volumes.' }
                ]).map((item, idx) => (
                  <li className="p-feature-item" key={idx}>
                    <span className="p-feature-bullet">✓</span>
                    <span><strong>{item.bold}</strong>{item.text}</span>
                  </li>
                ))}
              </ul>
              <p>
                {art.sec1P3 || "Addressing these challenges requires viewing the technology landscape not as a collection of isolated software purchases, but as an interconnected business platform designed to support strategic agility."}
              </p>
            </div>

            <div className="p-editorial-media reveal">
              <img
                src={`${import.meta.env.BASE_URL}img/custom-dev-sec1.jpg`}
                alt="Enterprise application landscape complexity"
                className="p-editorial-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section: A Complex Technology Landscape */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec2Eyebrow || "SYSTEM EVOLUTION"}</span>
            <h2 className="p-heading">{art.sec2Heading || "A Complex Technology Landscape"}</h2>
            <p className="p-subtext">
              {art.sec2Subtext || "When business applications, databases, and operational systems evolve independently, information flows become fragmented. Understanding this fragmentation is the critical first step."}
            </p>
          </div>

          <ArchitectureFlowDiagram
            badge={art.legacyLandscapeBadge || "Legacy Baseline"}
            title={art.legacyLandscapeTitle || "Fragmented Information Flow"}
            steps={art.legacyLandscapeFlow || legacyLandscapeFlow}
          />

          <div className="p-card-grid-3">
            {(art.sec2Cards || [
              { num: '01', title: 'Data Silos', desc: 'Crucial customer, financial, and inventory data remains trapped in departmental platforms, preventing a single unified view of business operations.' },
              { num: '02', title: 'Integration Gaps', desc: 'Point-to-point connections and nightly batch extracts create latency, high failure rates, and costly maintenance overhead across operational teams.' },
              { num: '03', title: 'Delayed Information', desc: 'When executives must wait days for month-end reconciliation to understand performance, decision-making is reactive rather than predictive.' }
            ]).map((c, idx) => (
              <div className="p-feature-card reveal" key={idx}>
                <span className="p-card-number">{c.num || `0${idx + 1}`}</span>
                <h3 className="p-card-title">{c.title}</h3>
                <p className="p-card-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Modern Application Architecture */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec3Eyebrow || "THE CONNECTED MODEL"}</span>
            <h2 className="p-heading">{art.sec3Heading || "Modern Application Architecture"}</h2>
            <p className="p-subtext">
              {art.sec3Subtext || "Enterprises move toward an event-driven, API-first architecture where data flows reliably across core platforms and reaches decision-makers in real time."}
            </p>
          </div>

          <ArchitectureFlowDiagram
            badge={art.modernArchitectureBadge || "Target Architecture"}
            title={art.modernArchitectureTitle || "Connected Enterprise Application Model"}
            steps={art.modernArchitectureFlow || modernArchitectureFlow}
          />

          <div className="p-editorial-grid p-reverse" style={{ marginTop: '2.5rem' }}>
            <div className="p-editorial-text reveal">
              <p>
                {art.sec3P1 || "A modern application architecture replaces brittle point-to-point connections with an agile, decoupled foundation. By establishing a robust API and integration layer, systems interact through governed, secure endpoints while preserving the autonomy of individual business units."}
              </p>
              <p>
                {art.sec3P2 || "Key technical capabilities of this architectural shift include:"}
              </p>
              <ul className="p-feature-list">
                {(art.sec3List || [
                  { bold: 'Application modernization:', text: ' Decoupling core business logic into scalable modular services.' },
                  { bold: 'API integration:', text: ' Establishing standardized, documented interfaces for internal and partner interoperability.' },
                  { bold: 'Data integration & database optimization:', text: ' Unifying operational data pipelines with high-throughput query optimization.' },
                  { bold: 'Observability & security:', text: ' Implementing centralized telemetry, audit trails, and role-based access controls across all services.' }
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
                src={`${import.meta.env.BASE_URL}img/solution-arch-design.jpg`}
                alt="Modern application architecture design"
                className="p-editorial-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section: Connected Data & Analytics */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec4Eyebrow || "INTELLIGENCE & VISIBILITY"}</span>
            <h2 className="p-heading">{art.sec4Heading || "Connected Data & Analytics"}</h2>
            <p className="p-subtext">
              {art.sec4Subtext || "When business applications communicate seamlessly, data ceases to be a reporting byproduct and becomes a primary driver of operational agility."}
            </p>
          </div>

          <div className="p-editorial-grid">
            <div className="p-editorial-text reveal">
              <p>
                {art.sec4P1 || "Integrated data foundations transform how leadership and operational teams interact with information. Rather than relying on retrospective reports that show what occurred weeks ago, organizations gain live operational telemetry across business units."}
              </p>
              <p>
                {art.sec4P2 || "Connected data and analytics support sustainable business outcomes through:"}
              </p>
              <ul className="p-feature-list">
                {(art.sec4List || [
                  { bold: 'Operational visibility:', text: ' Continuous transparency across sales, inventory, fulfillment, and financial performance.' },
                  { bold: 'Faster reporting cadences:', text: ' On-demand data aggregation that eliminates repetitive manual spreadsheets.' },
                  { bold: 'Consistent information:', text: ' Single definitions for metrics like margin, customer lifetime value, and lead velocity.' },
                  { bold: 'Better business insights:', text: ' Predictive pattern detection that surfaces risks and opportunities ahead of time.' },
                  { bold: 'Improved decision-making:', text: ' Confident executive action supported by validated data lineage and transparency.' }
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
                alt="Connected enterprise data analytics and real-time dashboard"
                className="p-editorial-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section: Technology Foundation Grid */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec5Eyebrow || "ARCHITECTURE BLUEPRINT"}</span>
            <h2 className="p-heading">{art.sec5Heading || "Technology Foundation"}</h2>
            <p className="p-subtext">
              {art.sec5Subtext || "A comprehensive view of the core technology areas that compose a modern, scalable enterprise foundation."}
            </p>
          </div>

          <TechnologyGrid rows={art.techFoundationRows || techFoundationRows} />
        </section>

        {/* Section: Business Impact */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec6Eyebrow || "QUALITATIVE VALUE"}</span>
            <h2 className="p-heading">{art.sec6Heading || "Business Impact"}</h2>
            <p className="p-subtext">
              {art.sec6Subtext || "Modernizing application architecture and connecting fragmented data delivers tangible operational improvements across the organization."}
            </p>
          </div>

          <BusinessImpactGrid outcomes={art.businessImpactOutcomes || businessImpactOutcomes} />
        </section>

        {/* Section: Key Perspective */}
        <KeyPerspectiveBox
          eyebrow={art.keyPerspectiveEyebrow || "STRATEGIC PERSPECTIVE"}
          title={art.keyPerspectiveTitle || "Modernization Is More Than Software Replacement"}
          lead={art.keyPerspectiveLead || "Modernizing business applications is not simply replacing old software with new tools. It is an intentional alignment of technology with how the business operates, scales, and delivers value."}
          points={art.keyPerspectivePoints || keyPerspectivePoints}
        />

        {/* CTA */}
        <PerspectiveCTA
          heading={art.ctaHeading || "Ready to Modernize Your Technology Environment?"}
          description={art.ctaDescription || "Explore how modern application architecture, connected data and scalable technology can help organizations improve efficiency and prepare for future growth."}
          buttonText={art.ctaButton || "Talk to Our Experts"}
          serviceContext="Business Transformation & Application Modernization"
        />

        {/* Related Perspectives */}
        <RelatedPerspectives currentId="business-transformation" />
      </div>
    </div>
  )
}
