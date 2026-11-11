import { PERSPECTIVE_INTENTS } from './perspectivesKnowledge.js'
import { resolveDateTimeQuery } from './dateTimeIntent.js'
import { resolveContactQuery } from './contactIntent.js'
import { resolveMenuReply, answerGeneralKnowledge, parseOptionIndex, tryMathCalculation } from './chatMenus.js'
import { translateText } from './translateHelper.js'

const CONTACT = {
  phone: '18004103299',
  email: 'info@rezonants.com',
  address:
    'SBR Towers, Axis bank building, Second Floor, D No 1/98/93/23, HUDA Tecno Encalve Cyber Hills Colony, VIP Hills, Jaihind Enclave, Madhapur, Hyderabad, Telangana 500081',
  vijayawadaAddress:
    'D.No. 24-29-210A, Durgapuram, Gulabithota Road, Vijayawada, NTR District, Andhra Pradesh – 520003',
  southAfricaCompany: 'REZONANTS PVT LTD',
  southAfricaAddress: 'Unit 11, Sunset View, 10 Hazy Street, Newcastle, Kwa-Zulu Natal, 2930, South Africa',
  hours: 'Monday – Saturday, 9:30 – 18:30 IST',
}

// Time-based greeting from the visitor's current local clock
// (<12:00 morning, 12:00–15:59 afternoon, 16:00+ evening).
export function getTimeGreeting(date = new Date()) {
  const h = date.getHours()
  if (h < 12) return 'Good morning'
  if (h < 16) return 'Good afternoon'
  return 'Good evening'
}

export function getWelcomeMessage(date = new Date()) {
  return `${getTimeGreeting(date)}! 👋 Welcome to Rezonants.
I'm the Rezonants AI Assistant. I can help you explore our services, technologies, and contact information.`
}

// Keep the old export name working for any other imports.
export const WELCOME_MESSAGE = getWelcomeMessage()

export const QUICK_ACTIONS = [
  { label: 'Our Services', value: 'What services do you offer?' },
  { label: 'Technologies', value: 'What technologies do you use?' },
  { label: 'Products', value: 'What products do you offer?' },
  { label: 'Contact Rezonants', value: 'How can I contact Rezonants?' },
]

const FALLBACK = `I don't have enough information to answer that yet. For accurate details, please contact the Rezonants team at ${CONTACT.email} or ${CONTACT.phone}, and they will be happy to help.`

// Safety net: if the AI service is unreachable, still refuse secret requests
// locally instead of treating them like ordinary questions.
const SECRET_PATTERNS = [
  'api key',
  'api-key',
  'apikey',
  'token',
  'secret',
  'password',
  'credential',
  'hf_',
  'env var',
  'environment variable',
  'connection string',
  'system prompt',
  'your instructions',
  'private key',
  'access key',
  'anon key',
  'service role',
]

function isSecretRequest(text) {
  const normalized = normalize(text)
  return SECRET_PATTERNS.some((p) => normalized.includes(p))
}

// Questions about specific personnel/salaries: answer honestly instead of
// guessing or drifting into the generic company reply.
const PERSONNEL_RE = /\b(ceo|c\.e\.o|cto|coo|cio|founder|co-founder|salary|salaries)\b/

function isPersonnelQuestion(text) {
  return PERSONNEL_RE.test(normalize(text))
}

// Offer probes ("Does Rezonants offer X?", "Do you provide X?") with an unknown
// object X: score only the object against the KB so unrelated words like
// "services" in the question don't fake a match.
const OFFER_PROBE_RE = /\b(?:do you|does rezonants|do you guys)\s+(?:offer|provide|have|support|build|make|develop)\s+(.+?)[?!.]*\s*$/

function unknownOfferReply(text) {
  const normalized = normalize(text)
  const m = normalized.match(OFFER_PROBE_RE)
  if (!m) return null
  const objectText = m[1].trim()
  if (!objectText) return null
  const objectWords = objectText.split(' ').filter(Boolean)
  const { bestScore } = scoreAll(objectText, objectWords)
  if (bestScore === 0) {
    return `That isn't something listed among Rezonants' services or products, so I don't have enough information to answer that yet. For accurate details, please contact the Rezonants team at ${CONTACT.email} or ${CONTACT.phone}, and they will be happy to help.`
  }
  return null
}

