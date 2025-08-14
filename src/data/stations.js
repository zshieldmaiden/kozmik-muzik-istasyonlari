/**
 * Kozmik Müzik İstasyonları Veri Yapısı
 * 
 * Her istasyon şu özelliklere sahiptir:
 * - id: İstasyonun benzersiz tanımlayıcısı
 * - name: İstasyonun görünen adı
 * - emoji: Görsel temsil için emoji    description: 'A  {
    id: 'cryochill-station',
    name: 'Uranüs',
    emoji: '❄️',
    description: 'Ambient, chillstep. Buzullar, mavi-beyaz kubbeler. Tempo'ya göre buz kristalleri kırılır/oluşur.',
    genres: ['ambient', 'chillstep', 'electronic'],
    moods: ['calm', 'relaxing'],
    weather: [
      { condition: 'snowy', tempRange: [-20, 5] },
      { condition: 'cloudy', tempRange: [-10, 10] }
    ],
    popularity: 7
  },
  {
    id: 'aurora-tunes',
    name: 'Aurora Tınısı',
    emoji: '🌌',
    description: 'Synthwave ve dream pop'un büyülü dansı. Kutup ışıklarının müziği.',
    genres: ['synthwave', 'chillwave', 'ambient', 'electronic', 'dreamPop'],
    moods: ['calm', 'nostalgic', 'melancholic', 'inspirational'],
    weather: [
      { condition: 'snow', tempRange: [-5, 5] },
      { condition: 'clouds', tempRange: [0, 10] },
      { condition: 'clear', tempRange: [-10, 5] },
      { condition: 'mist', tempRange: [-5, 8] }
    ],
    popularity: 8
  }
];tep. Buzullar, mavi-beyaz kubbeler. Tempo'ya göre buz kristalleri kırılır/oluşur.',
    genres: ['ambient', 'chillstep', 'electronic'],
    moods: ['calm', 'relaxing'],
    weather: [
      { condition: 'snowy', tempRange: [-20, 5] },
      { condition: 'cloudy', tempRange: [-10, 10] }
    ],
    popularity: 7
  },
  {
    id: 'aurora-tunes',
    name: 'Aurora Tınısı',
    emoji: '🌌',
    description: 'Synthwave ve dream pop'un büyülü dansı. Kutup ışıklarının müziği.',
    genres: ['synthwave', 'chillwave', 'ambient', 'electronic', 'dreamPop'],
    moods: ['calm', 'nostalgic', 'melancholic', 'inspirational'],
    weather: [
      { condition: 'snow', tempRange: [-5, 5] },
      { condition: 'clouds', tempRange: [0, 10] },
      { condition: 'clear', tempRange: [-10, 5] },
      { condition: 'mist', tempRange: [-5, 8] }
    ],
    popularity: 8
  }
];ription: Kısa açıklama
 * - genres: İstasyon için uyumlu müzik türleri dizisi
 * - moods: İstasyon için uyumlu ruh halleri dizisi
 * - weather: İstasyon için uyumlu hava durumları dizisi
 *   - condition: Hava durumu koşulu (clear, clouds, rain, snow, etc.)
 *   - tempRange: Sıcaklık aralığı [min, max] (celsius)
 * - popularity: İstasyonun popülerliği (1-10 arası)
 */

