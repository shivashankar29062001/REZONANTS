import { supabase } from './supabase.js'

// Scrub potential personal identifiers before logging an unanswered question.
export function sanitizeUnansweredQuestion(raw) {
  if (typeof raw !== 'string') return ''
  return raw
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email]')
    .replace(/\b\+?\d[\d\s\-().]{6,}\d\b/g, '[phone]')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1000)
}

export async function logUnansweredQuestion(rawQuestion) {
  try {
    if (!supabase) return
    if (typeof process !== 'undefined' && process.env?.SKIP_CHAT_GAP_LOG === '1') {
      return
    }
    const question = sanitizeUnansweredQuestion(rawQuestion)
    if (!question) return
    await supabase.from('chat_unanswered').insert([{ question }])
  } catch {
    // Fire-and-forget gap logging must never disrupt the visitor chat experience.
  }
}

