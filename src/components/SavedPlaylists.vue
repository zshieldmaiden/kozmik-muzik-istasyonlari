<template>
  <div class="saved-playlists-panel">
    <!-- Başlık -->
    <div class="panel-header">
      <h3>💾 Kaydedilen Playlist'ler</h3>
      <div class="header-controls">
        <button @click="loadSavedPlaylists" class="refresh-btn" :disabled="loading">
          {{ loading ? '🔄' : '🔄' }}
        </button>
        <button @click="togglePanel" class="toggle-btn">
          {{ isOpen ? '▼' : '▲' }}
        </button>
      </div>
    </div>

    <!-- İçerik -->
    <div v-if="isOpen" class="panel-content">
      <!-- Yükleme durumu -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Playlist'ler yükleniyor...</p>
      </div>

      <!-- Kategorili Playlist'ler -->
      <div v-else-if="playlists.length > 0" class="categorized-playlists">
        
        <!-- AI ile Kaydedilenler -->
        <div v-if="aiPlaylists.length > 0" class="playlist-category">
          <div class="category-header">
            <h4>🤖 AI ile Kaydedilenler</h4>
            <span class="category-count">{{ aiPlaylists.length }} playlist</span>
          </div>
          <div class="playlists-grid">
            <div 
              v-for="playlist in aiPlaylists" 
              :key="playlist.id" 
              class="playlist-card ai-playlist"
              @click="loadPlaylist(playlist)"
            >
              <!-- Playlist Bilgileri -->
              <div class="playlist-info">
                <div class="playlist-type-badge ai">🤖 AI</div>
                <h4 class="playlist-name">{{ playlist.name }}</h4>
                <p class="playlist-meta">
                  <span class="song-count">🎵 {{ playlist.song_count }} şarkı</span>
                  <span class="created-date">📅 {{ formatDate(playlist.created_at) }}</span>
                </p>
                <div class="playlist-tags">
                  <span 
                    v-for="station in playlist.stations" 
                    :key="station"
                    class="station-tag"
                    :class="getStationClass(station)"
                  >
                    {{ getStationName(station) }}
                  </span>
                </div>
              </div>

              <!-- Playlist Eylemleri -->
              <div class="playlist-actions">
                <button 
                  @click.stop="loadPlaylist(playlist)" 
                  class="action-btn load"
                  title="Playlist'i Yükle"
                >
                  ▶️
                </button>
                <button 
                  @click.stop="downloadPlaylist(playlist)" 
                  class="action-btn download"
                  title="İndir"
                >
                  💾
                </button>
                <button 
                  @click.stop="sharePlaylist(playlist)" 
                  class="action-btn share"
                  title="Paylaş"
                >
                  📤
                </button>
                <button 
                  @click.stop="deletePlaylist(playlist)" 
                  class="action-btn delete"
                  title="Sil"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Manuel Kaydedilenler -->
        <div v-if="manualPlaylists.length > 0" class="playlist-category">
          <div class="category-header">
            <h4>👤 Manuel Kaydedilenler</h4>
            <span class="category-count">{{ manualPlaylists.length }} playlist</span>
          </div>
          <div class="playlists-grid">
            <div 
              v-for="playlist in manualPlaylists" 
              :key="playlist.id" 
              class="playlist-card manual-playlist"
              @click="loadPlaylist(playlist)"
            >
              <!-- Playlist Bilgileri -->
              <div class="playlist-info">
                <div class="playlist-type-badge manual">👤 Manuel</div>
                <h4 class="playlist-name">{{ playlist.name }}</h4>
                <p class="playlist-meta">
                  <span class="song-count">🎵 {{ playlist.song_count }} şarkı</span>
                  <span class="created-date">📅 {{ formatDate(playlist.created_at) }}</span>
                </p>
                <div class="playlist-tags">
                  <span 
                    v-for="station in playlist.stations" 
                    :key="station"
                    class="station-tag"
                    :class="getStationClass(station)"
                  >
                    {{ getStationName(station) }}
                  </span>
                </div>
              </div>

              <!-- Playlist Eylemleri -->
              <div class="playlist-actions">
                <button 
                  @click.stop="loadPlaylist(playlist)" 
                  class="action-btn load"
                  title="Playlist'i Yükle"
                >
                  ▶️
                </button>
                <button 
                  @click.stop="downloadPlaylist(playlist)" 
                  class="action-btn download"
                  title="İndir"
                >
                  💾
                </button>
                <button 
                  @click.stop="sharePlaylist(playlist)" 
                  class="action-btn share"
                  title="Paylaş"
                >
                  📤
                </button>
                <button 
                  @click.stop="deletePlaylist(playlist)" 
                  class="action-btn delete"
                  title="Sil"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Boş durum -->
      <div v-else class="empty-state">
        <div class="empty-icon">🎵</div>
        <h4>Henüz kaydedilmiş playlist yok</h4>
        <p>İlk playlist'inizi oluşturmak için "Kaydet" butonunu kullanın!</p>
      </div>

      <!-- İstatistikler -->
      <div v-if="playlists.length > 0" class="stats-section">
        <h4>📊 İstatistikler</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">{{ playlists.length }}</span>
            <span class="stat-label">Toplam Playlist</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ totalSongs }}</span>
            <span class="stat-label">Toplam Şarkı</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ uniqueStations }}</span>
            <span class="stat-label">Farklı İstasyon</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ averageSongs }}</span>
            <span class="stat-label">Ortalama Şarkı</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MusicApiClient from '../api/musicApi.js'

