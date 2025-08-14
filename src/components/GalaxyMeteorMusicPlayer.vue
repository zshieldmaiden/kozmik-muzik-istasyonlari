<template>
  <div class="galaxy-meteor-music-player relative overflow-hidden w-full max-w-xl mx-auto transparent-container"
       :class="[moodBgClass, header ? 'header-player' : '']">
    <!-- Meteor Shower Canvas -->
    <canvas ref="meteorCanvas" class="absolute inset-0 w-full h-full z-0 pointer-events-none"></canvas>

    <!-- Animated Star Background -->
    <div class="absolute inset-0 z-10">
      <div v-for="star in visibleStars" :key="star.id"
           class="absolute rounded-full star"
           :style="star.style">
      </div>
    </div>

    <!-- Main Player Content -->
    <div class="relative z-20 flex items-center"
         :class="header ? 'flex-row space-x-3 justify-between w-full h-full px-3' : 'flex-col space-y-6 justify-center py-8 px-4'">
      
      <!-- Header Mode: Horizontal Nav Bar Layout -->
      <template v-if="header">
        <!-- Play/Pause Button -->
        <button @click="togglePlay"
                class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 
                       flex items-center justify-center text-white text-base
                       hover:scale-110 transition-all duration-300 
                       shadow-md hover:shadow-purple-500/50 flex-shrink-0"
                :class="{ 'animate-pulse': isPlaying }">
          <span v-if="!isPlaying">🌠</span>
          <span v-else>⏸️</span>
        </button>

        <!-- Song Info -->
        <div class="flex-1 min-w-0 text-left">
          <p class="text-sm font-semibold text-white truncate" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">{{ currentSong.title }}</p>
          <p class="text-xs text-white/70 truncate" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">{{ currentSong.artist }}</p>
        </div>

        <!-- Progress Bar -->
        <div class="flex-1 max-w-[120px] mx-2">
          <div class="relative h-1 bg-white/10 rounded-full cursor-pointer" @click="seekTo">
            <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300" 
                 :style="{ width: progress + '%' }">
            </div>
          </div>
        </div>

        <!-- Time Display -->
        <div class="text-xs text-white/70 font-mono flex-shrink-0 min-w-[35px]" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
          {{ formatTime(currentTime) }}
        </div>
      </template>

      <!-- Full Mode: Vertical Galaxy Layout -->
      <template v-else>
        <template v-if="mini || compact">
          <div class="relative w-full h-32">
            <!-- Play/Pause Button - Sol tarafta -->
            <button @click="togglePlay"
                    class="mini-play-btn"
                    :class="{ 'animate-pulse': isPlaying }"
                    style="position: absolute; right: 60px; top: 16px; width: 20px; height: 20px; border-radius: 50%; z-index: 999; padding: 0; margin: 0; display: flex; align-items: center; justify-content: center; background: rgba(168, 85, 247, 0.8); border: none; backdrop-filter: blur(10px);">
              <span v-if="!isPlaying" style="font-size: 8px;">🌠</span>
              <span v-else style="font-size: 8px;">⏸️</span>
            </button>
            
            <!-- Volume Button - Sağ tarafta -->
            <button class="mini-volume-btn" 
                    style="position: absolute; right: 16px; top: 16px; width: 20px; height: 20px; border-radius: 50%; z-index: 999; padding: 0; margin: 0; display: flex; align-items: center; justify-content: center; background: rgba(168, 85, 247, 0.8); border: none; backdrop-filter: blur(10px);">
              <span style="font-size: 8px;">🔊</span>
            </button>
            
            <div class="absolute top-4 left-1/2 transform -translate-x-1/2 text-center w-[80%]">
              <h3 class="text-base font-bold text-white mb-1 truncate" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">{{ currentSong.title }}</h3>
              <p class="text-white/70 text-xs truncate" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">{{ currentSong.artist }}</p>
            </div>
          </div>
        </template>
        <template v-else>
          <!-- Play/Pause Button - Sol Alt Köşede Mini -->
          <div class="galaxy-spiral-mini" 
               style="position: absolute; left: 16px; bottom: 16px; width: 40px; height: 40px; z-index: 999;">
            <div class="relative w-full h-full flex items-center justify-center animate-spin-slow">
              <button @click="togglePlay"
                      class="w-full h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 
                             flex items-center justify-center text-white text-sm
                             hover:scale-110 transition-all duration-300 
                             shadow-xl hover:shadow-purple-500/50"
                      :class="{ 'animate-pulse': isPlaying }">
                <span v-if="!isPlaying" style="font-size: 12px;">🌠</span>
                <span v-else style="font-size: 12px;">⏸️</span>
              </button>
            </div>
          </div>

          <!-- Song Info -->
          <div class="text-center">
            <h3 class="text-xl font-bold text-white mb-2" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">{{ currentSong.title }}</h3>
            <p class="text-white/70" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">{{ currentSong.artist }}</p>
          </div>

          <!-- Progress Bar -->
          <div class="w-full max-w-xs">
            <div class="relative h-2 bg-white/10 rounded-full cursor-pointer" @click="seekTo">
              <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300" 
                   :style="{ width: progress + '%' }">
              </div>
            </div>
            <div class="flex justify-between text-xs text-white/70 mt-2" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
              <span>{{ formatTime(currentTime) }}</span>
              <span>{{ formatTime(duration) }}</span>
            </div>
          </div>

          <!-- Volume Control -->
          <div class="flex items-center gap-3">
            <span class="text-white/70">🔊</span>
            <input type="range" min="0" max="100" v-model="volume" @input="updateVolume" 
                   class="volume-slider w-24 h-2 bg-white/10 rounded-full appearance-none cursor-pointer">
            <span class="text-xs text-white/70">{{ volume }}%</span>
          </div>

          <!-- Track Navigation -->
          <div class="flex items-center gap-4 justify-center">
            <button @click="previousTrack" 
                    class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300"
                    style="backdrop-filter: blur(10px);">
              ⏮️
            </button>
            <span class="text-xs text-white/50 px-2">
              {{ currentIndex + 1 }} / {{ playlist.length }}
            </span>
            <button @click="nextTrack" 
                    class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300"
                    style="backdrop-filter: blur(10px);">
              ⏭️
            </button>
          </div>
        </template>
      </template>
    </div>

    <!-- Hidden Audio Element -->
    <audio ref="audioElement" @loadedmetadata="onMetadataLoaded" @timeupdate="onTimeUpdate" @ended="onSongEnd" preload="metadata">
      <source :src="currentSong.src" type="audio/mpeg">
    </audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  mood: { type: String, default: 'calm' },
  header: { type: Boolean, default: false },
  currentSong: { type: Object, default: null },
  autoPlay: { type: Boolean, default: false }
})

