<template>
  <div class="spotify-player">
    <!-- Spotify Auth Button -->
    <div v-if="!isAuthenticated" class="auth-section">
      <button @click="authenticateSpotify" class="spotify-auth-btn">
        🎵 Spotify ile Giriş Yap
      </button>
      <p class="auth-info">Spotify Premium hesabınız ile gerçek müzik çalabilirsiniz</p>
    </div>

    <!-- Player Section -->
    <div v-else class="player-section">
      <!-- Device Status -->
      <div class="device-status" v-if="deviceId">
        <span class="status-indicator" :class="{ active: isReady }"></span>
        <span>{{ isReady ? 'Spotify Player Hazır' : 'Player Yükleniyor...' }}</span>
      </div>

      <!-- Current Track Display -->
      <div v-if="currentTrack" class="current-track">
        <img 
          v-if="currentTrack.album?.images?.[0]?.url" 
          :src="currentTrack.album.images[0].url" 
          :alt="currentTrack.name"
          class="track-image"
        >
        <div class="track-info">
          <h3 class="track-title">{{ currentTrack.name }}</h3>
          <p class="track-artist">{{ currentTrack.artists.map(a => a.name).join(', ') }}</p>
          <p class="track-album">{{ currentTrack.album.name }}</p>
        </div>
      </div>

      <!-- Player Controls -->
      <div class="player-controls">
        <button @click="previousTrack" class="control-btn" :disabled="!isReady">
          ⏮️
        </button>
        <button @click="togglePlayPause" class="control-btn main-control" :disabled="!isReady">
          {{ isPlaying ? '⏸️' : '▶️' }}
        </button>
        <button @click="nextTrack" class="control-btn" :disabled="!isReady">
          ⏭️
        </button>
      </div>

      <!-- Progress Bar -->
      <div v-if="currentTrack" class="progress-section">
        <span class="time-display">{{ formatTime(position) }}</span>
        <div class="progress-bar" @click="seekToPosition">
          <div 
            class="progress-fill" 
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
        <span class="time-display">{{ formatTime(duration) }}</span>
      </div>

      <!-- Volume Control -->
      <div class="volume-section">
        <span>🔊</span>
        <input 
          type="range" 
          min="0" 
          max="100" 
          v-model="volume" 
          @input="setVolume"
          class="volume-slider"
        >
        <span>{{ volume }}%</span>
      </div>

      <!-- Search and Play -->
      <div class="search-section">
        <input 
          v-model="searchQuery" 
          @keyup.enter="searchAndPlay"
          placeholder="Şarkı, sanatçı veya albüm ara..."
          class="search-input"
        >
        <button @click="searchAndPlay" class="search-btn">🔍</button>
      </div>

      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="search-results">
        <h4>Arama Sonuçları:</h4>
        <div 
          v-for="track in searchResults" 
          :key="track.id"
          @click="playTrack(track)"
          class="search-result-item"
        >
          <img 
            v-if="track.album?.images?.[2]?.url" 
            :src="track.album.images[2].url" 
            :alt="track.name"
            class="result-image"
          >
          <div class="result-info">
            <p class="result-title">{{ track.name }}</p>
            <p class="result-artist">{{ track.artists.map(a => a.name).join(', ') }}</p>
          </div>
          <button class="play-btn">▶️</button>
        </div>
      </div>

      <!-- Logout -->
      <button @click="logout" class="logout-btn">
        🚪 Çıkış Yap
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { 
  getSpotifyAuthUrl, 
  getAccessToken, 
  isTokenValid, 
  searchTracks,
  logout as spotifyLogout
} from '../api/spotify.js'

// Reactive state
const isAuthenticated = ref(false)
const deviceId = ref(null)
const isReady = ref(false)
const isPlaying = ref(false)
const currentTrack = ref(null)
const position = ref(0)
const duration = ref(0)
const volume = ref(50)
const searchQuery = ref('')
const searchResults = ref([])

