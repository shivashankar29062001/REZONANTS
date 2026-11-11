import { createClient } from '@supabase/supabase-js'

let viteUrl = ''
let viteAnonKey = ''
try {
  viteUrl = import.meta.env.VITE_SUPABASE_URL || ''
  viteAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
} catch {
  // Plain Node ESM runs without Vite's import.meta.env injection.
}

const nodeUrl =
  typeof process !== 'undefined' && process.env
    ? process.env.VITE_SUPABASE_URL || ''
    : ''
const nodeAnonKey =
  typeof process !== 'undefined' && process.env
    ? process.env.VITE_SUPABASE_ANON_KEY || ''
    : ''

const supabaseUrl = String(viteUrl || nodeUrl).trim()
const supabaseAnonKey = String(viteAnonKey || nodeAnonKey).trim()

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable live backend features.',
  )
}

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export const TABLE = {
  services: 'services',
  projects: 'projects',
  messages: 'messages',
}