const emit = defineEmits(['playlist-loaded', 'playlist-deleted'])

// State
const isOpen = ref(false)
const loading = ref(false)
const playlists = ref([])

// Computed properties
const totalSongs = computed(() => {
  return playlists.value.reduce((total, playlist) => total + (playlist.song_count || 0), 0)
})

const uniqueStations = computed(() => {
  const allStations = playlists.value.flatMap(p => p.stations || [])
  return new Set(allStations).size
})

const averageSongs = computed(() => {
  if (playlists.value.length === 0) return 0
  return Math.round(totalSongs.value / playlists.value.length)
})

// AI ile oluşturulan playlistler
const aiPlaylists = computed(() => {
  return playlists.value.filter(playlist => 
    playlist.type === 'ai-suggestions' || 
    playlist.name.includes('AI') || 
    playlist.name.includes('🤖') ||
    playlist.source === 'ai'
  )
})

// Manuel oluşturulan playlistler
const manualPlaylists = computed(() => {
  return playlists.value.filter(playlist => 
    playlist.type !== 'ai-suggestions' && 
    !playlist.name.includes('AI') && 
    !playlist.name.includes('🤖') &&
    playlist.source !== 'ai'
  )
})

// Panel toggle
function togglePanel() {
  isOpen.value = !isOpen.value
  if (isOpen.value && playlists.value.length === 0) {
    loadSavedPlaylists()
  }
}

// Kaydedilmiş playlist'leri yükle
async function loadSavedPlaylists() {
  try {
    loading.value = true
    
    // SQLite'dan tüm şarkıları al ve playlist'lere grupla
    const response = await MusicApiClient.getAllSongs()
    const allSongs = response.data || []
    
    // AI önerileri ve custom şarkıları grupla
    const playlistMap = new Map()
    
    allSongs.forEach(song => {
      // song.id'yi string'e çevir
      const songId = String(song.id || '')
      
      // AI önerileri için playlist oluştur
      if (songId.startsWith('ai-')) {
        const key = `ai-suggestions-${song.stations[0] || 'general'}`
        if (!playlistMap.has(key)) {
          playlistMap.set(key, {
            id: key,
            name: `🤖 AI Önerileri - ${getStationName(song.stations[0] || 'general')}`,
            type: 'ai-suggestions',
            stations: song.stations || [],
            songs: [],
            created_at: new Date().toISOString()
          })
        }
        playlistMap.get(key).songs.push(song)
      }
      
      // Custom şarkılar için playlist oluştur
      if (songId.startsWith('custom-')) {
        const key = `custom-playlist-${song.stations[0] || 'general'}`
        if (!playlistMap.has(key)) {
          playlistMap.set(key, {
            id: key,
            name: `💾 Kaydedilen Playlist - ${getStationName(song.stations[0] || 'general')}`,
            type: 'custom-playlist',
            stations: song.stations || [],
            songs: [],
            created_at: new Date().toISOString()
          })
        }
        playlistMap.get(key).songs.push(song)
      }
    })
    
    // localStorage'dan da playlist'leri al
    const localPlaylists = getLocalStoragePlaylists()
    
    // Tüm playlist'leri birleştir
    const allPlaylists = [
      ...Array.from(playlistMap.values()),
      ...localPlaylists
    ]
    
    // Şarkı sayılarını ekle
    playlists.value = allPlaylists.map(playlist => ({
      ...playlist,
      song_count: playlist.songs?.length || 0
    }))
    
  } catch (error) {
    console.error('Playlistler yüklenemedi:', error)
    
    // Hata durumunda localStorage'dan yükle
    playlists.value = getLocalStoragePlaylists()
  } finally {
    loading.value = false
  }
}

