<template>
  <div id="app-container" class="cosmic-background min-h-screen text-white font-sans relative overflow-hidden flex flex-col w-screen h-screen m-0 p-0">
    <!-- Galaktik Arka Plan Efektleri -->
    <ParticlesBackground />
    
    <header class="w-full relative z-20 px-4 py-2 border-b border-white/10">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full gap-2 lg:gap-0">
        <!-- Left: Logo + Title -->
        <div class="flex items-center gap-3 h-14">
          <img src="/app-logo.jpg" 
               alt="Mood Music Galaxy Logo" 
               class="app-logo w-11 h-11 rounded-lg">
          <h1 class="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
            Mood Music Galaxy
          </h1>
        </div>
      </div>
    </header>

    <main class="relative z-10 flex-1 w-full h-full overflow-auto">
      <!-- Ana İçerik Alanı - 2 Kolon Düzen -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-1 w-full h-full">
        
        <!-- SOL TARAF - Kozmik Müzik İstasyonları (Yarım Ekran) -->
        <div class="glass-panel m-1 h-full flex flex-col">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
              🚀 Kozmik Müzik İstasyonları 
              <span class="text-sm text-purple-300">{{ cosmicStations.length }}</span>
            </h3>
            <button @click="showCosmicStations = !showCosmicStations" 
                    class="px-3 py-1 bg-purple-600/30 hover:bg-purple-500/40 rounded-full text-sm transition-all">
              {{ showCosmicStations ? '📖' : '🌟' }}
            </button>
          </div>
          
          <!-- İstasyon Kartları - Orta Boyutlu + Müzik Önerileri -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 flex-1 overflow-auto" v-if="showCosmicStations">
            
            <!-- CosmicStations Test - Background animasyonlar için -->
            <div class="col-span-full mb-4">
              <CosmicStations :weather="weather || defaultWeather" />
            </div>
            
            <div v-for="station in cosmicStations" :key="station.id" class="flex flex-col">
              <!-- İstasyon Kartı -->
              <div @click="selectStation(station.id)"
                   class="station-card-medium group cursor-pointer mb-2"
                   :class="{ 'ring-2 ring-purple-400': selectedStation === station.id }">
                <div class="station-icon-medium" :class="`${station.id}-gradient`">
                  {{ station.emoji }}
                </div>
                <h4 class="station-name-medium">{{ station.name }}</h4>
                <p class="station-desc-medium">{{ getStationDescription(station.id) }}</p>
              </div>
              
              <!-- Müzik Önerileri - Her Kartın Altında -->
              <div class="bg-gradient-to-br from-purple-900/15 to-blue-900/15 rounded-lg p-2 border border-purple-500/10">
                <div class="flex items-center justify-between mb-2">
                  <h5 class="text-xs font-medium text-purple-300 flex items-center gap-1">
                    🎵 Öneriler
                  </h5>
                  <div class="flex gap-1">
                    <button @click="refreshStationPlaylist(station.id)" 
                            class="px-2 py-0.5 bg-purple-600/30 hover:bg-purple-500/40 rounded text-xs transition-all"
                            title="Playlist'i Yenile">
                      🔄
                    </button>
                    <button @click="testSpotifySearch(station.id)" 
                            class="px-2 py-0.5 bg-green-600/30 hover:bg-green-500/40 rounded text-xs transition-all"
                            title="Spotify Test">
                      🎧
                    </button>
                  </div>
                </div>
                <div class="space-y-1 max-h-32 overflow-y-auto">
                  <div v-for="(track, index) in getStationPlaylist(station.id).slice(0, 3)" :key="index"
                       class="flex items-center gap-2 p-1.5 bg-white/3 rounded hover:bg-white/8 transition-all cursor-pointer text-xs">
                    <div class="w-5 h-5 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center text-xs font-bold">
                      {{ index + 1 }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-white truncate text-xs">{{ track.title }}</p>
                      <p class="text-purple-200 truncate text-xs opacity-80">{{ track.artist }}</p>
                    </div>
                  </div>
                  <button v-if="getStationPlaylist(station.id).length > 3"
                          class="w-full text-xs text-purple-300 hover:text-purple-200 py-1 text-center">
                    +{{ getStationPlaylist(station.id).length - 3 }} daha fazla...
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Kompakt İstasyon Listesi -->
          <div v-else class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 flex-1 overflow-auto">
            <div v-for="station in cosmicStations" :key="station.id" 
                 @click="selectStation(station.id)"
                 class="station-mini-card-small group cursor-pointer"
                 :class="{ 'ring-1 ring-purple-400': selectedStation === station.id }">
              <div class="station-icon-small" :class="`${station.id}-gradient`">
                {{ station.emoji }}
              </div>
              <span class="station-name-small">{{ station.name }}</span>
            </div>
          </div>
        </div>

        <!-- SAĞ TARAF - Diğer Kontroller -->
        <div class="flex flex-col gap-1 h-full">
          <!-- Hava Durumu + GalaxyMuse (AI) Kompakt Panel -->
          <div class="glass-panel m-1 p-2 flex flex-row gap-2 items-stretch" style="min-height:unset;">
            <div style="flex:1; min-width:0; max-width:50%; display:flex; align-items:center; justify-content:center;">
              <WeatherDisplay :weather="weather" @weather-updated="updateWeather" small />
            </div>
            <div style="flex:1; min-width:0; max-width:50%; display:flex; align-items:center; justify-content:center;">
              <AuralisPanel compact :weather="weather" @station-selected="selectStation" @songs-added="addSongsToStation" />
            </div>
          </div>

          <!-- Ruh Hali Kartı -->
          <div class="glass-panel m-1">
            <MoodSelector @selectMood="setMood" :selected-mood="selectedMood" />
          </div>

          <!-- Müzik Çalar Kartı -->
          <div class="glass-panel m-1 flex-1">
            <MusicPlayer :mood="selectedMood" :weather="weather" @gamification-updated="onGamificationUpdated" />
          </div>

          <!-- Spotify Player Kartı -->
          <div class="glass-panel m-1 flex-1">
            <SpotifyPlayer />
          </div>
        </div>

      </div>

    </main>

    <!-- Alt Paneller - KOMPAKt PROFESYONEL FOOTER -->
    <footer class="w-full relative z-10 py-2">
      <!-- Zaman Tüneli - Kompakt -->
      <div class="compact-panel w-full mx-1 mb-2" v-if="showSpaceTimeline">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-base font-semibold">⏰ Zaman Tüneli</h2>
          <button @click="showSpaceTimeline = false" 
                  class="text-xs px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-purple-300 hover:text-white transition-all">
            ✕
          </button>
        </div>
        <SpaceTimeline />
      </div>
      
      <!-- Liderlik Tablosu - Modal -->
      <div class="leaderboard-modal" v-if="showLeaderboard">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-base font-semibold">🏆 Galaktik Liderlik Tablosu</h2>
          <button @click="showLeaderboard = false" 
                  class="text-xs px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-purple-300 hover:text-white transition-all">
            ✕
          </button>
        </div>
        <div class="leaderboard-content">
          <LeaderboardPanel />
        </div>
      </div>
      
      <!-- Kompakt Alt Paneller -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 w-full px-1">
        <!-- Liderlik Tablosu - Kompakt -->
        <div class="compact-panel leaderboard-panel">
          <button @click="showLeaderboard = !showLeaderboard" 
                  class="compact-nav-button w-full h-full">
            <span class="text-sm">🏆</span>
            <span class="text-xs">Liderlik</span>
          </button>
        </div>
        
        <!-- Hızlı Erişim - Kompakt -->
        <div class="compact-panel quick-access-panel">
          <div class="flex gap-2">
            <button @click="showSpaceTimeline = !showSpaceTimeline" 
                    class="compact-nav-button flex-1">
              <span class="text-sm">⏰</span>
              <span class="text-xs">Zaman</span>
            </button>
          </div>
        </div>
        
        <!-- Müzik Player - Ultra Kompakt -->
        <div class="compact-panel music-player-panel relative">
          <button @click="musicActions.toggleWidget()" 
                  class="compact-nav-button w-full h-full music-widget-button"
                  :class="{ 'widget-active': musicState.isWidgetOpen }">
            <span class="text-sm">🎵</span>
            <span class="text-xs">{{ musicState.currentSong ? musicState.currentSong.title.substring(0, 8) + '...' : 'Müzik' }}</span>
          </button>
          
          <!-- Çok Küçük Müzik Widget -->
          <div v-if="musicState.isWidgetOpen" class="music-mini-widget">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-medium text-white">🎵 Cosmic Journey</span>
              <button @click="musicActions.closeWidget()" 
                      class="text-xs text-red-300 hover:text-red-100">✕</button>
            </div>
            <div class="music-mini-content">
              <GalaxyMeteorMusicPlayer 
                :mood="selectedMood" 
                :compact="true" 
                :mini="true" 
                :current-song="musicState.currentSong"
                :auto-play="musicState.autoPlay"
                @song-changed="onGlobalSongChanged" />
            </div>
          </div>
        </div>
      </div>
    </footer>
    
    <StarCanvas />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMusicPlayer } from './utils/musicPlayerStore.js'