// Spotify Web Playback SDK instance
let player = null
let positionTimer = null

// Computed
const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (position.value / duration.value) * 100
})

// Initialize Spotify Web Playback SDK
const initializeSpotifyPlayer = async () => {
  if (!window.Spotify) {
    console.error('Spotify Web Playback SDK yüklenmedi')
    return
  }

  const token = localStorage.getItem('spotify_access_token')
  if (!token) {
    console.error('Spotify access token bulunamadı')
    return
  }

  player = new window.Spotify.Player({
    name: 'Mood Music Cosmic Player',
    getOAuthToken: cb => { cb(token) },
    volume: 0.5
  })

  // Player event listeners
  player.addListener('ready', ({ device_id }) => {
    console.log('Spotify Player hazır! Device ID:', device_id)
    deviceId.value = device_id
    isReady.value = true
  })

  player.addListener('not_ready', ({ device_id }) => {
    console.log('Spotify Player hazır değil. Device ID:', device_id)
    isReady.value = false
  })

  player.addListener('player_state_changed', (state) => {
    if (!state) return

    currentTrack.value = state.track_window.current_track
    isPlaying.value = !state.paused
    position.value = state.position
    duration.value = state.duration

    // Position tracker başlat/durdur
    if (!state.paused && !positionTimer) {
      startPositionTracker()
    } else if (state.paused && positionTimer) {
      stopPositionTracker()
    }
  })

  player.addListener('initialization_error', ({ message }) => {
    console.error('Spotify Player başlatma hatası:', message)
  })

  player.addListener('authentication_error', ({ message }) => {
    console.error('Spotify authentication hatası:', message)
    isAuthenticated.value = false
  })

  player.addListener('account_error', ({ message }) => {
    console.error('Spotify hesap hatası:', message)
  })

  // Player'ı başlat
  await player.connect()
}

// Position tracker
const startPositionTracker = () => {
  positionTimer = setInterval(() => {
    if (isPlaying.value) {
      position.value += 1000 // 1 saniye ekle
    }
  }, 1000)
}

const stopPositionTracker = () => {
  if (positionTimer) {
    clearInterval(positionTimer)
    positionTimer = null
  }
}

// Authentication
const authenticateSpotify = () => {
  const authUrl = getSpotifyAuthUrl()
  window.location.href = authUrl
}

// Check for auth callback
const checkAuthCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  
  if (code) {
    try {
      await getAccessToken(code)
      isAuthenticated.value = true
      
      // URL'yi temizle
      window.history.replaceState({}, document.title, window.location.pathname)
      
      // Spotify SDK'yı yükle
      await loadSpotifySDK()
      await initializeSpotifyPlayer()
    } catch (error) {
      console.error('Spotify authentication hatası:', error)
    }
  } else if (isTokenValid()) {
    isAuthenticated.value = true
    await loadSpotifySDK()
    await initializeSpotifyPlayer()
  }
}

// Load Spotify Web Playback SDK
const loadSpotifySDK = () => {
  return new Promise((resolve, reject) => {
    if (window.Spotify) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true
    
    script.onload = () => {
      // SDK yüklenene kadar bekle
      const checkSDK = setInterval(() => {
        if (window.Spotify) {
          clearInterval(checkSDK)
          resolve()
        }
      }, 100)
    }
    
    script.onerror = reject
    document.body.appendChild(script)
  })
}

// Player controls
const togglePlayPause = async () => {
  if (!player) return
  
  try {
    await player.togglePlay()
  } catch (error) {
    console.error('Play/Pause hatası:', error)
  }
}

const nextTrack = async () => {
  if (!player) return
  
  try {
    await player.nextTrack()
  } catch (error) {
    console.error('Next track hatası:', error)
  }
}

const previousTrack = async () => {
  if (!player) return
  
  try {
    await player.previousTrack()
  } catch (error) {
    console.error('Previous track hatası:', error)
  }
}

