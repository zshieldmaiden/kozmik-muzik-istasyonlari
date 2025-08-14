<template>
  <div class="galaxymuse-panel p-6 space-y-4" style="min-width:0; max-width:100%;">
    <div class="flex items-center gap-3 mb-2">
      <div class="galaxymuse-avatar flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg border-4 border-white/20">
        <span class="text-3xl">🎧</span>
      </div>
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-white drop-shadow">GalaxyMuse</h2>
        <div class="text-xs text-purple-200 font-medium mt-1">Kozmik Müzik & Ruh Hali Asistanı</div>
      </div>
  <!-- Sağ üstteki butonlar kaldırıldı -->
    </div>
    <div class="flex flex-col gap-2" style="min-width:0;">
  <textarea v-model="userText" placeholder="Kullanıcı metni (ör: Bugün çok enerjik ve mutlu hissediyorum!)" class="w-full rounded galaxymuse-input px-3 py-2 h-14" rows="1" />
  <!-- Hava durumu inputu kaldırıldı, otomatik alınacak -->
  <textarea v-model="history" placeholder="Geçmiş şarkılar (virgülle ayır: Shape of You - Ed Sheeran, Blinding Lights - The Weeknd)" class="w-full rounded galaxymuse-input px-3 py-2 h-14" rows="1" />
  <div class="flex gap-2 mt-3 justify-center">
        <button @click="ask" :disabled="loading" class="galaxymuse-btn-main" title="Müzik Analizi Yap">
          <span class="btn-icon">🎵</span>
          <span class="btn-text">Analiz Et</span>
        </button>
        <button @click="clearAll" class="galaxymuse-btn-secondary" title="Tümünü Temizle">
          <span class="btn-icon">🧹</span>
        </button>
        <button @click="copyAnswer" :disabled="!answer" class="galaxymuse-btn-secondary" title="Yanıtı Kopyala">
          <span class="btn-icon">📋</span>
        </button>
        <button @click="createPlaylist" :disabled="!answer" class="galaxymuse-btn-secondary" title="Çalma Listesi Oluştur">
          <span class="btn-icon">🎶</span>
        </button>
      </div>
    </div>
    <div v-if="error" class="text-red-300 text-sm font-semibold">{{ error }}</div>
    <div v-if="loading" class="text-white/80 text-base flex items-center gap-2"><span class="animate-spin">🌌</span></div>
    <div v-if="answer" class="galaxymuse-answer-box mt-2">
      <div class="answer-header">
        <h4 class="answer-title">🎵 Müzik Önerileri</h4>
      </div>
      <div class="answer-content">
        <pre class="whitespace-pre-wrap text-sm text-white/90 leading-relaxed">{{ answer }}</pre>
      </div>
    </div>
    
    <!-- Çalma Listesi Bölümü -->
    <div v-if="playlist.length > 0" class="galaxymuse-playlist-box mt-4" :class="`station-theme-${currentStation}`">
      <div class="playlist-header">
        <h4 class="playlist-title">🎶 {{ getStationDisplayName(currentStation) }} Çalma Listesi</h4>
        <button @click="clearPlaylist" class="playlist-clear-btn">🗑️</button>
      </div>
      <div class="playlist-content">
        <div v-for="(song, index) in playlist" :key="index" class="playlist-item">
          <div class="playlist-item-number">{{ index + 1 }}</div>
          <div class="playlist-item-info">
            <div class="playlist-item-title">{{ song.title }}</div>
            <div class="playlist-item-artist">{{ song.artist }}</div>
          </div>
          <button @click="playSimulation(song)" class="playlist-play-btn">▶️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import MusicApiClient from '../api/musicApi.js'
import { generateAuralisResponse } from '@/utils/auralisAgent.js'

const props = defineProps({
  weather: { type: [Object, String], default: null }
})

const emit = defineEmits(['station-selected', 'songs-added'])

const userText = ref('Bugün çok enerjik ve mutlu hissediyorum!')
const history = ref('Shape of You - Ed Sheeran, Blinding Lights - The Weeknd')
const answer = ref('')
const loading = ref(false)
const error = ref('')
const playlist = ref([])
const currentStation = ref('earth') // Varsayılan durak