import ParticlesBackground from './components/ParticlesBackground.vue'
import StarCanvas from './components/StarCanvas.vue'
import WeatherDisplay from './components/WeatherDisplay.vue'
import MoodSelector from './components/MoodSelector.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import SpotifyPlayer from './components/SpotifyPlayer.vue'
import SpaceTimeline from './components/SpaceTimeline.vue'
import CosmicStations from './components/CosmicStations.vue'
import GalaxyMeteorMusicPlayer from './components/GalaxyMeteorMusicPlayer.vue'
import LeaderboardPanel from './components/LeaderboardPanel.vue'
import AuralisPanel from './components/AuralisPanel.vue'
import { fetchWeather, defaultWeather } from './api/weather'
import { getPassengerPoints, isSpecialStationUnlocked } from './utils/gamification'
import { musicDatabase } from '@/data/musicDatabase.js'
import * as spotifyApi from '@/api/spotify.js'

const weather = ref(null)
const selectedMood = ref('happy')
const showSpaceTimeline = ref(false)
const showLeaderboard = ref(false)
const showCosmicStations = ref(true)
const selectedStation = ref(null)

// Global müzik player store
const { state: musicState, actions: musicActions } = useMusicPlayer()

const passengerPoints = ref(0)
const specialStationUnlocked = ref(false)

