import { ServicePageTemplate } from './ServicePageTemplate'

export default function PilotPrototypingPage() {
  return (
    <ServicePageTemplate
      title="Pilot & Prototyping"
      tagline="Solution Engineering & Custom Development"
      description="Validate before you build at scale — the confident path from idea to proven concept. We turn raw concepts into functional, testable prototypes and pilot systems so you can validate business logic, user experience, and technical feasibility."
      sectionHeadline="From idea to validated concept"
      sectionDescription="Turning an idea into a successful solution requires more than simply building it. Our Pilot & Prototyping service helps businesses evaluate concepts, test assumptions, and understand what works before committing to full-scale development. We work with you to define key objectives, identify potential challenges, and create focused prototypes or pilot solutions that bring your idea closer to reality."
      featuresTitle="From concept to a validated solution"
      features={[
        'Scope definition & design prototyping',
        'Rapid prototyping (2-6 week sprints)',
        'Proof of Concept (PoC) development',
        'Minimum Viable Product (MVP) delivery',
        'User feedback collection & iteration',
        'Technical feasibility investigations',
        'Pilot program design & execution',
        'Go/No-go criteria & handoff package',
      ]}
      benefits={[
        'Evaluate concepts & test assumptions early',
        'Working software in weeks, not months',
        'Real user feedback before major spend',
        'Identify improvements & reduce development risks',
        'Establish a clear direction for the next stage',
        'Investor-ready demos & metrics',
        'Fixed-scope, fixed-price engagements',
        'IP ownership stays with you',
      ]}
      technologies={[
        'React', 'Next.js', 'Vercel', 'Supabase', 'Firebase', 'Railway',
        'Figma', 'Framer', 'Storybook', 'Playwright', 'Cypress',
        'PostgreSQL', 'PlanetScale', 'Neon', 'Upstash', 'Redis',
        'Tailwind', 'shadcn/ui', 'Radix UI', 'Zod', 'React Hook Form'
      ]}
      caseStudies={[
        {
          title: 'AI Document Processing PoC',
          category: 'AI/ML Pilot',
          description: 'Built PoC processing 10k docs/day with 94% accuracy in 4 weeks.',
          image: `${import.meta.env.BASE_URL}img/case-ai-poc.jpg`,
          link: '#'
        },
        {
          title: 'Marketplace MVP Launch',
          category: 'MVP Development',
          description: 'Delivered two-sided marketplace MVP in 8 weeks, secured Series A.',
          image: `${import.meta.env.BASE_URL}img/case-marketplace.jpg`,
          link: '#'
        },
        {
          title: 'IoT Pilot for Smart Buildings',
          category: 'IoT Pilot',
          description: 'Pilot connecting 500 sensors, validated energy savings of 23%.',
          image: `${import.meta.env.BASE_URL}img/case-iot.jpg`,
          link: '#'
        }
      ]}
      ctaText="Start a pilot project"
    />
  )
}