function clearAll() {
  userText.value = ''
  history.value = ''
  answer.value = ''
  error.value = ''
  playlist.value = []
}

function copyAnswer() {
  if (answer.value) {
    navigator.clipboard.writeText(answer.value)
  }
}

function parsePlaylistFromAnswer(answerText) {
  const songs = []
  const lines = answerText.split('\n')
  
  // "💫 Kozmik Müzik Önerileri:" satırından sonraki 1-5 arası numaralı satırları bul
  let foundPlaylistSection = false
  
  for (const line of lines) {
    if (line.includes('💫 Kozmik Müzik Önerileri:')) {
      foundPlaylistSection = true
      continue
    }
    
    if (foundPlaylistSection && line.trim() === '') continue
    if (foundPlaylistSection && line.includes('✨════')) break
    
    if (foundPlaylistSection) {
      // Şarkı formatını parse et: "1. Şarkı - Sanatçı"
      const match = line.match(/^\d+\.\s*(.+?)\s*-\s*(.+)$/)
      if (match) {
        const [, title, artist] = match
        songs.push({
          title: title.trim(),
          artist: artist.trim()
        })
      }
    }
  }
  
  return songs
}

function parseStationFromAnswer(answerText) {
  const lines = answerText.split('\n')
  
  // "🚀 Önerilen Gezegen Durağı:" satırını bul
  for (const line of lines) {
    if (line.includes('🚀 Önerilen Gezegen Durağı:')) {
      const match = line.match(/🚀 Önerilen Gezegen Durağı:\s*(.+)/i)
      if (match) {
        const stationName = match[1].trim()
        
        // Durak ismini ID'ye çevir
        const stationMap = {
          'Dünya': 'earth',
          'Mars': 'mars', 
          'Venüs': 'venus',
          'Jüpiter': 'jupiter',
          'Satürn': 'saturn',
          'Kara Delik': 'blackhole',
          'Andromeda': 'andromeda'
        }
        
        for (const [name, id] of Object.entries(stationMap)) {
          if (stationName.toLowerCase().includes(name.toLowerCase())) {
            return id
          }
        }
      }
    }
  }
  
  return null
}

function createPlaylist() {
  if (!answer.value) return
  
  const parsedSongs = parsePlaylistFromAnswer(answer.value)
  const suggestedStation = parseStationFromAnswer(answer.value)
  
  playlist.value = parsedSongs
  
  if (parsedSongs.length > 0) {
    console.log('Çalma listesi oluşturuldu:', parsedSongs)
    
    // Önerilen durağa geçiş yap
    if (suggestedStation) {
      currentStation.value = suggestedStation // Yerel state güncelle
      console.log('Önerilen durağa geçiliyor:', suggestedStation)
      emit('station-selected', suggestedStation)
      
      // Önerileri müzik veritabanına ekle
      addSongsToDatabase(parsedSongs, suggestedStation)
      
      // Kısa bir süre sonra kullanıcıya bilgi ver
      setTimeout(() => {
        alert(`🚀 ${getStationDisplayName(suggestedStation)} durağına geçiş yapıldı!\n🎶 Çalma listesi bu durağın temasına uygun olarak oluşturuldu.\n🎵 Öneriler ${getStationDisplayName(suggestedStation)} müzik kütüphanesine eklendi!`)
      }, 500)
    } else {
      // Varsayılan olarak Earth durağını kullan
      currentStation.value = 'earth'
      addSongsToDatabase(parsedSongs, 'earth')
    }
  }
}

async function addSongsToDatabase(songs, stationId) {
  try {
    // Şarkıları SQLite veritabanına ekle
    const results = [];
    
    for (const song of songs) {
      const songData = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: song.title || 'AI Önerisi',
        artist: song.artist || 'AI Sanatçı',
        genre: song.genre || 'ai-generated',
        year: song.year || new Date().getFullYear(),
        spotifyQuery: `${song.title} ${song.artist}`.trim(),
        popularity: song.popularity || 7,
        stations: [stationId],
        moods: song.moods || ['ai-generated'],
        weather: {
          conditions: song.weather || ['ai-generated'],
          tempRange: [15, 30]
        }
      };
      
      const result = await MusicApiClient.addSong(songData);
      results.push(result);
    }
    
    console.log(`✅ ${results.length} AI önerisi veritabanına eklendi`);
    
    // Parent component'e de bildir
    emit('songs-added', {
      songs: songs,
      station: stationId,
      timestamp: new Date().toISOString(),
      source: 'database'
    });
    
  } catch (error) {
    console.error('❌ AI önerileri veritabanına eklenemedi:', error);
    
    // Hata durumunda parent component'e emit et
    emit('songs-added', {
      songs: songs,
      station: stationId,
      timestamp: new Date().toISOString(),
      source: 'localStorage'
    });
  }
}

