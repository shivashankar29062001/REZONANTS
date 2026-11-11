import { useEffect } from 'react'

// Counts concurrent locks (banner + preference modal) and only restores the
// original scroll state when the last one releases.
let scrollLockCount = 0
let baseOverflow = ''

/** Locks body scroll while `locked` is true (banner / modal open). */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return

    if (scrollLockCount === 0) {
      baseOverflow = document.body.style.overflow
    }
    scrollLockCount += 1
    document.body.style.overflow = 'hidden'

    return () => {
      scrollLockCount = Math.max(0, scrollLockCount - 1)
      if (scrollLockCount === 0) {
        document.body.style.overflow = baseOverflow
      }
    }
  }, [locked])
}