const KB = [
  {
    id: 'greeting',
    keywords: [
      'hello',
      'hi',
      'hey',
      'good morning',
      'good afternoon',
      'good evening',
      'namaste',
    ],
    reply: `Hello! 👋 How can I help you today? You can ask about our services, products, technologies, or contact details.`,
  },
  {
    id: 'who-are-you',
    keywords: ['who are you', 'what are you', 'your name', 'are you a robot', 'are you ai'],
    reply: `I'm the Rezonants AI Assistant — a virtual assistant for Rezonants. I can answer questions about our services, technologies, products, and contact information. If you need help beyond what I know, our team at ${CONTACT.email} will be glad to assist.`,
  },
  {
    id: 'about',
    keywords: [
      'about rezonants',
      'about the company',
      'tell me about rezonants',
      'about yourselves',
      'about yourself',
      'what is rezonants',
      'rezonants',
      'who is rezonants',
      'company overview',
      'what does rezonants do',
      'what do you do',
      'your company',
      'history',
      'since 2012',
      'founded',
    ],
    reply: `Rezonants is an IT services and digital products company based in Madhapur, Hyderabad, India, operating since 2012. We design, build and scale custom software, web and mobile products, cloud infrastructure and AI — for companies that compete on execution. We're known for website design and development, web application development and mobile application development (iPhone, iPad, Android), built on trust, quality and long-term partnership.`,
  },
  {
    id: 'services',
    keywords: [
      'what services',
      'your services',
      'services do you',
      'services does rezonants',
      'it services',
      'kind of services',
      'type of services',
      'what do you offer',
      'service offering',
      'what solutions',
      'solutions can you',
      'solutions do you',
      'solutions for my business',
      'business solutions',
      'what can you help with',
      'capabilities',
      'list services',
      'all services',
      'show services',
    ],
    reply: `Rezonants offers the following 9 specialized technology services:

1. Inception To Deployment
2. Business Process Automation
3. Center of Excellence
4. Custom Development & Customization
5. Digital Transformation
6. End-to-End Solution Framework
7. Migration & Modernization
8. Proof of Concept (PoC) & Pilot Implementation
9. Shared Services & Managed Operations

Type a service name to learn more about its core capabilities.`,
  },
  {
    id: 'inception-to-deployment',
    keywords: [
      'inception to deployment',
      'inception',
      'build from scratch',
      'scratch',
      'custom development',
      'software development',
      'web development',
      'web application',
      'web design',
      'application development',
      'mobile app',
      'mobile apps',
      'android',
      'ios',
      'iphone',
      'api',
      'bespoke',
      'requirements engineering',
      'solution architecture',
      'custom software',
      'custom solution',
      'custom solutions',
      'custom application',
      'software solution',
      'tailored software',
      'tailored application',
      'need software',
      'need an app',
      'build an app',
      'create an app',
    ],
    reply: `Rezonants' Inception To Deployment service delivers end-to-end development of new digital solutions from business requirements and solution architecture through development, integration, testing, deployment, and ongoing support. Core capabilities: Requirements Engineering • Solution Architecture • Application Development • API Integration • Quality Assurance • DevOps • Deployment • Support & Maintenance.`,
  },
  {
    id: 'cloud',
    keywords: [
      'cloud',
      'aws',
      'azure',
      'google cloud',
      'gcp',
      'digital transformation',
      'cloud solutions',
      'cloud services',
      'your cloud',
      'cloud offering',
      'migration',
      'cloud migration',
      'data center',
      'data centers',
    ],
    reply: `Rezonants offers Digital Transformation and Migration Services to modernize your technology, processes and culture. We help move applications, data and infrastructure to the cloud securely and cost-effectively, including cloud migrations on AWS, Azure and Google Cloud.`,
  },
  {
    id: 'consulting',
    keywords: [
      'consulting',
      'it consulting',
      'offshore',
      'consultancy',
      'shared services',
      'one-stop',
      'end-to-end',
    ],
    reply: `Rezonants provides comprehensive IT services including:

• Shared Services — Centralized platforms that scale across teams.
• One-Stop Solutions — Comprehensive technology solutions under one roof.
• End-to-End Solutions — Full-lifecycle delivery from strategy through 24/7 operations.

Which service interests you?`,
  },
  {
    id: 'marketing',
    keywords: [
      'marketing',
      'digital marketing',
      'seo',
      'social media',
      'google ads',
      'ppc',
      'email marketing',
      'branding',
      'online reputation',
      'marketing automation',
      'advertising',
    ],
    reply: `Rezonants focuses on technology services including custom development, cloud solutions and digital transformation. For marketing-related inquiries, please contact our team at ${CONTACT.email} and we'll be happy to discuss how we can help with your digital presence.`,
  },
  {
    id: 'process-automation',
    keywords: [
      'process automation',
      'automation',
      'workflow',
      'workflows',
      'automate',
      'manual process',
      'streamline',
    ],
    reply: `Rezonants' Business Process Automation service designs and implements intelligent automation solutions that streamline business processes, eliminate repetitive manual activities, improve operational efficiency and accelerate business outcomes. Core capabilities: Workflow Automation • RPA • Intelligent Automation • AI Automation • Process Optimization • API Integration • Process Orchestration.`,
  },
  {
    id: 'center-of-excellence',
    keywords: [
      'center of excellence',
      'coe',
      'engineering hub',
      'shared standards',
    ],
    reply: `Rezonants' Center of Excellence service embeds a high-performing engineering hub with shared standards and reuse. We help organizations establish centers of excellence to drive innovation and maintain quality across projects.`,
  },
  {
    id: 'solution-engineering',
    keywords: [
      'solution engineering',
      'architecture',
      'scalable systems',
      'system design',
    ],
    reply: `Rezonants' Solution Engineering service architects resilient, scalable systems from discovery to production. We design solutions that meet your business needs while ensuring reliability and performance.`,
  },
  {
    id: 'pilot-prototyping',
    keywords: [
      'pilot',
      'prototyping',
      'prototype',
      'proof of concept',
      'validate ideas',
      'mvp',
    ],
    reply: `Rezonants' Pilot & Prototyping service helps validate ideas fast with low-risk pilots and production-grade prototypes. We build MVPs and proof-of-concepts to test concepts before full-scale development.`,
  },
  {
    id: 'one-stop-solutions',
    keywords: [
      'one-stop',
      'one stop',
      'comprehensive solutions',
      'all in one',
    ],
    reply: `Rezonants' One-Stop Solutions provide comprehensive technology solutions under one roof. From strategy to execution, we handle all aspects of your technology needs.`,
  },
  {
    id: 'end-to-end-solutions',
    keywords: [
      'end-to-end',
      'end to end',
      'full lifecycle',
      'full delivery',
      'strategy to operations',
    ],
    reply: `Rezonants' End-to-End Solutions provide full-lifecycle delivery from strategy and design through 24/7 operations. We manage the complete project lifecycle so you can focus on your business.`,
  },
  {
    id: 'migration-services',
    keywords: [
      'migration',
      'migrate',
      'migrating',
      'cloud migration',
      'move to cloud',
      'moving to the cloud',
      'move our infrastructure',
      'data migration',
      'modernize',
      'modernisation',
      'modernization',
      'legacy system',
      'legacy systems',
      'legacy application',
      'legacy app',
      'old system',
      'old application',
      'old infrastructure',
      'existing system',
      'upgrade our',
      'upgrade the system',
      'upgrade it',
      'replatform',
      're-platform',
    ],
    reply: `Rezonants' Migration Services help move applications, data and infrastructure to the cloud securely and cost-effectively. We ensure smooth transitions with minimal downtime.`,
  },
  {
    id: 'shared-services',
    keywords: [
      'shared services',
      'centralized',
      'platform',
      'scale across teams',
    ],
    reply: `Rezonants' Shared Services provide centralized platforms that scale across teams. We help organizations establish shared service centers for efficiency and consistency.`,
  },
  {
    id: 'managed-services',
    keywords: [
      'managed services',
      'managed service',
      'managed operations',
      'managed it',
      'manage our it',
      'manage our infrastructure',
      'manage our systems',
      'manage it operations',
      'it operations',
      '24/7 support',
      '24x7 support',
      '24/7 monitoring',
      'ongoing support',
      'maintenance contract',
      'amc',
    ],
    reply: `Yes — Managed Services is one of Rezonants' core technology offerings. It provides reliable technology operations with expert support and continuous improvement: 24/7 infrastructure, cloud, network and application management, covering infrastructure management, cloud management, network management, application management, monitoring & observability, backup & recovery, and security operations (SecOps). It pairs with our Shared Services & Managed Operations service for centralized delivery with defined SLAs.

You can read the full details on our website at /technologies/managed-services.`,
  },
  {
    id: 'ai',
    keywords: [
      'ai',
      'artificial intelligence',
      'machine learning',
      'ml',
      'ai solutions',
      'ai/ml',
      'ai & robotics',
      'cognitive analytics',
      'generative ai',
      'llm',
      'chatbot',
      'genai',
      'neural',
      'data analytics',
      'predictive',
      'robotics',
    ],
    reply: `AI is a core part of how Rezonants builds products. Our technology expertise includes:

• AI & Robotics — Intelligent automation and robotic process automation solutions.
• Cognitive Analytics & AI — Advanced analytics, machine learning and AI-driven insights.

We embed machine learning and data capabilities into custom software and cloud solutions. For specifics on AI solutions for your use case, our engineering team at ${CONTACT.email} will share details tailored to your project.

In general terms: AI is the broad field of machines performing tasks that typically require human intelligence, while machine learning (ML) is the subset where systems learn patterns from data instead of being explicitly programmed.`,
  },
  {
    id: 'projects',
    keywords: [
      'projects',
      'portfolio',
      'work',
      'what have you built',
      'gallery',
      'clients',
      'samples',
      'showcase',
      'examples',
      'case study',
    ],
    reply: `Rezonants offers 8 specialized Enterprise Technology Solutions:
1. AI & Robotics Solutions (Intelligent Technology & Automated Operations)
2. Business Automation Solutions (Process Simplification & Workflow Orchestration)
3. Cloud Migration Solutions (Multi-Cloud Architecture & Migration)
4. Data Center Solutions (Reliable Mission-Critical Infrastructure)
5. Cognitive Analytics & AI (Data-to-Decision Intelligence)
6. Information & Reporting Systems (MIS & Automated KPI Dashboards)
7. Managed Services (24/7 IT Operations & SRE Support)
8. One-Stop Technology Solutions (Unified Lifecycle Partner)

You can explore these under the Technologies section on our website.`,
  },
  {
    id: 'contact',
    keywords: [
      'contact',
      'phone',
      'number',
      'call',
      'email',
      'mail',
      'address',
      'location',
      'office',
      'where are you',
      'reach you',
      'get in touch',
      'talk to someone',
      'speak to',
      'hyderabad',
      'madhapur',
      'vijayawada',
      'south africa office',
      'office address',
      'office location',
      'company locations',
      'where is rezonants',
      'where are you located',
      'where is your office',
      'located',
      'toll free',
      'customer care',
      'address line',
    ],
    reply: `You can reach Rezonants directly:

📞 Phone (toll-free): ${CONTACT.phone}
✉️ Email: ${CONTACT.email}
📍 Hyderabad, India (Headquarters): ${CONTACT.address}
📍 Vijayawada, India: ${CONTACT.vijayawadaAddress}
📍 South Africa Office: ${CONTACT.southAfricaCompany}, ${CONTACT.southAfricaAddress}

You can also use the "Send us a message" form on our homepage, or book a free consultation.`,
  },
  {
    id: 'hours',
    keywords: ['hours', 'open hours', 'working hours', 'timing', 'when are you open', 'what time'],
    reply: `Our office hours are ${CONTACT.hours}. You can also write to ${CONTACT.email} any time and we'll get back to you within one business day.`,
  },
  {
    id: 'book',
    keywords: [
      'book',
      'consultation',
      'meeting',
      'schedule',
      'demo',
      'call with',
      'talk to an expert',
      'talk to expert',
      'senior engineer',
      'free consultation',
    ],
    reply: `You can book a free consultation with our team through the "Book a free consultation" page on our website. Just share a little about your project and we'll come prepared — typically responding within one business day.`,
  },
  {
    id: 'pricing',
    keywords: ['price', 'pricing', 'cost', 'costs', 'rates', 'rate', 'charge', 'how much', 'budget', 'quote', 'estimate'],
    reply: `Project costs at Rezonants depend on scope, technology and timelines, so we don't publish fixed rates. We provide honest estimates and transparent billing on every engagement. Share your requirements and we'll send an accurate estimate — you can start with a free consultation from our website.`,
  },
  {
    id: 'help',
    keywords: ['help', 'what can you do', 'how can you help', 'what can i ask', 'menu', 'options', 'topics'],
    reply: `I can help with questions about Rezonants, our services, technologies, products, and contact information. Just ask away!`,
  },
  {
    id: 'navigation',
    keywords: ['navigate', 'how do i find', 'where is the', 'where can i', 'go to', 'find contact'],
    reply: `You can find everything on our website: About and Services on the homepage, Products at /products, Perspectives at /perspectives, and Contact via the contact form at the bottom of the homepage. There's also a "Book a free consultation" page for new projects.`,
  },
  {
    id: 'tech-stack',
    keywords: ['tech stack', 'technology', 'technologies used', 'languages', 'frameworks', 'stack', 'react', 'node', 'python', 'javascript', 'java', '.net'],
    reply: `Rezonants' technology expertise spans:

• AI & Robotics Solutions
• Business Automation Solutions
• Cloud Migration Solutions
• Data Center Solutions
• Cognitive Analytics & AI
• Information & Reporting Systems
• Managed Services
• One-Stop Technology Solutions

Because every project is different, our teams choose the stack that best fits your product. For details relevant to your project, the team at ${CONTACT.email} can share specifics.`,
  },
  {
    id: 'technologies',
    keywords: [
      'technologies',
      'what technologies',
      'your technologies',
      'tech',
      'tools',
      'platforms',
      'list technologies',
      'all technologies',
      'show technologies',
    ],
    reply: `Rezonants' core technologies:

1. AI & Robotics Solutions
2. Business Automation Solutions
3. Cloud Migration Solutions
4. Data Center Solutions
5. Cognitive Analytics & AI
6. Information & Reporting Systems
7. Managed Services
8. One-Stop Technology Solutions

Type a technology name to learn more about it.`,
  },
  {
    id: 'business-automation',
    keywords: [
      'business automation',
      'automate business',
      'business process',
      'workflow automation',
    ],
    reply: `Rezonants' Business Automation technology helps streamline workflows and remove manual effort with intelligent automation. We design and implement automated solutions that improve efficiency and reduce operational costs.`,
  },
  {
    id: 'data-centers',
    keywords: [
      'data center',
      'data centers',
      'server room',
      'infrastructure',
      'hosting',
    ],
    reply: `Rezonants' Data Centers technology provides modern data center operations and management. We help organizations manage their infrastructure efficiently with monitoring, maintenance and optimization.`,
  },
  {
    id: 'information-reporting',
    keywords: [
      'information systems',
      'reporting systems',
      'data reporting',
      'business intelligence',
      'analytics dashboard',
    ],
    reply: `Rezonants' Information & Reporting Systems technology provides data-driven decision making tools. We build systems that help organizations collect, analyze and report on their data effectively.`,
  },
  {
    id: 'products',
    keywords: [
      'products',
      'product',
      'software products',
      'what products',
      'products do you offer',
      'product offerings',
      'featured products',
      'erp',
      'crm',
      'hrms',
    ],
    reply: `Rezonants offers a range of digital products across five categories:

• Featured Products — Rezonants AI Suite, CloudNexus, WorkSync, DataStream
• ERP Solutions — Rezonants ERP Core, HRMS Pro, SupplyChain IQ, Finance Hub
• IT Solutions — Cloud Infrastructure, Cybersecurity Suite, DevOps Pipeline, Managed IT Services
• CRM Solutions — Sales CRM, Customer Support Hub, Marketing Automation, Customer 360 View
• HRMS Solutions — Core HR, Payroll & Compliance, Performance Management, Recruitment Portal

There's also an App Development section covering web and mobile apps. Explore everything on our Products page (/products), or ask me about a specific category.`,
  },
  {
    id: 'products-featured',
    keywords: ['featured products', 'rezonants ai suite', 'cloudnexus', 'worksync', 'datastream'],
    reply: `Our Featured Products:

• Rezonants AI Suite — intelligent autonomous agents and tools that automate complex workflows and customer operations.
• CloudNexus — multi-cloud management platform optimizing performance, security, compliance, and costs.
• WorkSync — hybrid collaboration and productivity hub with integrated task, chat, and document management.
• DataStream — real-time analytics engine transforming streams of business events into actionable insights.

Details on the Products page (/products).`,
  },
  {
    id: 'products-erp',
    keywords: ['erp solutions', 'rezonants erp core', 'supplychain iq', 'finance hub', 'enterprise resource planning'],
    reply: `Our ERP Solutions:

• Rezonants ERP Core — unified enterprise architecture connecting finance, assets, HR, procurement, and inventory.
• HRMS Pro — employee experience platform covering payroll, benefits, performance reviews, and self-service.
• SupplyChain IQ — real-time logistics tracking, automated warehouse operations, and demand forecasting.
• Finance Hub — advanced ledger management, billing workflows, automated compliance, and real-time cashflow reports.

Details on the Products page (/products#erp).`,
  },
  {
    id: 'products-it',
    keywords: ['it solutions', 'cybersecurity suite', 'devops pipeline', 'managed it services'],
    reply: `Our IT Solutions:

• Cloud Infrastructure — scalable cloud architecture, migration, and management across AWS, Azure, and GCP.
• Cybersecurity Suite — end-to-end security monitoring, threat detection, and compliance management.
• DevOps Pipeline — CI/CD automation, containerization, and infrastructure-as-code for faster delivery.
• Managed IT Services — 24/7 infrastructure monitoring, incident response, and proactive maintenance.

Details on the Products page (/products).`,
  },
  {
    id: 'products-crm',
    keywords: ['crm solutions', 'sales crm', 'customer support hub', 'customer 360'],
    reply: `Our CRM Solutions:

• Sales CRM — pipeline management, lead scoring, deal tracking, and sales forecasting in one platform.
• Customer Support Hub — ticketing, knowledge base, live chat, and omnichannel support management.
• Marketing Automation — campaign orchestration, email automation, lead nurturing, and analytics.
• Customer 360 View — unified customer profiles combining sales, support, and interaction data.

Details on the Products page (/products).`,
  },
  {
    id: 'products-hrms',
    keywords: ['hrms solutions', 'core hr', 'payroll', 'performance management', 'recruitment portal'],
    reply: `Our HRMS Solutions:

• Core HR — employee records, org hierarchy, leave management, and attendance tracking.
• Payroll & Compliance — automated payroll processing, tax calculations, and statutory compliance.
• Performance Management — OKR tracking, 360° reviews, goal setting, and employee development plans.
• Recruitment Portal — job postings, applicant tracking, interview scheduling, and onboarding workflows.

Details on the Products page (/products#hrms).`,
  },
  {
    id: 'products-appdev',
    keywords: ['app development', 'appdev', 'mobile app development'],
    reply: `Rezonants builds web and mobile applications — including iPhone, iPad and Android apps — as part of its custom development work. The App Development section of our Products page (/products#appdev) has details, and our Inception To Deployment service covers delivery from requirements through deployment and support.`,
  },
  // Official Perspectives (overview + one intent per Perspective). Replies and
  // keywords come from src/lib/perspectivesKnowledge.js, which is built from
  // PERSPECTIVES_DATA — the same source the /perspectives pages use. Never
  // hard-code a second Perspective list here.
  ...PERSPECTIVE_INTENTS,
  {
    id: 'security',
    keywords: ['security', 'privacy', 'data protection', 'gdpr', 'confidential'],
    reply: `Rezonants takes data privacy and security seriously. You can review our Privacy Policy on the /privacy page of our website, and manage your cookie preferences from the "Cookie Preferences" link in the footer. For compliance questions, contact ${CONTACT.email}.`,
  },
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'appreciate', 'great', 'awesome', 'perfect', 'nice'],
    reply: `You're welcome! 😊 If you have any other questions about Rezonants, just ask. You can also reach our team at ${CONTACT.email} or ${CONTACT.phone}.`,
  },
]

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s+./@-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function scoreIntent(intent, text, words) {
  let score = 0
  for (const kw of intent.keywords) {
    const key = normalize(kw)
    if (!key) continue
    if (key.length <= 2) {
      if (words.includes(key)) score += 4
    } else if (words.includes(key)) {
      score += key.length * 2
    } else if (new RegExp(`\\b${escapeRegExp(key)}\\b`).test(text)) {
      score += key.length * 3
    }
  }
  return score
}

