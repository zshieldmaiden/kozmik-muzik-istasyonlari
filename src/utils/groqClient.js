// Groq API istemcisi - Ultra hızlı LLM yanıtları için
// Ollama yerine Groq API kullanır

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1'

export const GROQ_MODELS = {
  LLAMA3_8B: 'llama-3.1-8b-instant',
  MIXTRAL_8X7B: 'mixtral-8x7b-32768',
  GEMMA_7B: 'gemma-7b-it'
}

// Ana Groq API çağrısı
async function callGroqAPI(prompt, model = GROQ_MODELS.LLAMA3_8B, temperature = 0.7) {
  if (!GROQ_API_KEY) {
    console.warn('❌ GROQ API key not found, using fallback response')
    return generateFallbackResponse(prompt)
  }

  try {
    const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: temperature,
        max_tokens: 1024,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Groq API yanıt veremiyor.'
  } catch (error) {
    console.error('❌ Groq API error:', error)
    return generateFallbackResponse(prompt)
  }
}

// Fallback yanıt üreteci
function generateFallbackResponse(prompt) {
  const responses = [
    '🌌 Kozmik enerjiler müzik önerisi hazırlıyor...',
    '🚀 Müzik galaksisi taranıyor, en uygun şarkılar bulunuyor...',
    '⭐ Yıldızlar arasında mükemmel melodi aranıyor...',
    '🌟 Harmoni dalgaları analiz ediliyor...'
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

// Müzik önerisi için Groq API çağrısı
export async function getMusicRecommendation(mood, weather = '', history = []) {
  const prompt = `Sen bir müzik önerisi uzmanısın. ${mood} ruh haline uygun şarkılar öner.${weather ? ` Hava durumu: ${weather}.` : ''}${history.length ? ` Daha önce önerilen: ${history.join(', ')}.` : ''} Türkçe yanıt ver.`
  
  return await callGroqAPI(prompt, GROQ_MODELS.LLAMA3_8B, 0.8)
}

// Ollama uyumlu generate fonksiyonu (Groq ile)
export async function ollamaGenerate({ prompt, model = GROQ_MODELS.LLAMA3_8B, temperature = 0.7 }) {
  return await callGroqAPI(prompt, model, temperature)
}

// Auralis chat fonksiyonu
export async function auralisChat(userMessage, context = {}) {
  const prompt = `Sen Auralis, kozmik müzik rehberisin. Kullanıcı mesajı: "${userMessage}". ${JSON.stringify(context)}. Türkçe yanıt ver.`
  
  return await callGroqAPI(prompt, GROQ_MODELS.LLAMA3_8B, 0.8)
}

// Ruh hali analizi
export async function analyzeMood(text) {
  const prompt = `Bu metindeki ruh halini analiz et ve tek kelimeyle tanımla: "${text}". Sadece ruh hali döndür: enerjik, sakin, melankolik, romantik, maceracı gibi.`
  
  return await callGroqAPI(prompt, GROQ_MODELS.LLAMA3_8B, 0.3)
}

export default {
  getMusicRecommendation,
  ollamaGenerate,
  auralisChat,
  analyzeMood,
  GROQ_MODELS
}
