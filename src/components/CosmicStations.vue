<template>
  <div class="cosmic-stations relative min-h-screen flex flex-col items-center justify-center p-4 z-10">
    <!-- Dinamik Arka Plan -->
    <div class="cosmic-background">
      <!-- Hareketli Yıldızlar -->
      <div class="moving-stars">
        <div v-for="star in backgroundStars" :key="star.id" 
             class="star" 
             :style="star.style">
        </div>
      </div>
      
      <!-- Meteor Yağmuru -->
      <div class="meteor-container">
        <div v-for="meteor in meteors" :key="meteor.id" 
             class="meteor" 
             :style="meteor.style">
        </div>
      </div>
    </div>

    <h1 class="text-3xl font-bold text-white text-center mb-6">Kozmik Müzik İstasyonları</h1>
    <p class="text-gray-300 text-center mb-8 max-w-md">Kozmik yolculuğunuzda size eşlik edecek müzik istasyonlarını keşfedin</p>
    
    <!-- İstasyonlar Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
      <!-- Dinamik İstasyon Kartları -->
      <div 
        v-for="station in stations"
        :key="station.id"
        class="station-card group relative"
        :class="[
          `${station.id}-station`,
          { 'active': selectedStation === station.id, 'music-playing': isPlayingMusic }
        ]"
        @click="selectStation(station.id)"
        @mouseenter="showStationInfo(station.id)"
        @mouseleave="hideStationInfo"
      >
        <div class="station-icon rotating-planet" :data-genre="station.genres[0]">{{ station.emoji }}</div>
        <h3 class="station-name">{{ station.name }}</h3>
        <p class="station-description">{{ station.description }}</p>
        
        <!-- Gelişmiş Tooltip - Hover'da görünür -->
        <div class="station-tooltip-advanced">
          <div class="tooltip-content">
            <div class="tooltip-header">
              <span class="tooltip-emoji">{{ station.emoji }}</span>
              <h4 class="tooltip-title">{{ station.name }} İstasyonu</h4>
            </div>
            <p class="tooltip-description">{{ getStationTooltip(station.id) }}</p>
            <div class="tooltip-genres">
              <span class="tooltip-label">Türler:</span>
              <div class="genre-tags">
                <span v-for="genre in station.genres.slice(0, 3)" :key="genre" 
                      class="genre-tag">{{ genre }}</span>
              </div>
            </div>
            <div class="tooltip-moods">
              <span class="tooltip-label">Ruh Halleri:</span>
              <div class="mood-tags">
                <span v-for="mood in station.moods.slice(0, 3)" :key="mood" 
                      class="mood-tag">{{ mood }}</span>
              </div>
            </div>
            <div class="tooltip-footer">
              <span class="click-hint">🖱️ Tıklayın ve keşfedin!</span>
            </div>
          </div>
        </div>
        
        <!-- Müzik Dalga Animasyonu -->
        <div v-if="selectedStation === station.id && isPlayingMusic" class="music-waves">
          <div class="wave wave-1"></div>
          <div class="wave wave-2"></div>
          <div class="wave wave-3"></div>
        </div>
      </div>
    </div>

    <!-- Seçili İstasyon Detayları -->
    <div v-if="selectedStation" class="mt-12 w-full max-w-4xl mx-auto bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div class="flex flex-col lg:flex-row gap-6">
        <div class="flex-shrink-0">
          <div class="station-icon-large rotating-planet" :data-genre="getStationGenre(selectedStation)">
            {{ getStationEmoji(selectedStation) }}
          </div>
        </div>
        
        <!-- İstasyon Bilgisi ve Önerilen Şarkılar -->
        <div class="flex-grow">
          <h2 class="text-2xl font-bold text-white mb-2">{{ getStationName(selectedStation) }} İstasyonu</h2>
          <p class="text-gray-300 mb-4">{{ getStationDescription(selectedStation) }}</p>
          
          <h3 class="text-lg font-semibold text-white mb-3">Önerilen Parçalar:</h3>
          <div class="space-y-2">
            <div v-for="(song, index) in recommendedSongs" :key="index" 
                 class="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors">
              <div class="flex items-center">
                <span class="w-6 text-gray-400">{{ index + 1 }}</span>
                <div class="ml-2">
                  <p class="text-white font-medium">{{ song.title }}</p>
                  <p class="text-gray-400 text-sm">{{ song.artist }}</p>
                </div>
              </div>
              <button class="play-button">
                <span class="text-xl">▶️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { getRecommendations } from '../utils/musicEngine'
