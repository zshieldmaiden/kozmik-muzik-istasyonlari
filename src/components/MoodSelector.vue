<template>
  <div class="mood-selector-container">
    <h2 class="mood-title">Ruh Halin Nasıl?</h2>
    <p class="mood-subtitle">Mooduna göre kozmik müzik yolculuğunu başlatalım</p>
    
    <div class="moods-grid">
      <button
        v-for="mood in moods"
        :key="mood.value"
        :aria-label="mood.label"
        class="mood-button"
        :class="{ 
          'mood-active': selectedMood === mood.value,
          [mood.colorClass]: true
        }"
        @click="selectMood(mood.value)"
        @keyup.enter="selectMood(mood.value)"
        tabindex="0"
      >
        <div class="mood-emoji">{{ mood.emoji }}</div>
        <div class="mood-label">{{ mood.label }}</div>
        <div class="mood-glow" :class="mood.glowClass"></div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
const props = defineProps({ selectedMood: String })
const emits = defineEmits(['selectMood'])

const moods = [
  { 
    value: 'happy', 
    emoji: '😊', 
    label: 'Mutlu',
    colorClass: 'mood-happy',
    glowClass: 'glow-yellow'
  },
  { 
    value: 'sad', 
    emoji: '😢', 
    label: 'Üzgün',
    colorClass: 'mood-sad',
    glowClass: 'glow-blue'
  },
  { 
    value: 'calm', 
    emoji: '😌', 
    label: 'Sakin',
    colorClass: 'mood-calm',
    glowClass: 'glow-green'
  },
  { 
    value: 'energetic', 
    emoji: '⚡', 
    label: 'Enerjik',
    colorClass: 'mood-energetic',
    glowClass: 'glow-orange'
  },
  { 
    value: 'love', 
    emoji: '💕', 
    label: 'Romantik',
    colorClass: 'mood-love',
    glowClass: 'glow-pink'
  },
  { 
    value: 'sleepy', 
    emoji: '🌙', 
    label: 'Uykulu',
    colorClass: 'mood-sleepy',
    glowClass: 'glow-purple'
  },
  { 
    value: 'thoughtful', 
    emoji: '🤔', 
    label: 'Düşünceli',
    colorClass: 'mood-thoughtful',
    glowClass: 'glow-indigo'
  },
  { 
    value: 'party', 
    emoji: '🎉', 
    label: 'Parti',
    colorClass: 'mood-party',
    glowClass: 'glow-rainbow'
  },
  { 
    value: 'motivasyon', 
    emoji: '🏋️', 
    label: 'Motivasyon',
    colorClass: 'mood-motivation',
    glowClass: 'glow-orange'
  },
  { 
    value: 'rahatlama', 
    emoji: '🧘', 
    label: 'Rahatlama',
    colorClass: 'mood-relax',
    glowClass: 'glow-blue'
  },
  { 
    value: 'isyankar', 
    emoji: '🤘', 
    label: 'İsyankâr',
    colorClass: 'mood-rebel',
    glowClass: 'glow-red'
  },
  { 
    value: 'dinginvederin', 
    emoji: '🌊', 
    label: 'Dingin & Derin',
    colorClass: 'mood-deep',
    glowClass: 'glow-cyan'
  },
]

function selectMood(mood) {
  localStorage.setItem('lastMood', mood)
  emits('selectMood', mood)
}

onMounted(() => {
  const last = localStorage.getItem('lastMood')
  if (last && last !== props.selectedMood) {
    emits('selectMood', last)
  }
})
</script>

<style scoped>
.mood-selector-container {
  width: 100%;
  max-width: none;
  margin: 2rem auto;
}

.mood-title {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.5rem;
  text-shadow: 0 4px 8px rgba(0,0,0,0.5);
  background: linear-gradient(135deg, #a855f7, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (min-width: 768px) {
  .mood-title {
    font-size: 1.875rem;
  }
}

.mood-subtitle {
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

@media (min-width: 768px) {
  .mood-subtitle {
    font-size: 1rem;
  }
}

.moods-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 1rem;
  max-width: 100%;
}

@media (max-width: 900px) {
  .moods-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(8, 1fr);
  }
}

@media (max-width: 600px) {
  .moods-grid {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(16, 1fr);
  }
}

.mood-button {
  position: relative;
  padding: 1rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
  outline: none;
  cursor: pointer;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  z-index: 1;
}

.mood-button:hover {
  transform: translateY(-2px) scale(1.05);
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.2);
}

