// Groq API Test - Bağlantı kontrolü
// Bu dosyayı frontend'de çalıştırarak Groq API'yi test edebilirsiniz

import { ollamaGenerate, GROQ_MODELS } from './groqClient.js'

// Test fonksiyonu
export async function testGroqConnection() {
  console.log('🧪 Groq API bağlantı testi başlatılıyor...')
  
  try {
    const testResponse = await ollamaGenerate({
      prompt: 'Merhaba! Bu bir test mesajıdır. Lütfen kısa bir yanıt ver.',
      system: 'Sen yardımcı bir AI asistanısın. Kısa ve net yanıt ver.',
      model: GROQ_MODELS.LLAMA3_8B,
      temperature: 0.5
    })
    
    console.log('✅ Groq API başarıyla çalışıyor!')
    console.log('📨 Test yanıtı:', testResponse)
    return { success: true, response: testResponse }
    
  } catch (error) {
    console.error('❌ Groq API hatası:', error)
    return { success: false, error: error.message }
  }
}

// Müzik testi
export async function testMusicRecommendation() {
  console.log('🎵 Müzik öneri testi başlatılıyor...')
  
  try {
    const musicResponse = await ollamaGenerate({
      prompt: 'Enerjik ruh halindeyim ve hava güneşli. Hangi müzik türlerini önerirsin?',
      system: 'Sen bir müzik uzmanısın. Ruh hali ve hava durumuna göre müzik önerisi yap.',
      model: GROQ_MODELS.MIXTRAL_8X7B,
      temperature: 0.7
    })
    
    console.log('🎶 Müzik önerisi testi başarılı!')
    console.log('🎵 Öneri:', musicResponse)
    return { success: true, response: musicResponse }
    
  } catch (error) {
    console.error('❌ Müzik testi hatası:', error)
    return { success: false, error: error.message }
  }
}

// Console'dan çalıştırabilmek için
if (typeof window !== 'undefined') {
  window.testGroq = testGroqConnection
  window.testMusic = testMusicRecommendation
  console.log('🔧 Test fonksiyonları yüklendi:')
  console.log('   testGroq() - Groq bağlantı testi')
  console.log('   testMusic() - Müzik öneri testi')
}
