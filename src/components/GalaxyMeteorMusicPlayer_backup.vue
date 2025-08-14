<template>
  <!-- Galaxy Themed Music Player + Meteor Shower -->
  <div class="relative overflow-hidden rounded-2xl shadow-lg border border-white/20 w-full max-w-xl mx-auto"
       :class="[moodBgClass, header ? 'header-player' : '']">
    <!-- Meteor Shower Canvas (background) -->
    <canvas ref="meteorCanvas" class="absolute inset-0 w-full h-full z-0 pointer-events-none"></canvas>

    <!-- Animated Star Background (divs, not canvas) -->
    <div class="absolute inset-0 z-10">
      <div v-for="star in visibleStars" :key="star.id"
           class="absolute rounded-full star"
           :class="star.pulseClass"
           :style="star.style">
      </div>
    </div>

    <!-- Main Player Content -->
    <div class="relative z-20 flex items-center"
         :class="header ? 'flex-row space-x-3 justify-between w-full h-full px-3' : 'flex-col space-y-6 justify-center py-8 px-4'">
      
      <!-- Header Mode: Horizontal Nav Bar Layout -->
      <template v-if="header">
        <!-- Play/Pause Button (Mini) -->
        <button @click="togglePlay"
                class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 
                       flex items-center justify-center text-white text-base
                       hover:scale-110 transition-all duration-300 
                       shadow-md hover:shadow-purple-500/50 flex-shrink-0"
                :class="{ 'animate-pulse': isPlaying }">
          <span v-if="!isPlaying" class="meteor-icon text-sm">🌠</span>
          <span v-else class="pause-icon text-sm">⏸️</span>
        </button>

        <!-- Song Info (Compact) -->
        <div class="flex-1 min-w-0 text-left">
          <p class="text-sm font-semibold text-white truncate leading-tight">{{ currentSong.title }}</p>
          <p class="text-xs text-white/70 truncate leading-tight">{{ currentSong.artist }}</p>
        </div>

        <!-- Progress Bar (Horizontal) -->
        <div class="flex-1 max-w-[120px] mx-2">
          <div class="relative h-1 bg-white/10 rounded-full cursor-pointer" @click="seekTo">
            <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300" 
                 :style="{ width: progress + '%' }">
            </div>
          </div>
        </div>

        <!-- Time Display (Compact) -->
        <div class="text-xs text-white/70 font-mono flex-shrink-0 min-w-[35px]">
          {{ formatTime(currentTime) }}
        </div>

        <!-- Volume Control (Mini) -->
        <div class="flex items-center space-x-1 flex-shrink-0">
          <span class="text-white/70 text-xs">{{ volumeIcon }}</span>
          <input type="range" 
                 min="0" 
                 max="100" 
                 v-model="volume"
                 @input="updateVolume"
                 class="volume-slider w-12 h-1 bg-white/10 rounded-full appearance-none cursor-pointer">
        </div>
      </template>

      <!-- Full Mode: Original Vertical Layout -->
      <template v-else>
      <!-- Song Info -->
      <div class="text-center">
        <h3 class="text-xl font-bold text-white">{{ currentSong.title }}</h3>
        <p class="text-sm text-white/70">{{ currentSong.artist }}</p>
      </div>

      <!-- Spiral Galaxy Progress + Play/Pause -->
      <div class="relative flex items-center justify-center">
        <!-- Spiral Galaxy Progress Ring -->
        <div class="galaxy-spiral relative w-32 h-32 rounded-full border-4 border-white/20"
             :class="{ 'animate-spin-slow': isPlaying }">
          <svg class="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
            <circle cx="50" cy="50" r="45" fill="none" :stroke="progressColor" stroke-width="2" stroke-linecap="round"
                    :stroke-dasharray="circumference" :stroke-dashoffset="circumference - (progress / 100) * circumference"
                    class="transition-all duration-300"/>
          </svg>
          <!-- Central Play/Pause Button -->
          <button @click="togglePlay"
                  class="absolute inset-0 m-auto w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                  :class="{ 'animate-pulse': isPlaying }">
            <span v-if="!isPlaying" class="meteor-icon">🌠</span>
            <span v-else class="pause-icon">⏸️</span>
          </button>
        </div>
      </div>

      <!-- Progress Bar (Time Display) -->
      <div class="w-full max-w-xs space-y-2">
        <div class="flex justify-between text-xs text-white/70">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
        <div class="relative h-2 bg-white/10 rounded-full cursor-pointer" @click="seekTo">
          <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
          <div class="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" :style="{ left: progress + '%', marginLeft: '-6px' }"></div>
        </div>
      </div>

      <!-- Volume Control with Star Density -->
      <div class="flex items-center space-x-4">
        <span class="text-white/70">{{ volumeIcon }}</span>
        <input type="range" min="0" max="100" v-model="volume" @input="updateVolume" class="volume-slider w-24 h-2 bg-white/10 rounded-full appearance-none cursor-pointer">
        <span class="text-xs text-white/70">{{ volume }}%</span>
      </div>
      
      </template>
    </div>

    <!-- Hidden Audio Element -->
    <audio ref="audioElement" @loadedmetadata="onMetadataLoaded" @timeupdate="onTimeUpdate" @ended="onSongEnd" preload="metadata">
      <source :src="currentSong.src" type="audio/mpeg">
    </audio>
  </div>