.mood-active {
  background: rgba(255,255,255,0.15) !important;
  border-color: rgba(255,255,255,0.3) !important;
  transform: scale(1.1);
}

.mood-emoji {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

@media (min-width: 768px) {
  .mood-emoji {
    font-size: 1.875rem;
  }
}

@media (min-width: 768px) {
  .mood-emoji {
    font-size: 1.875rem;
  }
}

.mood-label {
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

@media (min-width: 768px) {
  .mood-label {
    font-size: 0.875rem;
  }
}

.mood-glow {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.mood-active .mood-glow {
  opacity: 0.3;
}

.mood-button:hover .mood-glow {
  opacity: 0.2;
}

/* Mood specific colors */
.mood-happy {
  border-color: rgba(251, 191, 36, 0.3);
}

.mood-happy:hover, .mood-happy.mood-active {
  border-color: rgba(251, 191, 36, 0.5);
}

.mood-sad {
  border-color: rgba(59, 130, 246, 0.3);
}

.mood-sad:hover, .mood-sad.mood-active {
  border-color: rgba(59, 130, 246, 0.5);
}

.mood-calm {
  border-color: rgba(34, 197, 94, 0.3);
}

.mood-calm:hover, .mood-calm.mood-active {
  border-color: rgba(34, 197, 94, 0.5);
}

.mood-energetic {
  border-color: rgba(249, 115, 22, 0.3);
}

.mood-energetic:hover, .mood-energetic.mood-active {
  border-color: rgba(249, 115, 22, 0.5);
}

.mood-love {
  border-color: rgba(236, 72, 153, 0.3);
}

.mood-love:hover, .mood-love.mood-active {
  border-color: rgba(236, 72, 153, 0.5);
}

.mood-sleepy {
  border-color: rgba(147, 51, 234, 0.3);
}

.mood-sleepy:hover, .mood-sleepy.mood-active {
  border-color: rgba(147, 51, 234, 0.5);
}

.mood-thoughtful {
  border-color: rgba(99, 102, 241, 0.3);
}

.mood-thoughtful:hover, .mood-thoughtful.mood-active {
  border-color: rgba(99, 102, 241, 0.5);
}

.mood-party {
  border-color: rgba(168, 85, 247, 0.3);
}

.mood-party:hover, .mood-party.mood-active {
  border-color: rgba(168, 85, 247, 0.5);
}

.mood-motivation {
  border-color: rgba(249, 115, 22, 0.3);
}

.mood-motivation:hover, .mood-motivation.mood-active {
  border-color: rgba(249, 115, 22, 0.5);
}

.mood-relax {
  border-color: rgba(59, 130, 246, 0.3);
}

.mood-relax:hover, .mood-relax.mood-active {
  border-color: rgba(59, 130, 246, 0.5);
}

.mood-rebel {
  border-color: rgba(220, 38, 38, 0.3);
}

.mood-rebel:hover, .mood-rebel.mood-active {
  border-color: rgba(220, 38, 38, 0.5);
}

.mood-deep {
  border-color: rgba(6, 182, 212, 0.3);
}

.mood-deep:hover, .mood-deep.mood-active {
  border-color: rgba(6, 182, 212, 0.5);
}

/* Glow effects */
.glow-yellow {
  background: radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%);
}

.glow-blue {
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
}

.glow-green {
  background: radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%);
}

.glow-orange {
  background: radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%);
}

.glow-pink {
  background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%);
}

.glow-purple {
  background: radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%);
}

.glow-indigo {
  background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
}

.glow-rainbow {
  background: conic-gradient(from 0deg, 
    rgba(255, 0, 0, 0.3), 
    rgba(255, 154, 0, 0.3), 
    rgba(208, 222, 33, 0.3), 
    rgba(79, 220, 74, 0.3), 
    rgba(63, 218, 216, 0.3), 
    rgba(47, 201, 226, 0.3), 
    rgba(28, 127, 238, 0.3), 
    rgba(95, 39, 205, 0.3), 
    rgba(147, 0, 211, 0.3), 
    rgba(255, 0, 0, 0.3)
  );
  animation: rainbow-spin 3s linear infinite;
}

@keyframes rainbow-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .moods-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .mood-button {
    padding: 0.75rem;
  }
  
  .mood-emoji {
    font-size: 1.25rem;
  }
  
  .mood-label {
    font-size: 0.75rem;
  }
}
</style>