function getStationDisplayName(stationId) {
  const stationNames = {
    earth: 'Dünya',
    mars: 'Mars', 
    venus: 'Venüs',
    jupiter: 'Jüpiter',
    saturn: 'Satürn',
    blackhole: 'Kara Delik',
    andromeda: 'Andromeda'
  }
  return stationNames[stationId] || stationId
}

function clearPlaylist() {
  playlist.value = []
}

function playSimulation(song) {
  // Şimdilik sadece konsola yazdır, gerçek entegrasyon için Spotify API gerekir
  console.log(`Çalınıyor: ${song.title} - ${song.artist}`)
  alert(`🎵 Çalınıyor: ${song.title} - ${song.artist}`)
}

function getWeatherString() {
  // OpenWeatherMap objesinden ana durumu çek
  if (!props.weather) return ''
  if (typeof props.weather === 'string') return props.weather
  if (props.weather.weather && Array.isArray(props.weather.weather) && props.weather.weather[0]?.main) {
    // Türkçeleştirme veya normalize işlemi gerekirse burada yapılabilir
    return props.weather.weather[0].main
  }
  return ''
}

async function ask() {
  loading.value = true
  error.value = ''
  answer.value = ''
  try {
    // Geçmiş şarkıları diziye çevir
    const historyArr = history.value.split(',').map(s => s.trim()).filter(Boolean)
    const weatherStr = getWeatherString()
    answer.value = await generateAuralisResponse({ userText: userText.value, weather: weatherStr, history: historyArr })
  } catch (e) {
    error.value = String(e?.message || e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.galaxymuse-input {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(168,85,247,0.18);
  color: #fff;
  font-size: 0.85em;
  font-family: inherit;
  outline: none;
  transition: border 0.2s, background 0.2s;
}
.galaxymuse-input:focus {
  border-color: #a855f7;
  background: rgba(168,85,247,0.10);
}

.galaxymuse-btn-main {
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  color: #fff;
  font-weight: 600;
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border: none;
  box-shadow: 0 2px 8px rgba(80,0,120,0.2), 0 1px 0 rgba(255,255,255,0.1) inset;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.galaxymuse-btn-main:hover:not(:disabled) {
  background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(80,0,120,0.3), 0 1px 0 rgba(255,255,255,0.1) inset;
}

.galaxymuse-btn-main:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.galaxymuse-btn-secondary {
  background: rgba(255,255,255,0.08);
  color: #e4e7eb;
  font-weight: 500;
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  border: 1px solid rgba(168,85,247,0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.galaxymuse-btn-secondary:hover:not(:disabled) {
  background: rgba(168,85,247,0.1);
  border-color: rgba(168,85,247,0.4);
  color: #a855f7;
  transform: translateY(-1px);
}

.galaxymuse-btn-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  font-size: 1.1rem;
}

.btn-text {
  font-size: 0.85rem;
  font-weight: 600;
}
.galaxymuse-panel {
  box-shadow: 0 8px 32px rgba(80,0,120,0.18), 0 1.5px 0 rgba(255,255,255,0.08) inset;
  border-radius: 1.25rem;
  border: 1.5px solid rgba(168,85,247,0.18);
  background: linear-gradient(135deg, #2d1b69cc 0%, #1e3a8acc 100%);
}

.galaxymuse-avatar {
  box-shadow: 0 4px 16px rgba(80,0,120,0.18);
}
.galaxymuse-answer-box {
  background: linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%);
  border-radius: 1rem;
  border: 1px solid rgba(168,85,247,0.15);
  box-shadow: 0 4px 16px rgba(80,0,120,0.12);
  overflow: hidden;
}

.answer-header {
  background: linear-gradient(90deg, rgba(168,85,247,0.1) 0%, rgba(59,130,246,0.1) 100%);
  border-bottom: 1px solid rgba(168,85,247,0.1);
  padding: 0.75rem 1rem;
}

.answer-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #a855f7;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.answer-content {
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

.answer-content::-webkit-scrollbar {
  width: 4px;
}

.answer-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.answer-content::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.4);
  border-radius: 2px;
}

.answer-content::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.6);
}

/* Çalma Listesi Stilleri */
.galaxymuse-playlist-box {
  background: linear-gradient(135deg, rgba(59,130,246,0.8) 0%, rgba(168,85,247,0.9) 100%);
  border-radius: 1rem;
  border: 1px solid rgba(59,130,246,0.2);
  box-shadow: 0 4px 16px rgba(59,130,246,0.15);
  overflow: hidden;
}

.playlist-header {
  background: linear-gradient(90deg, rgba(59,130,246,0.1) 0%, rgba(168,85,247,0.1) 100%);
  border-bottom: 1px solid rgba(59,130,246,0.15);
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.playlist-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.playlist-clear-btn {
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  color: #ef4444;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.playlist-clear-btn:hover {
  background: rgba(239,68,68,0.2);
  border-color: rgba(239,68,68,0.4);
}

.playlist-content {
  padding: 0.5rem;
  max-height: 250px;
  overflow-y: auto;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  margin: 0.25rem 0;
  background: rgba(255,255,255,0.08);
  border-radius: 0.5rem;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.2s ease;
}

.playlist-item:hover {
  background: rgba(255,255,255,0.12);
  border-color: rgba(59,130,246,0.3);
  transform: translateX(2px);
}

.playlist-item-number {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.playlist-item-info {
  flex: 1;
  min-width: 0;
}

.playlist-item-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e4e7eb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-item-artist {
  font-size: 0.75rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-play-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.playlist-play-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: scale(1.1);
}

.playlist-content::-webkit-scrollbar {
  width: 4px;
}

.playlist-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.playlist-content::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.4);
  border-radius: 2px;
}

.playlist-content::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.6);
}

