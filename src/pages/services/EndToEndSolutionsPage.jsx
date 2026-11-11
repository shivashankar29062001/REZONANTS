import { ServicePageTemplate } from './ServicePageTemplate'

export default function EndToEndSolutionsPage() {
  return (
    <ServicePageTemplate
      title="End-to-End Solutions"
      description="One partner for the full lifecycle — strategy, design, development, deployment, and managed operations. We own outcomes, not just deliverables."
      features={[
        'Product discovery & strategy workshops',
        'UX/UI design & rapid prototyping',
        'Full-stack development & QA',
        'Cloud infrastructure & DevOps',
        'Security hardening & compliance',
        'Go-to-market & launch support',
        '24/7 managed operations & support',
        'Continuous enhancement & evolution',
      ]}
      benefits={[
        'Single point of accountability',
        'No handoff gaps between phases',
        'Predictable pricing models',
        'Faster time-to-market',
        'Shared risk & aligned incentives',
        'Institutional knowledge retained',
        'Scalable team model as you grow',
        'Strategic partner, not vendor',
      ]}
      technologies={[
        'Figma', 'Storybook', 'Chromatic', 'Vercel', 'Netlify', 'AWS Amplify',
        'GitHub Actions', 'GitLab CI', 'CircleCI', 'Terraform', 'Pulumi',
        'Datadog', 'New Relic', 'Sentry', 'PagerDuty', 'Opsgenie',
        'LaunchDarkly', 'Flagsmit', 'PostHog', 'Amplitude'
      ]}
      caseStudies={[
        {
          title: 'FinTech Product Build & Run',
          category: 'FinTech',
          description: 'End-to-end build of digital lending platform — from discovery to 24/7 operations.',
          image: `${import.meta.env.BASE_URL}img/case-fintech-e2e.jpg`,
          link: '#'
        },
        {
          title: 'Healthcare Platform Lifecycle',
          category: 'Healthcare',
          description: 'Designed, built, and operate patient engagement platform serving 2M+ users.',
          image: `${import.meta.env.BASE_URL}img/case-healthcare-e2e.jpg`,
          link: '#'
        },
        {
          title: 'EdTech Product Evolution',
          category: 'EdTech',
          description: '3-year partnership evolving MVP to market-leading platform with 500k learners.',
          image: `${import.meta.env.BASE_URL}img/case-edtech.jpg`,
          link: '#'
        }
      ]}
      ctaText="Partner for the full lifecycle"
    />
  )
}