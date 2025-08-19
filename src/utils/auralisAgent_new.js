// Auralis (Harmonia kaptanı) AI ajanı için istemci yardımcı fonksiyonları
// Groq API ile ultra-hızlı yanıt üretir - Ollama yerine Groq kullanır

import { ollamaGenerate, getMusicRecommendation, auralisChat, GROQ_MODELS } from './groqClient'

function normalizeMood(mood) {
  const m = String(mood || '').toLowerCase()
  const map = {
    enerjik: 'enerjik', energetic: 'enerjik', energy: 'enerjik',
    sakin: 'sakin', calm: 'sakin',
    melankolik: 'melankolik', melancholic: 'melankolik', sad: 'melankolik',
    romantik: 'romantik', romantic: 'romantik',
    maceracı: 'maceracı', adventurous: 'maceracı'
  }
  return map[m] || m || 'sakin'
}

function normalizeWeatherTR(wx) {
  const w = String(wx || '').toLowerCase()
  const map = {
    güneşli: 'güneşli', sunny: 'güneşli', clear: 'güneşli',
    yağmurlu: 'yağmurlu', rain: 'yağmurlu', rainy: 'yağmurlu', drizzle: 'yağmurlu',
    karlı: 'karlı', snow: 'karlı', snowy: 'karlı',
    fırtınalı: 'fırtınalı', thunderstorm: 'fırtınalı', storm: 'fırtınalı',
    bulutlu: 'bulutlu', cloudy: 'bulutlu', clouds: 'bulutlu'
  }
  return map[w] || 'bulutlu'
}

// Kullanıcıdan metin, hava durumu ve geçmiş şarkılar alıp format ile yanıt döndüren fonksiyon
export async function generateAuralisResponse({ userText, weather, history }) {
  // Net format odaklı prompt
  const prompt = `Sen bir kozmik müzik DJ'isin! MUTLAKA şu formatta yanıt ver:

🌌 Ruh Hali Analizi: [Kullanıcının ruh halini tek cümleyle açıkla]
🌟 Seçilen İstasyon: [İstasyon emoji ve adı] - [Neden seçildi?]

💫 Kozmik Müzik Önerileri:
1. [Sanatçı] - [Şarkı] | [Kısa açıklama]
2. [Sanatçı] - [Şarkı] | [Kısa açıklama]
3. [Sanatçı] - [Şarkı] | [Kısa açıklama]
4. [Sanatçı] - [Şarkı] | [Kısa açıklama]
5. [Sanatçı] - [Şarkı] | [Kısa açıklama]

🚀 Kozmik Mesaj: [Motivasyonlu kısa mesaj]

İSTASYONLAR:
🌟 KUASAR (enerji), 🌍 DÜNYA (popüler), 💖 VENÜS (romantik), 🔴 MARS (rock), 🎭 JÜPİTER (orkestra), 💍 SATÜRN (mistik), 🌊 NEPTÜN (derin), 🌌 SAMANYOLU (karışık), 🚀 ANDROMEDA (alternatif), ⚫ KARADELIK (karanlık), ⭐ İKİLİYILDIZ (düet), 💫 PULSAR (hipnotik), 💎 URANÜS (benzersiz), 🌈 AURORA (neşeli), 🕳️ KUASARİ KARADELIK (karanlık rock), 💥 SÜPERNOVA (şok)

Kullanıcı: "${userText}"
Hava: ${weather}
Geçmiş: ${JSON.stringify(history)}

Yukarıdaki FORMATLA yanıt ver! Türkçe!`

  // Groq API ile ultra-hızlı yanıt üretimi
  const text = await ollamaGenerate({ 
    prompt, 
    model: GROQ_MODELS.MIXTRAL_8X7B, 
    temperature: 0.8 
  })
  return text
}
