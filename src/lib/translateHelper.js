// Free in-memory translation helper using Google Translate dict client (zero paid API)
// Caches responses to keep performance instant and reliable.

const translationCache = new Map()
const MAX_CACHE_SIZE = 1000

export async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string' || !targetLang || targetLang === 'en') {
    return text
  }

  const cacheKey = `${targetLang}:${text}`
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=auto&tl=${encodeURIComponent(
        targetLang
      )}&dt=t&q=${encodeURIComponent(text)}`

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      })

      if (!res.ok) {
        return text
      }

      const data = await res.json()
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map((s) => s[0]).join('')
        if (translated && translated.trim().length > 0) {
          if (translationCache.size >= MAX_CACHE_SIZE) {
            translationCache.clear()
          }
          translationCache.set(cacheKey, translated)
          return translated
        }
      }
    } finally {
      clearTimeout(timer)
    }
  } catch {
    // If translation fails or times out, gracefully fall back to original text
  }

  return text
}

export const localizeResponse = translateText
