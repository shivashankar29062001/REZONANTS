import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { getProfile, upsertProfile } from './database'

// Public URL of the deployed site, used for links inside account emails.
const configuredSiteUrl = (import.meta.env.VITE_SITE_URL || '').trim()
const SITE_URL = (
  configuredSiteUrl ||
  (typeof window !== 'undefined'
    ? window.location.origin + (import.meta.env.BASE_URL || '/')
    : 'https://rezonants.com')
).replace(/\/+$/, '')

function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Authentication service is not configured.')
  }
  return supabase
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isRecovery, setIsRecovery] = useState(false)
  const [isConfirmingEmail, setIsConfirmingEmail] = useState(false)

  const syncProfile = useCallback(async (authUser) => {
    if (!supabase || !authUser?.id) {
      setProfile(null)
      return null
    }
    try {
      const existing = await getProfile(authUser.id)
      if (existing) {
        setProfile(existing)
        return existing
      }
      const created = await upsertProfile({
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || '',
      })
      setProfile(created)
      return created
    } catch (err) {
      console.error('Failed to load user profile:', err)
      return null
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return undefined
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        syncProfile(session.user)
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        syncProfile(session.user)
      } else {
        setProfile(null)
      }
      setLoading(false)
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true)
      }
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setIsRecovery(false)
      }
    })

    return () => listener?.subscription.unsubscribe()
  }, [syncProfile])

  // Email-confirmation callback: Supabase's default confirmation link
  // verifies the address AND establishes a session, logging the visitor
  // straight in. We want the visitor to confirm, then sign in manually, so:
  // mark the URL as a confirmation callback, exchange/verify as Supabase
  // intends, then immediately sign out of that confirmation-created session
  // and open the existing Sign In view. Expired or invalid links are routed
  // to an error view that offers a resend option.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hash = window.location.hash
    const code = params.get('code')
    const tokenHash = params.get('token_hash') || params.get('hashed_token')
    const type = params.get('type')

    // Password-recovery links are handled separately via the
    // PASSWORD_RECOVERY auth event.
    if (type === 'recovery') return

    // Implicit (hash) links carry the session in the URL fragment.
    const isImplicit =
      (hash.includes('type=signup') || hash.includes('type=email')) && hash.includes('access_token')
    // PKCE links carry an authorization code in the query string.
    const isPkce = !!code
    // Token-hash links carry a token_hash in the query string.
    const isTokenHash = !!tokenHash && (!type || type === 'signup' || type === 'email')

    if (!supabase || (!isImplicit && !isPkce && !isTokenHash)) return

    let cancelled = false
    setIsConfirmingEmail(true)

    const stripSearch = (search) =>
      search.replace(/([?&])(code|token_hash|hashed_token|type|next)=[^&]*/g, '').replace(/\?&/, '?')
    const stripHash = (h) =>
      h
        .replace(/#(access_token|token|type|expires_in|refresh_token|provider_token|expires_at)=[^&]*/g, '')
        .replace(/&+/g, '&')
        .replace(/[?#&]+$/, '')

    const redirectWith = (status) => {
      if (cancelled) return
      setIsConfirmingEmail(false)
      const clean =
        window.location.pathname +
        (stripSearch(window.location.search) || '') +
        (stripHash(window.location.hash) || '')
      window.history.replaceState(null, '', clean || window.location.pathname)
      window.location.assign(window.location.origin + (import.meta.env.BASE_URL || '/') + `?confirmed=${status}#auth`)
    }

    const finish = () => redirectWith('1')
    const fail = () => redirectWith('error')

    // Establish the session from the confirmation link, then sign the visitor
    // out so they confirm their email and then sign in manually.
    const establishSession = async () => {
      // A session may already exist (implicit hash links are applied by
      // supabase-js on initialisation). Retry briefly to cover the async init.
      for (let attempt = 0; attempt < 10; attempt++) {
        if (cancelled) throw new Error('Cancelled')
        const { data: { session } } = await supabase.auth.getSession()
        if (session) return
        if (!isImplicit) break
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      if (isPkce) {
        await supabase.auth.exchangeCodeForSession(code)
        return
      }
      if (isTokenHash) {
        await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type || 'signup' })
        return
      }
      throw new Error('No confirmation parameters found')
    }

    establishSession()
      .then(() => supabase.auth.signOut().catch(() => {}))
      .then(finish)
      .catch(fail)

    return () => {
      cancelled = true
    }
  }, [])

  async function signUp(email, password, fullName) {
    const { data, error } = await getSupabaseClient().auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        // Supabase reads the confirmation-email redirect from emailRedirectTo
        // (not redirectTo, which is ignored by signUp). It must be a publicly
        // reachable URL because the email is usually opened on a different
        // device. When the visitor clicks the link they land back on the site
        // and are taken to the existing Sign In view.
        emailRedirectTo: `${SITE_URL}/`,
      },
    })
    if (error) throw error
    return data
  }

  // Resend the confirmation email. Supabase has no dedicated resend endpoint on
  // the client, so we call signUp again with the same credentials: for an
  // existing but unconfirmed user GoTrue resends the confirmation email.
  async function resendVerificationEmail(email, password) {
    const { error } = await getSupabaseClient().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${SITE_URL}/`,
      },
    })
    if (error) throw error
  }

  async function signIn(email, password) {
    const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    const { error } = await getSupabaseClient().auth.signOut()
    if (error) throw error
  }

  async function resetPassword(email) {
    const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/`,
    })
    if (error) throw error
  }

  async function updatePassword(newPassword) {
    const { error } = await getSupabaseClient().auth.updateUser({ password: newPassword })
    if (error) throw error
  }

  async function updateProfile({ full_name, company, phone }) {
    if (!user?.id) throw new Error('You must be signed in to update your profile.')
    const updated = await upsertProfile({
      id: user.id,
      email: user.email || '',
      full_name: full_name ?? profile?.full_name ?? '',
      company: company ?? profile?.company ?? '',
      phone: phone ?? profile?.phone ?? '',
    })
    setProfile(updated)
    if (typeof full_name === 'string') {
      await getSupabaseClient().auth.updateUser({
        data: { full_name },
      })
    }
    return updated
  }

  async function refreshProfile() {
    if (!user) return null
    return syncProfile(user)
  }

  const value = {
    session,
    user,
    profile,
    loading,
    isRecovery,
    isConfirmingEmail,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile,
    resendVerificationEmail,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function getAuthErrorMessage(error) {
  if (!error?.message) return 'Something went wrong. Please try again.'
  const msg = error.message.toLowerCase()
  if (msg.includes('invalid login credentials')) return 'Invalid email or password. Please try again.'
  if (msg.includes('email not confirmed') || msg.includes('email not verified'))
    return 'Please confirm your email address before signing in. Check your inbox for the confirmation link.'
  if (msg.includes('already registered')) return 'An account with this email already exists. Try signing in instead.'
  if (msg.includes('password should be at least')) return 'Password must be at least 6 characters.'
  if (msg.includes('rate limit') || msg.includes('too many requests'))
    return 'Too many attempts. Please wait a moment and try again.'
  if (msg.includes('network') || msg.includes('fetch')) return 'Could not reach our servers. Check your connection and try again.'
  return error.message
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
