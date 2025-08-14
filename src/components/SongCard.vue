<template>
  <div class="p-3 rounded-lg glassmorphism flex flex-col items-center transition hover:scale-105">
    <div class="w-24 h-24 bg-white/20 rounded flex items-center justify-center mb-2 overflow-hidden">
      <img v-if="song.cover" :src="song.cover" alt="Albüm Kapağı" class="w-full h-full object-cover rounded" />
      <span v-else class="text-white/50 text-4xl">🎵</span>
    </div>
    <div class="text-sm font-semibold text-white text-center">{{ song.title }}</div>
    <div class="text-xs text-gray-300 mb-2">{{ song.artist }}</div>
    <div class="flex space-x-2 mb-2 items-center">
      <button @click="$emit('like')" :class="{'text-red-500': liked, 'text-white/70': !liked}" aria-label="Beğen" title="Beğen" style="font-size:14px">
        ❤️
      </button>
      <button @click="$emit('recommend')" class="text-white/70 hover:text-white" aria-label="Benzer şarkılar" title="Benzer şarkılar" style="font-size:14px">
        🔄
      </button>
      <!-- Gerçek müzik çalma butonu -->
      <button @click="playMusic" :class="{ 'text-green-400 animate-pulse': isPlaying, 'text-white/70': !isPlaying }" 
              :disabled="!hasValidAudio" aria-label="Çal/Duraklat" :title="isPlaying ? 'Duraklat' : 'Çal'" style="font-size:14px">
        {{ isPlaying ? '⏸️' : '▶️' }}
      </button>
      <a :href="spotifyUrl" target="_blank" rel="noopener" class="text-green-400 hover:underline" aria-label="Spotify'da Dinle" @click="$emit('play')" title="Spotify'da ara" style="font-size:12px">
        ⧉
      </a>
      <!-- Compact share buttons: Spotify playlist creation (emit) and YouTube search -->
      <button @click="$emit('share-spotify', song)" class="ml-auto text-white/60 hover:text-white" aria-label="Spotify Playlist'e Ekle" title="Spotify'a gönder" style="font-size:12px;padding:4px;border-radius:6px;background:rgba(255,255,255,0.02)">
        🎵
      </button>
      <button @click="$emit('share-youtube', song)" class="text-white/60 hover:text-white" aria-label="YouTube'da Aç" title="YouTube'da ara" style="font-size:12px;padding:4px;border-radius:6px;background:rgba(255,255,255,0.02)">
        ▶
      </button>
    </div>
    <div class="flex flex-col items-center w-full">
      <a v-if="song.demo" :href="song.demo" target="_blank" rel="noopener" class="text-xs text-blue-300 hover:underline mb-1">▶ 30 sn. Önizleme</a>
      <button v-else disabled class="text-xs text-gray-400 cursor-not-allowed">Önizleme yok</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMusicPlayer } from '../utils/musicPlayerStore.js'

const props = defineProps({ song: Object, liked: Boolean })
const emit = defineEmits(['like', 'recommend', 'play', 'share-spotify', 'share-youtube'])

// Global müzik player
const { actions: musicActions } = useMusicPlayer()

const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(props.song.spotifyQuery)}`

// Audio player state
const audioElement = ref(null)
const isPlaying = ref(false)
const currentAudio = ref(null)

// Check if song has valid audio source
const hasValidAudio = computed(() => {
  return props.song.demo || props.song.stream || props.song.src || props.song.preview_url
})

// Get best available audio source
const audioSource = computed(() => {
  return props.song.stream || 
         props.song.demo || 
         props.song.src || 
         props.song.preview_url ||
         null
})

// Play/pause music - YENİ: Global player'a yönlendir
async function playMusic() {
  console.log('🎵 SongCard: Şarkı Cosmic Journey\'e gönderiliyor:', props.song.title)
  
  // Global player'a şarkıyı gönder ve widget'ı aç
  musicActions.playSong(props.song, true)
  
  // Parent'a da bildir (gamification için)
  emit('play', props.song)
}

// Jamendo fallback
async function tryJamendoFallback() {
  try {
    console.log('Jamendo fallback deneniyor...')
    
    // Jamendo API'den arama yap
    const query = `${props.song.title} ${props.song.artist}`
    const jamendoUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${import.meta.env.VITE_JAMENDO_CLIENT_ID}&search=${encodeURIComponent(query)}&limit=1&audioformat=mp32`
    
    const response = await fetch(jamendoUrl)
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const track = data.results[0]
      
      // Jamendo stream'i çal
      currentAudio.value = new Audio(track.audio)
      
      currentAudio.value.addEventListener('error', () => {
        console.error('Jamendo fallback de başarısız oldu')
        isPlaying.value = false
      })
      
      currentAudio.value.addEventListener('ended', () => {
        isPlaying.value = false
        currentAudio.value = null
      })
      
      await currentAudio.value.play()
      isPlaying.value = true
      
      console.log('Jamendo fallback başarılı:', track.name)
      
    } else {
      console.log('Jamendo\'da uygun şarkı bulunamadı')
      isPlaying.value = false
    }
    
  } catch (error) {
    console.error('Jamendo fallback hatası:', error)
    isPlaying.value = false
  }
}

// Component unmount olduğunda ses dosyasını temizle
onUnmounted(() => {
  if (currentAudio.value) {
    currentAudio.value.pause()
    currentAudio.value = null
  }
})
</script>

<style scoped>
.glassmorphism {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0,0,0,0.1);
}
</style>
