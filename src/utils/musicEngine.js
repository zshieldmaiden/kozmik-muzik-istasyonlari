import { musicDatabase } from '../data/musicDatabase'
import { getWeatherBasedRecommendations } from '../data/offlineData.js'

// Ruh halini normalize eder (büyük/küçük harf, boşluk vb.)
function normalizeMood(mood) {
  if (!mood || typeof mood !== 'string') {
    return 'happy' // Varsayılan ruh hali
  }
  
  // Küçük harf yap ve boşlukları temizle
  const normalized = mood.toLowerCase().trim()
  
  // Yaygın eşleşmeleri düzenle
  const moodMap = {
    'energetic': 'happy',
    'joyful': 'happy',
    'excited': 'happy',
    'peaceful': 'calm',
    'relaxed': 'calm',
    'chill': 'calm',
    'melancholy': 'sad',
    'depressed': 'sad',
    'tired': 'sleepy',
    'drowsy': 'sleepy'
  }
  
  return moodMap[normalized] || normalized
}

// Hava durumu anahtarını normalize eder (OpenWeather -> veritabanı eşleşmesi)
function normalizeWeather(w) {
  // w string, OpenWeather response objesi veya { conditions/main } olabilir
  let key = ''
  if (!w) {
    key = ''
  } else if (typeof w === 'string') {
    key = w
  } else if (typeof w === 'object') {
    // OpenWeather: { weather: [{ main: 'Rain' }], ... }
    if (Array.isArray(w.weather) && w.weather[0]?.main) {
      key = w.weather[0].main
    } else if (w.conditions) {
      key = w.conditions
    } else if (w.main) {
      key = w.main
    } else {
      key = ''
    }
  }
  const k = String(key || '').toLowerCase()
  const map = {
    drizzle: 'rain',
    rain: 'rain',
    mist: 'mist',
    fog: 'mist',
    haze: 'mist',
    smoke: 'mist',
    thunderstorm: 'thunderstorm',
    storm: 'storm',
    snow: 'snow',
    clear: 'clear',
    clouds: 'clouds',
    dust: 'dust',
    night: 'night',
    aurora: 'aurora'
  }
  return map[k] || (k.includes('cloud') ? 'clouds' : (k.includes('rain') ? 'rain' : 'clear'))
}

// Şarkı için benzersiz anahtar (id yoksa title+artist)
function songKey(song) {
  return song?.id ? String(song.id) : `${song?.title || ''}::${song?.artist || ''}`
}
/**
 * Klasik mood+weather öneri algoritması (tekrarsız, session bazlı)
 * @param {string} mood - Kullanıcının seçtiği duygu durumu ('happy', 'sad', 'energetic', vb.)
 * @param {string} weatherMain - Mevcut hava durumu ('Clear', 'Rain', 'Snow', vb.)
 * @param {number} n - Kaç öneri döndürülsün
 * @returns {Array} - Öneri şarkı listesi
 */
