/**
 * Kozmik Müzik İstasyonları Veri Yapısı
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
    genres: ['r&b', 'soul', 'jazz', 'romantic'],
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
    description: 'R&B düetler, romantik parçalar. İki yıldızın yavaş yavaş birbirinin etrafında dönmesi.',
    genres: ['r&b', 'duet', 'romantic'],
    moods: ['romantic', 'calm'],
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
    description: 'Pop, K-Pop, enerji dolu parçalar. Dev patlama bulutu, neon sahne ışıkları.',
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
    description: 'Cool jazz, smooth saxophone. Küçük renkli enerji noktaları.',
    genres: ['jazz', 'cool jazz', 'saxophone'],
    moods: ['calm', 'classy'],
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
    description: '70\'ler disko, funk. Parlak buz kuyruğu, yansımalı dans pisti.',
    genres: ['disco', 'funk', 'dance'],
    moods: ['happy', 'energetic'],
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
    description: 'Drum & Bass, hızlı ritimler. Nabız gibi atan ışık hüzmeleri.',
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
    description: 'Ambient, chillstep. Buzullar, mavi-beyaz kubbeler.',
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
    description: 'Synthwave ve dream pop\'un büyülü dansı. Kutup ışıklarının müziği.',
    genres: ['synthwave', 'chillwave', 'ambient', 'electronic', 'dreamPop'],
    moods: ['calm', 'nostalgic', 'melancholic', 'inspirational'],
    weather: [
      { condition: 'snow', tempRange: [-5, 5] },
      { condition: 'clouds', tempRange: [0, 10] },
      { condition: 'clear', tempRange: [-10, 5] },
      { condition: 'mist', tempRange: [-5, 8] }
    ],
    popularity: 8
  },
  {
    id: 'quasar-energy-core',
    name: 'Kuasar',
    emoji: '⭐',
    description: 'Yüksek enerjili psytrance ve dubstep. Galaksinin merkezinden gelen güçlü enerji.',
    genres: ['psytrance', 'dubstep', 'bass', 'electronic', 'high-energy'],
    moods: ['energetic', 'intense', 'powerful', 'excited', 'motivasyon'],
    weather: [
      { condition: 'clear', tempRange: [15, 35] },
      { condition: 'storm', tempRange: [20, 40] },
      { condition: 'thunderstorm', tempRange: [25, 45] }
    ],
    popularity: 9
  }
];

// Mood ve weather sözlükleri (kısaltılmış versiyon)
export const moodDictionary = {
  'happy': { intensity: 7, energy: 8 },
  'calm': { intensity: 3, energy: 2 },
  'energetic': { intensity: 9, energy: 10 },
  'romantic': { intensity: 6, energy: 5 },
  'nostalgic': { intensity: 5, energy: 4 },
  'melancholic': { intensity: 5, energy: 3 },
  'motivasyon': { intensity: 8, energy: 10 },
  'rahatlama': { intensity: 2, energy: 1 },
  'isyankar': { intensity: 10, energy: 9 },
  'dinginvederin': { intensity: 3, energy: 2 }
};

export const weatherConditionMap = {
  'clear': { energy: 8, atmosphere: 'bright' },
  'clouds': { energy: 5, atmosphere: 'neutral' },
  'rain': { energy: 3, atmosphere: 'moody' },
  'snow': { energy: 4, atmosphere: 'peaceful' },
  'storm': { energy: 10, atmosphere: 'chaotic' }
};
