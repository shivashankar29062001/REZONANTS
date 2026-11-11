export function BrandLogo({ className = '', iconOnly = false }) {
  return (
    <span
      className={`brand-logo${iconOnly ? ' brand-logo--icon-only' : ''} ${className}`.trim()}
      aria-label="Rezonant Solutions Private Limited"
    >
      <img
        src={`${import.meta.env.BASE_URL}img/rezonant-logo.png`}
        alt=""
        aria-hidden="true"
        className="brand-logo-img"
      />
      {!iconOnly && (
        <span className="brand-wordmark-group">
          <span className="brand-wordmark">REZONANT</span>
          <span className="brand-subwordmark">SOLUTIONS PRIVATE LIMITED</span>
        </span>
      )}
    </span>
  )
}
