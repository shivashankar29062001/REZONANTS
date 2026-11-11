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

export default function ArtificialIntelligencePerspective() {
  const { t } = useTranslation()
  const art = t('perspectivesArticles.artificialIntelligence', { returnObjects: true }) || {}

  useDocumentMeta({
    title: art.title ? `${art.title} | Perspectives | Rezonants` : 'How AI Is Reshaping Enterprise Applications | Perspectives | Rezonants',
    description:
      art.subtitle || 'Explore how intelligent automation, AI copilots and predictive intelligence are becoming part of the enterprise applications businesses rely on every day.',
    keywords:
      'enterprise AI, artificial intelligence, intelligent automation, AI copilots, predictive intelligence, enterprise applications',
  })

  usePerspectiveScrollReveal()

  // 6 AI Copilot Capabilities
  const copilotCards = [
    {
      icon: '🔍',
      title: 'Information Search',
      desc: 'Semantic retrieval across distributed knowledge bases, intranet policies, product specifications, and historical ticket resolutions without keyword guessing.',
    },
    {
      icon: '📝',
      title: 'Document Summarization',
      desc: 'Instant distillation of lengthy RFPs, vendor agreements, technical specifications, and legal amendments into actionable executive briefs and risk checklists.',
    },
    {
      icon: '✨',
      title: 'Content Generation',
      desc: 'Assisted drafting of client proposals, operational documentation, standard operating procedures (SOPs), and standardized customer updates aligned with brand standards.',
    },
    {
      icon: '📈',
      title: 'Data Analysis',
      desc: 'Translating conversational inquiries into complex analytical queries, generating on-the-fly chart summaries and highlighting critical outliers for leadership.',
    },
    {
      icon: '🔄',
      title: 'Business Workflows',
      desc: 'Initiating transactions directly from chat prompts—such as scheduling resources, creating tickets, updating records, or submitting purchase requisitions.',
    },
    {
      icon: '🛡️',
      title: 'Role-Grounded Access',
      desc: 'Ensuring copilot responses strictly respect user permission levels, keeping confidential financials, HR files, and intellectual property protected.',
    },
  ]

  // Enterprise AI Use Cases
  const aiUseCases = [
    {
      icon: '⚙️',
      title: 'Supply Chain Optimization',
      desc: 'Dynamic inventory replenishment models that factor in supplier lead times, weather disruptions, and demand velocity.',
    },
    {
      icon: '👥',
      title: 'Customer Service Intelligence',
      desc: 'Context-aware virtual agents that resolve complex customer requests and route nuanced cases with full conversation summaries.',
    },
    {
      icon: '💳',
      title: 'Financial Process Automation',
      desc: 'Intelligent invoice matching, expense categorization, and early fraud anomaly detection across high-volume transaction feeds.',
    },
    {
      icon: '📊',
      title: 'Sales & Revenue Intelligence',
      desc: 'Opportunity scoring, deal velocity forecasting, and actionable next-best-step recommendations for enterprise account executives.',
    },
    {
      icon: '📋',
      title: 'Document Lifecycle Management',
      desc: 'Automated contract risk scoring, regulatory compliance cross-checks, and entity extraction across enterprise repositories.',
    },
    {
      icon: '🔬',
      title: 'IT & DevOps Automation',
      desc: 'Automated root cause analysis on application logs, self-healing cluster incident resolution, and continuous vulnerability triage.',
    },
  ]

  // Business Impact / Qualitative Benefits
  const aiBusinessBenefits = [
    'Faster operational decisions driven by real-time predictive models',
    'Reduction in repetitive data processing and manual reconciliations',
    'Higher employee throughput with contextual copilot assistance',
    'Improved customer satisfaction through hyper-personalized experiences',
    'Continuous process self-optimization based on real telemetry',
    'De-risked compliance tracking via automated audit-log inspection',
  ]

  // Governance points
  const governancePoints = [
    'Strict role-based access ensuring AI models never leak sensitive data',
    'Transparent reasoning traces allowing human review on high-value actions',
    'Continuous model evaluation to guard against hallucination and bias',
    'Strict data provenance standards aligning with GDPR, SOC 2, and HIPAA',
    'Human-in-the-loop escalation paths for uncertain edge conditions',
  ]

  return (
    <div className="perspective-page">
      <div className="perspective-wrap">
        <PerspectiveHero
          category={art.category || "ARTIFICIAL INTELLIGENCE"}
          title={art.title || "How AI Is Reshaping Enterprise Applications"}
          subtitle={art.subtitle || "Explore how intelligent automation, AI copilots and predictive intelligence are becoming part of the enterprise applications businesses rely on every day."}
          date="September 2026"
          readTime="6 min read"
          image="/img/perspectives/ai-reshaping-enterprise-applications.jpg"
          imageAlt="AI Reshaping Enterprise Applications"
          imageCaption={art.imageCaption || "Enterprise Technology Perspective — Artificial Intelligence & Enterprise Systems"}
        />

        {/* Section: AI in Enterprise Applications */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec1Eyebrow || "THE SHIFT TO NATIVE INTELLIGENCE"}</span>
            <h2 className="p-heading">{art.sec1Heading || "AI in Enterprise Applications"}</h2>
            <p className="p-subtext">
              {art.sec1Subtext || "Artificial intelligence is transitioning from experimental side-projects into the core operational applications that enterprises rely on every day."}
            </p>
          </div>

          <div className="p-editorial-grid">
            <div className="p-editorial-text reveal">
              <p>
                {art.sec1P1 || "For years, enterprise artificial intelligence was treated as an external capability: a model trained in isolation, a sandbox demonstration, or an isolated chatbot accessible through a separate portal. Today, the paradigm has fundamentally shifted. High-impact enterprise AI is embedded directly inside the systems of record—the ERPs, CRMs, human capital platforms, and supply chain engines where real business occurs."}
              </p>
              <p>
                {art.sec1P2 || "When intelligence operates inside the system of record, it inherits the organization’s established security boundaries, data models, and business logic. It does not simply generate generic responses; it acts on live orders, interprets open support tickets, reconciles supplier invoices, and assists employees within the exact interfaces they navigate every day."}
              </p>
              <p>
                {art.sec1P3 || "This transformation moves enterprise software from passive databases that wait for human keystrokes into proactive platforms that anticipate needs, automate steps, and surface timely recommendations."}
              </p>
            </div>

            <div className="p-editorial-media reveal">
              <img
                src={`${import.meta.env.BASE_URL}img/bpa-workflow-orchestration.jpg`}
                alt="AI orchestration inside enterprise applications"
                className="p-editorial-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section: Intelligent Automation */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec2Eyebrow || "AUTOMATION AT SCALE"}</span>
            <h2 className="p-heading">{art.sec2Heading || "Intelligent Automation"}</h2>
            <p className="p-subtext">
              {art.sec2Subtext || "Moving beyond traditional rule-based scripts toward cognitive workflows that understand unstructured content, adapt to variations, and optimize processes dynamically."}
            </p>
          </div>

          <div className="p-editorial-grid p-reverse">
            <div className="p-editorial-text reveal">
              <p>
                {art.sec2P1 || "Traditional Robotic Process Automation (RPA) excelled at deterministic, repetitive screen scraping. However, rigid rule sets break whenever a form changes, an unexpected document layout arrives, or an exception occurs. Intelligent automation bridges this divide by combining cognitive reasoning with transactional execution:"}
              </p>
              <ul className="p-feature-list">
                {(art.sec2List || [
                  { bold: 'Workflow automation:', text: ' Orchestrating complex cross-departmental operations, routing tasks based on urgency and historical resolution paths.' },
                  { bold: 'Intelligent document processing:', text: ' Ingesting unstructured PDFs, emails, shipping manifests, and contracts, converting them into structured database transactions.' },
                  { bold: 'Intelligent task automation:', text: ' Automating multi-step operational validations—such as matching purchase orders against receipts and bank statements.' },
                  { bold: 'Process optimization:', text: ' Continuously analyzing process logs to identify cycle-time bottlenecks and recommending targeted workflow refinements.' }
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
                src={`${import.meta.env.BASE_URL}img/poc-pilot-implementation.jpg`}
                alt="Intelligent workflow orchestration"
                className="p-editorial-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section: AI Copilots */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec3Eyebrow || "EMBEDDED ASSISTANCE"}</span>
            <h2 className="p-heading">{art.sec3Heading || "Enterprise AI Copilots"}</h2>
            <p className="p-subtext">
              {art.sec3Subtext || "Grounded in organizational knowledge and enterprise security, AI assistants act as specialized partners across daily business workflows."}
            </p>
          </div>

          <div className="p-card-grid-3">
            {(art.copilotCards || copilotCards).map((card, idx) => (
              <div className="p-feature-card reveal" key={idx}>
                <div className="p-card-icon-box">{card.icon}</div>
                <h3 className="p-card-title">{card.title}</h3>
                <p className="p-card-desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Predictive Intelligence */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec4Eyebrow || "FORWARD-LOOKING REASONING"}</span>
            <h2 className="p-heading">{art.sec4Heading || "Predictive Intelligence"}</h2>
            <p className="p-subtext">
              {art.sec4Subtext || "Transforming historical enterprise logs and real-time operational feeds into actionable foresight."}
            </p>
          </div>

          <div className="p-editorial-grid">
            <div className="p-editorial-text reveal">
              <p>
                {art.sec4P1 || "While generative models excel at understanding and synthesizing language, predictive intelligence focuses on mathematical patterns hidden within structured enterprise datasets. Embedded predictive models empower organizations to anticipate operational hurdles before they disrupt operations:"}
              </p>
              <ul className="p-feature-list">
                {(art.sec4List || [
                  { bold: 'Operational forecasting:', text: ' Predicting revenue trends, inventory velocity, and resource demands by synthesizing seasonal indicators with real-time pipeline velocity.' },
                  { bold: 'Predictive analytics:', text: ' Pinpointing customer churn risks, maintenance degradation cycles, and supply chain delays while there is still time to intervene.' },
                  { bold: 'Risk identification:', text: ' Flagging anomalies in financial transactions, compliance logs, and vendor procurement patterns before they escalate.' },
                  { bold: 'Demand prediction:', text: ' Harmonizing sales forecasts with manufacturing capacity and warehouse stock levels to protect working capital.' }
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
                src={`${import.meta.env.BASE_URL}img/custom-dev-sec3.jpg`}
                alt="Predictive intelligence in business software"
                className="p-editorial-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section: Enterprise AI Use Cases */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec5Eyebrow || "REAL-WORLD APPLICATIONS"}</span>
            <h2 className="p-heading">{art.sec5Heading || "Enterprise AI Use Cases"}</h2>
            <p className="p-subtext">
              {art.sec5Subtext || "Practical ways leading organizations are applying artificial intelligence across core business functions."}
            </p>
          </div>

          <div className="p-card-grid-3">
            {(art.aiUseCases || aiUseCases).map((uc, idx) => (
              <div className="p-feature-card reveal" key={idx}>
                <div className="p-card-icon-box">{uc.icon}</div>
                <h3 className="p-card-title">{uc.title}</h3>
                <p className="p-card-desc">{uc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Business Benefits */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec6Eyebrow || "STRATEGIC VALUE"}</span>
            <h2 className="p-heading">{art.sec6Heading || "Business Benefits"}</h2>
            <p className="p-subtext">
              {art.sec6Subtext || "When implemented thoughtfully with governed enterprise data, AI unlocks substantial qualitative advantages."}
            </p>
          </div>

          <BusinessImpactGrid outcomes={art.aiBusinessBenefits || aiBusinessBenefits} />
        </section>

        {/* Key Perspective / Governance */}
        <KeyPerspectiveBox
          eyebrow={art.keyPerspectiveEyebrow || "ENTERPRISE GOVERNANCE"}
          title={art.keyPerspectiveTitle || "Trust, Oversight & Guardrails"}
          lead={art.keyPerspectiveLead || "AI is only as dependable as the data foundation beneath it and the governance surrounding it. Sustainable enterprise adoption requires deliberate architectural discipline:"}
          points={art.governancePoints || governancePoints}
        />

        {/* CTA */}
        <PerspectiveCTA
          heading={art.ctaHeading || "Explore AI Opportunities for Your Business"}
          description={art.ctaDescription || "Discover how intelligent automation, enterprise copilots and predictive models can unlock operational efficiency across your core systems."}
          buttonText={art.ctaButton || "Talk to Our Experts"}
          serviceContext="Enterprise AI & Automation Solutions"
        />

        {/* Related Perspectives */}
        <RelatedPerspectives currentId="artificial-intelligence" />
      </div>
    </div>
  )
}