import { stations } from '../data/stations.js'

const props = defineProps({
  weather: {
    type: Object,
    default: () => ({ temp: 20, conditions: 'clear' })
  }
})

const selectedStation = ref(null)
const recommendedSongs = ref([])
const hoveredStation = ref(null)
const isPlayingMusic = ref(false)

// Animasyon state'leri
const backgroundStars = ref([])
const meteors = ref([])
const currentGenre = ref('pop')

// Arka plan animasyonları için timer'lar
let starTimer = null
let meteorTimer = null

// İstasyon hover bilgileri
function showStationInfo(station) {
  hoveredStation.value = station
}

function hideStationInfo() {
  hoveredStation.value = null
}

// Helper fonksiyonlar
function getStationName(stationId) {
  const station = stations.find(s => s.id === stationId)
  return station ? station.name : 'Bilinmeyen İstasyon'
}

function getStationEmoji(stationId) {
  const station = stations.find(s => s.id === stationId)
  return station ? station.emoji : '🌌'
}

function getStationDescription(stationId) {
  const station = stations.find(s => s.id === stationId)
  return station ? station.description : 'Bilinmeyen açıklama'
}

function getStationGenre(stationId) {
  const station = stations.find(s => s.id === stationId)
  return station && station.genres.length > 0 ? station.genres[0] : 'pop'
}

function getStationTooltip(stationId) {
  const tooltips = {
    earth: 'Ana merkez! Pop, rock ve klasik müziğin buluştuğu yaşam dolu gezegen sahnesi.',
    venus: 'Aşk gezegeni! Romantik ballad ve yumuşak jazz\'ın sıcak atmosferi.',
    mars: 'Enerjik rock ve elektronik ritimlerin buluştuğu kızıl gezegen sahnesi.',
    jupiter: 'Gaz devinin epik sinfonik atmosferi! Orkestral ve klasik müziğin heybetli sahnesi.',
    saturn: 'Halkalı güzelliğin smooth jazz ve lounge sahnesi!',
    neptune: 'En uzak gezegen! Ambient ve electronic\'in gizemli derin deniz atmosferi.',
    milkyway: 'Evimiz galaksi! Dünya müziklerinin kozmik birleşimi.',
    andromeda: 'En yakın galaksi komşumuz! Avant-garde ve deneysel müziğin uzak sahnesi.',
    blackhole: 'Evrenin karanlık güçleri! Heavy metal ve gothic müziğin yutulmuş sahnesi.',
    binarystar: 'Birlikte dönen iki yıldızın perfect harmony\'si! Electronic ve pop\'un dans sahnesi.',
    supernova: 'Yıldızın son patlaması! High-energy rock ve metal\'in explosive sahnesi.',
    quark: 'Atomaltı parçacıkların jazz club\'ı! Sofistike jazz ve blues sahnesi.',
    comet: 'Uzun yolculukların folk hikayesi! Acoustic ve storytelling sahnesi.',
    cryochill: 'Buzul gezegen! Chill-out ve ambient\'in soğuk atmosferi.'
  }
  return tooltips[stationId] || 'Kozmik müzik deneyimi!'
}

// Müzik türüne göre renk değişimi
function updateGenreColors(genre) {
  currentGenre.value = genre
  document.documentElement.style.setProperty('--current-genre-color', getGenreColor(genre))
}

function getGenreColor(genre) {
  const colors = {
    'pop': '#3498db',
    'romantic': '#e74c3c', 
    'rock': '#e67e22',
    'orchestral': '#f39c12',
    'jazz': '#f1c40f',
    'electronic': '#9b59b6',
    'ambient': '#1abc9c',
    'worldmusic': '#2ecc71',
    'experimental': '#34495e',
    'dark': '#2c3e50'
  }
  return colors[genre] || '#3498db'
}

