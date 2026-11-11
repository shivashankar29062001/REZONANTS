/*
 * Rezonants Perspectives — chatbot knowledge.
 *
 * Every chatbot reply about Perspectives is generated from PERSPECTIVES_DATA
 * (src/data/perspectivesData.js), the same source the /perspectives page and
 * the homepage Perspectives section render. There is no second, hand-written
 * Perspective list, so the website and the chatbot cannot drift apart again.
 *
 * Used by BOTH chat paths:
 *   - the browser assistant (src/lib/chatKnowledge.js adds these intents to its KB)
 *   - the chat API server (server/chat-api.js calls resolvePerspectivesQuery)
 */
import { PERSPECTIVES_DATA } from '../data/perspectivesData.js'

export const PERSPECTIVES_PAGE = '/perspectives'

// Phrases that should route a question to a specific Perspective. Kept to
// distinctive, multi-word phrases (never bare "ai", "erp" or "cloud") so
// unrelated services/products questions are not hijacked.
const PERSPECTIVE_KEYWORDS = {
  'business-transformation': [
    'business transformation',
    'business transformation perspective',
    'business applications',
    'business application modernization',
    'data driven enterprise',
    'connected data',
    'application architecture',
    'business visibility',
  ],
  'artificial-intelligence': [
    'artificial intelligence perspective',
    'ai perspective',
    'your ai perspective',
    'ai insights perspective',
    'enterprise ai',
    'ai copilots',
    'intelligent automation',
    'predictive intelligence',
    'ai powered analytics',
    'ai reshaping enterprise applications',
  ],
  'modern-erp': [
    'modern erp',
    'modern erp perspective',
    'erp perspective',
    'your erp perspective',
    'erp modernization',
    'erp integration',
    'erp platforms',
  ],
  cybersecurity: [
    'cybersecurity perspective',
    'cyber security perspective',
    'your cybersecurity perspective',
    'cyber resilience',
    'threat detection',
    'security monitoring',
    'zero trust',
    'cloud security',
    'vulnerability management',
    'incident response',
  ],
  'cloud-modernization': [
    'cloud modernization',
    'cloud modernization perspective',
    'cloud and modernization perspective',
    'cloud perspective',
    'your cloud perspective',
    'legacy application modernization',
    'legacy modernization',
    'cloud migration',
    'replatforming',
    're architecting',
  ],
}

export const PERSPECTIVES_OVERVIEW_KEYWORDS = [
  'perspectives',
  'perspective',
  'rezonants perspectives',
  'your perspectives',
  'what are your perspectives',
  'what are rezonants perspectives',
  'tell me about rezonants perspectives',
  'topics do your perspectives cover',
  'what topics do you cover',
  'show me your perspectives',
  'insights',
  'technology insights',
  'articles',
  'blog',
]

// "Rezonants Perspectives explore key areas of business and technology
// transformation:" + the five official Perspectives, straight from the data.
export const PERSPECTIVES_OVERVIEW_REPLY = `Rezonants Perspectives explore key areas of business and technology transformation:

${PERSPECTIVES_DATA.map((p, i) => `${i + 1}. ${p.tag} — ${p.excerpt}`).join('\n\n')}

You can explore any of these Perspectives on the Rezonants Perspectives page (${PERSPECTIVES_PAGE}), or ask me about a specific one — for example "Tell me about Modern ERP".`

export function getPerspectiveReply(id) {
  const p = PERSPECTIVES_DATA.find((item) => item.id === id)
  if (!p) return null
  return `Rezonants ${p.tag} Perspective — "${p.title}"

${p.excerpt}

In short: ${p.summary}

Key topics: ${p.keyTopics.join(' • ')}

Read the full article: ${p.path}`
}

// Intent objects in the exact shape chatKnowledge.js expects, so the browser
// assistant and this module stay in sync.
export const PERSPECTIVE_INTENTS = [
  {
    id: 'perspectives',
    keywords: PERSPECTIVES_OVERVIEW_KEYWORDS,
    reply: PERSPECTIVES_OVERVIEW_REPLY,
  },
  ...PERSPECTIVES_DATA.map((p) => ({
    id: `perspective-${p.id}`,
    keywords: PERSPECTIVE_KEYWORDS[p.id] || [p.tag.toLowerCase()],
    reply: getPerspectiveReply(p.id),
  })),
]

function normalize(text) {
  return (text || '')
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
    if (words.includes(key)) {
      score += key.length * 2
    } else if (new RegExp(`\\b${escapeRegExp(key)}\\b`).test(text)) {
      score += key.length * 3
    }
  }
  return score
}

/**
 * Deterministic Perspectives answer for one question, or null when the
 * question is not about Perspectives. Used by the chat API so Perspective
 * questions are answered from the official five-Perspective data even when
 * the AI model is unavailable.
 */
export function resolvePerspectivesQuery(text) {
  const q = normalize(text)
  if (!q) return null

  const words = q.split(' ').filter(Boolean)
  let best = null
  let bestScore = 0
  for (const intent of PERSPECTIVE_INTENTS) {
    const score = scoreIntent(intent, q, words)
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }
  if (!best || bestScore === 0) return null

  // Only answer deterministically when the question clearly targets
  // Perspectives: it names them, or matches a distinctive Perspective phrase
  // ("business transformation", "modern erp", "cyber resilience", ...).
  const mentionsPerspectives = /\bperspectiv/.test(q)
  if (!mentionsPerspectives && bestScore < 40) return null

  return best.reply
}
