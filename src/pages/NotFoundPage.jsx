import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../lib/useDocumentMeta'

export default function NotFoundPage() {
  useDocumentMeta({
    title: 'Page Not Found — Rezonants',
    description:
      'The page you are looking for could not be found on Rezonants.',
  })

  return (
    <main id="main" className="not-found-page">
      <div className="not-found-card">
        <span className="eyebrow">404 — Page Not Found</span>
        <h1>We couldn&apos;t find that page</h1>
        <p>
          The page you requested may have moved or no longer exists. Explore our
          services, technologies, or get in touch with the Rezonants team.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link to="/book-consultation" className="btn btn-ghost">
            Book a Consultation
          </Link>
        </div>
      </div>
    </main>
  )
}

