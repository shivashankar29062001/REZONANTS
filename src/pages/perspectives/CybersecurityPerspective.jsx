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

export default function CybersecurityPerspective() {
  const { t } = useTranslation()
  const art = t('perspectivesArticles.cybersecurity', { returnObjects: true }) || {}

  useDocumentMeta({
    title: art.title ? `${art.title} | Perspectives | Rezonants` : 'Building Cyber Resilience in a Connected Enterprise | Perspectives | Rezonants',
    description:
      art.subtitle || 'Explore how organizations can strengthen security, protect critical systems and prepare for threats across increasingly connected environments.',
    keywords:
      'cybersecurity, cyber resilience, zero trust, identity and access management, cloud security, threat detection, incident response',
  })

  usePerspectiveScrollReveal()

  // 4 Threat Protection Dimensions
  const threatCards = [
    {
      icon: '🛡️',
      title: 'Threat Detection',
      desc: 'Machine learning-assisted threat intelligence that monitors anomalous network patterns, credential abuse, and zero-day vulnerabilities in real time.',
    },
    {
      icon: '📡',
      title: 'Security Monitoring',
      desc: 'Centralized Security Operations Center (SOC) telemetry correlating events across servers, container clusters, identity providers, and endpoints.',
    },
    {
      icon: '🔍',
      title: 'Vulnerability Management',
      desc: 'Continuous automated vulnerability scanning across infrastructure, source code repositories, and container registries to remediate weaknesses proactively.',
    },
    {
      icon: '🔒',
      title: 'Data Protection',
      desc: 'Robust encryption in transit (TLS 1.3) and at rest (AES-256), alongside granular data loss prevention (DLP) governance to prevent intellectual property leaks.',
    },
  ]

  // Cloud security considerations
  const cloudSecurityCards = [
    {
      title: 'Shared Responsibility',
      desc: "Clear governance distinguishing the cloud provider's physical infrastructure security from the enterprise's responsibility for data encryption, IAM policies, and application code.",
    },
    {
      title: 'Infrastructure as Code (IaC)',
      desc: 'Immutable, auditable cloud configurations managed through code. Automated policy-as-code scanners block misconfigurations and exposed buckets before deployment.',
    },
    {
      title: 'Container & Kubernetes Security',
      desc: 'Hardened container runtimes, signed image registries, network micro-segmentation, and automated secret management that keeps credentials out of source repositories.',
    },
  ]

  // 4 Incident Readiness Phases
  const incidentReadinessPhases = [
    {
      icon: '👁️',
      title: 'Telemetry & Anomaly Detection',
      desc: 'Early warning indicators that flag lateral movement, suspicious privilege escalations, and unusual outbound data transfers within minutes.',
    },
    {
      icon: '⚡',
      title: 'Automated Containment',
      desc: 'Pre-scripted quarantine playbooks that isolate compromised credentials, revoke session tokens, and sever network pathways without shutting down core operations.',
    },
    {
      icon: '🛠️',
      title: 'Forensic Investigation & Remediation',
      desc: 'Auditable timeline analysis determining patient-zero infection vectors, closing structural vulnerabilities, and verifying systemic hygiene.',
    },
    {
      icon: '🔄',
      title: 'Resilient Recovery & Business Continuity',
      desc: 'Rapid restoration of clean services from immutable, air-gapped backups alongside transparent communications with regulatory authorities.',
    },
  ]

  // Business Impact / Qualitative Benefits
  const cyberBusinessBenefits = [
    'Protected enterprise brand reputation and enduring customer trust',
    'Uninterrupted business continuity during targeted security incidents',
    'Strict compliance alignment with ISO 27001, SOC 2, HIPAA, and GDPR',
    'Guaranteed confidentiality for sensitive customer and IP records',
    'Lower cybersecurity insurance premiums through validated resilience controls',
    'Accelerated sales cycles by satisfying stringent enterprise vendor security reviews',
  ]

  const zeroTrustPrinciples = [
    'Explicit Verification: Always authenticate and authorize based on all available data points, including user identity, location, device health, and service context.',
    'Least Privilege Access: Limit user access with Just-In-Time (JIT) and Just-Enough-Access (JEA) policies, adaptive risk-based challenges, and data protection rules.',
    'Assume Breach: Minimize blast radius and segment access. Verify end-to-end encryption and utilize analytics to gain visibility and improve threat defenses.',
  ]

  return (
    <div className="perspective-page">
      <div className="perspective-wrap">
        <PerspectiveHero
          category={art.category || "CYBERSECURITY"}
          title={art.title || "Building Cyber Resilience in a Connected Enterprise"}
          subtitle={art.subtitle || "Explore how organizations can strengthen security, protect critical systems and prepare for threats across increasingly connected environments."}
          date="September 2026"
          readTime="8 min read"
          image="/img/perspectives/cyber-resilience-connected-enterprise.jpg"
          imageAlt="Building cyber resilience across connected enterprise networks"
          imageCaption={art.imageCaption || "Enterprise Technology Perspective — Threat Defense & Zero-Trust Architecture"}
        />

        {/* Section: The Connected Security Landscape */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec1Eyebrow || "THE EXPANDING PERIMETER"}</span>
            <h2 className="p-heading">{art.sec1Heading || "The Connected Enterprise Security Landscape"}</h2>
            <p className="p-subtext">
              {art.sec1Subtext || "As modern organizations connect more applications, cloud environments, remote employees, mobile devices, and third-party partners, the traditional security perimeter ceases to exist."}
            </p>
          </div>

          <div className="p-editorial-grid">
            <div className="p-editorial-text reveal">
              <p>
                {art.sec1P1 || "In the legacy era of enterprise IT, security operated on a castle-and-moat doctrine: everything inside the corporate office network was presumed trusted, while everything outside was considered untrusted. A single corporate firewall protected internal servers, databases, and desktop computers."}
              </p>
              <p>
                {art.sec1P2 || "Today’s enterprise has outgrown physical walls. Workloads reside across multi-cloud environments (AWS, Azure, GCP), employees access business applications from diverse locations, and APIs continuously exchange sensitive operational data with external logistics providers, financial institutions, and SaaS vendors."}
              </p>
              <p>
                {art.sec1P3 || "While this hyper-connectivity drives tremendous business agility, it vastly expands the enterprise attack surface. Every API endpoint, identity token, connected mobile device, and SaaS integration represents a potential vector of exposure. True enterprise protection requires shifting from perimeter-based defense to proactive, end-to-end cyber resilience."}
              </p>
            </div>

            <div className="p-editorial-media reveal">
              <img
                src={`${import.meta.env.BASE_URL}img/cloud-integration-sec.jpg`}
                alt="Connected enterprise cloud security network"
                className="p-editorial-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section: Threat Protection */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec2Eyebrow || "COMPREHENSIVE DEFENSE"}</span>
            <h2 className="p-heading">{art.sec2Heading || "Multi-Layered Threat Protection"}</h2>
            <p className="p-subtext">
              {art.sec2Subtext || "Proactive defenses that safeguard critical infrastructure, sensitive corporate data, and operational systems."}
            </p>
          </div>

          <div className="p-card-grid-4">
            {(art.sec2Cards || threatCards).map((c, idx) => (
              <div className="p-feature-card reveal" key={idx}>
                <div className="p-card-icon-box">{c.icon}</div>
                <h3 className="p-card-title">{c.title}</h3>
                <p className="p-card-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Identity & Access */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec3Eyebrow || "THE NEW SECURITY BORDER"}</span>
            <h2 className="p-heading">{art.sec3Heading || "Identity & Access Management (IAM)"}</h2>
            <p className="p-subtext">
              {art.sec3Subtext || "Identity is the foundational control plane of modern security. Nearly all serious security breaches begin with compromised credentials rather than software exploits."}
            </p>
          </div>

          <div className="p-editorial-grid p-reverse">
            <div className="p-editorial-text reveal">
              <p>
                {art.sec3P1 || "Protecting enterprise assets requires ensuring that every identity—whether a human executive, an external contractor, or an autonomous software service account—has validated authorization for the exact resources it accesses."}
              </p>
              <ul className="p-feature-list">
                {(art.sec3List || [
                  { bold: 'Centralized identity management:', text: ' Single Sign-On (SSO) and federated identity standards that eliminate fragmented password stores across applications.' },
                  { bold: 'Adaptive multi-factor authentication (MFA):', text: ' Phishing-resistant FIDO2 hardware keys and risk-based contextual challenges for sensitive administrative functions.' },
                  { bold: 'Granular access control:', text: ' Fine-grained Role-Based (RBAC) and Attribute-Based (ABAC) access controls enforced at the API and database levels.' },
                  { bold: 'Least-privilege principles:', text: ' Granting temporary, just-in-time (JIT) access that expires automatically when administrative tasks conclude.' }
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
                src={`${import.meta.env.BASE_URL}img/devops-automation-sec.jpg`}
                alt="Identity and access management controls"
                className="p-editorial-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Section: Zero Trust Architecture */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec4Eyebrow || "ARCHITECTURAL PARADIGM"}</span>
            <h2 className="p-heading">{art.sec4Heading || "Demystifying Zero Trust Architecture"}</h2>
            <p className="p-subtext">
              {art.sec4Subtext || "Zero Trust is not a single product or tool. It is an architectural strategy based on a straightforward principle: trust no entity inside or outside the network by default."}
            </p>
          </div>

          <KeyPerspectiveBox
            eyebrow={art.keyPerspectiveEyebrow || "ZERO TRUST CORE DOCTRINE"}
            title={art.keyPerspectiveTitle || "Continuous Verification Over Blind Trust"}
            lead={art.keyPerspectiveLead || "In a Zero Trust architecture, implicit trust based on network location is entirely dismantled. Every transaction, database query, and user login must continuously prove its legitimacy:"}
            points={art.zeroTrustPrinciples || zeroTrustPrinciples}
          />
        </section>

        {/* Section: Cloud Security */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec5Eyebrow || "INFRASTRUCTURE GOVERNANCE"}</span>
            <h2 className="p-heading">{art.sec5Heading || "Cloud Security Considerations"}</h2>
            <p className="p-subtext">
              {art.sec5Subtext || "Safeguarding workloads across public cloud, hybrid architectures, and distributed container environments."}
            </p>
          </div>

          <div className="p-card-grid-3">
            {(art.cloudSecurityCards || cloudSecurityCards).map((c, idx) => (
              <div className="p-feature-card reveal" key={idx}>
                <h3 className="p-card-title">{c.title}</h3>
                <p className="p-card-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Incident Readiness */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec6Eyebrow || "OPERATIONAL RESILIENCE"}</span>
            <h2 className="p-heading">{art.sec6Heading || "Incident Readiness: Beyond Prevention"}</h2>
            <p className="p-subtext">
              {art.sec6Subtext || "True cyber resilience accepts that incidents may occur. Preparedness focuses on rapid containment, minimal business disruption, and verified recovery."}
            </p>
          </div>

          <div className="p-card-grid-4">
            {(art.incidentReadinessPhases || incidentReadinessPhases).map((phase, idx) => (
              <div className="p-feature-card reveal" key={idx}>
                <div className="p-card-icon-box">{phase.icon}</div>
                <h3 className="p-card-title">{phase.title}</h3>
                <p className="p-card-desc">{phase.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Business Benefits */}
        <section className="perspective-section">
          <div className="p-section-header reveal">
            <span className="p-eyebrow">{art.sec7Eyebrow || "STRATEGIC VALUE"}</span>
            <h2 className="p-heading">{art.sec7Heading || "Business Benefits"}</h2>
            <p className="p-subtext">
              {art.sec7Subtext || "Building a cyber-resilient enterprise protects organizational value, regulatory standing, and market reputation."}
            </p>
          </div>

          <BusinessImpactGrid outcomes={art.cyberBusinessBenefits || cyberBusinessBenefits} />
        </section>

        {/* CTA */}
        <PerspectiveCTA
          heading={art.ctaHeading || "Strengthen Your Enterprise Security"}
          description={art.ctaDescription || "Explore how organizations can strengthen security, protect critical systems and prepare for threats across increasingly connected environments."}
          buttonText={art.ctaButton || "Talk to Our Experts"}
          serviceContext="Enterprise Cybersecurity & Cyber Resilience"
        />

        {/* Related Perspectives */}
        <RelatedPerspectives currentId="cybersecurity" />
      </div>
    </div>
  )
}