// İstasyon seçimi
async function selectStation(stationId) {
  selectedStation.value = stationId
  isPlayingMusic.value = true
  
  // İstasyon bilgilerini al
  const station = stations.find(s => s.id === stationId)
  if (station && station.genres.length > 0) {
    updateGenreColors(station.genres[0])
  }
  
  // Müzik önerilerini al
  try {
    const recommendations = await getRecommendations({
      mood: station?.moods?.[0] || 'happy',
      weather: props.weather,
      station: stationId
    })
    recommendedSongs.value = recommendations
  } catch (error) {
    console.error('Müzik önerileri alınırken hata:', error)
    recommendedSongs.value = []
  }
}

// Arka plan animasyonları
function createStar() {
  const star = {
    id: Math.random(),
    style: {
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      animationDelay: Math.random() * 2 + 's',
      opacity: Math.random() * 0.7 + 0.3
    }
  }
  backgroundStars.value.push(star)
  console.log('⭐ Star created:', star.id, 'Total stars:', backgroundStars.value.length)
  
  if (backgroundStars.value.length > 50) {
    backgroundStars.value.shift()
  }
}

function createMeteor() {
  const meteor = {
    id: Math.random(),
    style: {
      left: Math.random() * 100 + '%',
      animationDuration: Math.random() * 3 + 2 + 's',
      animationDelay: Math.random() * 5 + 's'
    }
  }
  meteors.value.push(meteor)
  console.log('☄️ Meteor created:', meteor.id, 'Total meteors:', meteors.value.length)
  
  if (meteors.value.length > 5) {
    meteors.value.shift()
  }
}

onMounted(() => {
  console.log('🌌 CosmicStations mounted - starting animations')
  
  // Debug info
  console.log('Background stars array:', backgroundStars.value)
  console.log('Meteors array:', meteors.value)
  
  // DOM elementi var mı kontrol et
  const cosmicBg = document.querySelector('.cosmic-background')
  console.log('Cosmic background element found:', !!cosmicBg)
  if (cosmicBg) {
    console.log('Element styles:', {
      position: getComputedStyle(cosmicBg).position,
      zIndex: getComputedStyle(cosmicBg).zIndex,
      width: getComputedStyle(cosmicBg).width,
      height: getComputedStyle(cosmicBg).height
    })
  }
  
  // Arka plan animasyonlarını başlat
  starTimer = setInterval(createStar, 500)
  meteorTimer = setInterval(createMeteor, 3000)
  
  // İlk yıldızları oluştur
  for (let i = 0; i < 20; i++) {
    createStar()
  }
  
  setTimeout(() => {
    console.log('🌟 Animation status check:', {
      stars: backgroundStars.value.length,
      meteors: meteors.value.length,
      hasTimers: !!(starTimer && meteorTimer),
      starElements: document.querySelectorAll('.star').length,
      meteorElements: document.querySelectorAll('.meteor').length
    })
  }, 2000)
})

onUnmounted(() => {
  if (starTimer) clearInterval(starTimer)
  if (meteorTimer) clearInterval(meteorTimer)
})
</script>

<style scoped>
/* Kozmik arka plan - Cross-browser uyumlu */
.cosmic-background {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  overflow: visible !important;
  z-index: -1 !important;
  pointer-events: none !important;
  /* Hardware acceleration */
  will-change: transform, opacity;
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  /* Backface visibility */
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  backface-visibility: hidden;
}

.moving-stars {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  pointer-events: none !important;
  /* Hardware acceleration */
  will-change: transform;
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
}

.star {
  position: absolute !important;
  width: 6px !important;
  height: 6px !important;
  background: white !important;
  border-radius: 50% !important;
  pointer-events: none !important;
  box-shadow: 0 0 6px white, 0 0 12px white !important;
  /* Cross-browser animation */
  animation: twinkle 2s infinite alternate !important;
  -webkit-animation: twinkle 2s infinite alternate !important;
  -moz-animation: twinkle 2s infinite alternate !important;
  -o-animation: twinkle 2s infinite alternate !important;
  /* Hardware acceleration */
  will-change: opacity;
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  /* Anti-aliasing */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* Force visibility */
  z-index: -1 !important;
  display: block !important;
  visibility: visible !important;
}