export function getStationRecommendations(mood, weather, station, n = 5) {
  console.log(`🎵 Şarkı önerisi istendi. Mood: ${mood}, Station: ${station}, İstenilen: ${n}`)
  console.log(`🔄 Seansta önerilen şarkı sayısı: ${sessionRecommended.size}`)
  
  let list = []
  const moodKey = normalizeMood(mood)
  const weatherKey = normalizeWeather(weather)
  
  try {
    // musicDatabase kontrolü
    console.log(`🗄️ MusicDatabase durumu: ${Array.isArray(musicDatabase) ? `${musicDatabase.length} şarkı` : 'Array değil'}`)
    
    // Yeni format: musicDatabase bir dizi ise mood ve hava koşullarına göre filtrele
    if (Array.isArray(musicDatabase)) {
      list = musicDatabase.filter(song => {
        const moodOk = Array.isArray(song.moods) ? song.moods.includes(moodKey) : true
        const weatherOk = song.weather?.conditions?.length
          ? song.weather.conditions.includes(weatherKey)
          : true
        return moodOk && weatherOk
      })
      // Filtre boşsa daha geniş fallback uygula
      if (!list.length) {
        list = musicDatabase.filter(song => {
          const moodOk = Array.isArray(song.moods) ? song.moods.includes(moodKey) : true
          return moodOk
        })
      }
      if (!list.length) {
        list = musicDatabase
      }
    } else {
      // Eski formatla geriye uyum
      if (musicDatabase[moodKey]) {
        const moodData = musicDatabase[moodKey]
      if (moodData[weatherKey] && moodData[weatherKey].length) list = moodData[weatherKey]
      else if (moodData.any) list = moodData.any
    }
  }
  
  // Session bazlı tekrar kontrolü: daha önce önerilmeyen şarkıları filtrele
  const filtered = list.filter(song => !sessionRecommended.has(songKey(song)))
  
  // Eğer filtrelenmiş liste yetersiz kalırsa (örn: tüm şarkılar önerilmişse),
  // session'ı sıfırla (yeniden önerilmeye başlanabilsin diye)
  if (filtered.length < n) {
    console.log('Tüm şarkılar önerildi, session sıfırlanıyor!')
    sessionRecommended.clear()
  }
  
  // Öneri listesini hazırla:
  // 1. Eğer filtrelenmiş liste yeterince eleman içeriyorsa, onu kullan
  // 2. Aksi halde tüm listeyi kullan (session sıfırlandığı için tekrar etmeye başlayacak)
  // 3. Listeyi karıştır
  // 4. İlk n eleman ile sınırla
  const finalList = (filtered.length >= n ? filtered : list)
    .sort(() => 0.5 - Math.random())
    .slice(0, n)
  
  // Önerilen şarkıları session history'e ekle
  finalList.forEach(song => sessionRecommended.add(songKey(song)))
  
  // İstatistik amaçlı seans durumunu logla
  console.log(`✅ Şarkı önerisi tamamlandı: ${finalList.length} adet`)
  console.log(`📊 Session şarkı sayısı: ${sessionRecommended.size}, Filtrelenmiş liste: ${filtered.length}, Toplam liste: ${list.length}`)
  
  return finalList
  
  } catch (error) {
    console.error('MusicDatabase kullanılamıyor, offline data kullanılıyor:', error)
    // Fallback olarak offline data kullan
    const weather = { temp: 20, conditions: weatherKey }
    const fallbackSongs = getWeatherBasedRecommendations(weather).slice(0, n)
    console.log(`💾 Offline fallback: ${fallbackSongs.length} şarkı döndürülüyor`)
    return fallbackSongs
  }
}

// Session bazlı önerilen şarkıların tutulduğu Set (tekrarsız öneri için)
const sessionRecommended = new Set()

// Mood + weather -> audio feature range tablosu (örnek değerler)
export const moodWeatherFeatureRanges = {
  happy: {
    sunny:   { valence: [0.7, 1], energy: [0.6, 1], tempo: [110, 160], acousticness: [0, 0.4] },
    rainy:   { valence: [0.5, 0.8], energy: [0.4, 0.7], tempo: [90, 130], acousticness: [0.2, 0.7] },
    snowy:   { valence: [0.6, 1], energy: [0.5, 0.9], tempo: [100, 150], acousticness: [0, 0.5] },
    cloudy:  { valence: [0.5, 0.8], energy: [0.3, 0.6], tempo: [80, 120], acousticness: [0.3, 0.8] },
  },
  sad: {
    rainy:   { valence: [0, 0.4], energy: [0, 0.5], tempo: [60, 100], acousticness: [0.4, 1] },
    sunny:   { valence: [0.3, 0.6], energy: [0.2, 0.6], tempo: [70, 110], acousticness: [0.2, 0.7] },
    snowy:   { valence: [0, 0.5], energy: [0, 0.5], tempo: [60, 100], acousticness: [0.3, 0.9] },
    cloudy:  { valence: [0, 0.5], energy: [0, 0.5], tempo: [60, 100], acousticness: [0.4, 1] },
  },
  energetic: {
    snowy:   { valence: [0.5, 1], energy: [0.7, 1], tempo: [120, 180], acousticness: [0, 0.3] },
    sunny:   { valence: [0.6, 1], energy: [0.8, 1], tempo: [120, 180], acousticness: [0, 0.2] },
    rainy:   { valence: [0.5, 0.9], energy: [0.7, 1], tempo: [110, 170], acousticness: [0, 0.4] },
    cloudy:  { valence: [0.5, 0.9], energy: [0.6, 1], tempo: [100, 160], acousticness: [0, 0.5] },
  },
  // ... diğer moodlar ...
}

