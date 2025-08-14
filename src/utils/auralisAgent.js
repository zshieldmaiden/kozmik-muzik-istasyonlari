// Auralis (Harmonia kaptanı) AI ajanı için istemci yardımcı fonksiyonları
// Groq API üzerinden ultra-hızlı yanıt üretir.

import { ollamaGenerate, GROQ_MODELS } from './groqClient'

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


// Kullanıcıdan metin, hava durumu ve geçmiş şarkılar alıp dekoratif format ile yanıt döndüren yeni fonksiyon
export async function generateAuralisResponse({ userText, weather, history }) {
  // Promptu kullanıcıdan gelen verilerle oluştur - TÜRKÇE VERSİYON + DEKORATİF FORMAT
  const prompt = `Sen bir Kozmik Müzik Ruh Hali, Hava Durumu ve DNA Asistanısın. Yanıtlarını MUTLAKA bu formatta ver:

✨════════════════════════════════════✨
🧬 GalaxyMuse Kozmik Analiz Raporu 🧬
✨════════════════════════════════════✨

🪐 Ruh Hali Analizi: [Kullanıcının metninden çıkardığın ruh hali]
🌡️ Hava Durumu: [Verilen hava durumu]
🚀 Önerilen Gezegen Durağı: [Seçilen durak]
🎵 Müzik DNA'sı: [Geçmiş şarkılardan çıkardığın DNA]

💫 Kozmik Müzik Önerileri:
1. [Şarkı - Sanatçı]
2. [Şarkı - Sanatçı]  
3. [Şarkı - Sanatçı]
4. [Şarkı - Sanatçı]
5. [Şarkı - Sanatçı]

✨════════════════════════════════════✨

Gezegen Durakları:
🌍 Dünya → Ana akım, popüler (her hava, nötr ruh hali)
🔴 Mars → Enerjik rock, elektronik (güneşli + enerjik)
💖 Venüs → Romantik melodiler (yağmurlu + romantik)
🌌 Jüpiter → Epik orkestra (fırtınalı + güçlü hisler)
🪐 Satürn → R&B, groove (sıcak + rahat his)
⚫ Kara Delik → Lo-fi, ambient (gece + sakin/melankolik)
🌟 Andromeda → Modern pop, deneysel (güneşli + pozitif)

Kullanıcı metni: ${userText}
Hava durumu: ${weather}
Geçmiş şarkılar: ${JSON.stringify(history)}

Yanıtını yukarıdaki dekoratif formatta ver ve tamamen Türkçe yaz.`

  // Groq model kullanımı - ultra-hızlı inference
  const text = await ollamaGenerate({ 
    prompt, 
    model: GROQ_MODELS.LLAMA3_8B, 
    temperature: 0.7,
    system: "Sen Auralis, kozmik müzik istasyonlarının yapay zeka asistanısın. Türkçe yanıt ver ve müzik önerileri yap."
  })
  return text
}
