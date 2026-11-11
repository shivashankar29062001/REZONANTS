import { supabase } from './supabase'

export const CONSULTATION_TIME_SLOTS = [
  '9:00 AM – 10:00 AM',
  '10:30 AM – 11:30 AM',
  '12:00 PM – 1:00 PM',
  '2:00 PM – 3:00 PM',
  '3:30 PM – 4:30 PM',
  '5:00 PM – 6:00 PM',
]

function getClient() {
  if (!supabase) {
    throw new Error('Backend service is not configured.')
  }
  return supabase
}

/* ── Profiles CRUD ────────────────────────────────────────────────────────── */

export async function getProfile(userId) {
  const client = getClient()
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function upsertProfile({ id, email, full_name, company = '', phone = '' }) {
  const client = getClient()
  const { data, error } = await client
    .from('profiles')
    .upsert(
      {
        id,
        email,
        full_name,
        company,
        phone,
      },
      { onConflict: 'id' },
    )
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProfileRecord(userId, updates) {
  const client = getClient()
  const { data, error } = await client
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

/* ── Consultations CRUD ───────────────────────────────────────────────────── */

export async function listConsultations(userId) {
  const client = getClient()
  const { data, error } = await client
    .from('consultations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createConsultation(payload) {
  const client = getClient()
  const { data, error } = await client
    .from('consultations')
    .insert([payload])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateConsultation(id, userId, updates) {
  const client = getClient()
  const { data, error } = await client
    .from('consultations')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteConsultation(id, userId) {
  const client = getClient()
  const { error } = await client
    .from('consultations')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

/* ── Contact Messages CRUD ────────────────────────────────────────────────── */

export async function listContactMessages(userId) {
  const client = getClient()
  const { data, error } = await client
    .from('contact_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createContactMessage(payload) {
  const client = getClient()
  // Omit .select() so anonymous visitors (who do not have SELECT RLS access) can submit cleanly.
  const { error } = await client.from('contact_messages').insert([payload])
  if (error) throw error
}

export async function updateContactMessage(id, userId, updates) {
  const client = getClient()
  const { data, error } = await client
    .from('contact_messages')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteContactMessage(id, userId) {
  const client = getClient()
  const { error } = await client
    .from('contact_messages')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

/* ── Public Catalog Reads ─────────────────────────────────────────────────── */

export async function listServices() {
  const client = getClient()
  const { data, error } = await client
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })
  if (error) throw error
  return data || []
}

export async function listProjects() {
  const client = getClient()
  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('order_index', { ascending: true })
  if (error) throw error
  return data || []
}

export async function listTestimonials() {
  const client = getClient()
  const { data, error } = await client
    .from('testimonials')
    .select('*')
    .eq('is_published', true)
    .order('order_index', { ascending: true })
  if (error) throw error
  return data || []
}
