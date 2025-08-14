<template>
  <!-- Galaxy Themed Music Player Container -->
  <div class="galaxy-music-player relative overflow-hidden rounded-2xl backdrop-blur-lg border border-white/20"
       :class="[moodThemeClasses, compact ? 'compact-player' : 'full-player']">
    
    <!-- Animated Star Background -->
    <div class="absolute inset-0 overflow-hidden">
      <div v-for="star in visibleStars" 
           :key="star.id"
           class="star absolute rounded-full"
           :class="star.pulseClass"
           :style="star.style">
      </div>
    </div>

    <!-- Main Player Content -->
    <div class="relative z-10 flex items-center"
         :class="compact ? 'space-x-3' : 'flex-col space-y-6'">
      
      <!-- Compact Mode: Horizontal Layout -->
      <template v-if="compact">
        <!-- Mini Play/Pause Button -->
        <div class="relative">
          <button @click="togglePlay"
                  class="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 
                         flex items-center justify-center text-white text-lg
                         hover:scale-110 transition-all duration-300 
                         shadow-lg hover:shadow-purple-500/50"
                  :class="{ 'animate-pulse': isPlaying }">
            <span v-if="!isPlaying" class="meteor-icon text-sm">🌠</span>
            <span v-else class="pause-icon text-sm">⏸️</span>
          </button>
          
          <!-- Mini Progress Ring -->
          <svg class="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.1)" 
                    stroke-width="3"/>
            <circle cx="50" cy="50" r="45"
                    fill="none"
                    :stroke="progressColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="circumference - (progress / 100) * circumference"
                    class="transition-all duration-300"/>
          </svg>
        </div>

        <!-- Song Info (Compact) -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">{{ currentSong.title }}</p>
          <p class="text-xs text-white/70 truncate">{{ currentSong.artist }}</p>
        </div>

        <!-- Volume Control (Mini) -->
        <div class="flex items-center space-x-2">
          <span class="text-white/70 text-sm">🔊</span>
          <input type="range" 
                 min="0" 
                 max="100" 
                 v-model="volume"
                 @input="updateVolume"
                 class="volume-slider w-16 h-1 bg-white/10 rounded-full appearance-none cursor-pointer">
        </div>
      </template>

      <!-- Full Mode: Original Vertical Layout -->
      <template v-else>
      
      <!-- Song Information -->
      <div class="text-center space-y-2">
        <h3 class="text-xl font-bold text-white">{{ currentSong.title }}</h3>
        <p class="text-sm text-white/70">{{ currentSong.artist }}</p>
      </div>

      <!-- Central Play/Pause Button with Spiral Galaxy -->
      <div class="relative">
        <!-- Spiral Galaxy Background (Progress Ring) -->
        <div class="galaxy-spiral relative w-32 h-32 rounded-full border-4 border-white/20"
             :class="{ 'animate-spin-slow': isPlaying }">
          
          <!-- Progress Ring -->
          <svg class="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.1)" 
                    stroke-width="2"/>
            <circle cx="50" cy="50" r="45"
                    fill="none"
                    :stroke="progressColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="circumference - (progress / 100) * circumference"
                    class="transition-all duration-300"/>
          </svg>

          <!-- Central Play/Pause Button -->
          <button @click="togglePlay"
                  class="absolute inset-0 m-auto w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 
                         flex items-center justify-center text-white text-2xl
                         hover:scale-110 transition-all duration-300 
                         shadow-lg hover:shadow-purple-500/50"
                  :class="{ 'animate-pulse': isPlaying }">
            <!-- Meteor Icon for Play -->
            <span v-if="!isPlaying" class="meteor-icon">🌠</span>
            <!-- Pause Icon -->
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
        
        <!-- Custom Progress Bar -->
        <div class="relative h-2 bg-white/10 rounded-full cursor-pointer"
             @click="seekTo">
          <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300"
               :style="{ width: progress + '%' }">
          </div>
          <!-- Galaxy particles on progress bar -->
          <div class="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
               :style="{ left: progress + '%', marginLeft: '-6px' }">
          </div>
        </div>
      </div>

      <!-- Volume Control with Star Density -->
      <div class="flex items-center space-x-4">
        <span class="text-white/70">🔊</span>
        <div class="relative">
          <input type="range" 
                 min="0" 
                 max="100" 
                 v-model="volume"
                 @input="updateVolume"
                 class="volume-slider w-24 h-2 bg-white/10 rounded-full appearance-none cursor-pointer">
        </div>
        <span class="text-xs text-white/70">{{ volume }}%</span>
      </div>

      <!-- Mobile Responsive Controls -->
      <div class="flex items-center space-x-4 md:hidden">
        <button @click="previousSong" class="text-white/70 hover:text-white transition-colors">
          ⏮️
        </button>
        <button @click="nextSong" class="text-white/70 hover:text-white transition-colors">
          ⏭️
        </button>
      </div>
      
      </template>
    </div>

    <!-- Hidden Audio Element -->
    <audio ref="audioElement" 
           @loadedmetadata="onMetadataLoaded"
           @timeupdate="onTimeUpdate"
           @ended="onSongEnd"
           preload="metadata">
      <source :src="currentSong.src" type="audio/mpeg">
    </audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