// Dinamik müzik veritabanı (başlangıçta statik veritabanından kopyala)
const dynamicMusicDatabase = ref([...musicDatabase])

// Galaktik İstasyonlar
const baseStations = [
  { id: 'earth', name: 'Dünya', emoji: '🌍', description: 'Ana gezegen müzikleri' },
  { id: 'mars', name: 'Mars', emoji: '🔴', description: 'Enerjik rock ve elektronik' },
  { id: 'venus', name: 'Venüs', emoji: '💫', description: 'Romantik ve yumuşak melodiler' },
  { id: 'jupiter', name: 'Jüpiter', emoji: '🪐', description: 'Görkemli orkestral müzik' },
  { id: 'sun', name: 'Güneş', emoji: '☀️', description: 'Enerjik ve ışıltılı müzikler' },
  { id: 'neptune', name: 'Neptün', emoji: '🌊', description: 'Derin ambient sesler' },
  { id: 'milkyway', name: 'Samanyolu', emoji: '🌌', description: 'Galaktik synthwave' },
  { id: 'andromeda', name: 'Andromeda', emoji: '✨', description: 'Deneysel uzay müziği' },
  { id: 'blackhole', name: 'Kara Delik', emoji: '⚫', description: 'Karanlık ambient' }
]

const cosmicStations = computed(() => {
  const list = [...baseStations]
  if (specialStationUnlocked.value) {
    list.push({ 
      id: 'quasar', 
      name: 'Kuasar', 
      emoji: '🌟', 
      description: 'Ultra enerjili EDM arena' 
    })
  }
  return list
})

function setMood(mood) {
  selectedMood.value = mood
  localStorage.setItem('lastMood', mood)
}