/**
 * Kullanıcı profilini likedTracks'in ortalama audio features'ından hesaplar
 * @param {Array} likedTracks - Kullanıcının beğendiği şarkılar (audio features içermeli)
 * @returns {Object} - Ortalama feature objesi
 */
export function getUserProfile(likedTracks) {
  if (!likedTracks.length) return null
  const features = ['valence', 'energy', 'tempo', 'acousticness']
  const avg = {}
  for (const f of features) {
    avg[f] = likedTracks.reduce((sum, t) => sum + (t[f] || 0), 0) / likedTracks.length
  }
  return avg
}

/**
 * Şarkı ile hedef feature aralığına uygunluk puanı (0-1)
 */
export function featureMatchScore(song, featureRange) {
  let score = 0
  let count = 0
  for (const key in featureRange) {
    if (song[key] !== undefined) {
      const [min, max] = featureRange[key]
      if (song[key] >= min && song[key] <= max) score += 1
      count++
    }
  }
  return count ? score / count : 0
}

/**
 * Şarkı ile kullanıcı profili benzerlik puanı (0-1, öklidyen mesafe normalize)
 */
export function profileSimilarity(song, userProfile) {
  if (!userProfile) return 0.5
  const features = ['valence', 'energy', 'tempo', 'acousticness']
  let sum = 0
  for (const f of features) {
    if (song[f] !== undefined && userProfile[f] !== undefined) {
      sum += Math.pow(song[f] - userProfile[f], 2)
    }
  }
  // Normalize: 0 (en yakın) -> 1 (en uzak)
  return 1 - Math.min(Math.sqrt(sum) / features.length, 1)
}

/**
 * Şarkı popülerlik puanı (0-1, mock: varsa song.popularity, yoksa 0.5)
 */
export function popularityScore(song) {
  return song.popularity !== undefined ? song.popularity : 0.5
}

/**
 * Gelişmiş öneri algoritması (epsilon-greedy keşifli, puanlama ağırlıklı)
 * @param {string} mood - Kullanıcının seçtiği duygu durumu
 * @param {string} weatherMain - Mevcut hava durumu
 * @param {Array} likedTracks - Kullanıcının beğendiği şarkılar listesi (kişiselleştirme için)
 * @param {number} epsilon - Keşif oranı (0.2 = %20 keşif, %80 en iyi öneriler)
 * @returns {Array} - Öneri listesi
 */
