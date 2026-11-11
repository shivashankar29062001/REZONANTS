/*
 * Rezonants Perspectives — thought-leadership editorial library.
 * Five professional perspectives on business transformation, AI, ERP, cyber resilience, and cloud modernization.
 * Images are uniformly cropped 960x540 JPEG (/img/perspectives/*.jpg) for row stability and zero layout shift.
 *
 * This file is the SINGLE SOURCE OF TRUTH for the official Perspectives list.
 * The /perspectives pages, the homepage Perspectives section, the website
 * chatbot (src/lib/perspectivesKnowledge.js) and the chat API system prompts
 * all consume it, so the website and the chatbot can never disagree.
 */
export const PERSPECTIVES_DATA = [
  {
    id: 'business-transformation',
    slug: 'business-transformation',
    path: '/perspectives/business-transformation',
    category: 'BUSINESS TRANSFORMATION',
    tag: 'Business Transformation',
    date: 'Sep 2026',
    readTime: '7 min read',
    imageOptimized: '/img/perspectives/modernizing-business-applications.jpg',
    image: '/img/perspectives/modernizing-business-applications.jpg',
    imageAlt: 'Modernizing Business Applications for a Data-Driven Enterprise',
    title: 'Modernizing Business Applications for a Data-Driven Enterprise',
    excerpt: 'How modern application architecture and connected data can improve operational efficiency, scalability and business visibility.',
    summary: 'A modern application and data foundation can help enterprises improve operational efficiency, connect business systems and create better visibility across their operations.',
    keyTopics: [
      'Business application modernization',
      'Connected data',
      'Data integration',
      'Application architecture',
      'Enterprise applications',
      'Analytics',
      'Business visibility',
      'Scalability',
    ]
  },
  {
    id: 'artificial-intelligence',
    slug: 'artificial-intelligence',
    path: '/perspectives/artificial-intelligence',
    category: 'ARTIFICIAL INTELLIGENCE',
    tag: 'Artificial Intelligence',
    date: 'Sep 2026',
    readTime: '6 min read',
    imageOptimized: '/img/perspectives/ai-reshaping-enterprise-applications.jpg',
    image: '/img/perspectives/ai-reshaping-enterprise-applications.jpg',
    imageAlt: 'How AI Is Reshaping Enterprise Applications',
    title: 'How AI Is Reshaping Enterprise Applications',
    excerpt: 'Explore how intelligent automation, AI copilots and predictive intelligence are becoming part of the enterprise applications businesses rely on every day.',
    summary: 'Explore how intelligent automation, AI copilots and predictive intelligence are transforming everyday enterprise software into adaptive, proactive platforms.',
    keyTopics: [
      'Enterprise AI',
      'AI applications',
      'Intelligent automation',
      'AI copilots',
      'Predictive intelligence',
      'AI-powered analytics',
      'Business process automation',
    ]
  },
  {
    id: 'modern-erp',
    slug: 'modern-erp',
    path: '/perspectives/modern-erp',
    category: 'MODERN ERP',
    tag: 'Modern ERP',
    date: 'Aug 2026',
    readTime: '6 min read',
    imageOptimized: '/img/perspectives/accelerating-business-transformation-modern-erp.jpg',
    image: '/img/perspectives/accelerating-business-transformation-modern-erp.jpg',
    imageAlt: 'Accelerating Business Transformation with Modern ERP',
    title: 'Accelerating Business Transformation with Modern ERP',
    excerpt: 'Explore how modern ERP platforms connect finance, procurement, supply chain and business operations through a unified digital foundation.',
    summary: 'A modern ERP platform connects finance, procurement, supply chain, and business operations into a unified, real-time operating model.',
    keyTopics: [
      'Modern ERP',
      'Finance',
      'Procurement',
      'Supply chain',
      'Inventory',
      'Human resources',
      'Operations',
      'ERP integration',
      'Business analytics',
    ]
  },
  {
    id: 'cybersecurity',
    slug: 'cybersecurity',
    path: '/perspectives/cybersecurity',
    category: 'CYBERSECURITY',
    tag: 'Cybersecurity',
    date: 'Aug 2026',
    readTime: '7 min read',
    imageOptimized: '/img/perspectives/cyber-resilience-connected-enterprise.jpg',
    image: '/img/perspectives/cyber-resilience-connected-enterprise.jpg',
    imageAlt: 'Building Cyber Resilience in a Connected Enterprise',
    title: 'Building Cyber Resilience in a Connected Enterprise',
    excerpt: 'Explore how organizations can strengthen security, protect critical systems and prepare for threats across increasingly connected environments.',
    summary: 'As enterprises integrate more cloud systems, APIs, and partner ecosystems, cyber resilience ensures mission-critical operations withstand modern threats.',
    keyTopics: [
      'Enterprise cybersecurity',
      'Threat detection',
      'Security monitoring',
      'Identity and access',
      'Zero Trust',
      'Cloud security',
      'Vulnerability management',
      'Incident response',
      'Cyber resilience',
    ]
  },
  {
    id: 'cloud-modernization',
    slug: 'cloud-modernization',
    path: '/perspectives/cloud-modernization',
    category: 'CLOUD & MODERNIZATION',
    tag: 'Cloud & Modernization',
    date: 'Jul 2026',
    readTime: '7 min read',
    imageOptimized: '/img/perspectives/legacy-application-cloud-modernization.jpg',
    image: '/img/perspectives/legacy-application-cloud-modernization.jpg',
    imageAlt: 'Modernizing Legacy Applications for the Cloud',
    title: 'Modernizing Legacy Applications for the Cloud',
    excerpt: 'Explore a practical approach to assessing, modernizing and moving legacy applications toward scalable, secure cloud architectures.',
    summary: 'A structured, pragmatic roadmap to assess, refactor, and migrate monolithic enterprise systems to elastic, maintainable cloud architectures.',
    keyTopics: [
      'Legacy application modernization',
      'Cloud migration',
      'Rehosting',
      'Replatforming',
      'Refactoring',
      'Re-architecting',
      'Cloud infrastructure',
      'Application modernization',
      'Scalability',
    ]
  }
]