</template>

<script setup>
// Galaxy Themed Music Player + Meteor Shower
// Vue 3 Composition API + Tailwind CSS
import { ref, computed, onMounted, watch, nextTick } from 'vue'

// Props: mood ("energetic" | "calm")
const props = defineProps({
  mood: { type: String, default: 'calm' },
  header: { type: Boolean, default: false }
})

// Audio Player State
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(75)
const progress = ref(0)
const audioElement = ref(null)

// Sample playlist (expand as needed)
const playlist = ref([
  { id: 1, title: "Cosmic Journey", artist: "Space Orchestra", src: "/audio/cosmic-journey.mp3" },
  { id: 2, title: "Stellar Dreams", artist: "Galaxy Band", src: "/audio/stellar-dreams.mp3" }
])
const currentSongIndex = ref(0)
const currentSong = computed(() => playlist.value[currentSongIndex.value])

// --- STAR BACKGROUND SYSTEM ---
const baseStarCount = 50
const stars = ref([])
const visibleStars = computed(() => {
  // Star density increases with volume
  const starCount = Math.floor((baseStarCount * volume.value) / 100)
  return stars.value.slice(0, starCount)
})

// Mood-based theme classes
const moodBgClass = computed(() => {
  return props.mood === 'energetic'
    ? 'bg-gradient-to-br from-purple-600/60 to-blue-500/60 border-purple-400/50'
    : 'bg-gradient-to-br from-blue-400/30 to-purple-300/30 border-blue-300/50'
})

// Progress ring calculation
const circumference = 2 * Math.PI * 45
const progressColor = computed(() => props.mood === 'energetic' ? '#a855f7' : '#60a5fa')

// Star generation
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
      },
      pulseClass: isPlaying.value ? (props.mood === 'energetic' ? 'star-energetic' : 'star-calm') : ''
    }
    stars.value.push(star)
  }
}

// --- METEOR SHOWER SYSTEM (Canvas) ---
const meteorCanvas = ref(null)
let ctx = null
let meteors = []
let meteorAnimId = null

function spawnMeteor() {
  // Meteor properties depend on mood
  const speed = props.mood === 'energetic' ? (4 + Math.random() * 3) : (1.5 + Math.random() * 1.5)
  const length = props.mood === 'energetic' ? (80 + Math.random() * 40) : (50 + Math.random() * 30)
  const thickness = props.mood === 'energetic' ? (2 + Math.random() * 2) : (1 + Math.random() * 1.5)
  const color = props.mood === 'energetic' ? 'rgba(168,85,247,0.8)' : 'rgba(96,165,250,0.7)'
  meteors.push({
    x: Math.random() * meteorCanvas.value.width,
    y: -length,
    speed,
    length,
    thickness,
    color,
    alpha: 1
  })
}

