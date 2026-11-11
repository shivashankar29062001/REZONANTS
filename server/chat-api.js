import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { handleChatRequest } from './chatHandler.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: '*' }))
app.use(express.json())

app.post('/api/chat', (req, res) =>
  handleChatRequest(req, res, { missingTokenStatus: 500 }),
)

// ─── Translation API ───────────────────────────────────────────────────────────
// Batch-translates UI text via Google Cloud Translation API.
// The API key is read from the server-side env only — never exposed to the browser.

const GOOGLE_TRANSLATE_URL =
  'https://translation.googleapis.com/language/translate/v2'

app.post('/api/translate', async (req, res) => {
  const { texts, target, source = 'en' } = req.body

  if (!Array.isArray(texts) || texts.length === 0) {
    return res.status(400).json({ error: 'texts must be a non-empty array' })
  }
  if (!target || typeof target !== 'string') {
    return res.status(400).json({ error: 'target language code is required' })
  }
  if (target === source) {
    return res.json({ translations: texts })
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
  if (!apiKey) {
    console.error('[Translate API] GOOGLE_TRANSLATE_API_KEY not configured')
    return res.status(500).json({ error: 'Translation service not configured.' })
  }

  try {
    const response = await fetch(
      `${GOOGLE_TRANSLATE_URL}?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: texts,
          target,
          source,
          format: 'text',
        }),
      },
    )

    if (!response.ok) {
      await response.text()
      return res.status(502).json({ error: 'Translation provider returned an error.' })
    }

    const data = await response.json()
    const translations = data.data.translations.map((t) => t.translatedText)
    return res.json({ translations })
  } catch (err) {
    console.error('[Translate API] Exception:', err?.message || 'Unknown error')
    return res.status(500).json({ error: 'Translation request failed.' })
  }
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Rezonants AI Chat API is running with knowledge-grounded system prompt support',
    provider: process.env.AI_PROVIDER || 'huggingface',
    model: process.env.AI_MODEL || 'Qwen/Qwen2.5-72B-Instruct',
  })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Rezonants AI Chat API server running at http://localhost:${PORT}`)
})

export default app
