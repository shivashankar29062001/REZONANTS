import { ServicePageTemplate } from './ServicePageTemplate'

export default function DigitalTransformationPage() {
  return (
    <ServicePageTemplate
      title="Digital Transformation"
      description="Modernize your technology, processes, and culture to compete in a digital-first world. We partner with leadership to execute transformation that delivers measurable business outcomes."
      features={[
        'Digital strategy & roadmap development',
        'Legacy application modernization',
        'Cloud adoption & migration programs',
        'Data platform & analytics enablement',
        'Customer experience (CX) redesign',
        'DevOps & platform engineering',
        'Organizational change management',
        'Innovation labs & pilot programs',
      ]}
      benefits={[
        'CEO/CTO-level partnership, not just delivery',
        'Outcome-focused, not activity-focused',
        'Phased approach with quick wins',
        'Risk mitigation at every step',
        'Cultural transformation, not just tech',
        'Measurable KPIs tied to business value',
        'Sustainable operating model post-engagement',
        'Access to our partner ecosystem',
      ]}
      technologies={[
        'AWS', 'Azure', 'GCP', 'Kubernetes', 'Service Mesh', 'Serverless',
        'Snowflake', 'Databricks', 'dbt', 'Airflow', 'Great Expectations',
        'Segment', 'RudderStack', 'Amplitude', 'Mixpanel', 'LaunchDarkly',
        'GitOps', 'ArgoCD', 'Flux', 'Backstage', 'Feature Flags'
      ]}
      caseStudies={[
        {
          title: 'Insurance Core Modernization',
          category: 'Insurance',
          description: 'Transformed 40-year-old policy admin system to cloud-native, reducing quote time 80%.',
          image: `${import.meta.env.BASE_URL}img/case-insurance.jpg`,
          link: '#'
        },
        {
          title: 'Retail Omnichannel Platform',
          category: 'Retail',
          description: 'Unified e-commerce, POS, and inventory into single platform for 500+ stores.',
          image: `${import.meta.env.BASE_URL}img/case-retail.jpg`,
          link: '#'
        },
        {
          title: 'Manufacturing Data Platform',
          category: 'Manufacturing',
          description: 'Built IoT data lake enabling predictive maintenance across 12 factories.',
          image: `${import.meta.env.BASE_URL}img/case-manufacturing.jpg`,
          link: '#'
        }
      ]}
      ctaText="Transform your business"
    />
  )
}