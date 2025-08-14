// Groq API Client - Ollama replacement
// Ultra-fast inference with LPU technology

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const BASE_URL = 'https://api.groq.com/openai/v1'

export async function ollamaGenerate({ prompt, system, model = 'llama3-8b-8192', temperature = 0.7 }) {
  if (!GROQ_API_KEY) {
    console.warn('GROQ_API_KEY not found, using fallback response')
    return generateFallbackResponse(prompt)
  }

  try {
    const messages = []
    
    if (system) {
      messages.push({ role: 'system', content: system })
    }
    
    messages.push({ role: 'user', content: prompt })

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: temperature,
        max_tokens: 1000,
        stream: false
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Groq API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ''

  } catch (error) {
    console.error('Groq API error:', error)
    return generateFallbackResponse(prompt)
  }
}

// Fallback responses for offline usage
function generateFallbackResponse(prompt) {
  const lowerPrompt = prompt.toLowerCase()
  
  if (lowerPrompt.includes('müzik') || lowerPrompt.includes('music')) {
    return `🎵 Bu ruh haline uygun müzik önerileri:

• Ambient ve synthwave müzikler dinleyebilirsin
• Lo-fi hip hop rahatlatıcı olabilir  
• Klasik müzik konsantrasyonu artırır
• Doğa sesleri eşliğinde instrumental parçalar
• Space ambient müzikler kozmik atmosfer yaratır

Hangi tarzda müzik dinlemek istiyorsun?`
  }

  if (lowerPrompt.includes('ruh hal') || lowerPrompt.includes('mood')) {
    return `🌟 Ruh halini iyileştirmek için:

• Derin nefes alma egzersizleri yap
• Sevdiğin müzikleri dinle
• Doğayla vakit geçir
• Meditasyon yap
• Yaratıcı aktivitelerde bulun

Şu anda nasıl hissediyorsun?`
  }

  return `🤖 Auralis burada! Müzik önerileri ve ruh hali konularında yardımcı olabilirim. Ne yapmak istiyorsun?`
}

// Groq modellerı
export const GROQ_MODELS = {
  LLAMA3_8B: 'llama3-8b-8192',
  LLAMA3_70B: 'llama3-70b-8192', 
  MIXTRAL_8X7B: 'mixtral-8x7b-32768',
  GEMMA_7B: 'gemma-7b-it'
}
