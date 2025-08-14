<template>
  <div class="advanced-search-panel">
    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      ⚠️ {{ errorMessage }}
    </div>
    
    <!-- Arama Başlığı -->
    <div class="search-header">
      <h3>🔍 Gelişmiş Arama & Filtreleme</h3>
      <button @click="togglePanel" class="close-btn">{{ isOpen ? '▼' : '▲' }}</button>
    </div>

    <!-- Arama Paneli -->
    <div v-if="isOpen" class="search-content">
      <!-- Metin Arama -->
      <div class="search-section">
        <label>🎵 Şarkı/Sanatçı Ara:</label>
        <input 
          v-model="searchTerm" 
          @input="onSearchChange"
          placeholder="Şarkı adı, sanatçı veya genre..."
          class="search-input"
        />
      </div>

      <!-- Filtreler -->
      <div class="filters-grid">
        <!-- İstasyon Filtresi -->
        <div class="filter-group">
          <label>🚀 İstasyon:</label>
          <select v-model="filters.station" @change="onFilterChange" class="filter-select">
            <option value="">Tüm İstasyonlar</option>
            <option v-for="station in stations" :key="station.id" :value="station.id">
              {{ station.display_name }}
            </option>
          </select>
        </div>

        <!-- Mood Filtresi -->
        <div class="filter-group">
          <label>😊 Ruh Hali:</label>
          <select v-model="filters.mood" @change="onFilterChange" class="filter-select">
            <option value="">Tüm Mood'lar</option>
            <option v-for="mood in moods" :key="mood.id" :value="mood.name">
              {{ mood.name }} ({{ mood.song_count }})
            </option>
          </select>
        </div>

        <!-- Genre Filtresi -->
        <div class="filter-group">
          <label>🎸 Tür:</label>
          <select v-model="filters.genre" @change="onFilterChange" class="filter-select">
            <option value="">Tüm Türler</option>
            <option v-for="genre in genres" :key="genre.genre" :value="genre.genre">
              {{ genre.genre }} ({{ genre.song_count }})
            </option>
          </select>
        </div>

        <!-- Yıl Aralığı -->
        <div class="filter-group">
          <label>📅 Yıl:</label>
          <div class="year-range">
            <input 
              v-model="filters.yearMin" 
              @change="onFilterChange"
              type="number" 
              placeholder="Min" 
              class="year-input"
            />
            <span>-</span>
            <input 
              v-model="filters.yearMax" 
              @change="onFilterChange"
              type="number" 
              placeholder="Max" 
              class="year-input"
            />
          </div>
        </div>
      </div>

      <!-- Sıralama -->
      <div class="sort-section">
        <label>📊 Sırala:</label>
        <select v-model="sortBy" @change="onSortChange" class="sort-select">
          <option value="popularity">Popülerlik</option>
          <option value="title">Şarkı Adı</option>
          <option value="artist">Sanatçı</option>
          <option value="year">Yıl</option>
          <option value="genre">Tür</option>
        </select>
        <button @click="toggleSortOrder" class="sort-order-btn">
          {{ sortOrder === 'desc' ? '⬇️' : '⬆️' }}
        </button>
      </div>

      <!-- Hızlı Filtreler -->
      <div class="quick-filters">
        <button @click="setQuickFilter('popular')" class="quick-filter-btn">
          🔥 Popüler
        </button>
        <button @click="setQuickFilter('recent')" class="quick-filter-btn">
          🆕 Yeni Eklenen
        </button>
        <button @click="setQuickFilter('ai')" class="quick-filter-btn">
          🤖 AI Önerileri
        </button>
        <button @click="clearFilters" class="quick-filter-btn clear">
          🗑️ Temizle
        </button>
      </div>

      <!-- Sonuç Sayısı -->
      <div class="results-info">
        <span v-if="loading">🔄 Aranıyor...</span>
        <span v-else>📊 {{ results.length }} şarkı bulundu</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import MusicApiClient from '../api/musicApi.js'

const emit = defineEmits(['results-updated', 'loading-changed'])

// State
const isOpen = ref(false)
const loading = ref(false)
const searchTerm = ref('')
const results = ref([])
const errorMessage = ref('')

// Error handling
function showError(message) {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = ''
  }, 5000) // 5 saniye sonra kaybolsun
}

// Filtreler
const filters = ref({
  station: '',
  mood: '',
  genre: '',
  yearMin: '',
  yearMax: ''
})

