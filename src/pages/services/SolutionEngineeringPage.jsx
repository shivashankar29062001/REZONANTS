import { ServicePageTemplate } from './ServicePageTemplate'

export default function SolutionEngineeringPage() {
  return (
    <ServicePageTemplate
      title="Solution Engineering"
      description="Bridge the gap between business vision and technical execution. Our solution engineers architect the right system, choose the right tech, and de-risk delivery from day one."
      features={[
        'Solution architecture & technical design',
        'Technology evaluation & vendor selection',
        'Proof of concepts & spike investigations',
        'Technical due diligence & risk assessment',
        'Migration strategy & execution planning',
        'Performance engineering & capacity planning',
        'Security architecture & threat modeling',
        'Cost optimization & cloud economics',
      ]}
      benefits={[
        'Avoid costly architectural mistakes early',
        'Vendor-neutral technology recommendations',
        'Production-ready designs, not diagrams',
        'Hands-on engineers, not slide-ware architects',
        'Clear migration paths with rollback plans',
        'Non-functional requirements baked in',
        'Executive-ready documentation & decisions',
        'Ongoing advisory through delivery',
      ]}
      technologies={[
        'AWS', 'Azure', 'GCP', 'Kubernetes', 'Istio', 'Envoy',
        'Kafka', 'RabbitMQ', 'Redis', 'Cassandra', 'Elasticsearch',
        'OpenTelemetry', 'Jaeger', 'Prometheus', 'Grafana',
        'Terraform', 'Pulumi', 'Crossplane', 'Helm', 'Kustomize'
      ]}
      caseStudies={[
        {
          title: 'Multi-Cloud Migration Strategy',
          category: 'Cloud Migration',
          description: 'Architected phased migration of 200+ workloads from on-prem to AWS/Azure hybrid.',
          image: `${import.meta.env.BASE_URL}img/case-multicloud.jpg`,
          link: '#'
        },
        {
          title: 'Real-time Analytics Platform',
          category: 'Data Engineering',
          description: 'Designed streaming platform processing 10M events/sec for fraud detection.',
          image: `${import.meta.env.BASE_URL}img/case-streaming.jpg`,
          link: '#'
        },
        {
          title: 'Legacy Modernization Assessment',
          category: 'Modernization',
          description: 'Technical due diligence on 15-year-old codebase, delivered phased rewrite plan.',
          image: `${import.meta.env.BASE_URL}img/case-legacy.jpg`,
          link: '#'
        }
      ]}
      ctaText="Architect your solution"
    />
  )
}