export const stations = [
  {
    id: 'earth',
    name: 'Dünya',
    emoji: '🌎',
    description: 'Klasik ve popüler şarkıların rahatlatıcı harmonileri',
    genres: ['pop', 'rock', 'indie', 'folk'],
    moods: ['peaceful', 'relaxed', 'happy', 'nostalgic', 'motivasyon', 'rahatlama', 'dinginvederin'],
    weather: [
      { condition: 'clear', tempRange: [15, 25] },
      { condition: 'clouds', tempRange: [10, 20] }
    ],
    popularity: 10
  },
  {
    id: 'venus',
    name: 'Venüs',
    emoji: '💫',
    description: 'Romantik ve duygusal melodilerin dansı',
    genres: ['r&b', ' soul', 'jazz', 'romantic'],
    moods: ['romantic', 'peaceful', 'happy', 'dreamy', 'rahatlama', 'dinginvederin'],
    weather: [
      { condition: 'clear', tempRange: [20, 35] },
      { condition: 'clouds', tempRange: [15, 30] }
    ],
    popularity: 8
  },
  {
    id: 'mars',
    name: 'Mars',
    emoji: '🔴',
    description: 'Enerjik ve cesur elektronik müzik frekansları',
    genres: ['electronic', 'dance', 'edm', 'techno'],
    moods: ['energetic', 'excited', 'angry', 'intense', 'motivasyon', 'isyankar'],
    weather: [
      { condition: 'clear', tempRange: [25, 40] },
      { condition: 'dust', tempRange: [15, 45] }
    ],
    popularity: 7
  },
  {
    id: 'jupiter',
    name: 'Jüpiter',
    emoji: '🌌',
    description: 'İhtişamlı orkestral kompozisyonlar',
    genres: ['classical', 'orchestral', 'soundtrack', 'epic'],
    moods: ['grand', 'inspired', 'energetic', 'powerful', 'dinginvederin'],
    weather: [
      { condition: 'storm', tempRange: [-5, 15] },
      { condition: 'clouds', tempRange: [0, 20] }
    ],
    popularity: 6
  },
  {
    id: 'saturn',
    name: 'Satürn',
    emoji: '🪐',
    description: 'Kozmik caz ve füzyon ahenkleri',
    genres: ['jazz', 'fusion', 'experimental', 'ambient'],
    moods: ['dreamy', 'creative', 'relaxed', 'curious', 'rahatlama'],
    weather: [
      { condition: 'clear', tempRange: [-20, 5] },
      { condition: 'clouds', tempRange: [-30, 0] }
    ],
    popularity: 5
  },
  {
    id: 'neptune',
    name: 'Neptün',
    emoji: '💙',
    description: 'Derin ve gizemli ambient müzik denizi',
    genres: ['ambient', 'chillout', 'downtempo', 'atmospheric'],
    moods: ['melancholic', 'calm', 'peaceful', 'introspective', 'dinginvederin', 'rahatlama'],
    weather: [
      { condition: 'rain', tempRange: [5, 15] },
      { condition: 'clouds', tempRange: [0, 10] },
      { condition: 'mist', tempRange: [0, 10] }
    ],
    popularity: 6
  },
  {
    id: 'milkyway',
    name: 'Samanyolu',
    emoji: '🌠',
    description: 'Yıldızlararası melodilerin senfonisi',
    genres: ['world', 'folk', 'ethnic', 'new age'],
    moods: ['dreamy', 'inspired', 'curious', 'peaceful', 'rahatlama', 'dinginvederin'],
    weather: [
      { condition: 'clear', tempRange: [-10, 30] },
      { condition: 'clouds', tempRange: [-5, 25] }
    ],
    popularity: 7
  },
  {
    id: 'andromeda',
    name: 'Andromeda',
    emoji: '✨',
    description: 'Galaksiler arası deneysel müzik dalgaları',
    genres: ['experimental', 'avant-garde', 'electronic', 'psychedelic'],
    moods: ['curious', 'creative', 'dreamy', 'mysterious', 'isyankar', 'motivasyon'],
    weather: [
      { condition: 'clear', tempRange: [-40, -10] },
      { condition: 'aurora', tempRange: [-50, 0] }
    ],
    popularity: 4
  },
  {
    id: 'blackhole',
    name: 'Kara Delik',
    emoji: '⚫',
    description: 'Derin bas ve hipnotik ritimler',
    genres: ['dark ambient', 'industrial', 'drone', 'bass'],
    moods: ['intense', 'dark', 'mysterious', 'powerful', 'isyankar', 'dinginvederin'],
    weather: [
      { condition: 'thunderstorm', tempRange: [-30, 10] },
      { condition: 'night', tempRange: [-20, 5] }
    ],
    popularity: 3
  },
  {
    id: 'binary-star-harmony',
    name: 'İkili Yıldız',
    emoji: '🌟🌟',
    description: 'R&B düetler, romantik parçalar. İki yıldızın yavaş yavaş birbirinin etrafında dönmesi. Şarkı bitince yıldızlar birleşir.',
    genres: ['r&b', 'duet', 'romantic'],
    moods: ['romantic', 'chill'],
    weather: [
      { condition: 'clear', tempRange: [10, 30] },
      { condition: 'night', tempRange: [0, 20] }
    ],
    popularity: 8
  },
  {
    id: 'supernova-pop-stage',
    name: 'Süpernova Patlaması',
    emoji: '💥',
    description: 'Pop, K-Pop, enerji dolu parçalar. Dev patlama bulutu, neon sahne ışıkları. Nakaratta dev renk patlamaları.',
    genres: ['pop', 'k-pop', 'dance'],
    moods: ['energetic', 'happy'],
    weather: [
      { condition: 'sunny', tempRange: [20, 40] },
      { condition: 'festival', tempRange: [15, 35] }
    ],
    popularity: 9
  },
  {
    id: 'quark-jazz-club',
    name: 'Kuantum Parçacıklar',
    emoji: '🎷',
    description: 'Cool jazz, smooth saxophone. Küçük renkli enerji noktaları. Saksafon sololarında partiküller spiral çizer.',
    genres: ['jazz', 'cool jazz', 'saxophone'],
    moods: ['chill', 'classy'],
    weather: [
      { condition: 'rainy', tempRange: [5, 20] },
      { condition: 'night', tempRange: [0, 20] }
    ],
    popularity: 7
  },
  {
    id: 'comet-disco-hub',
    name: 'Kuyrukluyıldız',
    emoji: '☄️',
    description: '70’ler disko, funk. Parlak buz kuyruğu, yansımalı dans pisti. Kuyruk hızlandıkça BPM artar.',
    genres: ['disco', 'funk', 'dance'],
    moods: ['funky', 'dance'],
    weather: [
      { condition: 'clear', tempRange: [10, 30] },
      { condition: 'night', tempRange: [0, 20] }
    ],
    popularity: 8
  },
  {
    id: 'pulsar-beat-station',
    name: 'Pulsar',
    emoji: '🔊',
    description: 'Drum & Bass, hızlı ritimler. Nabız gibi atan ışık hüzmeleri. Atış frekansına göre görseller titreşir.',
    genres: ['drum & bass', 'dnb', 'electronic'],
    moods: ['energetic', 'intense'],
    weather: [
      { condition: 'clear', tempRange: [10, 30] },
      { condition: 'night', tempRange: [0, 20] }
    ],
    popularity: 8
  },
  {
    id: 'cryochill-station',
    name: 'Uranüs',
    emoji: '❄️',
    description: 'Ambient, chillstep. Buzullar, mavi-beyaz kubbeler. Tempo’ya göre buz kristalleri kırılır/oluşur.',
    genres: ['ambient', 'chillstep', 'electronic'],
    moods: ['calm', 'relaxing'],
    weather: [
      { condition: 'snowy', tempRange: [-20, 5] },
      { condition: 'cloudy', tempRange: [-10, 10] }
    ],
    popularity: 7
  }
];

