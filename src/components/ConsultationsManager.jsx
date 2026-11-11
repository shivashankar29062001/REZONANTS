import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from '../i18n/TranslationContext'
import {
  CONSULTATION_TIME_SLOTS,
  deleteConsultation,
  listConsultations,
  updateConsultation,
} from '../lib/database'

function ConsultationsManager({ userId, refreshKey = 0, onNotify }) {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    service: '',
    preferred_date: '',
    preferred_time: '',
    budget: '',
    requirements: '',
    status: 'new',
  })

  const serviceOptions = Object.values(t('consultation.services', { returnObjects: true }) || {})
  const budgetOptions = Object.values(t('consultation.budgets', { returnObjects: true }) || {})

  const load = useCallback(async () => {
    if (!userId) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const rows = await listConsultations(userId)
      setItems(rows)
    } catch (err) {
      onNotify?.({ type: 'error', text: err.message || 'Could not load your consultations.' })
    } finally {
      setLoading(false)
    }
  }, [userId, onNotify])

  useEffect(() => {
    load()
  }, [load, refreshKey])

  const startEdit = (item) => {
    setConfirmDeleteId(null)
    setEditingId(item.id)
    setEditForm({
      service: item.service || '',
      preferred_date: item.preferred_date || '',
      preferred_time: item.preferred_time || '',
      budget: item.budget || '',
      requirements: item.requirements || '',
      status: item.status || 'new',
    })
  }

  const handleSaveEdit = async (e, id) => {
    e.preventDefault()
    if (!editForm.service || !editForm.preferred_date || !editForm.preferred_time) {
      onNotify?.({ type: 'error', text: 'Service, date, and time slot are required.' })
      return
    }
    setSaving(true)
    try {
      const updated = await updateConsultation(id, userId, {
        service: editForm.service,
        preferred_date: editForm.preferred_date,
        preferred_time: editForm.preferred_time,
        budget: editForm.budget || null,
        requirements: editForm.requirements.trim() || null,
        status: editForm.status,
      })
      setItems((prev) => prev.map((row) => (row.id === id ? updated : row)))
      setEditingId(null)
      onNotify?.({ type: 'success', text: 'Consultation updated successfully.' })
    } catch (err) {
      onNotify?.({ type: 'error', text: err.message || 'Failed to update consultation.' })
    } finally {
      setSaving(false)
    }
  }

  const handleCancelStatus = async (item) => {
    setSaving(true)
    try {
      const updated = await updateConsultation(item.id, userId, { status: 'cancelled' })
      setItems((prev) => prev.map((row) => (row.id === item.id ? updated : row)))
      onNotify?.({ type: 'success', text: 'Consultation marked as cancelled.' })
    } catch (err) {
      onNotify?.({ type: 'error', text: err.message || 'Could not update consultation.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setSaving(true)
    try {
      await deleteConsultation(id, userId)
      setItems((prev) => prev.filter((row) => row.id !== id))
      setConfirmDeleteId(null)
      if (editingId === id) setEditingId(null)
      onNotify?.({ type: 'success', text: 'Consultation deleted.' })
    } catch (err) {
      onNotify?.({ type: 'error', text: err.message || 'Failed to delete consultation.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="card crud-empty">
        <p>Loading your consultations…</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="card crud-empty">
        <p>You have no consultations booked yet.</p>
      </div>
    )
  }

  return (
    <div className="crud-list">
      {items.map((item) => (
        <article className="card crud-item" key={item.id}>
          {editingId === item.id ? (
            <form className="crud-edit-form" onSubmit={(e) => handleSaveEdit(e, item.id)}>
              <div className="grid grid-2">
                <div className="input-group">
                  <label htmlFor={`edit-svc-${item.id}`}>Service</label>
                  <select
                    id={`edit-svc-${item.id}`}
                    value={editForm.service}
                    onChange={(e) => setEditForm((f) => ({ ...f, service: e.target.value }))}
                  >
                    {!serviceOptions.includes(editForm.service) && editForm.service && (
                      <option value={editForm.service}>{editForm.service}</option>
                    )}
                    {serviceOptions.map((label) => (
                      <option key={label} value={label}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor={`edit-status-${item.id}`}>Status</label>
                  <select
                    id={`edit-status-${item.id}`}
                    value={editForm.status}
                    onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                  >
                    <option value="new">New</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-2">
                <div className="input-group">
                  <label htmlFor={`edit-date-${item.id}`}>Preferred Date</label>
                  <input
                    id={`edit-date-${item.id}`}
                    type="date"
                    value={editForm.preferred_date}
                    onChange={(e) => setEditForm((f) => ({ ...f, preferred_date: e.target.value }))}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor={`edit-time-${item.id}`}>Preferred Time</label>
                  <select
                    id={`edit-time-${item.id}`}
                    value={editForm.preferred_time}
                    onChange={(e) => setEditForm((f) => ({ ...f, preferred_time: e.target.value }))}
                  >
                    {CONSULTATION_TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor={`edit-budget-${item.id}`}>Estimated Budget</label>
                <select
                  id={`edit-budget-${item.id}`}
                  value={editForm.budget}
                  onChange={(e) => setEditForm((f) => ({ ...f, budget: e.target.value }))}
                >
                  <option value="">Not specified</option>
                  {budgetOptions.map((label) => (
                    <option key={label} value={label}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor={`edit-req-${item.id}`}>Requirements</label>
                <textarea
                  id={`edit-req-${item.id}`}
                  rows={3}
                  value={editForm.requirements}
                  onChange={(e) => setEditForm((f) => ({ ...f, requirements: e.target.value }))}
                />
              </div>
              <div className="crud-actions">
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setEditingId(null)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="crud-item-head">
                <div>
                  <h3>{item.service}</h3>
                  <p className="crud-meta">
                    {item.preferred_date} • {item.preferred_time}
                    {item.budget ? ` • ${item.budget}` : ''}
                  </p>
                </div>
                <span className={`status-pill status-${item.status}`}>{item.status}</span>
              </div>
              <p className="crud-submeta">
                {item.name} ({item.email}) • {item.phone}
                {item.company ? ` • ${item.company}` : ''}
              </p>
              {item.requirements && <p className="crud-body">{item.requirements}</p>}
              <div className="crud-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => startEdit(item)}
                  disabled={saving}
                >
                  Edit / Reschedule
                </button>
                {item.status !== 'cancelled' && item.status !== 'completed' && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleCancelStatus(item)}
                    disabled={saving}
                  >
                    Mark Cancelled
                  </button>
                )}
                {confirmDeleteId === item.id ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={saving}
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setConfirmDeleteId(null)}
                      disabled={saving}
                    >
                      Keep
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setConfirmDeleteId(item.id)}
                    disabled={saving}
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
  )
}

export default ConsultationsManager
