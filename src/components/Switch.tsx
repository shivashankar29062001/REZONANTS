import type { Ref } from 'react'

interface SwitchProps {
  id: string
  label: string
  checked: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  innerRef?: Ref<HTMLButtonElement>
}

/**
 * Accessible toggle switch (WAI-ARIA `switch`). The visible row provides the
 * label; the control exposes it via `aria-label`.
 */
export function Switch({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  innerRef,
}: SwitchProps) {
  return (
    <button
      id={id}
      ref={innerRef}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={`cookie-switch${checked ? ' cookie-switch-on' : ''}`}
      onClick={() => onChange?.(!checked)}
    >
      <span className="cookie-switch-track" aria-hidden="true">
        <span className="cookie-switch-thumb" />
      </span>
    </button>
  )
}

export default Switch
