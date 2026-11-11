import { ServicePageTemplate } from './ServicePageTemplate'

export default function CenterOfExcellencePage() {
  return (
    <ServicePageTemplate
      title="Center of Excellence (CoE)"
      description="Establish a sustainable, scalable engineering Center of Excellence with our proven framework — governance, talent, tooling, and continuous improvement built in."
      features={[
        'CoE strategy, charter & governance model',
        'Talent acquisition & competency framework',
        'Engineering standards & architecture guidelines',
        'Toolchain selection & platform engineering',
        'Agile transformation & delivery excellence',
        'Quality engineering & test automation',
        'Knowledge management & inner sourcing',
        'Metrics, OKRs & continuous improvement',
      ]}
      benefits={[
        'Accelerate delivery velocity by 2-3x',
        'Standardize quality across all teams',
        'Build internal capability, reduce vendor lock-in',
        'Attract & retain top engineering talent',
        'Governance without bureaucracy',
        'Reusable components & platform services',
        'Measurable ROI with quarterly business reviews',
        'Executive sponsorship & stakeholder alignment',
      ]}
      technologies={[
        'Jira', 'Confluence', 'GitLab', 'GitHub Enterprise', 'Azure DevOps',
        'SonarQube', 'Cypress', 'Playwright', 'k6', 'Grafana', 'Prometheus',
        'ArgoCD', 'Flux', 'Backstage', 'TechDocs', 'ArchUnit', 'Dependabot'
      ]}
      caseStudies={[
        {
          title: 'FinTech CoE for Global Bank',
          category: 'Financial Services',
          description: 'Established a 150-person CoE delivering 50+ microservices with 99.9% uptime.',
          image: `${import.meta.env.BASE_URL}img/case-fintech-coe.jpg`,
          link: '#'
        },
        {
          title: 'Retail Platform CoE',
          category: 'E-commerce',
          description: 'Built internal platform serving 20+ product teams with shared services and standards.',
          image: `${import.meta.env.BASE_URL}img/case-retail-coe.jpg`,
          link: '#'
        },
        {
          title: 'Healthcare CoE Transformation',
          category: 'Healthcare',
          description: 'Modernized legacy CoE to cloud-native, reducing deployment time from weeks to hours.',
          image: `${import.meta.env.BASE_URL}img/case-healthcare-coe.jpg`,
          link: '#'
        }
      ]}
      ctaText="Build your CoE"
    />
  )
}