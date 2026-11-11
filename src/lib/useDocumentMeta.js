import { useEffect } from 'react'

/**
 * Sets the document <title>, meta description and (optionally) a JSON-LD
 * script for the current page. Previous values are restored on unmount so
 * sibling routes keep their own metadata.
 */
export function useDocumentMeta({ title, description, jsonLd }) {
  useEffect(() => {
    const previousTitle = document.title
    let meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.content ?? null
    let script = null

    if (title) document.title = title
    if (description) {
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = description
    }
    if (jsonLd) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }

    return () => {
      document.title = previousTitle
      if (meta) {
        if (previousDescription) meta.content = previousDescription
        else meta.remove()
      }
      if (script) script.remove()
    }
  }, [title, description, jsonLd])
}
