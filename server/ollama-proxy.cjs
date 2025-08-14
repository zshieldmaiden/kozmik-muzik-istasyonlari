// Simple Ollama proxy to use local LLMs
// Assumes Ollama is running on http://localhost:11434

const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch').default || require('node-fetch')

const app = express()
const port = process.env.PORT || 8788
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434'

app.use(cors())
app.use(express.json({ limit: '1mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('[ollama-proxy] Health check received')
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[ollama-proxy] ${req.method} ${req.url} from ${req.ip}`)
  next()
})

app.post('/api/ollama/generate', async (req, res) => {
  try {
    const { model = 'llama3:8b', system, prompt, temperature = 0.7, stream = false } = req.body || {}
    
    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' })
    }

    const url = `${OLLAMA_HOST}/api/generate`

    const body = {
      model,
      prompt,
      system,
      stream,
      options: {
        temperature: temperature
      }
    }

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!r.ok) {
      const errTxt = await r.text()
      return res.status(500).json({ error: 'Ollama request failed', details: errTxt })
    }

    const data = await r.json()
    res.json({ text: data.response, raw: data })
  } catch (e) {
    console.error('[ollama-proxy] Error:', e)
    res.status(500).json({ error: 'Internal error', details: String(e) })
  }
})

app.listen(port, 'localhost', () => {
  console.log(`[ollama-proxy] listening on http://localhost:${port}`)
})