.meteor-container {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  pointer-events: none !important;
  /* Hardware acceleration */
  will-change: transform;
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
}

.meteor {
  position: absolute !important;
  width: 4px !important;
  height: 30px !important;
  background: linear-gradient(45deg, #fff, #00f, #fff) !important;
  border-radius: 50% !important;
  pointer-events: none !important;
  box-shadow: 0 0 8px #00f, 0 0 16px #00f !important;
  /* Cross-browser animation */
  animation: meteor-fall 3s linear infinite !important;
  -webkit-animation: meteor-fall 3s linear infinite !important;
  -moz-animation: meteor-fall 3s linear infinite !important;
  -o-animation: meteor-fall 3s linear infinite !important;
  /* Hardware acceleration */
  will-change: transform, opacity;
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  /* Force visibility */
  z-index: -1 !important;
  display: block !important;
  visibility: visible !important;
}

/* Cross-browser keyframes - Safari/WebKit */
@-webkit-keyframes twinkle {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

/* Cross-browser keyframes - Firefox */
@-moz-keyframes twinkle {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

/* Cross-browser keyframes - Opera */
@-o-keyframes twinkle {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

/* Standard keyframes */
@keyframes twinkle {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

/* Cross-browser keyframes - Safari/WebKit */
@-webkit-keyframes meteor-fall {
  0% {
    -webkit-transform: translate3d(0, -100px, 0);
    transform: translate3d(0, -100px, 0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translate3d(-100px, 100vh, 0);
    transform: translate3d(-100px, 100vh, 0);
    opacity: 0;
  }
}

/* Cross-browser keyframes - Firefox */
@-moz-keyframes meteor-fall {
  0% {
    -moz-transform: translate3d(0, -100px, 0);
    transform: translate3d(0, -100px, 0);
    opacity: 1;
  }
  100% {
    -moz-transform: translate3d(-100px, 100vh, 0);
    transform: translate3d(-100px, 100vh, 0);
    opacity: 0;
  }
}

/* Cross-browser keyframes - Opera */
@-o-keyframes meteor-fall {
  0% {
    -o-transform: translate3d(0, -100px, 0);
    transform: translate3d(0, -100px, 0);
    opacity: 1;
  }
  100% {
    -o-transform: translate3d(-100px, 100vh, 0);
    transform: translate3d(-100px, 100vh, 0);
    opacity: 0;
  }
}

/* Standard keyframes */
@keyframes meteor-fall {
  0% {
    transform: translate3d(0, -100px, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(-100px, 100vh, 0);
    opacity: 0;
  }
}

/* İstasyon kartları */
.station-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  transform: translateY(0);
}

.station-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1), 
    rgba(255, 255, 255, 0.05)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 16px;
}

.station-card:hover {
  transform: translateY(-12px) scale(1.02);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.station-card:hover::before {
  opacity: 1;
}

.station-card:hover .station-icon {
  transform: scale(1.1) rotate(5deg);
  text-shadow: 0 0 30px currentColor;
}

.station-card:hover .station-name {
  color: #ffffff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.station-card.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
  transform: translateY(-8px);
}

.station-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  display: block;
  animation: float 3s ease-in-out infinite;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}

.station-icon-large {
  font-size: 5rem;
  animation: float 3s ease-in-out infinite;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.rotating-planet {
  animation: rotate 10s linear infinite, float 3s ease-in-out infinite;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.station-name {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.station-description {
  color: #cbd5e0;
  font-size: 0.9rem;
  line-height: 1.4;
  transition: all 0.3s ease;
}

.station-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  white-space: nowrap;
  max-width: 300px;
  white-space: normal;
  z-index: 10;
  margin-bottom: 8px;
}

.station-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.9);
}

/* Müzik dalga animasyonu */
.music-waves {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 3px;
}

.wave {
  width: 3px;
  height: 20px;
  background: linear-gradient(to top, #3498db, #2ecc71);
  border-radius: 2px;
  animation: wave-pulse 1s ease-in-out infinite;
}

.wave-1 { animation-delay: 0s; }
.wave-2 { animation-delay: 0.2s; }
.wave-3 { animation-delay: 0.4s; }

@keyframes wave-pulse {
  0%, 100% { height: 10px; }
  50% { height: 25px; }
}

/* İstasyon özel renkleri */
.earth-station { border-color: #3498db; }
.venus-station { border-color: #e74c3c; }
.mars-station { border-color: #e67e22; }
.jupiter-station { border-color: #f39c12; }
.saturn-station { border-color: #f1c40f; }
.neptune-station { border-color: #1abc9c; }
.milkyway-station { border-color: #2ecc71; }
.andromeda-station { border-color: #34495e; }
.blackhole-station { border-color: #2c3e50; }
.binarystar-station { border-color: #9b59b6; }
.supernova-station { border-color: #e67e22; }
.quark-station { border-color: #f1c40f; }
.comet-station { border-color: #2ecc71; }
.cryochill-station { border-color: #1abc9c; }

.earth-station:hover { box-shadow: 0 0 20px #3498db; }
.venus-station:hover { box-shadow: 0 0 20px #e74c3c; }
.mars-station:hover { box-shadow: 0 0 20px #e67e22; }
.jupiter-station:hover { box-shadow: 0 0 20px #f39c12; }
.saturn-station:hover { box-shadow: 0 0 20px #f1c40f; }
.neptune-station:hover { box-shadow: 0 0 20px #1abc9c; }
.milkyway-station:hover { box-shadow: 0 0 20px #2ecc71; }
.andromeda-station:hover { box-shadow: 0 0 20px #34495e; }
.blackhole-station:hover { box-shadow: 0 0 20px #2c3e50; }
.binarystar-station:hover { box-shadow: 0 0 20px #9b59b6; }
.supernova-station:hover { box-shadow: 0 0 20px #e67e22; }
.quark-station:hover { box-shadow: 0 0 20px #f1c40f; }
.comet-station:hover { box-shadow: 0 0 20px #2ecc71; }
.cryochill-station:hover { box-shadow: 0 0 20px #1abc9c; }

/* Play button */
.play-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.play-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 768px) {
  .station-card {
    padding: 16px;
  }
  
  .station-icon {
    font-size: 2rem;
  }
  
  .station-name {
    font-size: 1.2rem;
  }
  
  .station-description {
    font-size: 0.8rem;
  }
}

/* Gelişmiş Tooltip Stilleri */
.station-tooltip-advanced {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  pointer-events: none;
  filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5));
}

.station-card:hover .station-tooltip-advanced {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-100%) translateY(-10px);
}

.tooltip-content {
  background: linear-gradient(135deg, 
    rgba(15, 23, 42, 0.95), 
    rgba(30, 41, 59, 0.95), 
    rgba(51, 65, 85, 0.95)
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 16px;
  padding: 20px;
  width: 320px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
}

.tooltip-content::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid rgba(30, 41, 59, 0.95);
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.tooltip-emoji {
  font-size: 2rem;
  text-shadow: 0 0 20px currentColor;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.tooltip-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.tooltip-description {
  color: rgba(203, 213, 225, 0.9);
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 16px;
}

.tooltip-genres, .tooltip-moods {
  margin-bottom: 12px;
}

.tooltip-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(148, 163, 184, 0.8);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.genre-tags, .mood-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.genre-tag {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.mood-tag {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
}

.tooltip-footer {
  padding-top: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  text-align: center;
}

.click-hint {
  color: rgba(251, 191, 36, 0.9);
  font-size: 0.8rem;
  font-weight: 500;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { 
    opacity: 0.7;
    text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
  }
  50% { 
    opacity: 1;
    text-shadow: 0 0 20px rgba(251, 191, 36, 0.8);
  }
}

/* Main container positioning */
.cosmic-stations {
  position: relative !important;
  z-index: 1 !important;
  /* Ensure content is above background */
  background: transparent !important;
}

/* Ensure proper stacking context */
.cosmic-stations > *:not(.cosmic-background) {
  position: relative;
  z-index: 2;
}
</style>