/* Durak Tema Stilleri */
.station-theme-earth {
  background: linear-gradient(135deg, rgba(34,197,94,0.8) 0%, rgba(59,130,246,0.9) 100%);
  border-color: rgba(34,197,94,0.3);
}

.station-theme-mars {
  background: linear-gradient(135deg, rgba(239,68,68,0.8) 0%, rgba(245,101,101,0.9) 100%);
  border-color: rgba(239,68,68,0.3);
}

.station-theme-venus {
  background: linear-gradient(135deg, rgba(236,72,153,0.8) 0%, rgba(219,39,119,0.9) 100%);
  border-color: rgba(236,72,153,0.3);
}

.station-theme-jupiter {
  background: linear-gradient(135deg, rgba(168,85,247,0.8) 0%, rgba(147,51,234,0.9) 100%);
  border-color: rgba(168,85,247,0.3);
}

.station-theme-saturn {
  background: linear-gradient(135deg, rgba(245,158,11,0.8) 0%, rgba(217,119,6,0.9) 100%);
  border-color: rgba(245,158,11,0.3);
}

.station-theme-blackhole {
  background: linear-gradient(135deg, rgba(71,85,105,0.8) 0%, rgba(51,65,85,0.9) 100%);
  border-color: rgba(71,85,105,0.3);
}

.station-theme-andromeda {
  background: linear-gradient(135deg, rgba(139,92,246,0.8) 0%, rgba(124,58,237,0.9) 100%);
  border-color: rgba(139,92,246,0.3);
}

/* Her durak için playlist title rengini özelleştir */
.station-theme-earth .playlist-title {
  color: #22c55e;
}

.station-theme-mars .playlist-title {
  color: #ef4444;
}

.station-theme-venus .playlist-title {
  color: #ec4899;
}

.station-theme-jupiter .playlist-title {
  color: #a855f7;
}

.station-theme-saturn .playlist-title {
  color: #f59e0b;
}

.station-theme-blackhole .playlist-title {
  color: #94a3b8;
}

.station-theme-andromeda .playlist-title {
  color: #8b5cf6;
}
</style>