// ─── Conversation context (session-only) ─────────────────────────────────────
// Works for ANY visitor: names and topics are derived from the current chat
// history passed in by the Chatbot component. Nothing is hard-coded or
// persisted, so "New chat" (which clears the message list) clears memory too.

const SERVICES_LIST = [
  'Inception To Deployment',
  'Business Process Automation',
  'Center of Excellence',
  'Custom Development & Customization',
  'Digital Transformation',
  'End-to-End Solution Framework',
  'Migration & Modernization',
  'Proof of Concept (PoC) & Pilot Implementation',
  'Shared Services & Managed Operations',
]

const ORDINALS = {
  first: 0, '1st': 0,
  second: 1, '2nd': 1,
  third: 2, '3rd': 2,
  fourth: 3, '4th': 3,
  fifth: 4, '5th': 4,
  sixth: 5, '6th': 5,
  seventh: 6, '7th': 6,
  eighth: 7, '8th': 7,
  ninth: 8, '9th': 8,
}

// Common non-name words so "I am looking for..." / "I am from..." are not
// mistaken for a visitor stating their name.
const NAME_STOP_WORDS = new Set([
  'fine', 'good', 'great', 'ok', 'okay', 'not', 'here', 'from', 'in', 'at',
  'a', 'an', 'the', 'looking', 'interested', 'sorry', 'sure', 'happy',
  'ready', 'done', 'back', 'new', 'just', 'only', 'very', 'really', 'so',
  'too', 'also', 'working', 'trying', 'planning', 'thinking', 'searching',
  'exploring', 'checking', 'curious', 'wondering', 'glad', 'excited',
  'confused', 'tired', 'busy', 'free', 'available', 'open',
])