export function getSmartRecommendations(mood, weatherMain, likedTracks = [], epsilon = 0.2) {
  const moodKey = (mood || '').toLowerCase()
  const weatherKey = normalizeWeather(weatherMain)
  let list = []
  if (Array.isArray(musicDatabase)) {
    list = musicDatabase.filter(song => {
      const moodOk = Array.isArray(song.moods) ? song.moods.includes(moodKey) : true
      const weatherOk = song.weather?.conditions?.length
        ? song.weather.conditions.includes(weatherKey)
        : true
      return moodOk && weatherOk
    })
    if (!list.length) list = musicDatabase.filter(song => Array.isArray(song.moods) ? song.moods.includes(moodKey) : true)
    if (!list.length) list = musicDatabase
  } else {
    if (musicDatabase[moodKey]) {
      const moodData = musicDatabase[moodKey]
      if (moodData[weatherKey] && moodData[weatherKey].length) list = moodData[weatherKey]
      else if (moodData.any) list = moodData.any
    }
  }
  
  // Session bazlı tekrar kontrolü: daha önce önerilmeyen şarkıları filtrele
  const filtered = list.filter(song => !sessionRecommended.has(songKey(song)))
  
  // Eğer filtrelenmiş liste yetersiz kalırsa (örn: tüm şarkılar önerilmişse),
  // session'ı sıfırla (yeniden önerilmeye başlanabilsin diye)
  if (filtered.length < 8) {
    console.log('Tüm şarkılar önerildi, session sıfırlanıyor!')
    sessionRecommended.clear()
  }
  
  // Gerçek listeyi hazırla (filtrelenmiş veya tümü)
  const workingList = filtered.length ? filtered : list
  
  // Kullanıcı profilini hesapla (beğenilen şarkıların audio özelliklerinin ortalaması)
  const userProfile = getUserProfile(likedTracks)
  
  // Hedef audio feature aralığını al (mood+weather kombinasyonuna göre)
  const featureRange = moodWeatherFeatureRanges[moodKey]?.[weatherKey]
  
  // Her şarkı için puan hesapla
  const scored = workingList.map(song => {
    // 1. Mood-weather uygunluğu (şarkının audio özellikleri mood+weather hedef aralığına ne kadar uyuyor)
    const moodScore = featureRange ? featureMatchScore(song, featureRange) : 0.5
    
    // 2. Kullanıcı profili benzerliği (şarkının audio özellikleri kullanıcının beğendiği şarkılara ne kadar benziyor)
    const profileScore = profileSimilarity(song, userProfile)
    
    // 3. Popülerlik skoru (daha popüler şarkılar biraz daha fazla öncelik alsın)
    const popScore = popularityScore(song)
    
    // Toplam puanı hesapla - ağırlıklar: %70 mood uyumu, %20 profil benzerliği, %10 popülerlik
    const total = 0.7 * moodScore + 0.2 * profileScore + 0.1 * popScore
    
    // Şarkıyı puanla birlikte döndür
    return { ...song, _score: total }
  })
  
  // Epsilon-greedy yaklaşımı:
  // - Listede en yüksek puanlı şarkılar ağırlıklı olarak seçilir (%80)
  // - Keşif için daha düşük puanlı şarkılardan rastgele seçim yapılır (%20)
  const sorted = scored.sort((a, b) => b._score - a._score)
  const n = 8 // Toplam öneri sayısı
  const mainCount = Math.round(n * (1 - epsilon)) // Ana şarkılar (en iyi puanlılar)
  const exploreCount = n - mainCount // Keşif şarkıları
  
  // En iyi puanlı şarkıları seç
  const main = sorted.slice(0, mainCount)
  
  // Keşif için kalanlardan rastgele seç
  const rest = sorted.slice(mainCount)
  const explore = rest.sort(() => 0.5 - Math.random()).slice(0, exploreCount)
  
  // Ana ve keşif listelerini birleştir ve karıştır
  const finalList = [...main, ...explore].sort(() => 0.5 - Math.random())
  
  // Önerilen şarkıları session history'e ekle
  finalList.forEach(song => sessionRecommended.add(songKey(song)))
  
  // İstatistik amaçlı seans durumunu logla
  console.log(`Smart öneri - Session şarkı sayısı: ${sessionRecommended.size}, Filtrelenmiş liste: ${filtered.length}, Toplam liste: ${list.length}`)
  
  return finalList
}

/**
 * Session bazlı şarkı önerilerini sıfırlar
 * Yeni bir önerme oturumu başlatmak için kullanılır
 */
export function resetSessionRecommendations() {
  // Önerilen şarkıların set'ini temizle
  sessionRecommended.clear()
  console.log('Öneri seansı sıfırlandı, tüm şarkılar yeniden önerilebilir.')
}

/**
 * Mevcut seansta önerilen şarkı sayısını döndürür
 * @returns {number} - Önerilen şarkı sayısı
 */
export function getSessionRecommendationsCount() {
  return sessionRecommended.size
}

/**
 * Basit öneri fonksiyonu - getStationRecommendations'ı sarıyor
 * Geriye uyumluluk için
 * @param {string} mood - Ruh hali
 * @param {Object|string} weather - Hava durumu
 * @param {number} n - İstenilen şarkı sayısı
 * @returns {Array} - Önerilen şarkılar dizisi
 */
export function getRecommendations(mood, weather, n = 5) {
  return getStationRecommendations(mood, weather, 'general', n)
}