// Sıralama
const sortBy = ref('popularity')
const sortOrder = ref('desc')

// Veri listeleri
const stations = ref([])
const moods = ref([])
const genres = ref([])

// Debounce timer
let searchTimeout = null

// Panel toggle
function togglePanel() {
  isOpen.value = !isOpen.value
}

// Arama değişikliği
function onSearchChange() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    performSearch()
  }, 500) // 500ms debounce
}

// Filtre değişikliği
function onFilterChange() {
  performSearch()
}

// Sıralama değişikliği
function onSortChange() {
  performSearch()
}

// Sıralama düzeni değiştir
function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  performSearch()
}

// Hızlı filtreler
function setQuickFilter(type) {
  clearFilters()
  
  switch (type) {
    case 'popular':
      sortBy.value = 'popularity'
      sortOrder.value = 'desc'
      break
    case 'recent':
      filters.value.yearMin = new Date().getFullYear() - 5
      sortBy.value = 'year'
      sortOrder.value = 'desc'
      break
    case 'ai':
      searchTerm.value = 'ai-'
      break
  }
  
  performSearch()
}

// Filtreleri temizle
function clearFilters() {
  searchTerm.value = ''
  filters.value = {
    station: '',
    mood: '',
    genre: '',
    yearMin: '',
    yearMax: ''
  }
  sortBy.value = 'popularity'
  sortOrder.value = 'desc'
  performSearch()
}

// Ana arama fonksiyonu
async function performSearch() {
  try {
    loading.value = true
    emit('loading-changed', true)
    
    // Arama kriterlerini hazırla
    const criteria = {
      searchTerm: searchTerm.value.trim(),
      station: filters.value.station,
      mood: filters.value.mood,
      genre: filters.value.genre,
      yearMin: filters.value.yearMin,
      yearMax: filters.value.yearMax,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value
    }
    
    // Gelişmiş arama yap (offline fallback ile)
    const response = await MusicApiClient.advancedSearch(criteria)
    results.value = response.data || []
    
    console.log('Arama tamamlandı:', {
      criteria,
      resultCount: results.value.length,
      source: response.source || 'unknown'
    })
    
    // Parent'a sonuçları gönder
    emit('results-updated', results.value)
    
  } catch (error) {
    console.error('Arama hatası:', error)
    showError('Arama yapılırken hata oluştu. Offline modda devam ediliyor.')
    results.value = []
    emit('results-updated', [])
    
  } finally {
    loading.value = false
    emit('loading-changed', false)
  }
}

// Başlangıç verilerini yükle - Error handling ile
async function loadInitialData() {
  try {
    // İstasyonları yükle
    const stationsResponse = await MusicApiClient.getAllStations()
    stations.value = stationsResponse.data || []
    
    // Mood'ları yükle
    const moodsResponse = await MusicApiClient.getAllMoods()
    moods.value = moodsResponse.data || []
    
    // Genre'leri yükle
    const genresResponse = await MusicApiClient.getAllGenres()
    genres.value = genresResponse.data || []
    
    console.log('Başlangıç verileri yüklendi:', {
      stations: stations.value.length,
      moods: moods.value.length,
      genres: genres.value.length,
      source: stationsResponse.source || 'unknown'
    })
    
    // İlk arama
    performSearch()
    
  } catch (error) {
    console.error('Başlangıç verileri yüklenemedi:', error)
    // Fallback data ile devam et
    stations.value = []
    moods.value = []
    genres.value = []
    
    // Kullanıcıya bilgi ver
    showError('Veri yükleme başarısız oldu, offline modda devam ediliyor.')
  }
}

// Component mounted
onMounted(() => {
  loadInitialData()
})
</script>

<style scoped>
.error-message {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.advanced-search-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 15px;
}

.search-header h3 {
  margin: 0;
  color: white;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.search-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-section label {
  display: block;
  color: white;
  margin-bottom: 8px;
  font-weight: 500;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.filter-group label {
  display: block;
  color: white;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.filter-select {
  width: 100%;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.year-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.year-input {
  width: 80px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.sort-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-select {
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.sort-order-btn {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.sort-order-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.quick-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.quick-filter-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: transform 0.3s ease;
}

.quick-filter-btn:hover {
  transform: scale(1.05);
}

.quick-filter-btn.clear {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.results-info {
  text-align: center;
  color: white;
  font-weight: 500;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>
