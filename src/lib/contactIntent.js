// Company contact & location intent handling for the Rezonants chatbot.
//
// Answers the many different ways a visitor can ask for the company's
// contact or location information — "where are you located?", "give me
// your phone number", "how do I reach your office?", "send address",
// "contact info please", "where is Rezonants?", and dozens of variations.
//
// Design rules:
// - Detection is intent-based, not exact-keyword based: it combines
//   contact/location nouns (address, phone, email, location, office,
//   contact, details) with company references ("you", "your",
//   "Rezonants", "your office") and question/action cues ("where ...", "how
//   can I reach ...", "can I visit ...", "get in touch").
// - When the visitor asks for ONE specific detail, that detail is answered
//   first (phone -> phone number, email -> email address, location ->
//   office address). Otherwise the full contact block is returned.
// - No Google Maps / directions URLs or raw encoded location links are ever
//   shown — replies contain only the plain company address and contact data.
// - Office-hours, navigation and consultation-booking questions are
//   deliberately left to their own handlers, so they are never hijacked.
// - Returns null for anything that is not a contact/location question, so
//   the caller keeps its normal flow (AI model, Rezonants knowledge, greetings).
//
// This module is shared by the Vercel API route (api/chat.js), the local
// Express server (server/chat-api.js) and the offline/local fallback
// (src/lib/chatKnowledge.js), so all three chat paths answer identically.

import { CONTACT, formatOfficeListText } from '../config/contact.js'

export { CONTACT }

// Lowercase, strip diacritics/apostrophes, collapse punctuation/hyphens to
// spaces ("e-mail" -> "e mail", "toll-free" -> "toll free").
function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Contact/location nouns. Any one of these is a strong signal.
const ADDRESS_RE =
  /\b(address|addresses|located|location|location details|locations|direction|directions|google maps|map|maps|head office|headquarter|headquarters|hq|physical address|office address|company address|postal address|branch)\b/
const PHONE_RE =
  /\b(phone|phones|telephone|mobile|contact number|phone number|mobile number|telephone number|toll free|customer care|helpline|whatsapp|call centre|call center)\b/
const EMAIL_RE = /\b(e mail|email|mail id|mail address)\b/
const CONTACT_RE =
  /\b(contact|contact info|contact information|contact details|contact number|get in touch|in touch|reach out|company details|company information|your details|your detail|your information|send location|share address|share location)\b/

// Company references and question/action cues used for intent-based matching.
const COMPANY_RE = /\b(you|your|yourself|yourselves|rezonants|us|we|our|company|office|team)\b/
const REACH_RE = /\b(reach|connect|get in touch|contact|visit|come to|find|see you|meet you)\b/
const WHERE_RE = /\bwhere\b/

// Do not hijack questions that belong to another handler.
const OFFICE_HOURS_RE = /\b(open|opens|opening|closed|closes|closing|hours|timing|timings|shift|shifts|when are you)\b/
const SERVICE_NAV_RE =
  /\b(portal|privacy|perspectives|blog)\b/
const BOOKING_RE = /\b(book|booking|consultation|meeting|appointment|demo|schedule a call)\b/
const MARKETING_RE = /\b(email marketing|marketing automation|digital marketing|email campaign)\b/

function isContactIntent(q) {
  // These questions are handled by hours / navigation / booking intents instead.
  const strong = ADDRESS_RE.test(q) || PHONE_RE.test(q) || EMAIL_RE.test(q) || CONTACT_RE.test(q)

  if (OFFICE_HOURS_RE.test(q) && !strong) return false
  if (SERVICE_NAV_RE.test(q) && !strong) return false
  if (BOOKING_RE.test(q) && !strong) return false
  if (MARKETING_RE.test(q)) return false

  return (
    strong ||
    (WHERE_RE.test(q) && COMPANY_RE.test(q)) ||
    (REACH_RE.test(q) && COMPANY_RE.test(q))
  )
}

function fullContactReply() {
  return [
    `You can reach ${CONTACT.companyName} directly:`,
    `- 📞 Toll-free: ${CONTACT.phoneDisplay} | ✉️ Email: ${CONTACT.email} | 🌐 ${CONTACT.website}`,
    `- 🕒 Hours: ${CONTACT.hoursDetailed} | 📅 Book a free consultation: /book-consultation`,
    formatOfficeListText(),
  ].join('\n')
}

function phoneReply() {
  return `Our toll-free phone number is 📞 ${CONTACT.phoneDisplay}. You can also email ✉️ ${CONTACT.email} or visit /book-consultation to schedule a free consultation.`
}

function emailReply() {
  return `You can email ${CONTACT.companyName} at ✉️ ${CONTACT.email}, call 📞 ${CONTACT.phoneDisplay} (toll-free), or use the contact form at /#contact.`
}

function locationReply() {
  return [
    `${CONTACT.companyName} operates from these office locations:`,
    formatOfficeListText(),
    `For inquiries, contact ${CONTACT.email} or ${CONTACT.phoneDisplay}.`,
  ].join('\n')
}

/**
 * Resolve a company contact/location question to a ready-to-send reply.
 *
 * @param {string} text - The visitor's raw message.
 * @returns {string|null} The reply, or null when the message is not a
 *   contact/location question (caller continues its normal flow).
 */
export function resolveContactQuery(text) {
  const q = normalize(text)
  if (!q) return null
  if (!isContactIntent(q)) return null

  const wantsPhone = PHONE_RE.test(q)
  const wantsEmail = EMAIL_RE.test(q)
  const wantsAddress = ADDRESS_RE.test(q)
  const wantsGeneral = CONTACT_RE.test(q) || (!wantsPhone && !wantsEmail && !wantsAddress)

  // One specific detail requested -> answer it first.
  if (!wantsGeneral) {
    if (wantsPhone) return phoneReply()
    if (wantsEmail) return emailReply()
    if (wantsAddress) return locationReply()
  }

  return fullContactReply()
}