const emit = defineEmits(['song-changed'])

// Audio Player State
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(75)
const progress = ref(0)
const currentIndex = ref(0)

// Playlist with cosmic-themed songs
const playlist = ref([
  {
    title: "Cosmic Journey",
    artist: "Space Orchestra",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    title: "Stellar Winds",
    artist: "Galaxy Ensemble",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-04.wav"
  },
  {
    title: "Nebula Dreams",
    artist: "Cosmic Voyagers",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-03.wav"
  },
  {
    title: "Interstellar Voyage",
    artist: "Star Collective",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-02.wav"
  },
  {
    title: "Galactic Harmony",
    artist: "Universe Symphony",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-01.wav"
  }
])

// Current song computed from props or playlist
const currentSong = computed(() => {
  // Eğer prop olarak şarkı geliyorsa onu kullan
  if (props.currentSong) {
    return {
      title: props.currentSong.title || 'Bilinmeyen Şarkı',
      artist: props.currentSong.artist || 'Bilinmeyen Sanatçı',
      src: props.currentSong.stream || 
           props.currentSong.demo || 
           props.currentSong.src || 
           props.currentSong.preview_url ||
           'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    }
  }
  
  // Aksi halde playlist'ten al
  return playlist.value[currentIndex.value] || playlist.value[0]
})

// Audio element reference
const audioElement = ref(null)

// Mood-based background class
const moodBgClass = computed(() => {
  return props.mood === 'energetic' 
    ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' 
    : 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900'
})

// Star system
const stars = ref([])
const baseStarCount = 20

const visibleStars = computed(() => {
  const multiplier = isPlaying.value ? 1.5 : 1
  return stars.value.slice(0, Math.floor(baseStarCount * multiplier))
})

// Generate stars
function generateStars() {
  stars.value = []
  for (let i = 0; i < baseStarCount; i++) {
    const star = {
      id: i,
      style: {
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        width: Math.random() * 4 + 2 + 'px',
        height: Math.random() * 4 + 2 + 'px',
        animationDelay: Math.random() * 2 + 's',
        animationDuration: props.mood === 'energetic' ? '1s' : '3s'
      }
    }
    stars.value.push(star)
  }
}

// Meteor Canvas System
const meteorCanvas = ref(null)
let ctx = null
let meteors = []
let meteorAnimId = null

function spawnMeteor() {
  const speed = props.mood === 'energetic' ? (4 + Math.random() * 3) : (1.5 + Math.random() * 1.5)
  const length = props.mood === 'energetic' ? (80 + Math.random() * 40) : (50 + Math.random() * 30)
  const color = props.mood === 'energetic' ? 'rgba(168,85,247,0.8)' : 'rgba(96,165,250,0.7)'
  
  meteors.push({
    x: Math.random() * meteorCanvas.value.width,
    y: -length,
    speed,
    length,
    color,
    alpha: 1
  })
}

function animateMeteors() {
  if (!ctx || !meteorCanvas.value) return
  
  ctx.clearRect(0, 0, meteorCanvas.value.width, meteorCanvas.value.height)
  
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i]
    ctx.save()
    ctx.globalAlpha = m.alpha
    ctx.strokeStyle = m.color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(m.x, m.y)
    ctx.lineTo(m.x + m.length * 0.4, m.y + m.length)
    ctx.stroke()
    ctx.restore()
    
    m.x += m.speed * 0.2
    m.y += m.speed
    m.alpha -= 0.01
    
    if (m.y > meteorCanvas.value.height + m.length || m.alpha <= 0) {
      meteors.splice(i, 1)
    }
  }
  
  if (Math.random() < 0.02) {
    spawnMeteor()
  }
  
  meteorAnimId = requestAnimationFrame(animateMeteors)
}