// localStorage'dan playlist'leri al
function getLocalStoragePlaylists() {
  try {
    const saved = localStorage.getItem('savedPlaylist')
    const cosmic = localStorage.getItem('cosmicPlaylists')
    
    const playlists = []
    
    if (saved) {
      const savedPlaylist = JSON.parse(saved)
      playlists.push({
        id: 'localStorage-saved',
        name: savedPlaylist.name || 'Kaydedilen Playlist',
        type: 'localStorage',
        songs: savedPlaylist.songs || [],
        stations: ['earth'],
        created_at: savedPlaylist.created || new Date().toISOString()
      })
    }
    
    if (cosmic) {
      const cosmicPlaylists = JSON.parse(cosmic)
      cosmicPlaylists.forEach((playlist, index) => {
        playlists.push({
          id: `localStorage-cosmic-${index}`,
          name: playlist.name || `Cosmic Playlist ${index + 1}`,
          type: 'localStorage',
          songs: playlist.songs || [],
          stations: playlist.stations || ['earth'],
          created_at: playlist.created || new Date().toISOString()
        })
      })
    }
    
    return playlists
  } catch (error) {
    console.error('localStorage playlistleri okunamadı:', error)
    return []
  }
}

// Playlist'i yükle
async function loadPlaylist(playlist) {
  try {
    let songs = []
    
    if (playlist.type === 'localStorage') {
      songs = playlist.songs || []
    } else {
      // SQLite'dan şarkıları al
      songs = playlist.songs || []
    }
    
    emit('playlist-loaded', {
      name: playlist.name,
      songs: songs,
      stations: playlist.stations,
      type: playlist.type
    })
    
    console.log(`✅ Playlist yüklendi: ${playlist.name} (${songs.length} şarkı)`)
    
  } catch (error) {
    console.error('Playlist yüklenemedi:', error)
  }
}

// Playlist'i indir
function downloadPlaylist(playlist) {
  try {
    const data = {
      name: playlist.name,
      songs: playlist.songs,
      stations: playlist.stations,
      created: playlist.created_at,
      exported: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `${playlist.name.replace(/[^a-z0-9]/gi, '_')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    URL.revokeObjectURL(url)
    
    console.log(`📥 Playlist indirildi: ${playlist.name}`)
    
  } catch (error) {
    console.error('Playlist indirilemedi:', error)
  }
}

// Playlist'i paylaş
function sharePlaylist(playlist) {
  try {
    const shareText = `🎵 ${playlist.name}\\n${playlist.song_count} şarkı\\n${playlist.songs?.slice(0, 3).map(s => `• ${s.title} - ${s.artist}`).join('\\n') || ''}${playlist.songs?.length > 3 ? '\\n...' : ''}`
    
    if (navigator.share) {
      navigator.share({
        title: playlist.name,
        text: shareText
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert('Playlist bilgileri panoya kopyalandı!')
    }
    
  } catch (error) {
    console.error('Playlist paylaşılamadı:', error)
  }
}

// Playlist'i sil
async function deletePlaylist(playlist) {
  if (!confirm(`"${playlist.name}" playlist'ini silmek istediğinizden emin misiniz?`)) {
    return
  }
  
  try {
    if (playlist.type === 'localStorage') {
      // localStorage'dan sil
      if (playlist.id === 'localStorage-saved') {
        localStorage.removeItem('savedPlaylist')
      } else if (playlist.id.startsWith('localStorage-cosmic-')) {
        const cosmic = JSON.parse(localStorage.getItem('cosmicPlaylists') || '[]')
        const index = parseInt(playlist.id.split('-')[2])
        cosmic.splice(index, 1)
        localStorage.setItem('cosmicPlaylists', JSON.stringify(cosmic))
      }
    } else {
      // SQLite'dan sil (şarkıları sil)
      for (const song of playlist.songs) {
        // Burada DELETE API endpoint'i gerekli
        console.log(`Silme için API endpoint gerekli: ${song.id}`)
      }
    }
    
    // Liste'den kaldır
    playlists.value = playlists.value.filter(p => p.id !== playlist.id)
    
    emit('playlist-deleted', playlist)
    console.log(`🗑️ Playlist silindi: ${playlist.name}`)
    
  } catch (error) {
    console.error('Playlist silinemedi:', error)
  }
}

// Tarih formatlama
function formatDate(dateString) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return 'Bilinmiyor'
  }
}

