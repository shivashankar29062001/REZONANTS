import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CONSULTATION_TIME_SLOTS, createConsultation } from '../lib/database'
import { useAuth } from '../lib/auth'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { useTranslation } from '../i18n/TranslationContext'
import ConsultationsManager from '../components/ConsultationsManager'
import PhoneInput from '../components/PhoneInput'
import {
  DEFAULT_COUNTRY,
  formatE164,
  phoneValidationMessage,
  validatePhoneDigits,
} from '../lib/phone'

const TIME_SLOTS = CONSULTATION_TIME_SLOTS

const CONTACT = {
  phone: '18004103299',
  phoneHref: 'tel:18004103299',
  email: 'info@rezonants.com',
  emailHref: 'mailto:info@rezonants.com',
  address:
    'SBR Towers, Axis bank building, Second Floor, D No 1/98/93/23, HUDA Tecno Encalve Cyber Hills Colony, VIP Hills, Jaihind Enclave, Madhapur, Hyderabad, Telangana 500081',
}

function BookConsultationPage({ onRequireAuth }) {
  const location = useLocation()
  const { user, profile, loading } = useAuth()
  const { t } = useTranslation()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    phone_country: DEFAULT_COUNTRY,
    company: '',
    service: location.state?.service || '',
    preferred_date: '',
    preferred_time: '',
    budget: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [toast, setToast] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!user) return
    setForm((f) => ({
      ...f,
      name: f.name || profile?.full_name || user.user_metadata?.full_name || '',
      email: f.email || user.email || '',
      company: f.company || profile?.company || '',
    }))
  }, [user, profile])

  useDocumentMeta({
    title: t('consultation.badge') + ' — Rezonants',
    description: t('consultation.description'),
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  const today = () => {
    const d = new Date()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${m}-${day}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handlePhoneChange = ({ phone, country }) => {
    setForm((f) => ({ ...f, phone, phone_country: country }))
    setErrors((prev) => {
      if (!prev.phone) return prev
      const next = { ...prev }
      delete next.phone
      return next
    })
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = t('consultation.validation.nameRequired')
    if (!form.email.trim()) next.email = t('consultation.validation.emailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = t('consultation.validation.emailInvalid')
    const phoneResult = validatePhoneDigits(form.phone, form.phone_country)
    if (phoneResult) next.phone = phoneValidationMessage(t, phoneResult)
    if (!form.service) next.service = t('consultation.validation.serviceRequired')
    if (!form.preferred_date) next.preferred_date = t('consultation.validation.dateRequired')
    if (!form.preferred_time) next.preferred_time = t('consultation.validation.timeRequired')
    if (form.message.trim().length > 0 && form.message.trim().length < 10) {
      next.message = t('consultation.validation.messageTooShort')
    }
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setToast({
        type: 'error',
        text: t('consultation.validation.signInRequired'),
      })
      return
    }
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    try {
      await createConsultation({
        user_id: user.id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: formatE164(form.phone, form.phone_country),
        company: form.company.trim() || null,
        service: form.service,
        preferred_date: form.preferred_date,
        preferred_time: form.preferred_time,
        budget: form.budget || null,
        requirements: form.message.trim(),
      })
      setStatus('success')
      setRefreshKey((k) => k + 1)
      setForm({
        name: profile?.full_name || user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: '',
        phone_country: DEFAULT_COUNTRY,
        company: profile?.company || '',
        service: '',
        preferred_date: '',
        preferred_time: '',
        budget: '',
        message: '',
      })
      setToast({
        type: 'success',
        text: t('consultation.validation.bookedSuccess'),
      })
    } catch {
      setStatus('idle')
      setToast({
        type: 'error',
        text: t('consultation.validation.couldNotBook'),
      })
    }
  }

  return (
    <>
      <section className="subpage-hero consult-hero">
        <div className="container">
          <div className="consult-hero-inner">
            <span className="badge">{t('consultation.badge')}</span>
            <h1>
              <span dangerouslySetInnerHTML={{ __html: t('consultation.title') }} />
            </h1>
            <p>
              {t('consultation.description')}
            </p>
            <div className="hero-actions">
              <a href="#consultation-form" className="btn btn-cta btn-lg">
                {t('consultation.bookSlot')}
              </a>
              <a href="#how-it-works" className="btn btn-glass btn-lg">
                {t('consultation.howItWorks')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="consultation-form">
        <div className="container consult-layout">
          {!loading && !user ? (
            <div className="card contact-form consult-card consult-auth-gate">
              <div className="section-header consult-heading">
                <span className="badge">{t('consultation.accountRequired')}</span>
                <h2>{t('consultation.signInToBook')}</h2>
                <p>
                  {t('consultation.accountRequiredText')}
                </p>
              </div>
              <button type="button" className="btn btn-primary btn-lg" onClick={() => onRequireAuth('login')}>
                {t('consultation.signInToContinue')}
              </button>
              <p className="consult-gate-note">
                {t('consultation.newToRezonants')}{' '}
                <button type="button" className="link-btn" onClick={() => onRequireAuth('signup')}>
                  {t('consultation.createAccount')}
                </button>
              </p>
            </div>
          ) : !loading && user ? (
          <div className="card contact-form consult-card">
            <div className="section-header consult-heading">
              <span className="badge">{t('consultation.requestMeeting')}</span>
              <h2>{t('consultation.tellUsAboutProject')}</h2>
              <p>{t('consultation.fillDetails')}</p>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-2">
                <div className="input-group">
                  <label htmlFor="name">{t('consultation.fullName')}</label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    aria-invalid={errors.name ? 'true' : undefined}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={errors.name ? 'input-error' : ''}
                  />
                  {errors.name && (
                    <span className="error-message" id="name-error">{errors.name}</span>
                  )}
                </div>
                <div className="input-group">
                  <label htmlFor="email">{t('consultation.email')}</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@company.com"
                    autoComplete="email"
                    aria-invalid={errors.email ? 'true' : undefined}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={errors.email ? 'input-error' : ''}
                  />
                  {errors.email && (
                    <span className="error-message" id="email-error">{errors.email}</span>
                  )}
                </div>
              </div>
              <div className="grid grid-2">
                <div className="input-group">
                  <label htmlFor="phone">{t('consultation.phone')}</label>
                  <PhoneInput
                    id="phone"
                    name="phone"
                    value={form.phone}
                    country={form.phone_country}
                    onChange={handlePhoneChange}
                    error={errors.phone}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="company">{t('consultation.company')}</label>
                  <input
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company Inc."
                    autoComplete="organization"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="service">{t('consultation.serviceOfInterest')}</label>
                <select
                  id="service"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  aria-invalid={errors.service ? 'true' : undefined}
                  aria-describedby={errors.service ? 'service-error' : undefined}
                  className={errors.service ? 'input-error' : ''}
                >
                  <option value="">{t('consultation.selectService')}</option>
                  {form.service && !Object.values(t('consultation.services', { returnObjects: true })).includes(form.service) && (
                    <option value={form.service}>{form.service}</option>
                  )}
                  {Object.entries(t('consultation.services', { returnObjects: true })).map(([key, label]) => (
                    <option key={key} value={label}>{label}</option>
                  ))}
                </select>
                {errors.service && (
                  <span className="error-message" id="service-error">{errors.service}</span>
                )}
              </div>
              <div className="grid grid-2">
                <div className="input-group">
                  <label htmlFor="preferred_date">{t('consultation.preferredDate')}</label>
                  <input
                    id="preferred_date"
                    name="preferred_date"
                    type="date"
                    min={today()}
                    value={form.preferred_date}
                    onChange={handleChange}
                    aria-invalid={errors.preferred_date ? 'true' : undefined}
                    aria-describedby={errors.preferred_date ? 'date-error' : undefined}
                    className={errors.preferred_date ? 'input-error' : ''}
                  />
                  {errors.preferred_date && (
                    <span className="error-message" id="date-error">{errors.preferred_date}</span>
                  )}
                </div>
                <div className="input-group">
                  <label htmlFor="preferred_time">{t('consultation.preferredTime')}</label>
                  <select
                    id="preferred_time"
                    name="preferred_time"
                    value={form.preferred_time}
                    onChange={handleChange}
                    aria-invalid={errors.preferred_time ? 'true' : undefined}
                    aria-describedby={errors.preferred_time ? 'time-error' : undefined}
                    className={errors.preferred_time ? 'input-error' : ''}
                  >
                    <option value="">{t('consultation.selectTimeSlot')}</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.preferred_time && (
                    <span className="error-message" id="time-error">{errors.preferred_time}</span>
                  )}
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="budget">{t('consultation.estimatedBudget')}</label>
                <select
                  id="budget"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                >
                  <option value="">{t('consultation.selectRange')}</option>
                  {Object.entries(t('consultation.budgets', { returnObjects: true })).map(([key, label]) => (
                    <option key={key} value={label}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="message">{t('consultation.projectRequirements')}</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your goals, scope, timeline and anything else we should know…"
                  rows={5}
                  aria-invalid={errors.message ? 'true' : undefined}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className={errors.message ? 'input-error' : ''}
                />
                {errors.message && (
                  <span className="error-message" id="message-error">{errors.message}</span>
                )}
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'submitting'}>
                {status === 'submitting' ? t('consultation.booking') : t('consultation.bookFreeConsultation')}
              </button>
              <p className="consult-note">
                {t('consultation.freeNote')}
              </p>
            </form>
          </div>
          ) : null}

          <aside className="consult-side">
            <div className="consult-info card">
              <h3>{t('consultation.whatToExpect')}</h3>
              {Object.values(t('consultation.expectPoints', { returnObjects: true })).map((p, i) => (
                <div className="consult-step" key={p.title}>
                  <span className="consult-step-num">{i + 1}</span>
                  <div>
                    <strong>{p.title}</strong>
                    <p>{p.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="consult-info card">
              <h3>{t('consultation.preferToReachUs')}</h3>
              <ul className="consult-contact">
                <li>
                  <strong>{t('consultation.callUs')}</strong>
                  <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
                </li>
                <li>
                  <strong>{t('consultation.emailUs')}</strong>
                  <a href={CONTACT.emailHref}>{CONTACT.email}</a>
                </li>
                <li>
                  <strong>{t('consultation.visitUs')}</strong>
                  <span>{CONTACT.address}</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {!loading && user && (
        <section className="section" id="my-consultations">
          <div className="container">
            <div className="account-panel-header">
              <div>
                <span className="badge">Your Bookings</span>
                <h2>My Scheduled Consultations</h2>
                <p>Review, reschedule, cancel, or delete your submitted consultations.</p>
              </div>
            </div>
            <ConsultationsManager userId={user.id} refreshKey={refreshKey} onNotify={setToast} />
          </div>
        </section>
      )}

      <section className="section consult-why" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="badge">{t('consultation.whyBookWithUs')}</span>
            <h2>{t('consultation.freeCallTitle')}</h2>
          </div>
<div className="products-grid">
            <article className="card product-card">
              <div className="product-icon preview-icon">1</div>
              <h3>{t('consultation.freeCallNoPressure')}</h3>
              <p>{t('consultation.freeCallNoPressureText')}</p>
            </article>
            <article className="card product-card">
              <div className="product-icon preview-icon">2</div>
              <h3>{t('consultation.seniorConsultants')}</h3>
              <p>{t('consultation.seniorConsultantsText')}</p>
            </article>
            <article className="card product-card">
              <div className="product-icon preview-icon">3</div>
              <h3>{t('consultation.clearTimelines')}</h3>
              <p>{t('consultation.clearTimelinesText')}</p>
            </article>
          </div>
        </div>
      </section>

      {toast && (
        <div className={`toast toast-${toast.type}`} role="status">
          <span>{toast.type === 'success' ? '✓' : '!'}</span>
          <span>{toast.text}</span>
        </div>
      )}
    </>
  )
}

export default BookConsultationPage
