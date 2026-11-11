import { useState, useEffect, useRef, useCallback, Fragment } from 'react'
import { useFocusTrap } from '../../lib/useFocusTrap'
import {
  QUICK_ACTIONS,
  getChatResponse,
  getUserNameFromHistory,
} from '../../lib/chatKnowledge'
import { parseMenuOptions } from '../../lib/chatMenus'
import { useTranslation } from '../../i18n/TranslationContext'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type View = 'closed' | 'open' | 'minimized'

let idCounter = 0
const nextId = (prefix: string) => `${prefix}-${++idCounter}`

// The latest numbered menu the assistant displayed, recovered from the
// message list. It stays available after an option is chosen so a visitor can
// explore another item; a newer menu replaces it, and "New chat" clears it.
function findActiveMenu(messages: Message[], currentCategory?: 'services' | 'technologies' | 'products' | null) {
  if (currentCategory === null) {
    return null
  }
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== 'assistant') continue
    const parsed = parseMenuOptions(messages[i].content)
    if (parsed) return { index: i, type: currentCategory || parsed.type, options: parsed.options }
  }
  return null
}

function getLocalizedWelcomeMessage(t: (key: string, options?: any) => string, date = new Date()) {
  const h = date.getHours()
  let greeting = t('chatbot.greetingMorning', { defaultValue: 'Good morning' })
  if (h >= 12 && h < 16) {
    greeting = t('chatbot.greetingAfternoon', { defaultValue: 'Good afternoon' })
  } else if (h >= 16) {
    greeting = t('chatbot.greetingEvening', { defaultValue: 'Good evening' })
  }
  const welcome = t('chatbot.welcomeText', {
    defaultValue: "! 👋 Welcome to Rezonants.\nI'm the Rezonants AI Assistant. I can help you explore our services, technologies, and contact information.",
  })
  if (!welcome) return greeting
  const trimmedGreeting = greeting.trim()
  const trimmedWelcome = welcome.trim()
  if (/^[!！,.?;:]/.test(trimmedWelcome)) {
    return `${trimmedGreeting}${trimmedWelcome}`
  }
  return `${trimmedGreeting} ${trimmedWelcome}`
}