/**
 * Ruh halleri (moods) sözlüğü
 * Her ruh hali için uyumluluk puanları ve açıklamalar
 */
export const moodDictionary = {
  'happy': { intensity: 7, energy: 8, description: 'Neşeli ve pozitif' },
  'sad': { intensity: 6, energy: 3, description: 'Hüzünlü ve duygusal' },
  'energetic': { intensity: 9, energy: 10, description: 'Yüksek enerjili ve dinamik' },
  'calm': { intensity: 3, energy: 2, description: 'Sakin ve rahatlatıcı' },
  'romantic': { intensity: 6, energy: 5, description: 'Romantik ve duygusal' },
  'angry': { intensity: 10, energy: 9, description: 'Öfkeli ve yoğun' },
  'nostalgic': { intensity: 5, energy: 4, description: 'Nostaljik ve düşündürücü' },
  'dreamy': { intensity: 4, energy: 3, description: 'Hayalperest ve atmosferik' },
  'excited': { intensity: 8, energy: 9, description: 'Heyecanlı ve enerjik' },
  'peaceful': { intensity: 2, energy: 1, description: 'Huzurlu ve rahatlatıcı' },
  'mysterious': { intensity: 6, energy: 4, description: 'Gizemli ve merak uyandıran' },
  'melancholic': { intensity: 5, energy: 3, description: 'Hüzünlü ve düşünceli' },
  'creative': { intensity: 7, energy: 6, description: 'Yaratıcı ve ilham verici' },
  'relaxed': { intensity: 3, energy: 2, description: 'Rahatlamış ve dingin' },
  'intense': { intensity: 9, energy: 8, description: 'Yoğun ve güçlü' },
  'curious': { intensity: 6, energy: 5, description: 'Meraklı ve keşfedici' },
  'inspired': { intensity: 7, energy: 6, description: 'İlham dolu ve motive' },
  'grand': { intensity: 8, energy: 7, description: 'İhtişamlı ve görkemli' },
  'powerful': { intensity: 8, energy: 8, description: 'Güçlü ve etkileyici' },
  'dark': { intensity: 7, energy: 5, description: 'Karanlık ve gizemli' },
  'introspective': { intensity: 4, energy: 3, description: 'İçe dönük ve derin' },
  // Yeni moodlar
  'motivasyon': { intensity: 8, energy: 10, description: 'Spor, çalışma veya sabah enerjisi için motive edici' },
  'rahatlama': { intensity: 2, energy: 1, description: 'Spa, meditasyon, yavaş tempolu chill' },
  'isyankar': { intensity: 10, energy: 9, description: 'Rock, metal, sert rap ile isyankâr/öfke' },
  'dinginvederin': { intensity: 3, energy: 2, description: 'Klasik müzik, film müzikleri, doğa sesleri ile derin ve dingin' }
};