function selectStation(stationId) {
  selectedStation.value = stationId
  // İstasyona göre mood ayarla
  const station = cosmicStations.value.find(s => s.id === stationId)
  if (station) {
    console.log(`${station.name} istasyonu seçildi`)
  }
}

function addSongsToStation(event) {
  const { songs, station, timestamp } = event
  
  console.log(`${songs.length} şarkı ${getStationDisplayName(station)} durağına ekleniyor...`)
  
  // Her şarkıyı veritabanına ekle
  songs.forEach((song, index) => {
    const newSong = {
      id: `ai-${station}-${Date.now()}-${index}`,
      title: song.title,
      artist: song.artist,
      genre: getStationGenre(station),
      year: new Date().getFullYear(),
      spotifyQuery: `${song.title} ${song.artist}`,
      moods: getStationMoods(station),
      weather: {
        conditions: getStationWeatherConditions(station),
        tempRange: [10, 30]
      },
      stations: [station],
      popularity: 8, // AI önerileri yüksek popülerlik
      source: 'ai-recommendation',
      timestamp: timestamp
    }
    
    // Aynı şarkı zaten var mı kontrol et
    const exists = dynamicMusicDatabase.value.some(existing => 
      existing.title.toLowerCase() === song.title.toLowerCase() && 
      existing.artist.toLowerCase() === song.artist.toLowerCase() &&
      existing.stations.includes(station)
    )
    
    if (!exists) {
      dynamicMusicDatabase.value.push(newSong)
      console.log(`✅ Eklendi: ${song.title} - ${song.artist}`)
    } else {
      console.log(`⚠️ Zaten mevcut: ${song.title} - ${song.artist}`)
    }
  })
}

function getStationDisplayName(stationId) {
  const stationNames = {
    earth: 'Dünya',
    mars: 'Mars', 
    venus: 'Venüs',
    jupiter: 'Jüpiter',
    sun: 'Güneş',
    neptune: 'Neptün',
    milkyway: 'Samanyolu',
    andromeda: 'Andromeda',
    blackhole: 'Kara Delik'
  }
  return stationNames[stationId] || stationId
}

function getStationGenre(stationId) {
  const stationGenres = {
    earth: 'pop',
    mars: 'rock',
    venus: 'romantic',
    jupiter: 'orchestral',
    sun: 'energetic',
    neptune: 'ambient',
    milkyway: 'synthwave',
    andromeda: 'experimental',
    blackhole: 'ambient'
  }
  return stationGenres[stationId] || 'pop'
}

function getStationMoods(stationId) {
  const stationMoods = {
    earth: ['happy', 'energetic', 'neutral'],
    mars: ['energetic', 'powerful', 'intense'],
    venus: ['romantic', 'calm', 'loving'],
    jupiter: ['epic', 'powerful', 'dramatic'],
    sun: ['energetic', 'bright', 'uplifting'],
    neptune: ['calm', 'meditative', 'ambient'],
    milkyway: ['nostalgic', 'dreamy', 'cosmic'],
    andromeda: ['experimental', 'futuristic', 'innovative'],
    blackhole: ['calm', 'meditative', 'ambient']
  }
  return stationMoods[stationId] || ['happy']
}

function getStationWeatherConditions(stationId) {
  const stationWeather = {
    earth: ['clear', 'clouds'],
    mars: ['clear', 'dust'],
    venus: ['rain', 'storms'],
    jupiter: ['storms', 'extreme'],
    sun: ['sunny', 'bright'],
    neptune: ['oceanic', 'blue'],
    milkyway: ['starry', 'night'],
    andromeda: ['galactic', 'distant'],
    blackhole: ['dark', 'mysterious']
  }
  return stationWeather[stationId] || ['clear']
}

function getStationDescription(stationId) {
  const station = baseStations.find(s => s.id === stationId)
  return station ? station.description : 'Kozmik müzik deneyimi'
}

function getSelectedStationName() {
  if (!selectedStation.value) return ''
  const station = cosmicStations.value.find(s => s.id === selectedStation.value)
  return station ? station.name : ''
}

