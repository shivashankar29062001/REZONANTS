import { ServicePageTemplate } from './ServicePageTemplate'

export default function MigrationServicesPage() {
  return (
    <ServicePageTemplate
      title="Migration Services"
      description="Move applications, data, and infrastructure to modern platforms with zero-downtime migrations, automated validation, and rollback safety nets."
      features={[
        'Cloud migration (lift-and-shift, re-platform, refactor)',
        'Database migration & modernization',
        'Mainframe & legacy system migration',
        'Data center exit & colocation migration',
        'Kubernetes & container platform migration',
        'SaaS & ISV platform migration',
        'Automated testing & validation',
        'Cutover planning & execution',
      ]}
      benefits={[
        'Zero-downtime migration patterns',
        'Automated data validation & reconciliation',
        'Rollback plans for every migration wave',
        'Pre-migration assessment & TCO modeling',
        'Compliance & security preserved',
        'Application modernization optionality',
        'Post-migration optimization included',
        'Reference architectures & runbooks delivered',
      ]}
      technologies={[
        'AWS Migration Hub', 'Azure Migrate', 'Google Cloud Migrate',
        'AWS DMS', 'Azure Database Migration', 'Striim', 'Qlik Replicate',
        'Velero', 'KubeCost', 'Konveyor', 'MTC (Migration Toolkit for Containers)',
        'Terraform', 'Ansible', 'Packer', 'CloudEndure', 'Cloudamize'
      ]}
      caseStudies={[
        {
          title: 'Mainframe to Cloud Migration',
          category: 'Mainframe Modernization',
          description: 'Migrated core banking from mainframe to AWS with 99.99% data fidelity.',
          image: `${import.meta.env.BASE_URL}img/case-mainframe.jpg`,
          link: '#'
        },
        {
          title: 'Multi-Region Kubernetes Migration',
          category: 'Platform Migration',
          description: 'Migrated 150 microservices to EKS across 3 regions with zero downtime.',
          image: `${import.meta.env.BASE_URL}img/case-k8s-migration.jpg`,
          link: '#'
        },
        {
          title: 'Data Warehouse Modernization',
          category: 'Data Migration',
          description: 'Migrated 50TB Teradata to Snowflake with automated SQL translation.',
          image: `${import.meta.env.BASE_URL}img/case-dw.jpg`,
          link: '#'
        }
      ]}
      ctaText="Plan your migration"
    />
  )
}