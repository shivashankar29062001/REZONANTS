import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Traps Tab focus inside `containerRef` while `active` is true and restores
 * focus to the previously focused element (or `restoreRef`) when deactivated.
 *
 * NOTE: When a nested dialog (e.g. the preferences modal) opens above this
 * one, its own trap takes over; this trap skips elements inside `.cookie-modal`
 * so the two never fight over focus.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  restoreRef?: RefObject<HTMLElement | null>,
): void {
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    previouslyFocused.current =
      (restoreRef?.current ?? document.activeElement) as HTMLElement | null

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const target = event.target as Element | null
      if (target?.closest('.cookie-modal')) return

      const container = containerRef.current
      if (!container) return

      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement)

      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const current = document.activeElement

      if (event.shiftKey && (current === first || !container.contains(current))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (current === last || !container.contains(current))) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused.current?.focus?.()
    }
  }, [active, containerRef, restoreRef])
}