function getStationPlaylist(stationId) {
  // dynamicMusicDatabase'den istasyona göre şarkıları filtrele
  try {
    const stationTracks = dynamicMusicDatabase.value
      .filter(track => track.stations.includes(stationId))
      .sort((a, b) => {
        // AI önerilerini üstte göster, sonra popülerlik sırasına göre
        if (a.source === 'ai-recommendation' && b.source !== 'ai-recommendation') return -1
        if (b.source === 'ai-recommendation' && a.source !== 'ai-recommendation') return 1
        return b.popularity - a.popularity
      })
      .slice(0, 8) // Daha fazla şarkı göster (AI önerileri dahil)
      .map(track => ({
        title: track.title,
        artist: track.artist,
        id: track.id,
        year: track.year,
        genre: track.genre,
        spotifyQuery: track.spotifyQuery,
        popularity: track.popularity
      }))
    
    return stationTracks.length > 0 ? stationTracks : getDefaultPlaylist(stationId)
  } catch (error) {
    console.error('Müzik veritabanı yüklenemedi:', error)
    return getDefaultPlaylist(stationId)
  }
}

function getDefaultPlaylist(stationId) {
  // Fallback playlist'ler
  const playlists = {
    earth: [
      { title: "Happy", artist: "Pharrell Williams" },
      { title: "Shape of You", artist: "Ed Sheeran" },
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
      { title: "Here Comes the Sun", artist: "The Beatles" },
      { title: "What a Wonderful World", artist: "Louis Armstrong" }
    ],
    mars: [
      { title: "Life on Mars?", artist: "David Bowie" },
      { title: "Space Oddity", artist: "David Bowie" },
      { title: "Rocket Man", artist: "Elton John" },
      { title: "Harder Better Faster Stronger", artist: "Daft Punk" },
      { title: "Get Lucky", artist: "Daft Punk ft. Pharrell Williams" }
    ],
    venus: [
      { title: "Perfect", artist: "Ed Sheeran" },
      { title: "All of Me", artist: "John Legend" },
      { title: "Thinking Out Loud", artist: "Ed Sheeran" },
      { title: "La Vie En Rose", artist: "Édith Piaf" },
      { title: "Fly Me to the Moon", artist: "Frank Sinatra" }
    ],
    jupiter: [
      { title: "Jupiter", artist: "Gustav Holst" },
      { title: "Also sprach Zarathustra", artist: "Richard Strauss" },
      { title: "Interstellar Main Theme", artist: "Hans Zimmer" },
      { title: "Ode to Joy", artist: "Beethoven" },
      { title: "Imperial March", artist: "John Williams" }
    ],
    sun: [
      { title: "Here Comes the Sun", artist: "The Beatles" },
      { title: "Good Day Sunshine", artist: "The Beatles" },
      { title: "Sunshine", artist: "Keane" },
      { title: "Blinding Lights", artist: "The Weeknd" },
      { title: "Walking on Sunshine", artist: "Katrina and the Waves" }
    ],
    neptune: [
      { title: "Aqueous Transmission", artist: "Incubus" },
      { title: "Weightless", artist: "Marconi Union" },
      { title: "Ocean", artist: "John Butler Trio" },
      { title: "Deep Blue Day", artist: "Brian Eno" },
      { title: "Porcelain", artist: "Moby" }
    ],
    milkyway: [
      { title: "Midnight City", artist: "M83" },
      { title: "Turbo Killer", artist: "Carpenter Brut" },
      { title: "Sunset", artist: "The Midnight" },
      { title: "A Real Hero", artist: "College & Electric Youth" },
      { title: "Starlight", artist: "Muse" }
    ],
    andromeda: [
      { title: "Andromeda", artist: "Weyes Blood" },
      { title: "Cosmic Dancer", artist: "T. Rex" },
      { title: "Svefn-g-englar", artist: "Sigur Rós" },
      { title: "Echoes", artist: "Pink Floyd" },
      { title: "Space Age Bachelor Pad Music", artist: "Stereolab" }
    ],
    blackhole: [
      { title: "Black Hole Sun", artist: "Soundgarden" },
      { title: "The Sound of Silence", artist: "Simon & Garfunkel" },
      { title: "Hurt", artist: "Johnny Cash" },
      { title: "Mad World", artist: "Gary Jules" },
      { title: "Breathe Me", artist: "Sia" }
    ],
    quasar: [
      { title: "Levels", artist: "Avicii" },
      { title: "Bangarang", artist: "Skrillex" },
      { title: "Titanium", artist: "David Guetta ft. Sia" },
      { title: "Animals", artist: "Martin Garrix" },
      { title: "Strobe", artist: "Deadmau5" }
    ]
  }
  
  return playlists[stationId] || []
}