// Props to receive current mood from parent
const props = defineProps({
  mood: {
    type: String,
    default: 'calm'
  },
  compact: {
    type: Boolean,
    default: false
  }
})

// Audio Player State
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(75)
const progress = ref(0)
const audioElement = ref(null)

// Sample songs - you can expand this list
const playlist = ref([
  {
    id: 1,
    title: "Cosmic Journey",
    artist: "Space Orchestra",
    src: "/audio/cosmic-journey.mp3" // Add your audio file to public/audio/
  },
  {
    id: 2,
    title: "Stellar Dreams",
    artist: "Galaxy Band",
    src: "/audio/stellar-dreams.mp3"
  }
])

const currentSongIndex = ref(0)
const currentSong = computed(() => playlist.value[currentSongIndex.value])

// Star Animation System
const baseStarCount = 50
const stars = ref([])

// Generate stars based on volume (star density)
const visibleStars = computed(() => {
  const starCount = Math.floor((baseStarCount * volume.value) / 100)
  return stars.value.slice(0, starCount)
})

// Mood-based theme classes
const moodThemeClasses = computed(() => {
  if (props.mood === 'energetic') {
    return 'bg-gradient-to-br from-purple-600/30 to-blue-500/30 border-purple-400/50'
  }
  return 'bg-gradient-to-br from-blue-400/20 to-purple-300/20 border-blue-300/50'
})

// Progress ring calculation
const circumference = 2 * Math.PI * 45

// Progress color based on mood
const progressColor = computed(() => {
  return props.mood === 'energetic' ? '#a855f7' : '#60a5fa'
})

// Star generation function
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
      pulseClass: props.mood === 'energetic' ? 'star-energetic' : 'star-calm'
    }
    stars.value.push(star)
  }
}

// Audio Control Functions
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

function previousSong() {
  currentSongIndex.value = (currentSongIndex.value - 1 + playlist.value.length) % playlist.value.length
  nextTick(() => {
    if (isPlaying.value) {
      audioElement.value.play()
    }
  })
}

function nextSong() {
  currentSongIndex.value = (currentSongIndex.value + 1) % playlist.value.length
  nextTick(() => {
    if (isPlaying.value) {
      audioElement.value.play()
    }
  })
}

// Audio Event Handlers
function onMetadataLoaded() {
  duration.value = audioElement.value.duration
}

function onTimeUpdate() {
  currentTime.value = audioElement.value.currentTime
  progress.value = (currentTime.value / duration.value) * 100
}

function onSongEnd() {
  nextSong()
}

// Utility Functions
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Watch for mood changes to update star animations
watch(() => props.mood, () => {
  generateStars()
}, { immediate: true })

// Initialize component
onMounted(() => {
  generateStars()
  updateVolume()
})
</script>

<style scoped>
/* Galaxy Music Player Animations */
.full-player {
  min-height: 400px;
  padding: 1.5rem;
}

.compact-player {
  min-height: auto;
  padding: 0.75rem;
  max-width: 300px;
}

/* Star animations based on mood */
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

/* Spiral Galaxy Animation */
.galaxy-spiral {
  background: radial-gradient(circle, 
    rgba(147, 51, 234, 0.1) 0%, 
    rgba(59, 130, 246, 0.1) 50%, 
    transparent 100%);
}

.animate-spin-slow {
  animation: spin-galaxy 8s linear infinite;
}

@keyframes spin-galaxy {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Custom Volume Slider */
.volume-slider {
  background: linear-gradient(to right, 
    rgba(147, 51, 234, 0.6) 0%, 
    rgba(59, 130, 246, 0.6) 100%);
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

/* Responsive Design */
@media (max-width: 768px) {
  .galaxy-music-player {
    min-height: 350px;
    padding: 1rem;
  }
  
  .galaxy-spiral {
    width: 120px;
    height: 120px;
  }
  
  .galaxy-spiral button {
    width: 60px;
    height: 60px;
  }
}

/* Meteor and Pause Icons */
.meteor-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
}

.pause-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
}

/* Progress bar hover effect */
.galaxy-music-player .relative.h-2:hover .absolute.top-0 {
  box-shadow: 0 0 15px rgba(147, 51, 234, 0.6);
}
</style>
