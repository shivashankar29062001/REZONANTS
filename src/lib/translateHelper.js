// Free in-memory translation helper using Google Translate dict client (zero paid API)
// Caches responses to keep performance instant and reliable.

const translationCache = new Map()
const MAX_CACHE_SIZE = 1000

const SCRIPT_LANGUAGE_PATTERNS = [
  { code: 'te', regex: /[\u0C00-\u0C7F]/ },
  { code: 'hi', regex: /[\u0900-\u097F]/ },
  { code: 'ta', regex: /[\u0B80-\u0BFF]/ },
  { code: 'kn', regex: /[\u0C80-\u0CFF]/ },
  { code: 'ml', regex: /[\u0D00-\u0D7F]/ },
  { code: 'bn', regex: /[\u0980-\u09FF]/ },
  { code: 'gu', regex: /[\u0A80-\u0AFF]/ },
  { code: 'pa', regex: /[\u0A00-\u0A7F]/ },
  { code: 'ar', regex: /[\u0600-\u06FF]/ },
  { code: 'ja', regex: /[\u3040-\u30FF]/ },
  { code: 'ko', regex: /[\uAC00-\uD7AF]/ },
  { code: 'ru', regex: /[\u0400-\u04FF]/ },
]

export function detectScriptLanguage(text) {
  if (!text || typeof text !== 'string') return null
  for (const entry of SCRIPT_LANGUAGE_PATTERNS) {
    if (entry.regex.test(text)) return entry.code
  }
  return null
}

function hasNonAsciiLetters(text) {
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) > 127) return true
  }
  return false
}

const BRAND_TRANSLITERATION_RE =
  /రెజోనెంట్స్|రేజోనెంట్స్|रेज़ोनेंट्स|रेजोनेंट्स|रेज़ोनेंट|Rezonants/gi

const PRESERVED_OUTGOING_TOKEN_RE =
  /(?:Rezonant Solutions Private Limited|REZONANTS PVT LTD|Rezonants|info@rezonants\.com|rezonants\.com|1800\s*410\s*3299|18004103299|\/[a-z0-9-]+(?:\/[a-z0-9-]+)*(?:#[a-z0-9-]+)?)/g

function protectTokensForTranslation(text, targetLang) {
  if (targetLang === 'en') {
    const tokens = []
    const prepared = text.replace(BRAND_TRANSLITERATION_RE, () => {
      const idx = tokens.length
      tokens.push('Rezonants')
      return `__RZTOK_${idx}__`
    })
    return { prepared, tokens }
  }
  const tokens = []
  const prepared = text.replace(PRESERVED_OUTGOING_TOKEN_RE, (match) => {
    const idx = tokens.length
    tokens.push(match)
    return `__RZTOK_${idx}__`
  })
  return { prepared, tokens }
}

function restoreProtectedTokens(translated, tokens) {
  if (!tokens || tokens.length === 0) return translated
  return translated.replace(/__\s*RZTOK[_\s]*(\d+)\s*__/gi, (full, idxStr) => {
    const idx = Number(idxStr)
    return Number.isInteger(idx) && tokens[idx] !== undefined ? tokens[idx] : full
  })
}

export async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string' || !targetLang) {
    return text
  }
  if (targetLang === 'en' && !hasNonAsciiLetters(text)) {
    return text
  }

  const cacheKey = `${targetLang}:${text}`
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)
  }

  const { prepared, tokens } = protectTokensForTranslation(text, targetLang)

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=auto&tl=${encodeURIComponent(
        targetLang
      )}&dt=t&q=${encodeURIComponent(prepared)}`

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
        const rawTranslated = data[0].map((s) => s[0]).join('')
        const restored = restoreProtectedTokens(rawTranslated, tokens)
        if (restored && restored.trim().length > 0) {
          if (translationCache.size >= MAX_CACHE_SIZE) {
            translationCache.clear()
          }
          translationCache.set(cacheKey, restored)
          return restored
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