export const Chatbot = () => {
  const { t, lang } = useTranslation()
  const [view, setView] = useState<View>('closed')
  const [messages, setMessages] = useState<Message[]>([
    { id: nextId('welcome'), role: 'assistant', content: getLocalizedWelcomeMessage(t) },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentMenuCategory, setCurrentMenuCategory] = useState<'services' | 'technologies' | 'products' | null>(null)
  const currentMenuCategoryRef = useRef<'services' | 'technologies' | 'products' | null>(null)

  const updateMenuCategory = (cat: 'services' | 'technologies' | 'products' | null) => {
    currentMenuCategoryRef.current = cat
    setCurrentMenuCategory(cat)
  }

  const panelRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useFocusTrap(panelRef, view === 'open', toggleRef)

  const hasConversation = messages.some((m) => m.role === 'user')

  useEffect(() => {
    if (!hasConversation) {
      setMessages([{ id: nextId('welcome'), role: 'assistant', content: getLocalizedWelcomeMessage(t) }])
    }
  }, [lang, t, hasConversation])

  const scrollToBottom = useCallback(() => {
    const el = messagesRef.current
    if (el) el.scrollTo({ top: el.scrollHeight })
  }, [])

  useEffect(() => {
    if (view === 'open') {
      scrollToBottom()
      const t = window.setTimeout(() => textareaRef.current?.focus(), 60)
      return () => window.clearTimeout(t)
    }
  }, [view, scrollToBottom])

  useEffect(() => {
    const el = messagesRef.current
    if (!el) return

    const lastMsg = messages[messages.length - 1]

    // When the user sends a message, keep it visible (scroll to bottom).
    if (lastMsg?.role === 'user') {
      el.scrollTo({ top: el.scrollHeight })
      return
    }

    // For assistant responses: if the last message is long (taller than the
    // container), scroll to its beginning so the user sees the start. Otherwise
    // scroll to bottom (normal behavior for short responses).
    const assistantEls = el.querySelectorAll('.chatbot-message-assistant')
    const lastAssistantEl = assistantEls[assistantEls.length - 1]

    if (lastAssistantEl && !loading) {
      const msgHeight = lastAssistantEl.getBoundingClientRect().height
      const containerHeight = el.getBoundingClientRect().height

      if (msgHeight > containerHeight * 0.7) {
        // Long response — show its beginning.
        const containerRect = el.getBoundingClientRect()
        const msgRect = lastAssistantEl.getBoundingClientRect()
        const scrollTarget = el.scrollTop + (msgRect.top - containerRect.top)
        el.scrollTo({ top: scrollTarget })
      } else {
        el.scrollTo({ top: el.scrollHeight })
      }
    } else {
      el.scrollTo({ top: el.scrollHeight })
    }
  }, [messages, loading])

  useEffect(() => {
    if (view !== 'open') return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView('closed')
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [view])

  const openChat = () => {
    setView('open')
  }

  const minimizeChat = () => {
    setView('minimized')
  }

  const closeChat = () => {
    setView('closed')
  }

  const expandChat = () => {
    setView('open')
  }

  const resetChat = () => {
    // New chat: conversation memory (including the visitor's name) resets,
    // and the welcome greeting reflects the current time.
    setMessages([{ id: nextId('welcome'), role: 'assistant', content: getLocalizedWelcomeMessage(t) }])
    setInput('')
    updateMenuCategory(null)
  }

  const appendMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [...prev, { id: nextId(role), role, content }])
  }

  const sendMessage = useCallback(
    async (raw: string, displayLabel?: string) => {
      const text = raw.trim()
      if (!text || loading) return

      appendMessage('user', displayLabel ? displayLabel.trim() : text)
      setInput('')
      setLoading(true)

      // Full conversation for this chat (welcome message excluded), capped to
      // keep the payload bounded. Sending the WHOLE history (not just the last
      // few turns) lets the assistant recall a name shared many messages ago;
      // resetChat() clears this list, so "New chat" also resets memory.
      const history = messages
        .filter((m) => !m.id.startsWith('welcome'))
        .slice(-40)
        .map(({ role, content }) => ({ role, content }))
      // Name stated anywhere in the CURRENT chat (including this message),
      // newest statement wins.
      const statedName = getUserNameFromHistory([...history, { role: 'user', content: text }])
      // Visitor's local clock so time-based greetings (morning/afternoon/
      // evening) come from the user's environment, not the server's.
      const localTime = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })

      try {
        const controller = new AbortController()
        const timer = window.setTimeout(() => controller.abort(), 30000)
        let res: Response
        try {
          res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: text,
              history,
              userName: statedName,
              localTime,
              lang,
              currentMenuCategory: currentMenuCategoryRef.current,
            }),
            signal: controller.signal,
          })
        } finally {
          window.clearTimeout(timer)
        }

        const data = await res.json().catch(() => null)
        if (!res.ok || !data || data.error) {
          throw new Error(data?.error || 'Request failed')
        }

        if ('currentMenuCategory' in data) {
          updateMenuCategory(data.currentMenuCategory || null)
        } else {
          const parsed = parseMenuOptions(data.response)
          if (parsed) {
            updateMenuCategory(parsed.type)
          } else {
            updateMenuCategory(null)
          }
        }

        appendMessage('assistant', data.response)
      } catch {
        // Fallback (API unreachable): pass the conversation so name memory,
        // follow-ups and context also work in the local path.
        const local = await getChatResponse(text, history, lang, currentMenuCategoryRef.current)
        if (typeof local === 'object' && local !== null && 'currentMenuCategory' in local) {
          updateMenuCategory((local as any).currentMenuCategory || null)
          appendMessage('assistant', (local as any).response || '')
        } else {
          const textResponse = typeof local === 'string' ? local : (local as any)?.response || ''
          const parsed = parseMenuOptions(textResponse)
          if (parsed) {
            updateMenuCategory(parsed.type)
          } else {
            updateMenuCategory(null)
          }
          appendMessage('assistant', textResponse)
        }
      } finally {
        setLoading(false)
      }
    },
    [loading, messages, lang],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`
  }

  const canSend = input.trim().length > 0 && !loading

  // Clicking an option sends the very same number a visitor would have typed,
  // so both routes resolve through identical intent logic.
  const activeMenu = findActiveMenu(messages, currentMenuCategory)

  return (
    <div className="chatbot-root">
      {view === 'closed' && (
        <>
          <button
            ref={toggleRef}
            type="button"
            className="chatbot-toggle"
            onClick={openChat}
            aria-label={t('chatbot.openChatLabel')}
            title={t('chatbot.chatWithRezonantsAi')}
          >
            <svg
              className="chatbot-toggle-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              <path d="M12 11.5v.01" />
              <path d="M16 11.5v.01" />
              <path d="M8 11.5v.01" />
            </svg>
            <span className="chatbot-toggle-badge" aria-hidden="true">
              AI
            </span>
          </button>
        </>
      )}

      {view !== 'closed' && (
        <>
          <div
            ref={panelRef}
            className={`chatbot-panel${view === 'minimized' ? ' chatbot-panel-minimized' : ''}`}
            role={view === 'minimized' ? undefined : 'dialog'}
            aria-modal={view === 'minimized' ? undefined : 'true'}
            aria-labelledby={view === 'minimized' ? undefined : 'chatbot-title'}
          >
            <header className="chatbot-header">
              <div className="chatbot-header-brand">
                <img src={`${import.meta.env.BASE_URL}img/rezonants-ai-assistant-icon.svg`} alt="" className="chatbot-header-logo" />
                <div className="chatbot-header-text">
                  <h2 id="chatbot-title">{t('chatbot.chatTitle')}</h2>
                  <span className="chatbot-status">
                    <span className="chatbot-status-dot" aria-hidden="true" />
                    {t('chatbot.online')}
                  </span>
                </div>
              </div>

              <div className="chatbot-header-actions">
                {view === 'minimized' ? (
                  <button
                    type="button"
                    className="chatbot-header-btn"
                    onClick={expandChat}
                    aria-label={t('chatbot.expandLabel')}
                    title={t('chatbot.expand')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="chatbot-header-btn"
                    onClick={minimizeChat}
                    aria-label={t('chatbot.minimizeLabel')}
                    title={t('chatbot.minimize')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  className="chatbot-header-btn"
                  onClick={closeChat}
                  aria-label={t('chatbot.closeLabel')}
                  title={t('chatbot.close')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </header>

            {view === 'open' && (
              <>
                <div className="chatbot-messages" ref={messagesRef} aria-live="polite">
                  {messages.map((msg, idx) => (
                    <Fragment key={msg.id}>
                      <div
                        className={`chatbot-message ${msg.role === 'user' ? 'chatbot-message-user' : 'chatbot-message-assistant'}`}
                      >
                        {msg.role === 'assistant' && (
                          <span className="chatbot-avatar" aria-hidden="true">
                            <img src={`${import.meta.env.BASE_URL}img/rezonants-ai-assistant-icon.svg`} alt="" />
                          </span>
                        )}
                        <p className="chatbot-message-content">{msg.content}</p>
                      </div>

                      {activeMenu && activeMenu.index === idx && !loading && (
                        <div className="chatbot-message chatbot-message-assistant">
                          <span className="chatbot-avatar" aria-hidden="true">
                            <img src={`${import.meta.env.BASE_URL}img/rezonants-ai-assistant-icon.svg`} alt="" />
                          </span>
                          <div className="chatbot-quick-list" role="group" aria-label={t('chatbot.menuOptions', { defaultValue: 'Menu options' })}>
                            {activeMenu.options.map((option) => (
                              <button
                                key={option.index}
                                type="button"
                                className="chatbot-quick-btn"
                                onClick={() => sendMessage(String(option.index), `${option.index}. ${option.label}`)}
                              >
                                {option.index}. {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </Fragment>
                  ))}

                  {loading && (
                    <div className="chatbot-message chatbot-message-assistant" aria-label={t('chatbot.typing', { defaultValue: 'Rezonants AI is typing' })}>
                      <span className="chatbot-avatar" aria-hidden="true">
                        <img src={`${import.meta.env.BASE_URL}img/rezonants-ai-assistant-icon.svg`} alt="" />
                      </span>
                      <span className="typing-indicator">
                        <span className="dot" />
                        <span className="dot" />
                        <span className="dot" />
                      </span>
                    </div>
                  )}
                </div>

                {!hasConversation && (
                  <div className="chatbot-quick-actions">
                    <p className="chatbot-quick-title">{t('chatbot.popularTopics')}</p>
                    <div className="chatbot-quick-list">
                      {QUICK_ACTIONS.map((action) => {
                        const quickTopicLabels: Record<string, string> = {
                          'What services do you offer?': t('nav.services', { defaultValue: t('services.eyebrow', { defaultValue: 'Our Services' }) }),
                          'What technologies do you use?': t('nav.technologies', { defaultValue: t('technologies.title', { defaultValue: 'Technologies' }) }),
                          'What products do you offer?': t('nav.products', { defaultValue: 'Products' }),
                          'How can I contact Rezonants?': t('nav.contact', { defaultValue: t('contact.eyebrow', { defaultValue: 'Contact Rezonants' }) }),
                        }
                        const label = quickTopicLabels[action.value] || action.label
                        return (
                          <button
                            key={action.value}
                            type="button"
                            className="chatbot-quick-btn"
                            onClick={() => sendMessage(action.value, label)}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                <form className="chatbot-input-area" onSubmit={handleSubmit}>
                  <div className="chatbot-input-box">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleTextareaKeyDown}
                      placeholder={t('chatbot.askPlaceholder')}
                      maxLength={500}
                      rows={1}
                      autoComplete="off"
                      aria-label={t('chatbot.messageLabel')}
                      className="chatbot-input"
                    />
                    <button
                      type="submit"
                      className="chatbot-send"
                      disabled={!canSend}
                      aria-label={t('chatbot.sendLabel')}
                      title={t('chatbot.sendTitle')}
                    >
                      <svg className="chatbot-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 2L1 12" />
                        <path d="M2 22L22 12" />
                        <path d="M22 2L15 22l-3-7-7-3z" />
                      </svg>
                    </button>
                  </div>
                  <div className="chatbot-input-foot">
                    <span>{t('chatbot.enterToSend')}</span>
                    {hasConversation && (
                      <button type="button" className="chatbot-reset" onClick={resetChat}>
                        {t('chatbot.newChat')}
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>

          <div className="chatbot-overlay" onClick={closeChat} aria-hidden="true" />
        </>
      )}
    </div>
  )
}
