import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthErrorMessage, useAuth } from '../lib/auth'
import { useTranslation } from '../i18n/TranslationContext'
import { BrandLogo } from './BrandLogo.jsx'

function AuthModal({ open, mode, onClose, onSwitchMode, redirectTo, notice }) {
  const { signUp, signIn, isRecovery, resetPassword, updatePassword, resendVerificationEmail } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [serverMessage, setServerMessage] = useState(null)
  const [showResend, setShowResend] = useState(false)
  const [resendStatus, setResendStatus] = useState('idle')
  const [resendError, setResendError] = useState(null)

  const isLogin = mode === 'login'

  const [view, setView] = useState(mode === 'forgot' || isRecovery ? (isRecovery ? 'recovery' : 'forgot') : isLogin ? 'login' : 'signup')

  useEffect(() => {
    setErrors({})
    setStatus('idle')
    setAcceptedTerms(false)
    setShowResend(false)
    setResendStatus('idle')
    setResendError(null)
    // Always start with blank credentials on every open/mode change so nothing
    // typed during Sign Up is carried into the Sign In form — including after
    // the visitor confirms their email and is brought back to sign in.
    setForm({ fullName: '', email: '', password: '', confirmPassword: '' })
    if (isRecovery) {
      setView('recovery')
      setServerMessage(null)
    } else {
      setView(mode === 'forgot' ? 'forgot' : mode === 'login' ? 'login' : 'signup')
      // `notice` is supplied by the app when returning from an email
      // confirmation; it is shown once and cleared when the modal closes.
      setServerMessage(notice ?? null)
      setShowResend(notice?.showResend ?? false)
    }
  }, [open, mode, isRecovery, notice])

  if (!open) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const next = {}
    if (view === 'forgot') {
      if (!form.email.trim()) next.email = t('auth.validation.emailRequired')
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = t('auth.validation.emailInvalid')
      return next
    }
    if (view === 'recovery') {
      if (!form.password) next.password = t('auth.validation.passwordRequired')
      else if (form.password.length < 6) next.password = t('auth.validation.passwordMinLength')
      if (form.confirmPassword !== form.password) next.confirmPassword = t('auth.validation.passwordsNoMatch')
      return next
    }
    if (!isLogin && !form.fullName.trim()) next.fullName = t('auth.validation.fullNameRequired')
    if (!form.email.trim()) next.email = t('auth.validation.emailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = t('auth.validation.emailInvalid')
    if (!form.password) next.password = t('auth.validation.passwordRequired')
    else if (form.password.length < 6) next.password = t('auth.validation.passwordMinLength')
    if (!isLogin && form.confirmPassword !== form.password) next.confirmPassword = t('auth.validation.passwordsNoMatch')
    if (isLogin && !acceptedTerms) next.acceptedTerms = t('auth.validation.acceptTerms')
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    setServerMessage(null)
    try {
      if (view === 'forgot') {
        await resetPassword(form.email.trim())
        setServerMessage({
          type: 'info',
          text: t('auth.resetSent'),
        })
        setStatus('idle')
      } else if (view === 'recovery') {
        await updatePassword(form.password)
        setForm((f) => ({ ...f, password: '', confirmPassword: '' }))
        setView('login')
        setServerMessage({
          type: 'success',
          text: t('auth.passwordUpdated'),
        })
        setStatus('idle')
      } else if (isLogin) {
        await signIn(form.email.trim(), form.password)
        if (redirectTo) navigate(redirectTo)
        onClose()
      } else {
        const data = await signUp(form.email.trim(), form.password, form.fullName.trim())
        if (data?.session) {
          if (redirectTo) navigate(redirectTo)
          onClose()
        } else {
          setServerMessage({
            type: 'success',
            text: t('auth.accountCreated'),
          })
          setStatus('idle')
          setShowResend(true)
        }
      }
    } catch (err) {
      setStatus('idle')
      setServerMessage({ type: 'error', text: getAuthErrorMessage(err) })
      const msg = err?.message?.toLowerCase() || ''
      if (msg.includes('email not confirmed') || msg.includes('email not verified')) {
        setShowResend(true)
      }
    }
  }

  const handleResend = async () => {
    if (!form.email.trim() || !form.password) {
      setResendStatus('error')
      setResendError(t('auth.resendPromptError', { defaultValue: 'Please enter your email and password above to resend the verification email.' }))
      return
    }
    setResendStatus('sending')
    setResendError(null)
    try {
      await resendVerificationEmail(form.email.trim(), form.password)
      setResendStatus('sent')
    } catch (err) {
      setResendStatus('error')
      setResendError(getAuthErrorMessage(err))
    }
  }

  const goTo = (nextView) => () => {
    setErrors({})
    setServerMessage(null)
    setStatus('idle')
    setView(nextView)
  }

  const switchTo = (nextMode) => () => {
    setErrors({})
    setServerMessage(null)
    onSwitchMode(nextMode)
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="modal-header">
          <BrandLogo iconOnly className="modal-brand-icon" />
          <h2>
            {view === 'forgot' ? t('auth.forgotPassword') : view === 'recovery' ? t('auth.createNewPassword') : isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
          </h2>
          <p>
            {view === 'forgot'
              ? t('auth.forgotDesc')
              : view === 'recovery'
                ? t('auth.recoveryDesc')
                : isLogin
                  ? t('auth.welcomeBackDesc')
                  : t('auth.createAccountDesc')}
          </p>
        </div>

        {serverMessage && (
          <div className={`alert alert-${serverMessage.type}`} role="status">
            {serverMessage.text}
          </div>
        )}

        {showResend && (
          <div className="resend-verification">
            <p className="resend-hint">{t('auth.resendVerificationHint', { defaultValue: "Didn't receive the verification email?" })}</p>
            <button
              type="button"
              className="link-btn"
              onClick={handleResend}
              disabled={resendStatus === 'sending'}
            >
              {resendStatus === 'sending' ? t('auth.sending', { defaultValue: 'Sending…' }) : t('auth.resendVerificationBtn', { defaultValue: 'Resend verification email' })}
            </button>
            {resendStatus === 'sent' && (
              <p className="resend-success">{t('auth.resendSuccess', { defaultValue: 'Verification email resent! Please check your inbox.' })}</p>
            )}
            {resendStatus === 'error' && resendError && (
              <p className="resend-error">{resendError}</p>
            )}
          </div>
        )}

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          {view === 'signup' && (
            <div className="input-group">
              <label htmlFor="fullName">{t('auth.fullName')}</label>
              <input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder={t('auth.placeholders.fullName', { defaultValue: 'Jane Doe' })}
                autoComplete="name"
                className={errors.fullName ? 'input-error' : ''}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>
          )}

          {view !== 'recovery' && (
            <div className="input-group">
              <label htmlFor="auth-email">{t('auth.email')}</label>
              <input
                id="auth-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t('auth.placeholders.email', { defaultValue: 'jane@company.com' })}
                autoComplete="email"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          )}

          {view !== 'forgot' && (
          <div className="input-group">
            <label htmlFor="auth-password">{view === 'recovery' ? t('auth.newPassword') : t('auth.password')}</label>
            <input
              id="auth-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          )}

          {view !== 'login' && view !== 'forgot' && (
            <div className="input-group">
              <label htmlFor="confirmPassword">{view === 'recovery' ? t('auth.confirmNewPassword') : t('auth.confirmPassword')}</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          )}

          {view === 'login' && (
            <>
              <div className="auth-row">
                <button type="button" className="link-btn forgot-link" onClick={goTo('forgot')}>
                  {t('auth.forgotPasswordLink')}
                </button>
              </div>
              <div className="input-group">
                <label className="check-row">
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    aria-invalid={errors.acceptedTerms ? 'true' : undefined}
                  />
                  <span>
                    <span dangerouslySetInnerHTML={{ __html: t('auth.privacyPolicy') }} />
                  </span>
                </label>
                {errors.acceptedTerms && <span className="error-message">{errors.acceptedTerms}</span>}
              </div>
            </>
          )}
          <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'submitting'}>
            {status === 'submitting'
              ? t('auth.pleaseWait')
              : view === 'forgot'
                ? t('auth.sendResetLink')
                : view === 'recovery'
                  ? t('auth.createNewPassword')
                  : isLogin
                    ? t('auth.signIn')
                    : t('auth.signUp')}
          </button>
        </form>

        <div className="modal-footer">
          {view === 'forgot' ? (
            <p>
              {t('auth.rememberedPassword')}{' '}
              <button type="button" className="link-btn" onClick={goTo('login')}>
                {t('auth.signInLink')}
              </button>
            </p>
          ) : view === 'recovery' ? (
            <p>
              {t('auth.changedMind')}{' '}
              <button type="button" className="link-btn" onClick={goTo('login')}>
                {t('auth.backToSignIn')}
              </button>
            </p>
          ) : isLogin ? (
            <p>
              {t('auth.noAccount')}{' '}
              <button type="button" className="link-btn" onClick={switchTo('signup')}>
                {t('auth.signUpLink')}
              </button>
            </p>
          ) : (
            <p>
              {t('auth.hasAccount')}{' '}
              <button type="button" className="link-btn" onClick={switchTo('login')}>
                {t('auth.signInLink')}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