// Audio Controls
function togglePlay() {
  if (!audioElement.value) return
  
  if (isPlaying.value) {
    audioElement.value.pause()
    isPlaying.value = false
  } else {
    audioElement.value.play().catch(error => {
      console.error('Playback failed:', error)
      isPlaying.value = false
    })
    isPlaying.value = true
  }
}

function nextTrack() {
  currentIndex.value = (currentIndex.value + 1) % playlist.value.length
  loadCurrentSong()
}

function previousTrack() {
  currentIndex.value = currentIndex.value === 0 ? playlist.value.length - 1 : currentIndex.value - 1
  loadCurrentSong()
}

function loadCurrentSong(autoPlay = false) {
  if (audioElement.value) {
    const wasPlaying = isPlaying.value
    audioElement.value.pause()
    isPlaying.value = false
    currentTime.value = 0
    progress.value = 0
    
    // Load new song
    const songSrc = currentSong.value.src
    console.log('🎵 Loading song:', currentSong.value.title, 'src:', songSrc)
    
    audioElement.value.src = songSrc
    audioElement.value.load()
    
    if (autoPlay || wasPlaying) {
      audioElement.value.addEventListener('canplay', () => {
        audioElement.value.play().catch(error => {
          console.error('Auto-play failed:', error)
        })
        isPlaying.value = true
      }, { once: true })
    }
  }
}

function seekTo(event) {
  if (!audioElement.value || !duration.value) return
  
  const rect = event.target.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  const newTime = percent * duration.value
  
  audioElement.value.currentTime = newTime
  currentTime.value = newTime
}

function updateVolume() {
  if (audioElement.value) {
    audioElement.value.volume = volume.value / 100
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function onMetadataLoaded() {
  if (audioElement.value) {
    duration.value = audioElement.value.duration || 0
  }
}

function onTimeUpdate() {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
    progress.value = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
  }
}

function onSongEnd() {
  isPlaying.value = false
  currentTime.value = 0
  progress.value = 0
  
  // Auto-play next track
  setTimeout(() => {
    nextTrack()
  }, 500)
}

function resizeCanvas() {
  if (!meteorCanvas.value) return
  meteorCanvas.value.width = meteorCanvas.value.offsetWidth
  meteorCanvas.value.height = meteorCanvas.value.offsetHeight
}

// Lifecycle
onMounted(() => {
  generateStars()
  
  nextTick(() => {
    if (meteorCanvas.value) {
      resizeCanvas()
      ctx = meteorCanvas.value.getContext('2d')
      animateMeteors()
      window.addEventListener('resize', resizeCanvas)
    }
    
    // Initialize audio
    if (audioElement.value) {
      audioElement.value.src = currentSong.value.src
      audioElement.value.volume = volume.value / 100
    }
  })
})

watch(() => props.mood, () => {
  generateStars()
})

// Props.currentSong değiştiğinde yeni şarkıyı yükle
watch(() => props.currentSong, (newSong) => {
  if (newSong) {
    console.log('🎵 Galaxy Player: Yeni şarkı yükleniyor:', newSong.title)
    loadCurrentSong(props.autoPlay)
    emit('song-changed', newSong)
  }
})

// Auto-play prop'u değiştiğinde
watch(() => props.autoPlay, (shouldAutoPlay) => {
  if (shouldAutoPlay && !isPlaying.value && audioElement.value) {
    nextTick(() => {
      togglePlay()
    })
  }
})
</script>

<style scoped>
.transparent-container {
  background: transparent !important;
  backdrop-filter: none !important;
  border: none !important;
  box-shadow: none !important;
}

.galaxy-spiral {
  background: radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%);
}

.galaxy-spiral-mini {
  background: radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%);
  border-radius: 50%;
}

.animate-spin-slow {
  animation: spin-galaxy 8s linear infinite;
}

@keyframes spin-galaxy {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.star {
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
  animation: twinkle 2s ease-in-out infinite alternate;
}

@keyframes twinkle {
  0% { opacity: 0.3; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1.2); }
}

.volume-slider {
  background: linear-gradient(to right, rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.6));
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 0%, #a855f7 100%);
  cursor: pointer;
  box-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
}

.header-player {
  height: 56px;
  width: 100%;
  max-width: 450px;
  background: transparent !important;
  backdrop-filter: none !important;
  border: none !important;
}

.mini-play-btn span {
  font-size: 1rem !important;
}

@media (max-width: 768px) {
  .galaxy-spiral {
    width: 120px;
    height: 120px;
  }
  
  .galaxy-spiral button {
    width: 60px;
    height: 60px;
  }
  
  .galaxy-spiral-mini {
    width: 35px !important;
    height: 35px !important;
    left: 12px !important;
    bottom: 12px !important;
  }
}
</style>