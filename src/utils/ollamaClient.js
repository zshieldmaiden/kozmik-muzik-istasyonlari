// Frontend client for Ollama proxy
// Connects to the proxy at /api/ollama/generate.

const BASE_URL = import.meta.env.VITE_OLLAMA_PROXY_URL || 'http://localhost:8788'

export async function ollamaGenerate({ prompt, system, model = 'llama3:8b', temperature = 0.7, stream = false }) {
  const r = await fetch(`${BASE_URL}/api/ollama/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, system, model, temperature, stream })
  })
  if (!r.ok) {
    const txt = await r.text()
    throw new Error(`Ollama proxy error: ${txt}`)
  }
  const data = await r.json()
  return data.text || ''
}