function onGamificationUpdated() {
  passengerPoints.value = getPassengerPoints()
  specialStationUnlocked.value = isSpecialStationUnlocked()
}

// Global müzik player event handlers
function onGlobalSongChanged(song) {
  console.log('🎵 Global: Şarkı değişti:', song?.title)
  // Gerekirse ek işlemler yapılabilir
}

function updateWeather(newWeatherData) {
  weather.value = newWeatherData
  console.log('Hava durumu güncellendi:', newWeatherData.name)
}

onMounted(async () => {
  passengerPoints.value = getPassengerPoints()
  specialStationUnlocked.value = isSpecialStationUnlocked()

  const lastMood = localStorage.getItem('lastMood')
  if (lastMood) {
    selectedMood.value = lastMood
  }

  weather.value = defaultWeather;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await fetchWeather(position.coords.latitude, position.coords.longitude)
          weather.value = data
        } catch (error) {
          console.error('Hava durumu alınırken hata:', error)
        }
      },
      async (error) => {
        console.error('Konum hatası:', error.message)
        try {
          const data = await fetchWeather(41.01, 28.97) // Istanbul
          weather.value = data
        } catch (fetchError) {
          console.error('Fallback hava durumu alınırken hata:', fetchError)
        }
      }
    )
  } else {
    console.error('Tarayıcınızda coğrafi konum desteklenmiyor.')
    try {
      const data = await fetchWeather(41.01, 28.97) // Istanbul
      weather.value = data
    } catch (fetchError) {
      console.error('Fallback hava durumu alınırken hata:', fetchError)
    }
  }
})

// Test Fonksiyonları
function refreshStationPlaylist(stationId) {
  console.log(`🔄 ${stationId} istasyonu playlist'i yenileniyor...`)
  // Bu fonksiyon reactive olduğu için otomatik yenilenecek
  const tracks = getStationPlaylist(stationId)
  console.log(`✅ ${tracks.length} şarkı yüklendi:`, tracks)
}

async function testSpotifySearch(stationId) {
  try {
    console.log(`🎧 ${stationId} istasyonu için Spotify testi başlatılıyor...`)
    
    // İstasyona ait şarkıları al
    const tracks = getStationPlaylist(stationId)
    if (tracks.length === 0) {
      console.warn('Bu istasyon için şarkı bulunamadı')
      return
    }
    
    // İlk şarkıyı Spotify'da arat
    const firstTrack = tracks[0]
    console.log(`🔍 Spotify'da aranan: "${firstTrack.spotifyQuery || firstTrack.title + ' ' + firstTrack.artist}"`)
    
    // Spotify API'yi test et (eğer yapılandırılmışsa)
    const isConfigured = await spotifyApi.isConfigured()
    if (isConfigured) {
      console.log('✅ Spotify API yapılandırılmış!')
      // Gerçek arama yapılabilir
    } else {
      console.log('⚠️ Spotify API henüz yapılandırılmamış. API anahtarı gerekli.')
    }
    
    // Veritabanı istatistikleri
    console.log(`📊 ${stationId} istasyon istatistikleri:`)
    console.log(`- Toplam şarkı: ${tracks.length}`)
    console.log(`- Türler: ${[...new Set(tracks.map(t => t.genre))].join(', ')}`)
    console.log(`- Ortalama popülerlik: ${(tracks.reduce((sum, t) => sum + (t.popularity || 0), 0) / tracks.length).toFixed(1)}`)
    
  } catch (error) {
    console.error('Spotify test hatası:', error)
  }
}
</script>