/**
 * Hava durumu koşulları sözlüğü
 * Her koşul için enerji ve atmosfer değerleri
 */
export const weatherConditionMap = {
  'clear': { energy: 8, atmosphere: 'bright', description: 'Açık ve güneşli' },
  'clouds': { energy: 5, atmosphere: 'neutral', description: 'Bulutlu' },
  'rain': { energy: 3, atmosphere: 'moody', description: 'Yağmurlu' },
  'thunderstorm': { energy: 9, atmosphere: 'intense', description: 'Fırtınalı' },
  'snow': { energy: 4, atmosphere: 'peaceful', description: 'Karlı' },
  'mist': { energy: 2, atmosphere: 'mysterious', description: 'Sisli' },
  'dust': { energy: 6, atmosphere: 'harsh', description: 'Tozlu' },
  'aurora': { energy: 7, atmosphere: 'magical', description: 'Kuzey ışıkları' },
  'night': { energy: 4, atmosphere: 'dark', description: 'Gece' },
  'storm': { energy: 10, atmosphere: 'chaotic', description: 'Fırtınalı' }
};

/**
 * Sıcaklık aralıklarına göre enerji ve ruh hali eşleşmeleri
 */
export const temperatureRanges = [
  { min: -50, max: -20, energy: 3, moods: ['mysterious', 'dark', 'melancholic'] },
  { min: -20, max: 0, energy: 4, moods: ['calm', 'introspective', 'peaceful'] },
  { min: 0, max: 10, energy: 5, moods: ['relaxed', 'dreamy', 'melancholic'] },
  { min: 10, max: 20, energy: 6, moods: ['peaceful', 'happy', 'nostalgic'] },
  { min: 20, max: 30, energy: 7, moods: ['happy', 'romantic', 'creative'] },
  { min: 30, max: 40, energy: 8, moods: ['energetic', 'excited', 'intense'] }
];