// İstasyon adı getir
function getStationName(stationId) {
  const names = {
    earth: 'Dünya',
    mars: 'Mars',
    venus: 'Venüs',
    jupiter: 'Jüpiter',
    sun: 'Güneş',
    neptune: 'Neptün',
    milkyway: 'Samanyolu',
    andromeda: 'Andromeda',
    blackhole: 'Kara Delik',
    quasar: 'Kuasar'
  }
  return names[stationId] || stationId
}

// İstasyon CSS sınıfı
function getStationClass(stationId) {
  return `station-${stationId}`
}

// Component mounted
onMounted(() => {
  // İlk yükleme otomatik olarak yapılmayacak
})
</script>

<style scoped>
.saved-playlists-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
}

.panel-header h3 {
  margin: 0;
  color: white;
  font-size: 1.2rem;
}

.header-controls {
  display: flex;
  gap: 10px;
}

.refresh-btn, .toggle-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease;
}

.refresh-btn:hover, .toggle-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: white;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.categorized-playlists {
  margin-bottom: 30px;
}

.playlist-category {
  margin-bottom: 40px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.category-header h4 {
  margin: 0;
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
}

.category-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

.playlist-type-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.playlist-type-badge.ai {
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.8), rgba(160, 82, 45, 0.8));
  color: white;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.playlist-type-badge.manual {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(22, 163, 74, 0.8));
  color: white;
  border: 1px solid rgba(134, 239, 172, 0.3);
}

.playlist-card {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.playlist-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
}

.playlist-card.ai-playlist {
  border-left: 4px solid #FFD700;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 255, 255, 0.15));
}

.playlist-card.ai-playlist:hover {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 255, 255, 0.2));
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.2);
}

.playlist-card.manual-playlist {
  border-left: 4px solid #22C55E;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(255, 255, 255, 0.15));
}

.playlist-card.manual-playlist:hover {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(255, 255, 255, 0.2));
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.2);
}

.playlist-info {
  margin-bottom: 15px;
}

.playlist-name {
  margin: 0 0 10px 0;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
}

.playlist-meta {
  margin: 0 0 10px 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.playlist-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.station-tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: white;
  font-weight: 500;
}

.station-earth { background: linear-gradient(135deg, #4ade80, #22c55e); }
.station-mars { background: linear-gradient(135deg, #f87171, #ef4444); }
.station-venus { background: linear-gradient(135deg, #fb7185, #ec4899); }
.station-jupiter { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
.station-sun { background: linear-gradient(135deg, #fb923c, #ea580c); }
.station-neptune { background: linear-gradient(135deg, #60a5fa, #3b82f6); }

.playlist-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  padding: 8px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.8);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h4 {
  margin: 0 0 10px 0;
  font-size: 1.3rem;
}

.empty-state p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
}

.stats-section {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 20px;
}

.stats-section h4 {
  margin: 0 0 15px 0;
  color: white;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 5px;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}
</style>
