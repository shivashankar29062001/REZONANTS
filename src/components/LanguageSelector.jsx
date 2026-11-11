import { useState, useRef, useEffect, useId, useMemo, useCallback } from 'react'
import { useTranslation } from '../i18n/TranslationContext'
import { SUPPORTED_LANGUAGES } from '../i18n/languages'
import './LanguageSelector.css'

// All 115 languages sorted in strict alphabetical sequence (A to Z)
const ALL_LANGUAGES_SORTED = [...SUPPORTED_LANGUAGES].sort((a, b) =>
  a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
)

export default function LanguageSelector({ onSelect, className = '' }) {
  const { lang, setLanguage, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)
  const searchInputRef = useRef(null)
  const listContainerRef = useRef(null)
  const selectedItemRef = useRef(null)
  const listboxId = useId()

  const currentLang =
    SUPPORTED_LANGUAGES.find((item) => item.code === lang) ||
    SUPPORTED_LANGUAGES.find((item) => item.code === (lang ? lang.split('-')[0] : 'en')) ||
    { code: 'en', name: 'English', nativeName: 'English' }

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
      return () => document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen])

  // Scroll to the currently selected language
  const scrollToActive = useCallback(() => {
    if (!listContainerRef.current) return
    const container = listContainerRef.current

    if (currentLang.code === 'en') {
      container.scrollTop = 0
      return
    }

    if (selectedItemRef.current) {
      const item = selectedItemRef.current
      const containerRect = container.getBoundingClientRect()
      const itemRect = item.getBoundingClientRect()
      const relativeTop = itemRect.top - containerRect.top + container.scrollTop
      const targetScroll = relativeTop - (container.clientHeight / 2) + (item.clientHeight / 2)
      container.scrollTop = Math.max(0, targetScroll)
    }
  }, [currentLang.code])

  // Automatically scroll to the chosen language when dropdown opens
  useEffect(() => {
    if (isOpen) {
      scrollToActive()
      const raf = requestAnimationFrame(scrollToActive)
      const t1 = setTimeout(scrollToActive, 50)
      const t2 = setTimeout(scrollToActive, 190)
      return () => {
        cancelAnimationFrame(raf)
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [isOpen, scrollToActive])

  // Focus search input on desktop without breaking scroll position
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      if (window.innerWidth >= 768) {
        const timer = setTimeout(() => {
          searchInputRef.current?.focus({ preventScroll: true })
          scrollToActive()
        }, 70)
        return () => clearTimeout(timer)
      }
    } else {
      setSearch('')
    }
  }, [isOpen, scrollToActive])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleSelect = async (code) => {
    await setLanguage(code)
    setIsOpen(false)
    if (onSelect) onSelect(code)
    triggerRef.current?.focus()
  }

  const query = search.trim().toLowerCase()

  const filteredLanguages = useMemo(() => {
    if (!query) return ALL_LANGUAGES_SORTED
    return ALL_LANGUAGES_SORTED.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.nativeName.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)
    )
  }, [query])

  const showTopDefaultRow =
    !query || 'english (default)'.includes(query) || 'en'.includes(query)

  return (
    <div className={`lang-selector-wrapper ${className}`.trim()} ref={dropdownRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`lang-trigger ${isOpen ? 'is-active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={`Select website language. Currently selected: ${currentLang.name} (${currentLang.nativeName})`}
        title={`Language: ${currentLang.name} (${currentLang.nativeName})`}
      >
        <span className="lang-globe-icon" aria-hidden="true">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        </span>
        <span className="lang-trigger-label">{currentLang.nativeName}</span>
        <span className={`lang-chevron ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="lang-dropdown-panel" id={listboxId} role="listbox" aria-label="Available languages">
          <div className="lang-search-box">
            <span className="lang-search-icon" aria-hidden="true">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              ref={searchInputRef}
              type="text"
              className="lang-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language / भाषा खोजें..."
              aria-label="Search languages"
            />
            {search && (
              <button
                type="button"
                className="lang-search-clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="lang-list-container" ref={listContainerRef}>
            {/* Top row: English (Default) - Fixed in English only */}
            {showTopDefaultRow && (
              <div className="lang-default-section">
                <button
                  key="en-default"
                  ref={currentLang.code === 'en' ? selectedItemRef : null}
                  type="button"
                  role="option"
                  aria-selected={currentLang.code === 'en'}
                  className={`lang-option-btn lang-default-btn ${currentLang.code === 'en' ? 'is-selected' : ''}`}
                  onClick={() => handleSelect('en')}
                >
                  <span className="lang-native-name">English (Default)</span>
                  <span className="lang-english-sub">English</span>
                  {currentLang.code === 'en' && (
                    <span className="lang-check-icon" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
                <div className="lang-divider" aria-hidden="true" />
              </div>
            )}

            {filteredLanguages.length === 0 && !showTopDefaultRow ? (
              <div className="lang-empty-state">
                {t('nav.noResults', { defaultValue: 'No languages found' })}
              </div>
            ) : (
              <div className="lang-grid">
                {filteredLanguages.map((item) => {
                  const isSelected = currentLang.code === item.code
                  return (
                    <button
                      key={item.code}
                      ref={isSelected && currentLang.code !== 'en' ? selectedItemRef : null}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`lang-option-btn ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => handleSelect(item.code)}
                    >
                      <span className="lang-native-name">{item.nativeName}</span>
                      <span className="lang-english-sub">{item.name}</span>
                      {isSelected && (
                        <span className="lang-check-icon" aria-hidden="true">
                          ✓
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