const setVolume = async () => {
  if (!player) return
  
  try {
    await player.setVolume(volume.value / 100)
  } catch (error) {
    console.error('Volume hatası:', error)
  }
}

const seekToPosition = async (event) => {
  if (!player || !duration.value) return
  
  const progressBar = event.currentTarget
  const clickX = event.offsetX
  const progressWidth = progressBar.offsetWidth
  const seekPercent = clickX / progressWidth
  const seekPosition = seekPercent * duration.value
  
  try {
    await player.seek(Math.floor(seekPosition))
  } catch (error) {
    console.error('Seek hatası:', error)
  }
}

// Search and play
const searchAndPlay = async () => {
  if (!searchQuery.value.trim()) return
  
  try {
    const results = await searchTracks(searchQuery.value, 10)
    searchResults.value = results
  } catch (error) {
    console.error('Arama hatası:', error)
  }
}

const playTrack = async (track) => {
  if (!player || !deviceId.value) return
  
  try {
    // Spotify Web API ile çalma
    const token = localStorage.getItem('spotify_access_token')
    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        device_id: deviceId.value,
        uris: [`spotify:track:${track.id}`]
      })
    })
    
    if (!response.ok) {
      console.error('Çalma hatası:', await response.text())
    }
    
    // Arama sonuçlarını gizle
    searchResults.value = []
    searchQuery.value = ''
  } catch (error) {
    console.error('Track çalma hatası:', error)
  }
}

// Utility functions
const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const logout = () => {
  spotifyLogout()
  isAuthenticated.value = false
  isReady.value = false
  currentTrack.value = null
  
  if (player) {
    player.disconnect()
    player = null
  }
  
  stopPositionTracker()
}

// Lifecycle
onMounted(() => {
  checkAuthCallback()
})

onUnmounted(() => {
  stopPositionTracker()
  if (player) {
    player.disconnect()
  }
})
</script>

<style scoped>
.spotify-player {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 20px;
  color: white;
  position: relative;
  z-index: 1;
}

/* Auth Section */
.auth-section {
  text-align: center;
  padding: 40px 20px;
}

.spotify-auth-btn {
  background: linear-gradient(135deg, #1DB954, #1ed760);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.spotify-auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(29, 185, 84, 0.3);
}

.auth-info {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

/* Player Section */
.player-section {
  max-width: 400px;
  margin: 0 auto;
}

.device-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.status-indicator.active {
  background: #1DB954;
  box-shadow: 0 0 10px rgba(29, 185, 84, 0.5);
}

/* Current Track */
.current-track {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
}

.track-image {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
}

.track-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.track-title {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.track-artist {
  margin: 0 0 3px 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.track-album {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
}

/* Player Controls */
.player-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.control-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.main-control {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1DB954, #1ed760);
  font-size: 1.5rem;
}

/* Progress Bar */
.progress-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.time-display {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  min-width: 35px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #1DB954, #1ed760);
  border-radius: 3px;
  transition: width 0.1s ease;
}

/* Volume Control */
.volume-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
}

.volume-slider {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #1DB954;
  cursor: pointer;
  -webkit-appearance: none;
}

/* Search Section */
.search-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-input:focus {
  border-color: #1DB954;
  box-shadow: 0 0 0 2px rgba(29, 185, 84, 0.2);
}

.search-btn {
  padding: 12px 15px;
  background: linear-gradient(135deg, #1DB954, #1ed760);
  border: none;
  border-radius: 25px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: scale(1.05);
}

/* Search Results */
.search-results {
  margin-bottom: 20px;
}

.search-results h4 {
  margin: 0 0 15px 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-result-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.result-image {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  object-fit: cover;
}

.result-info {
  flex: 1;
}

.result-title {
  margin: 0 0 3px 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.result-artist {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.play-btn {
  background: none;
  border: none;
  color: #1DB954;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.play-btn:hover {
  background: rgba(29, 185, 84, 0.2);
}

/* Logout Button */
.logout-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
