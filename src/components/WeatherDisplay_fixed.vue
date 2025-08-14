<template>
  <div class="weather-container">
    <!-- Şehir Arama -->
    <div class="city-search">
      <div class="search-input-container">
        <input 
          v-model="searchCity"
          @keyup.enter="searchWeather"
          placeholder="Şehir adı yazın..."
          class="city-input"
          type="text"
        >
        <button @click="searchWeather" class="search-button" :disabled="loading">
          {{ loading ? '🔄' : '🔍' }}
        </button>
      </div>
    </div>

    <div v-if="weather" class="weather-content">
      <div class="weather-header">
        <div class="weather-icon">{{ getWeatherIcon(weather.weather[0].main) }}</div>
        <div class="weather-info">
          <h3 class="city-name">{{ weather.name }}</h3>
          <p class="weather-description">{{ weather.weather[0].description }}</p>
        </div>
      </div>
      
      <div class="temperature">
        <span class="temp-value">{{ Math.round(weather.main.temp) }}</span>
        <span class="temp-unit">°C</span>
      </div>
      
      <div class="weather-details">
        <div class="detail-item">
          <span class="detail-icon">💧</span>
          <span class="detail-text">{{ weather.main.humidity }}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-icon">🌬️</span>
          <span class="detail-text">{{ Math.round(weather.wind?.speed || 0) }} km/h</span>
        </div>
      </div>
    </div>
    
    <div v-else-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Hava durumu yükleniyor...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">❌</div>
      <p>{{ error }}</p>
      <button @click="retrySearch" class="retry-button">🔄 Tekrar Dene</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fetchWeatherByCity } from '../api/weather'

const props = defineProps({ weather: Object })
const emit = defineEmits(['weather-updated'])

const searchCity = ref('')
const loading = ref(false)
const error = ref('')

const getWeatherIcon = (weatherType) => {
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️'
  }
  return icons[weatherType] || '🌤️'
}

const searchWeather = async () => {
  if (!searchCity.value.trim()) {
    error.value = 'Lütfen şehir adı girin'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const weatherData = await fetchWeatherByCity(searchCity.value.trim())
    emit('weather-updated', weatherData)
    searchCity.value = ''
  } catch (err) {
    error.value = 'Şehir bulunamadı. Lütfen geçerli bir şehir adı girin.'
    console.error('Hava durumu hatası:', err)
  } finally {
    loading.value = false
  }
}

const retrySearch = () => {
  error.value = ''
  searchWeather()
}
</script>

<style scoped>
/* %25 küçültülmüş hava durumu container */
.weather-container {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 1.5rem;
  padding: 1.125rem;
  max-width: 18rem;
  margin: 0 auto;
  animation: float 6s ease-in-out infinite;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

/* Şehir Arama Stilleri */
.city-search {
  margin-bottom: 1rem;
}

.search-input-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.city-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.3s ease;
}

.city-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.city-input:focus {
  border-color: rgba(147, 51, 234, 0.5);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.2);
}

.search-button {
  background: linear-gradient(135deg, #9333ea, #7c3aed);
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 3rem;
}

.search-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Hata Durumu */
.error-state {
  text-align: center;
  color: white;
  padding: 1rem;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.error-state p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.retry-button {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-1px);
}

.weather-content {
  text-align: center;
  color: white;
}

.weather-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

/* %25 küçültülmüş weather icon */
.weather-icon {
  font-size: 2.25rem;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

.weather-info {
  text-align: left;
}

/* %25 küçültülmüş city name */
.city-name {
  font-size: 0.9375rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

/* %25 küçültülmüş weather description */
.weather-description {
  font-size: 0.65625rem;
  color: rgba(255,255,255,0.8);
  margin: 0;
  text-transform: capitalize;
}

.temperature {
  margin: 1rem 0;
  text-align: center;
}

/* %25 küçültülmüş temperature */
.temp-value {
  font-size: 2.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
}

/* %25 küçültülmüş temp unit */
.temp-unit {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  margin-left: 0.25rem;
}

.weather-details {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.detail-icon {
  font-size: 1.1rem;
}

.detail-text {
  color: rgba(255,255,255,0.9);
  font-weight: 500;
}

.loading-state {
  text-align: center;
  color: rgba(255,255,255,0.8);
  padding: 2rem 1rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
}

/* Responsive Design - %25 küçültülmüş */
@media (max-width: 640px) {
  .weather-container {
    max-width: 12rem;
    padding: 0.75rem;
  }
  
  .weather-header {
    flex-direction: column;
    gap: 0.35rem;
  }
  
  .weather-info {
    text-align: center;
  }
  
  .weather-icon {
    font-size: 1.9rem;
  }
  
  .temp-value {
    font-size: 1.7rem;
  }
}
</style>