function animateMeteors() {
  if (!ctx) return
  ctx.clearRect(0, 0, meteorCanvas.value.width, meteorCanvas.value.height)
  // Draw meteors
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i]
    ctx.save()
    ctx.globalAlpha = m.alpha
    ctx.strokeStyle = m.color
    ctx.lineWidth = m.thickness
    ctx.beginPath()
    ctx.moveTo(m.x, m.y)
    ctx.lineTo(m.x + m.length * 0.4, m.y + m.length)
    ctx.stroke()
    ctx.restore()
    m.x += m.speed * 0.2
    m.y += m.speed
    m.alpha -= 0.003 * (props.mood === 'energetic' ? 2 : 1)
    if (m.y > meteorCanvas.value.height || m.alpha <= 0) {
      meteors.splice(i, 1)
    }
  }
  // Meteor spawn rate by mood
  if (Math.random() < (props.mood === 'energetic' ? 0.25 : 0.08)) {
    spawnMeteor()
  }
  meteorAnimId = requestAnimationFrame(animateMeteors)
}

function resizeCanvas() {
  if (!meteorCanvas.value) return
  meteorCanvas.value.width = meteorCanvas.value.offsetWidth
  meteorCanvas.value.height = meteorCanvas.value.offsetHeight
}

// --- AUDIO CONTROL ---
function togglePlay() {
  if (isPlaying.value) {
    audioElement.value.pause()
  } else {
    audioElement.value.play()
  }
  isPlaying.value = !isPlaying.value
}

function updateVolume() {
  if (audioElement.value) {
    audioElement.value.volume = volume.value / 100
  }
}

function seekTo(event) {
  const rect = event.target.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  const time = percent * duration.value
  audioElement.value.currentTime = time
}

function onMetadataLoaded() {
  duration.value = audioElement.value.duration
}

function onTimeUpdate() {
  currentTime.value = audioElement.value.currentTime
  progress.value = (currentTime.value / duration.value) * 100
}

function onSongEnd() {
  currentSongIndex.value = (currentSongIndex.value + 1) % playlist.value.length
  nextTick(() => {
    if (isPlaying.value) {
      audioElement.value.play()
    }
  })
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const volumeIcon = computed(() => {
  if (volume.value === 0) return '🔇'
  if (volume.value < 40) return '🔈'
  if (volume.value < 80) return '🔉'
  return '🔊'
})

// --- REACTIVITY & LIFECYCLE ---
watch(() => props.mood, () => {
  generateStars()
  // Reset meteors for new mood
  meteors = []
}, { immediate: true })

watch(isPlaying, (val) => {
  generateStars()
})

onMounted(() => {
  generateStars()
  updateVolume()
  // Meteor shower setup
  resizeCanvas()
  ctx = meteorCanvas.value.getContext('2d')
  animateMeteors()
  window.addEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
/* --- Galaxy Music Player + Meteor Shower Styles --- */
.galaxy-spiral {
  background: radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%);
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
}
.star-calm {
  animation: twinkle-calm 3s ease-in-out infinite alternate;
}
.star-energetic {
  animation: twinkle-energetic 1s ease-in-out infinite alternate;
}
@keyframes twinkle-calm {
  0% { opacity: 0.3; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1.2); }
}
@keyframes twinkle-energetic {
  0% { opacity: 0.5; transform: scale(0.9) rotate(0deg); }
  100% { opacity: 1; transform: scale(1.3) rotate(180deg); }
}
.meteor-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
}
.pause-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
}
.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 0%, #a855f7 100%);
  cursor: pointer;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
}
.volume-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 0%, #a855f7 100%);
  cursor: pointer;
  border: none;
}
:deep(.header-player) {
  height: 56px;
  min-height: 56px;
  max-height: 56px;
  min-width: 380px;
  max-width: 450px;
  padding: 0.75rem 1rem;
  border-radius: 0.875rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
}

/* Header mode volume slider */
:deep(.header-player .volume-slider) {
  width: 48px !important;
  height: 0.25rem !important;
  background: linear-gradient(to right, rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.6));
}

:deep(.header-player .volume-slider::-webkit-slider-thumb) {
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, #fff 0%, #a855f7 100%);
  box-shadow: 0 0 6px rgba(168, 85, 247, 0.4);
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
}
</style>
