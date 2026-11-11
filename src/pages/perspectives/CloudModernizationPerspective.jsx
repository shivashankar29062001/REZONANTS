import { useDocumentMeta } from '../../lib/useDocumentMeta'
import { useTranslation } from '../../i18n/TranslationContext'
import {
  usePerspectiveScrollReveal,
  PerspectiveHero,
  ArchitectureFlowDiagram,
  BusinessImpactGrid,
  KeyPerspectiveBox,
  PerspectiveCTA,
  RelatedPerspectives,
} from './PerspectiveComponents.jsx'
import './PerspectivesDetail.css'

export default function CloudModernizationPerspective() {
  const { t } = useTranslation()
  const art = t('perspectivesArticles.cloudModernization', { returnObjects: true }) || {}

  useDocumentMeta({
    title: art.title ? `${art.title} | Perspectives | Rezonants` : 'Modernizing Legacy Applications for the Cloud | Perspectives | Rezonants',
    description:
      art.subtitle || 'Explore a practical approach to assessing, modernizing and moving legacy applications toward scalable, secure cloud architectures.',
    keywords:
      'cloud modernization, legacy applications, cloud migration, refactoring, rehosting, microservices, cloud architecture',
  })

  usePerspectiveScrollReveal()

  // 4 Modernization Approaches
  const modernizationApproaches = [
    {
      num: '01',
      title: 'Rehost (Lift & Shift)',
      desc: 'Migrating applications directly to cloud virtual machines without modifying underlying application code.',
      benefits: 'Fastest time-to-cloud with minimal migration disruption.',
    },
    {
      num: '02',
      title: 'Replatform (Lift & Reshape)',
      desc: 'Moving workloads to cloud-managed databases, container runtimes, or OS upgrades without rewriting core business logic.',
      benefits: 'Reduces operational overhead and improves scalability with low risk.',
    },
    {
      num: '03',
      title: 'Refactor (Cloud-Native Rebuild)',
      desc: 'Deconstructing monolithic codebases into modular microservices, serverless functions, and event-driven APIs.',
      benefits: 'Maximizes agility, autoscaling performance, and operational cost efficiency.',
    },
    {
      num: '04',
      title: 'Replace (SaaS Transition)',
      desc: 'Decommissioning customized legacy modules in favor of industry-standard commercial SaaS solutions.',
      benefits: 'Eliminates ongoing maintenance overhead and guarantees continuous feature updates.',
    },
  ]

  // Architecture Flow: Modernization Lifecycle
  const cloudArchitectureFlow = [
    {
      title: 'Phase 1: Estate Assessment',
      desc: 'Audit dependencies, technical debt, and calculate workload ROI.',
    },
    {
      title: 'Phase 2: Target Blueprint',
      desc: 'Design containerized topologies, managed databases, and IaC templates.',
    },
    {
      title: 'Phase 3: Migration Waves',
      desc: 'Execute canary deployments with dual-write data synchronization.',
    },
    {
      title: 'Phase 4: Cloud Optimization',
      desc: 'Continuous FinOps governance, auto-scaling, and telemetry monitoring.',
    },
  ]

  // Qualitative Business Benefits
  const cloudModernizationBenefits = [
    'Substantially reduced infrastructure maintenance and hardware refresh expenses',
    'Near-infinite compute elasticity handling seasonal enterprise demand without latency',
    'Accelerated release velocity with automated CI/CD continuous deployment pipelines',
    'Elimination of single points of failure through multi-region high availability',
    'Modern API architectures enabling rapid cross-platform partner integrations',
    'Deep real-time observability into application performance and cloud spending',
  ]

  const landscapeAssessmentPoints = [
    'Mapping complex inter-application dependencies and data synchronization cadences',
    'Identifying hardcoded environmental configurations and proprietary database schemas',
    'Assessing regulatory compliance and data sovereignty constraints per jurisdiction',
    'Calculating realistic Total Cost of Ownership (TCO) across refactor versus rehost paths',
    'Establishing clear rollout waves to protect active daily business operations',
  ]

  return (
    <div className="perspective-page">
      <div className="perspective-wrap">
        <PerspectiveHero
          category={art.category || "CLOUD & MODERNIZATION"}
          title={art.title || "Modernizing Legacy Applications for the Cloud"}
          subtitle={art.subtitle || "Explore a practical approach to assessing, modernizing and moving legacy applications toward scalable, secure cloud architectures."}
          date="September 2026"
          readTime="6 min read"
          image="/img/perspectives/legacy-application-cloud-modernization.jpg"
          imageAlt="Cloud application modernization and container architecture"
          imageCaption={art.imageCaption || "Enterprise Technology Perspective — Cloud-Native Re-platforming & Containerization"}
        />

        {/* Section: The Legacy Challenge */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec1Eyebrow || "THE REALITY OF LEGACY SYSTEMS"}</span>
            <h2 className="p-heading">{art.sec1Heading || "The Legacy Challenge"}</h2>
            <p className="p-subtext">
              {art.sec1Subtext || "Aging monoliths constrain innovation velocity, increase operational vulnerabilities, and escalate infrastructure maintenance costs."}
            </p>
          </div>

          <div className="p-editorial-grid">
            <div className="p-editorial-text reveal">
              <p>
                {art.sec1P1 || "Mission-critical applications built a decade ago still drive billions in enterprise revenue, yet their architectural rigidities create growing operational risk."}
              </p>
              <p>
                {art.sec1P2 || "Every enterprise faces the tension between stability and modernization. Legacy systems were engineered for durability, and they have performed reliably for years. However, as business requirements accelerate, these aging architectures encounter structural limits:"}
              </p>
              <ul className="p-feature-list">
                {(art.sec1List || [
                  { bold: 'Aging software stacks:', text: ' Monolithic codebases built on deprecated frameworks with diminishing talent pools available for maintenance.' },
                  { bold: 'Difficult maintenance cycles:', text: ' Tightly coupled components where changing a single feature risks breaking unrelated operational modules.' },
                  { bold: 'Limited scalability:', text: ' Vertical scaling limits that require purchasing expensive proprietary hardware to handle seasonal traffic spikes.' },
                  { bold: 'Integration challenges:', text: ' Inability to interface smoothly with modern mobile apps, customer portals, or partner APIs without fragile batch scripts.' },
                  { bold: 'Infrastructure constraints:', text: ' Physical server room lifecycles, backup vulnerabilities, and high power/cooling operational expenditures.' }
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
                src={`${import.meta.env.BASE_URL}img/migration-modernization.jpg`}
                alt="Cloud modernization and server migration"
                className="p-editorial-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section: Understanding the Application Landscape */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec2Eyebrow || "ASSESSMENT & DISCOVERY"}</span>
            <h2 className="p-heading">{art.sec2Heading || "Understanding the Application Landscape"}</h2>
            <p className="p-subtext">
              {art.sec2Subtext || "Successful cloud modernization begins with rigorous assessment. Jumping directly into migration without auditing application dependencies is the primary cause of delayed cutovers."}
            </p>
          </div>

          <div className="p-editorial-grid p-reverse">
            <div className="p-editorial-text reveal">
              <p>
                {art.sec2P1 || "A pragmatic modernization journey begins by establishing total clarity across the existing estate:"}
              </p>
              <ul className="p-feature-list">
                {(art.sec2List || [
                  { bold: 'Applications:', text: ' Cataloging all active workloads, custom modules, background scripts, and historical third-party packages.' },
                  { bold: 'Dependencies:', text: ' Mapping complex runtime coupling, shared database tables, direct file system calls, and external service contracts.' },
                  { bold: 'Data:', text: ' Evaluating data structures, transactional integrity requirements, backup cadence, and regulatory sovereignty rules.' },
                  { bold: 'Infrastructure:', text: ' Auditing CPU, memory, storage utilization, and network throughput to right-size target cloud specifications.' },
                  { bold: 'Business criticality:', text: ' Categorizing applications into tiers to design safe, staged migration waves with clear fallback procedures.' }
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
                src={`${import.meta.env.BASE_URL}img/custom-dev-sec2.jpg`}
                alt="Application landscape and architecture assessment"
                className="p-editorial-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section: Modernization Approaches (4 Visual Cards) */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec3Eyebrow || "THE 4 MODERNIZATION PATHS"}</span>
            <h2 className="p-heading">{art.sec3Heading || "Modernization Approaches"}</h2>
            <p className="p-subtext">
              {art.sec3Subtext || "There is no one-size-fits-all migration strategy. Leading enterprises match the right modernization pattern to each specific workload based on business value, urgency, and technical debt."}
            </p>
          </div>

          <div className="p-card-grid-4">
            {(art.modernizationApproaches || modernizationApproaches).map((app, idx) => (
              <div className="p-feature-card reveal" key={idx}>
                <span className="p-card-number">{app.num}</span>
                <h3 className="p-card-title">{app.title}</h3>
                <p className="p-card-desc" style={{ marginBottom: '1rem' }}>{app.desc}</p>
                <div style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: '0.85rem',
                  marginTop: 'auto',
                  fontSize: '0.8rem',
                  color: 'var(--accent-ink, var(--primary-hover))',
                  lineHeight: '1.45',
                }}>
                  <strong>{art.modernizationApproachesAdvantageLabel || 'Advantage:'}</strong> {app.benefits}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Cloud Architecture */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec4Eyebrow || "TARGET TRANSFORMATION MODEL"}</span>
            <h2 className="p-heading">{art.sec4Heading || "Modern Cloud Architecture"}</h2>
            <p className="p-subtext">
              {art.sec4Subtext || "A structured roadmap that transforms legacy monoliths into elastic, secure, and maintainable cloud services."}
            </p>
          </div>

          <ArchitectureFlowDiagram
            badge={art.cloudArchitectureBadge || "Modernization Lifecycle"}
            title={art.cloudArchitectureTitle || "End-to-End Cloud Modernization Flow"}
            steps={art.cloudArchitectureFlow || cloudArchitectureFlow}
          />

          <div className="p-editorial-grid" style={{ marginTop: '2.5rem' }}>
            <div className="p-editorial-text reveal">
              <p>
                {art.sec4P1 || "The destination architecture decouples core applications into modular, containerized services hosted on elastic cloud platforms (such as Kubernetes or managed serverless runtimes)."}
              </p>
              <p>
                {art.sec4P2 || "By establishing automated CI/CD deployment pipelines, automated blue-green cutovers, and infrastructure as code, deployments transform from nerve-wracking weekend events into seamless daily routines."}
              </p>
              <p>
                {art.sec4P3 || "Elastic compute automatically scales up during demand surges and scales down during lulls, eliminating idle resource costs while guaranteeing sub-second response times for global users."}
              </p>
            </div>

            <div className="p-editorial-media reveal">
              <img
                src={`${import.meta.env.BASE_URL}img/build-scratch-architecture.jpg`}
                alt="Cloud architecture modernization"
                className="p-editorial-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section: Benefits */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec5Eyebrow || "TRANSFORMATION OUTCOMES"}</span>
            <h2 className="p-heading">{art.sec5Heading || "Key Modernization Benefits"}</h2>
            <p className="p-subtext">
              {art.sec5Subtext || "Moving legacy systems onto modern cloud architectures delivers tangible operational agility and cost predictability."}
            </p>
          </div>

          <BusinessImpactGrid outcomes={art.cloudModernizationBenefits || cloudModernizationBenefits} />
        </section>

        {/* Key Perspective */}
        <KeyPerspectiveBox
          eyebrow={art.keyPerspectiveEyebrow || "MODERNIZATION BEST PRACTICES"}
          title={art.keyPerspectiveTitle || "Four Pillars of a Successful Migration"}
          lead={art.keyPerspectiveLead || "Experience shows that modernization projects succeed when founded on comprehensive preparation, clear wave sequencing, and rigorous testing:"}
          points={art.landscapeAssessmentPoints || landscapeAssessmentPoints}
        />

        {/* CTA */}
        <PerspectiveCTA
          heading={art.ctaHeading || "Modernize Your Legacy Applications"}
          description={art.ctaDescription || "Explore a practical approach to assessing, modernizing and moving legacy applications toward scalable, secure cloud architectures."}
          buttonText={art.ctaButton || "Talk to Our Experts"}
          serviceContext="Legacy Modernization & Cloud Migration"
        />

        {/* Related Perspectives */}
        <RelatedPerspectives currentId="cloud-modernization" />
      </div>
    </div>
  )
}
