// Auralis (Harmonia kaptanı) AI ajanı için istemci yardımcı fonksiyonları
// Gemini proxy üzerinden yanıt üretir.

import { ollamaGenerate } from './ollamaClient'

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


// Kullanıcıdan metin, hava durumu ve geçmiş şarkılar alıp JSON öneri döndüren yeni fonksiyon
export async function generateAuralisResponse({ userText, weather, history }) {
  // Promptu kullanıcıdan gelen verilerle oluştur - TÜRKÇE VERSİYON
  const prompt = `Sen bir Kozmik Müzik Ruh Hali, Hava Durumu ve DNA Asistanısın.\nKullanıcı metnini analiz ederek ruh halini belirle (ör: mutlu, üzgün, enerjik, sakin, romantik, melankolik).\nKullanıcıdan aldığı hava durumu bilgisini de değerlendir (güneşli, yağmurlu, karlı, sisli, fırtınalı vb.).\nRuh hali + hava durumu kombinasyonuna uygun Gezegen Durağını seç:\nDünya → Ana akım, popüler (her hava, nötr ruh hali)\nMars → Enerjik rock, elektronik (güneşli + enerjik)\nVenüs → Romantik melodiler (yağmurlu + romantik)\nJüpiter → Epik orkestra (fırtınalı + güçlü hisler)\nSatürn → R&B, groove (sıcak + rahat his)\nKara Delik → Lo-fi, ambient (gece + sakin/melankolik)\nAndromeda → Modern pop, deneysel (güneşli + pozitif)\nKullanıcının geçmişte dinlediği şarkılardan Müzik DNA’sı çıkar.\nDNA + Gezegen Durağı + Hava Durumu uyumuna göre 5 yeni şarkı öner.\nSonucu JSON formatında döndür:\n{\n  "ruhHali": "...",\n  "havaDurumu": "...",\n  "gezegenDuragi": "...",\n  "muzikDNA": "...",\n  "oneriler": ["şarkı - sanatçı", "..."]\n}\nKullanıcı metni: ${userText}\nHava durumu: ${weather}\nGeçmiş şarkılar: ${JSON.stringify(history)}\nBu şekilde AI, metin + hava durumu + müzik geçmişi kombinasyonunu kullanarak öneriler üretecek.`

  // Model ismini burada değiştirebilirsiniz (ör: 'llama3:8b', 'mistral', 'llama2', ...)
  const text = await ollamaGenerate({ prompt, model: 'mistral', temperature: 0.7 })
  return text
}
