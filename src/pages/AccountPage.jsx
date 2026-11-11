import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuthErrorMessage, useAuth } from '../lib/auth'
import {
  createContactMessage,
  deleteContactMessage,
  listContactMessages,
  updateContactMessage,
} from '../lib/database'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import ConsultationsManager from '../components/ConsultationsManager'

function AccountPage({ onRequireAuth }) {
  const { user, profile, loading, updateProfile, updatePassword } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [toast, setToast] = useState(null)

  const [profileForm, setProfileForm] = useState({
    full_name: '',
    company: '',
    phone: '',
  })
  const [savingProfile, setSavingProfile] = useState(false)

  const [pwForm, setPwForm] = useState({ password: '', confirmPassword: '' })
  const [savingPw, setSavingPw] = useState(false)

  const [messages, setMessages] = useState([])
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [newMsg, setNewMsg] = useState({ company: '', subject: '', message: '' })
  const [savingMsg, setSavingMsg] = useState(false)
  const [editingMsgId, setEditingMsgId] = useState(null)
  const [editMsgForm, setEditMsgForm] = useState({ company: '', subject: '', message: '' })
  const [confirmDeleteMsgId, setConfirmDeleteMsgId] = useState(null)

  useDocumentMeta({
    title: 'My Account & Bookings — Rezonants',
    description: 'Manage your Rezonants profile, scheduled consultations, and contact inquiries.',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!user) return
    setProfileForm({
      full_name: profile?.full_name || user.user_metadata?.full_name || '',
      company: profile?.company || '',
      phone: profile?.phone || '',
    })
  }, [user, profile])

  const loadMessages = useCallback(async () => {
    if (!user?.id) {
      setMessages([])
      return
    }
    setLoadingMsgs(true)
    try {
      const rows = await listContactMessages(user.id)
      setMessages(rows)
    } catch (err) {
      setToast({ type: 'error', text: err.message || 'Could not load your messages.' })
    } finally {
      setLoadingMsgs(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (activeTab === 'messages' && user?.id) {
      loadMessages()
    }
  }, [activeTab, user?.id, loadMessages])

  const handleProfileSave = async (e) => {
    e.preventDefault()
    if (!profileForm.full_name.trim()) {
      setToast({ type: 'error', text: 'Full name is required.' })
      return
    }
    setSavingProfile(true)
    try {
      await updateProfile({
        full_name: profileForm.full_name.trim(),
        company: profileForm.company.trim(),
        phone: profileForm.phone.trim(),
      })
      setToast({ type: 'success', text: 'Profile saved to database.' })
    } catch (err) {
      setToast({ type: 'error', text: getAuthErrorMessage(err) })
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    if (pwForm.password.length < 6) {
      setToast({ type: 'error', text: 'Password must be at least 6 characters.' })
      return
    }
    if (pwForm.password !== pwForm.confirmPassword) {
      setToast({ type: 'error', text: 'Passwords do not match.' })
      return
    }
    setSavingPw(true)
    try {
      await updatePassword(pwForm.password)
      setPwForm({ password: '', confirmPassword: '' })
      setToast({ type: 'success', text: 'Password updated successfully.' })
    } catch (err) {
      setToast({ type: 'error', text: getAuthErrorMessage(err) })
    } finally {
      setSavingPw(false)
    }
  }

  const handleCreateMessage = async (e) => {
    e.preventDefault()
    if (!newMsg.message.trim()) {
      setToast({ type: 'error', text: 'Please enter a message.' })
      return
    }
    setSavingMsg(true)
    try {
      await createContactMessage({
        user_id: user.id,
        name: profileForm.full_name.trim() || user.email,
        email: user.email,
        company: newMsg.company.trim() || profileForm.company.trim() || null,
        subject: newMsg.subject.trim() || null,
        message: newMsg.message.trim(),
      })
      setNewMsg({ company: '', subject: '', message: '' })
      await loadMessages()
      setToast({ type: 'success', text: 'Inquiry submitted and stored in Supabase.' })
    } catch (err) {
      setToast({ type: 'error', text: err.message || 'Could not send message.' })
    } finally {
      setSavingMsg(false)
    }
  }

  const handleSaveMsgEdit = async (e, id) => {
    e.preventDefault()
    if (!editMsgForm.message.trim()) {
      setToast({ type: 'error', text: 'Message text cannot be empty.' })
      return
    }
    setSavingMsg(true)
    try {
      const updated = await updateContactMessage(id, user.id, {
        company: editMsgForm.company.trim() || null,
        subject: editMsgForm.subject.trim() || null,
        message: editMsgForm.message.trim(),
      })
      setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)))
      setEditingMsgId(null)
      setToast({ type: 'success', text: 'Message updated.' })
    } catch (err) {
      setToast({ type: 'error', text: err.message || 'Failed to update message.' })
    } finally {
      setSavingMsg(false)
    }
  }

  const handleDeleteMessage = async (id) => {
    setSavingMsg(true)
    try {
      await deleteContactMessage(id, user.id)
      setMessages((prev) => prev.filter((m) => m.id !== id))
      setConfirmDeleteMsgId(null)
      setToast({ type: 'success', text: 'Message deleted.' })
    } catch (err) {
      setToast({ type: 'error', text: err.message || 'Failed to delete message.' })
    } finally {
      setSavingMsg(false)
    }
  }

  return (
    <>
      <section className="subpage-hero consult-hero">
        <div className="container">
          <div className="consult-hero-inner">
            <span className="badge">Account Portal</span>
            <h1>
              Manage Your <em>Rezonants</em> Account
            </h1>
            <p>
              Update your profile, track or reschedule consultations, and manage your submitted inquiries.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container account-shell">
          {!loading && !user ? (
            <div className="card consult-card consult-auth-gate">
              <div className="section-header consult-heading">
                <span className="badge">Authentication Required</span>
                <h2>Sign in to view your account</h2>
                <p>
                  Sign in or create a free Rezonants account to manage your profile, bookings, and inquiries.
                </p>
              </div>
              <div className="crud-actions">
                <button type="button" className="btn btn-primary btn-lg" onClick={() => onRequireAuth('login')}>
                  Sign In
                </button>
                <button type="button" className="btn btn-ghost btn-lg" onClick={() => onRequireAuth('signup')}>
                  Create Account
                </button>
              </div>
            </div>
          ) : !loading && user ? (
            <>
              <div className="account-tabs" role="tablist" aria-label="Account sections">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'profile'}
                  className={`account-tab ${activeTab === 'profile' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile & Security
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'consultations'}
                  className={`account-tab ${activeTab === 'consultations' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('consultations')}
                >
                  My Consultations
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'messages'}
                  className={`account-tab ${activeTab === 'messages' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('messages')}
                >
                  My Contact Messages
                </button>
              </div>

              {activeTab === 'profile' && (
                <div className="grid grid-2 account-grid">
                  <div className="card consult-card">
                    <div className="section-header consult-heading">
                      <span className="badge">Profile</span>
                      <h2>Personal Details</h2>
                    </div>
                    <form onSubmit={handleProfileSave}>
                      <div className="input-group">
                        <label htmlFor="acc-email">Email</label>
                        <input id="acc-email" value={user.email || ''} disabled />
                      </div>
                      <div className="input-group">
                        <label htmlFor="acc-name">Full Name</label>
                        <input
                          id="acc-name"
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm((f) => ({ ...f, full_name: e.target.value }))}
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="acc-company">Company</label>
                        <input
                          id="acc-company"
                          value={profileForm.company}
                          onChange={(e) => setProfileForm((f) => ({ ...f, company: e.target.value }))}
                          placeholder="Company Inc."
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="acc-phone">Phone</label>
                        <input
                          id="acc-phone"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                        {savingProfile ? 'Saving…' : 'Save Profile'}
                      </button>
                    </form>
                  </div>

                  <div className="card consult-card">
                    <div className="section-header consult-heading">
                      <span className="badge">Security</span>
                      <h2>Update Password</h2>
                    </div>
                    <form onSubmit={handlePasswordSave}>
                      <div className="input-group">
                        <label htmlFor="acc-pw">New Password</label>
                        <input
                          id="acc-pw"
                          type="password"
                          value={pwForm.password}
                          onChange={(e) => setPwForm((f) => ({ ...f, password: e.target.value }))}
                          placeholder="Minimum 6 characters"
                          autoComplete="new-password"
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="acc-pw-confirm">Confirm New Password</label>
                        <input
                          id="acc-pw-confirm"
                          type="password"
                          value={pwForm.confirmPassword}
                          onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                          placeholder="Confirm password"
                          autoComplete="new-password"
                        />
                      </div>
                      <button type="submit" className="btn btn-primary" disabled={savingPw}>
                        {savingPw ? 'Updating…' : 'Update Password'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'consultations' && (
                <div className="account-panel">
                  <div className="account-panel-header">
                    <div>
                      <h2>My Consultations</h2>
                      <p>View, reschedule, cancel, or remove your consultation requests.</p>
                    </div>
                    <Link to="/book-consultation" className="btn btn-primary">
                      + Book Consultation
                    </Link>
                  </div>
                  <ConsultationsManager userId={user.id} onNotify={setToast} />
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="grid grid-2 account-grid">
                  <div className="card consult-card">
                    <div className="section-header consult-heading">
                      <span className="badge">New Inquiry</span>
                      <h2>Send a Message</h2>
                    </div>
                    <form onSubmit={handleCreateMessage}>
                      <div className="input-group">
                        <label htmlFor="msg-company">Company</label>
                        <input
                          id="msg-company"
                          value={newMsg.company}
                          onChange={(e) => setNewMsg((m) => ({ ...m, company: e.target.value }))}
                          placeholder={profileForm.company || 'Optional'}
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="msg-subject">Subject</label>
                        <input
                          id="msg-subject"
                          value={newMsg.subject}
                          onChange={(e) => setNewMsg((m) => ({ ...m, subject: e.target.value }))}
                          placeholder="How can we help?"
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="msg-body">Message</label>
                        <textarea
                          id="msg-body"
                          rows={4}
                          value={newMsg.message}
                          onChange={(e) => setNewMsg((m) => ({ ...m, message: e.target.value }))}
                          placeholder="Describe your inquiry…"
                        />
                      </div>
                      <button type="submit" className="btn btn-primary" disabled={savingMsg}>
                        {savingMsg ? 'Sending…' : 'Submit Inquiry'}
                      </button>
                    </form>
                  </div>

                  <div className="account-panel">
                    <h2>Submitted Inquiries</h2>
                    {loadingMsgs ? (
                      <div className="card crud-empty"><p>Loading messages…</p></div>
                    ) : messages.length === 0 ? (
                      <div className="card crud-empty"><p>No inquiries submitted under this account yet.</p></div>
                    ) : (
                      <div className="crud-list">
                        {messages.map((msg) => (
                          <article className="card crud-item" key={msg.id}>
                            {editingMsgId === msg.id ? (
                              <form className="crud-edit-form" onSubmit={(e) => handleSaveMsgEdit(e, msg.id)}>
                                <div className="input-group">
                                  <label htmlFor={`edit-msg-subj-${msg.id}`}>Subject</label>
                                  <input
                                    id={`edit-msg-subj-${msg.id}`}
                                    value={editMsgForm.subject}
                                    onChange={(e) => setEditMsgForm((f) => ({ ...f, subject: e.target.value }))}
                                  />
                                </div>
                                <div className="input-group">
                                  <label htmlFor={`edit-msg-comp-${msg.id}`}>Company</label>
                                  <input
                                    id={`edit-msg-comp-${msg.id}`}
                                    value={editMsgForm.company}
                                    onChange={(e) => setEditMsgForm((f) => ({ ...f, company: e.target.value }))}
                                  />
                                </div>
                                <div className="input-group">
                                  <label htmlFor={`edit-msg-body-${msg.id}`}>Message</label>
                                  <textarea
                                    id={`edit-msg-body-${msg.id}`}
                                    rows={3}
                                    value={editMsgForm.message}
                                    onChange={(e) => setEditMsgForm((f) => ({ ...f, message: e.target.value }))}
                                  />
                                </div>
                                <div className="crud-actions">
                                  <button type="submit" className="btn btn-primary btn-sm" disabled={savingMsg}>
                                    {savingMsg ? 'Saving…' : 'Save'}
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => setEditingMsgId(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <>
                                <div className="crud-item-head">
                                  <div>
                                    <h3>{msg.subject || 'General Inquiry'}</h3>
                                    <p className="crud-meta">
                                      {new Date(msg.created_at).toLocaleDateString()}
                                      {msg.company ? ` • ${msg.company}` : ''}
                                    </p>
                                  </div>
                                  <span className={`status-pill status-${msg.status}`}>{msg.status}</span>
                                </div>
                                <p className="crud-body">{msg.message}</p>
                                <div className="crud-actions">
                                  <button
                                    type="button"
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => {
                                      setEditingMsgId(msg.id)
                                      setEditMsgForm({
                                        company: msg.company || '',
                                        subject: msg.subject || '',
                                        message: msg.message || '',
                                      })
                                    }}
                                  >
                                    Edit
                                  </button>
                                  {confirmDeleteMsgId === msg.id ? (
                                    <>
                                      <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteMessage(msg.id)}
                                        disabled={savingMsg}
                                      >
                                        Confirm Delete
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => setConfirmDeleteMsgId(null)}
                                      >
                                        Keep
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      className="btn btn-ghost btn-sm"
                                      onClick={() => setConfirmDeleteMsgId(msg.id)}
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : null}
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

export default AccountPage