function extractName(text) {
  const cleaned = (text || '').replace(/[\u2019]/g, "'")
  const patterns = [
    /my name is\s+([a-zA-Z][a-zA-Z'-]{0,30})/i,
    /my name(?:'s)?\s+(?!is\b)([a-zA-Z][a-zA-Z'-]{0,30})\b/i,
    /\bmy ?self(?:,)?\s+([a-zA-Z][a-zA-Z'-]{0,30})/i,
    /\bcall me\s+([a-zA-Z][a-zA-Z'-]{0,30})/i,
    /\bthis is\s+([a-zA-Z][a-zA-Z'-]{0,30})/i,
    /\bi am\s+([a-zA-Z][a-zA-Z'-]{0,30})\b/i,
    /\bi'm\s+([a-zA-Z][a-zA-Z'-]{0,30})\b/i,
  ]
  for (const re of patterns) {
    const m = cleaned.match(re)
    if (!m) continue
    const candidate = m[1].replace(/[^a-zA-Z'-]/g, '')
    if (candidate && !NAME_STOP_WORDS.has(candidate.toLowerCase())) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1)
    }
  }
  return null
}

function isNameQuestion(text) {
  const normalized = normalize(text)
  return /what (?:s|is) my name|who am i|do you (?:know|remember) my name|can you (?:tell|say) my name/.test(normalized)
}

function findNameInHistory(history) {
  // Newest first, so a name updated mid-chat wins.
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role !== 'user') continue
    const name = extractName(history[i].content || '')
    if (name) return name
  }
  return null
}

// Shared with Chatbot.tsx: the name stated anywhere in the CURRENT chat
// (newest statement wins). Session-only — nothing is persisted, so a new
// chat (empty history) naturally starts with no name.
export function getUserNameFromHistory(history) {
  return findNameInHistory(history || [])
}

// Pure greetings ("Hi", "Hello there", "Good morning", "How are you?",
// "What's up?") -> handled as conversation, never as the fallback.
const PURE_GREETING_RE = /^(hi+|hey+|hello+|hiya|yo|howdy|greetings|namaste|good\s+(?:morning|afternoon|evening)|how\s+are\s+you(?:\s+doing)?|how\s+do\s+you\s+do|what'?s\s+up|how\s+is\s+it\s+going)(\s+(?:there|team|rezonants|everyone|guys|bot|again|all))?[\s!.,?]*$/i
const WELLBEING_RE = /how\s+are\s+you|how\s+do\s+you\s+do|what'?s\s+up|how\s+is\s+it\s+going/i

function getGreetingReply(text, history) {
  const t = (text || '').toLowerCase().trim()
  if (!PURE_GREETING_RE.test(t)) return null
  const name = findNameInHistory(history)
  if (WELLBEING_RE.test(t)) {
    return name
      ? `I'm doing well, thank you! 😊 What would you like to explore next, ${name}?`
      : `I'm doing well, thank you! 😊 How can I help you with Rezonants?`
  }
  // If the visitor themselves said "good morning/afternoon/evening", echo it
  // back; otherwise greet by the visitor's CURRENT LOCAL TIME.
  const echo = t.match(/good\s+(morning|afternoon|evening)/)
  const g = echo
    ? `Good ${echo[1].charAt(0).toUpperCase()}${echo[1].slice(1)}`
    : getTimeGreeting()
  return name ? `${g}, ${name}! 👋 How can I help you today?` : `${g}! 👋 How can I help you today?`
}

function scoreAll(text, words) {
  let best = null
  let bestScore = 0
  for (const intent of KB) {
    const score = scoreIntent(intent, text, words)
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }
  return { best, bestScore }
}

const FOLLOWUP_RE = /(tell me more|more about|second one|first one|third one|fourth one|fifth one|the second|the first|the third|explain that|explain it|in simple words|simple words|simple terms|more detail|in more detail|go on|continue|give me an example|real world example|example of that|elaborate|what about that|explain more|what are (?:its|the) benefits|benefits|advantages)/i

function resolveFollowUp(text, history) {
  const normalized = normalize(text)
  if (!FOLLOWUP_RE.test(normalized) || history.length === 0) return null

  // If asking "what are its benefits" or "benefits" or "explain more" right after a menu item explanation
  const lastAssistant = [...history].reverse().find((m) => m.role === 'assistant' && m.content)
  if (lastAssistant) {
    const isBenefits = /benefits|what are (?:its|the) benefits|advantages/i.test(normalized)
    const isExplainMore = /explain more|tell me more|more detail|elaborate|go on|continue/i.test(normalized)

    const headingMatch = lastAssistant.content.match(/^(\d{1,2})\.\s+([^\n]+)/m)
    if (headingMatch && (isBenefits || isExplainMore)) {
      const itemTitle = headingMatch[2].trim()
      if (isBenefits) {
        if (/Benefits:\s*([\s\S]+?)(?=\n\nWould you like|$)/i.test(lastAssistant.content)) {
          const match = lastAssistant.content.match(/Benefits:\s*([\s\S]+?)(?=\n\nWould you like|$)/i)
          return `Key benefits of ${itemTitle}:\n\n${match[1].trim()}`
        }
        return `Key benefits of ${itemTitle} with Rezonants:\n• Streamlined delivery and optimized operational workflows.\n• High scalability, security, and proven enterprise reliability.\n• Measurable ROI, lower maintenance overhead, and 24/7 dedicated support.`
      }
      if (isExplainMore) {
        return `Here is more detail about ${itemTitle}:\n\nRezonants provides end-to-end execution for ${itemTitle}, aligning with your specific business goals. Our engineering teams handle everything from architecture and integration to continuous optimization and governance, ensuring smooth adoption and measurable results.`
      }
    }
  }

  let target = null

  // "tell me more about the second one" after a numbered list -> that item
  const ordinalMatch = normalized.match(/\b(first|1st|second|2nd|third|3rd|fourth|4th|fifth|5th|sixth|6th|seventh|7th|eighth|8th|ninth|9th)\b/)
  if (ordinalMatch) {
    const item = SERVICES_LIST[ORDINALS[ordinalMatch[1]]]
    if (item) {
      const itemText = normalize(item)
      const r = scoreAll(itemText, itemText.split(' ').filter(Boolean))
      if (r.bestScore > 0) target = r.best
    }
  }

  // Otherwise re-match the KB against the previous user question
  if (!target) {
    const lastUser = [...history].reverse().find((m) => m.role === 'user' && m.content)
    if (lastUser) {
      const q = normalize(lastUser.content)
      const r = scoreAll(q, q.split(' ').filter(Boolean))
      if (r.bestScore > 0) target = r.best
    }
  }

  // Last resort: match against the previous assistant answer
  if (!target) {
    const lastAssistant = [...history].reverse().find((m) => m.role === 'assistant' && m.content)
    if (lastAssistant) {
      const a = normalize(lastAssistant.content).slice(0, 600)
      const r = scoreAll(a, a.split(' ').filter(Boolean))
      if (r.bestScore > 0) target = r.best
    }
  }

  if (!target) return null
  const wantsSimple = /simple words|simple terms|simpler|easier/.test(normalized)
  return wantsSimple ? `Sure — in simple terms: ${target.reply}` : target.reply
}

export async function getChatResponse(text, history = [], lang = 'en', currentMenuCategory = null) {
  async function computeReply() {
    if (isSecretRequest(text)) {
      return `I'm sorry, but I can't share API keys, passwords, credentials or internal configuration. If you'd like help with Rezonants' services or contacting our team, I'm happy to assist.`
    }

    // Personnel/salary specifics aren't published — answer honestly, never invent.
    if (isPersonnelQuestion(text)) {
      return `That detail isn't published on our website and I wouldn't want to guess. For anything about Rezonants' team or leadership, please contact ${CONTACT.email} or ${CONTACT.phone} and the team will help you directly.`
    }

    // Priority 0: mathematics (arithmetic, averages, percentages). Resolved before
    // the menu logic so "2+2" is calculated, not treated as a list selection —
    // while a bare "2" still falls through to the menu logic below.
    const mathReply = tryMathCalculation(text)
    if (mathReply) return mathReply

    // Priority 1-3: a numbered selection against the menu currently on screen,
    // or a request for the Services / Technologies / Products menu. Resolved BEFORE every
    // other intent so "2" is never treated as an unknown question and
    // "services" never reaches the fallback.
    const menuReply = resolveMenuReply(text, history, currentMenuCategory)
    if (menuReply) {
      let nextCategory = currentMenuCategory
      if (/^Our Services:/m.test(menuReply)) nextCategory = 'services'
      else if (/^Our Technologies:/m.test(menuReply)) nextCategory = 'technologies'
      else if (/^Here are our products:/m.test(menuReply)) nextCategory = 'products'
      return { reply: menuReply, currentMenuCategory: nextCategory }
    }

    // If the user enters a number without first selecting a category, ask whether they mean Services, Technologies, or Products.
    const bareIndex = parseOptionIndex(text)
    if (bareIndex !== null) {
      return {
        reply: `Did you mean Services, Technologies, or Products? Please specify a category or type "services", "technologies", or "products" to see the list.`,
        currentMenuCategory: null,
      }
    }

    const unknownOffer = unknownOfferReply(text)
    if (unknownOffer) return unknownOffer

    // Company contact/location questions ("where are you located?", "give me
    // your phone number", "how do I reach your office?", "send address", ...)
    // are answered from the known company details, for ANY phrasing.
    const contactReply = resolveContactQuery(text)
    if (contactReply) return contactReply

    const normalized = normalize(text)
    const words = normalized.split(' ').filter(Boolean)
    const { best, bestScore } = scoreAll(normalized, words)

    // The visitor shared their name -> acknowledge it (works for ANY name).
    const statedName = extractName(text)
    if (statedName) {
      if (best && bestScore > 0) {
        return `Nice to meet you, ${statedName}! 👋 ${best.reply}`
      }
      return `Nice to meet you, ${statedName}! 👋 I'll remember your name for this conversation. How can I help — services, products, technologies, or contact info?`
    }

    // Name recall question -> answer from the current chat only.
    if (isNameQuestion(text)) {
      const name = findNameInHistory(history)
      if (name) return `Your name is ${name}.`
      return `I don't have your name yet — I only know what's shared within this chat. What should I call you?`
    }

    // Priority 9: simple, well-known general-knowledge questions (capitals,
    // currencies, common facts, tech definitions) get a real answer instead of
    // the Rezonants contact fallback — but ONLY once no Rezonants knowledge applies,
    // because company information outranks general facts in the intent order.
    if (bestScore === 0) {
      const general = answerGeneralKnowledge(text)
      if (general) return general
    }

    // General date/time questions ("present time", "today's date in Japan")
    // are answered from the clock via IANA timezones — never the Rezonants
    // fallback. Default location is India; a name shared in this chat
    // personalizes the default-location time reply (spec: date/time + name).
    const dateTimeReply = resolveDateTimeQuery(text, {
      name: findNameInHistory(history),
      greeting: getTimeGreeting(),
    })
    if (dateTimeReply) return dateTimeReply

    // Pure greetings -> natural, brief reply (with name/context awareness);
    // conversation context is preserved, never the fallback.
    const greetingReply = getGreetingReply(text, history)
    if (greetingReply) return greetingReply

    // Follow-up ("tell me more", "the second one", "in simple words") ->
    // resolve against the recent conversation instead of falling back.
    if (bestScore === 0 && history.length > 0) {
      const followUp = resolveFollowUp(text, history)
      if (followUp) return followUp
    }

    if (!best) return FALLBACK

    return best.reply
  }

  const result = await computeReply()
  const rawReply = typeof result === 'object' && result !== null && 'reply' in result ? result.reply : result
  const category = typeof result === 'object' && result !== null && 'currentMenuCategory' in result ? result.currentMenuCategory : null

  const translated = lang && lang !== 'en' ? await translateText(rawReply, lang) : rawReply

  const output = {
    response: translated,
    currentMenuCategory: category,
    toString() {
      return this.response
    },
  }
  return output
}