<style>
/* Galaktik Arka Plan */
.cosmic-background {
  background: linear-gradient(135deg, 
    #1a0b3d 0%,     /* Derin mor */
    #2d1b69 25%,    /* Koyu mor-mavi */
    #1e3a8a 50%,    /* Mavi */
    #312e81 75%,    /* İndigo */
    #1e293b 100%    /* Koyu gri-mavi */
  );
  background-attachment: fixed;
  background-size: 400% 400%;
  animation: gradientFlow 15s ease infinite;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Cam Panel Efekti */
.glass-panel {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.glass-panel:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* Mini İstasyon Kartları */
.station-mini-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.station-mini-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.station-icon-mini {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.station-name-mini {
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
}

/* Küçük İstasyon Kartları */
.station-mini-card-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.station-mini-card-small:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.station-icon-small {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
}

.station-name-small {
  font-size: 0.625rem;
  font-weight: 500;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Orta Boyut İstasyon Kartları - Sol Panel İçin */
.station-card-medium {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  min-height: 140px;
}

.station-card-medium:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 12px 30px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(147, 51, 234, 0.2);
}

.station-icon-medium {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.station-card-medium:hover .station-icon-medium {
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.station-name-medium {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.station-desc-medium {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.3;
  text-align: center;
  max-width: 100%;
}

.station-card-medium:hover .station-name-medium {
  color: white;
}

.station-card-medium:hover .station-desc-medium {
  color: rgba(255, 255, 255, 0.8);
}

/* Küçük İstasyon Kartları - Kompakt Görünüm */
.station-card-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  min-height: 80px;
}

.station-card-small:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.2),
    0 0 15px rgba(147, 51, 234, 0.15);
}

.station-name-small {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.2;
  text-align: center;
}

.station-card-small:hover .station-name-small {
  color: white;
}

/* İstasyon Gradyentleri */
.earth-gradient { background: linear-gradient(135deg, #22c55e, #16a34a); }
.mars-gradient { background: linear-gradient(135deg, #ef4444, #dc2626); }
.venus-gradient { background: linear-gradient(135deg, #f59e0b, #d97706); }
.jupiter-gradient { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.sun-gradient { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
.neptune-gradient { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.milkyway-gradient { background: linear-gradient(135deg, #d946ef, #c026d3); }
.andromeda-gradient { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.blackhole-gradient { background: linear-gradient(135deg, #374151, #1f2937); }
.quasar-gradient { 
  background: conic-gradient(from 0deg, #ff0080, #ff8000, #80ff00, #0080ff, #8000ff, #ff0080);
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Navigasyon Butonları */
.nav-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(147, 51, 234, 0.2);
  border: 1px solid rgba(147, 51, 234, 0.3);
  border-radius: 25px;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-button:hover {
  background: rgba(147, 51, 234, 0.3);
  border-color: rgba(147, 51, 234, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(147, 51, 234, 0.2);
}

/* Kompakt Profesyonel Footer Stiller */
.compact-panel {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0.75rem;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.compact-panel:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.compact-nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: rgba(147, 51, 234, 0.15);
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 8px;
  color: white;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 44px;
  width: 100%;
  flex: 1;
}

.compact-nav-button:hover {
  background: rgba(147, 51, 234, 0.25);
  border-color: rgba(147, 51, 234, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.15);
}

/* Mini Footer Paneller - Süper Kompakt */
.mini-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 0.375rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  min-height: 40px;
}

.mini-panel:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
}

.mini-nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: rgba(147, 51, 234, 0.12);
  border: 1px solid rgba(147, 51, 234, 0.15);
  border-radius: 6px;
  color: white;
  font-weight: 400;
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 24px;
  font-size: 0.75rem;
}

.mini-nav-button:hover {
  background: rgba(147, 51, 234, 0.2);
  border-color: rgba(147, 51, 234, 0.3);
  box-shadow: 0 2px 6px rgba(147, 51, 234, 0.1);
}

/* Genel Container */
#app-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

/* Kaydırma Çubukları */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

/* Uygulama Logosu */
.app-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
  transition: all 0.3s ease;
}

.app-logo:hover {
  transform: scale(1.05) rotate(2deg);
  filter: drop-shadow(0 6px 16px rgba(147, 51, 234, 0.4));
}

/* Müzik Player Panel Stilleri */
.music-player-panel {
  height: 45px;
  min-height: 45px;
  max-height: 45px;
  position: relative;
  display: flex;
  align-items: center;
}

.music-player-content {
  height: 37px;
  min-height: 37px;
  max-height: 37px;
  overflow: hidden;
  display: flex;
  align-items: center;
  width: 100%;
}

/* Müzik player butonlarının daima görünür olması için */
.music-player-content .music-controls {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.music-player-content .progress-bar,
.music-player-content .song-info {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Liderlik ve Hızlı Erişim Panel Stilleri */
.leaderboard-panel,
.quick-access-panel {
  height: 45px;
  min-height: 45px;
  max-height: 45px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0;
}

.leaderboard-panel .compact-nav-button {
  border: none;
  border-radius: 12px;
  margin: 0;
  background: rgba(147, 51, 234, 0.15);
  border: 1px solid rgba(147, 51, 234, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.leaderboard-panel .text-xs,
.quick-access-panel .flex {
  height: 37px;
  min-height: 37px;
  max-height: 37px;
  overflow: hidden;
  display: flex;
  align-items: center;
  width: 100%;
}

/* Liderlik Modal Stilleri */
.leaderboard-modal {
  background: url('/liderlik.jpg') center/cover;
  position: fixed;
  left: 20px;
  bottom: 20px;
  backdrop-filter: blur(2px);
  background-color: rgba(0, 0, 0, 0.3);
  background-blend-mode: overlay;
  border: 1px solid rgba(147, 51, 234, 0.3);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  width: 350px;
  height: 300px;
  max-width: 350px;
  max-height: 300px;
  overflow: hidden;
  z-index: 1;
  margin: 0;
}

.leaderboard-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(79, 70, 229, 0.1));
  border-radius: 12px;
  z-index: 1;
}

.leaderboard-modal > * {
  position: relative;
  z-index: 2;
}

.leaderboard-content {
  height: 250px;
  overflow-y: auto;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(8px);
}

/* Çok Küçük Müzik Widget */

.music-mini-widget {
  position: absolute;
  bottom: calc(100% + 5px);
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  background-image: url('/music.jpg');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  background-color: transparent !important;
  border: 1px solid transparent !important;
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: none !important;
  z-index: 1000;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.music-mini-widget ::v-deep .galaxy-spiral {
  display: none !important;
}

.music-mini-widget ::v-deep button {
  width: 24px !important;
  height: 24px !important;
  position: absolute !important;
  left: 16px !important;
  bottom: 16px !important;
  z-index: 999 !important;
  border-radius: 50% !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
  background: #a855f7 !important;
  box-shadow: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.music-mini-widget ::v-deep button span {
  font-size: 1rem !important;
}

.music-mini-widget,
.music-mini-widget * {
  text-shadow: 0 0 4px rgba(0,0,0,0.7) !important;
}

.music-mini-widget ::v-deep .galaxy-meteor-music-player {
  border: 1px solid transparent !important;
  background: none !important;
  box-shadow: none !important;
}

.music-mini-content {
  flex-grow: 1; /* Kalan alanı doldur */
  overflow-y: auto; /* Gerekirse kaydırma çubuğu */
}

.music-widget-button {
  background: rgba(34, 197, 94, 0.15) !important;
  border-color: rgba(34, 197, 94, 0.2) !important;
}

.music-widget-button.widget-active {
  background: rgba(34, 197, 94, 0.3) !important;
  border-color: rgba(34, 197, 94, 0.5) !important;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2) !important;
}

/* Override for music widget transparency and button positioning */
.music-mini-widget {
  background-color: rgba(10, 10, 10, 0.3) !important;
}

.music-mini-widget ::v-deep .galaxy-spiral {
  display: none;
}

.music-mini-widget ::v-deep button {
  width: 32px !important;
  height: 32px !important;
  position: absolute !important;
  left: 8px !important;
  bottom: 8px !important;
  border-radius: 50% !important;
  padding: 0 !important;
}

.music-mini-widget ::v-deep button span {
  font-size: 1rem !important;
}
</style>