/**
 * İstasyon uyumluluğunu hesaplayan yardımcı fonksiyon
 * 
 * @param {Object} station - İstasyon nesnesi
 * @param {String} mood - Seçilen ruh hali
 * @param {Object} weather - Hava durumu nesnesi (condition, temp)
 * @return {Number} Uyumluluk puanı (0-100)
 */
export function calculateStationCompatibility(station, mood, weather) {
  let score = 0;
  const maxScore = 100;
  
  // Ruh hali uyumu (0-40 puan)
  if (station.moods.includes(mood)) {
    score += 40;
  } else {
    // Ruh hali doğrudan eşleşmiyorsa, mood sözlüğünden benzerlik kontrolü yap
    const selectedMoodInfo = moodDictionary[mood];
    if (selectedMoodInfo) {
      const moodScore = station.moods.reduce((acc, stationMood) => {
        const stationMoodInfo = moodDictionary[stationMood];
        if (stationMoodInfo) {
          // Enerji ve yoğunluk farkına göre benzerlik hesapla
          const energyDiff = Math.abs(selectedMoodInfo.energy - stationMoodInfo.energy);
          const intensityDiff = Math.abs(selectedMoodInfo.intensity - stationMoodInfo.intensity);
          
          // Farklar ne kadar azsa, benzerlik o kadar yüksektir
          const similarity = 10 - (energyDiff + intensityDiff) / 2;
          return Math.max(acc, similarity * 2); // 0-20 puan arası
        }
        return acc;
      }, 0);
      
      score += moodScore;
    }
  }
  
  // Hava durumu uyumu (0-30 puan)
  const weatherScore = station.weather.reduce((acc, stationWeather) => {
    // Hava durumu koşulunun uyuşması (0-15 puan)
    let conditionScore = 0;
    if (stationWeather.condition === weather.condition) {
      conditionScore = 15;
    } else if (weatherConditionMap[stationWeather.condition] && weatherConditionMap[weather.condition]) {
      // Hava koşulları birebir eşleşmiyorsa, enerji ve atmosfer özelliklerine bakılır
      const stationWeatherInfo = weatherConditionMap[stationWeather.condition];
      const currentWeatherInfo = weatherConditionMap[weather.condition];
      
      const energyDiff = Math.abs(stationWeatherInfo.energy - currentWeatherInfo.energy);
      const sameAtmosphere = stationWeatherInfo.atmosphere === currentWeatherInfo.atmosphere;
      
      conditionScore = 10 - energyDiff + (sameAtmosphere ? 5 : 0);
    }
    
    // Sıcaklık uyumu (0-15 puan)
    let tempScore = 0;
    if (weather.temp >= stationWeather.tempRange[0] && weather.temp <= stationWeather.tempRange[1]) {
      tempScore = 15;
    } else {
      // Sıcaklık aralığına ne kadar yakınsa, o kadar puan
      const distanceFromRange = Math.min(
        Math.abs(weather.temp - stationWeather.tempRange[0]),
        Math.abs(weather.temp - stationWeather.tempRange[1])
      );
      
      tempScore = Math.max(0, 15 - distanceFromRange);
    }
    
    return Math.max(acc, conditionScore + tempScore);
  }, 0);
  
  score += weatherScore;
  
  // Popülerlik (0-20 puan)
  score += station.popularity * 2;
  
  // Tavan değer kontrolü
  return Math.min(score, maxScore);
}

/**
 * Mood ve hava durumuna göre en uygun istasyonları filtreleyen fonksiyon
 * 
 * @param {String} mood - Seçilen ruh hali
 * @param {Object} weather - Hava durumu nesnesi
 * @param {Number} threshold - Minimum uyumluluk eşiği (0-100)
 * @return {Array} Uyumluluk puanına göre sıralanmış istasyon dizisi
 */
export function getCompatibleStations(mood, weather, threshold = 50) {
  return stations
    .map(station => ({
      ...station,
      compatibilityScore: calculateStationCompatibility(station, mood, weather)
    }))
    .filter(station => station.compatibilityScore >= threshold)
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}
