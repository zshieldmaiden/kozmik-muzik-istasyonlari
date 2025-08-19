<template>
  <div class="w-full max-w-4xl mx-auto mt-2 space-y-2">
    <!-- Playlist Kontrolleri -->
    <div class="playlist-controls glassmorphism rounded-2xl p-4">
      <div class="flex flex-wrap gap-2 justify-center">
        <button @click="getDailyPlaylist" class="control-button daily">
          <span class="icon">🎧</span>
          <span>Günlük Mix</span>
        </button>
        <button @click="shuffleRecommendations" class="control-button discover">
          <span class="icon">🔀</span>
          <span>Keşfet</span>
        </button>
        <button @click="savePlaylist" class="control-button save">
          <span class="icon">💾</span>
          <span>Kaydet</span>
        </button>
        
        <!-- Paylaş Dropdown Menü -->
        <div class="share-dropdown" :class="{ active: showShareMenu }">
          <button @click="toggleShareMenu" class="control-button share">
            <span class="icon">📤</span>
            <span>Paylaş</span>
            <span class="dropdown-arrow">{{ showShareMenu ? '▲' : '▼' }}</span>
          </button>
          
          <!-- Sosyal Medya Platformları -->
          <div v-if="showShareMenu" class="share-menu">
            <button @click="sharePlaylist('facebook')" class="share-option facebook">
              <span class="platform-icon">🌐</span>
              <span>Facebook</span>
            </button>
            <button @click="sharePlaylist('whatsapp')" class="share-option whatsapp">
              <span class="platform-icon">💬</span>
              <span>WhatsApp</span>
            </button>
            <button @click="sharePlaylist('instagram')" class="share-option instagram">
              <span class="platform-icon">�</span>
              <span>Instagram</span>
            </button>
            <button @click="sharePlaylist('twitter')" class="share-option twitter">
              <span class="platform-icon">🐦</span>
              <span>Twitter</span>
            </button>
          </div>
        </div>
      </div>
      <div v-if="playlistName" class="playlist-name">
        {{ playlistName }}
      </div>
    </div>

    <!-- Gelişmiş Arama & Filtreleme -->
    <AdvancedSearch 
      @results-updated="onSearchResults"
      @loading-changed="onSearchLoading"
    />

    <!-- Kaydedilen Playlist'ler -->
    <SavedPlaylists 
      @playlist-loaded="onPlaylistLoaded"
      @playlist-deleted="onPlaylistDeleted"
    />

    <!-- Playlist Oluştur - Spotify ve YouTube -->
    <MusicPlatforms />

    <!-- Şarkı Listesi -->
    <div class="songs-section">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Kozmik şarkılar yükleniyor...</p>
      </div>
      <div v-else class="songs-grid">
        <SongCard
          v-for="song in songs"
          :key="song.id || song.title"
          :song="song"
          :liked="isLiked(song)"
          @like="toggleLike(song)"
          @recommend="recommendSimilar(song)"
          @play="onSongPlayed(song)"
          @share-spotify="shareToSpotify"
          @share-youtube="shareToYouTube"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useMusicPlayer } from '../utils/musicPlayerStore.js'
const emit = defineEmits(['gamification-updated'])
import SongCard from './SongCard.vue'
import AdvancedSearch from './AdvancedSearch.vue'
import SavedPlaylists from './SavedPlaylists.vue'
import MusicPlatforms from './MusicPlatforms.vue'
import { getRecommendations, getSessionRecommendationsCount } from '../utils/musicEngine'
import { addPassengerPoint, addStationStamp } from '@/utils/gamification'
import MusicApiClient from '../api/musicApi.js'

const props = defineProps({ mood: String, weather: Object })

// Global müzik player
const { actions: musicActions } = useMusicPlayer()

const loading = ref(true)
const songs = ref([])
const likedSongs = ref(JSON.parse(localStorage.getItem('likedSongs') || '[]'))
const history = ref(JSON.parse(localStorage.getItem('listenHistory') || '[]'))
const playlistName = ref('')
const showShareMenu = ref(false)

// Fallback hava durumu
const fallbackWeather = {
  weather: [{ main: "Clear", description: "Açık" }],
  main: { temp: 22 },
  name: "Varsayılan Şehir"
}

// Şarkı beğenildi mi?
function isLiked(song) {
  return likedSongs.value.some(s => s.title === song.title && s.artist === song.artist)
}

// Beğeni toggle
function toggleLike(song) {
  const exists = isLiked(song)
  if (!exists) likedSongs.value.push(song)
  else likedSongs.value = likedSongs.value.filter(s => !(s.title === song.title && s.artist === song.artist))
  localStorage.setItem('likedSongs', JSON.stringify(likedSongs.value))
}

// Dinleme geçmişine ekle
function addToHistory(songList) {
  const newHistory = [...history.value, ...songList.filter(s => !history.value.some(h => h.title === s.title && h.artist === s.artist))]
  history.value = newHistory.slice(-50)
  localStorage.setItem('listenHistory', JSON.stringify(history.value))
}

/**
 * Mood + hava durumu ile öneri getir
 * Her çağrıda, aynı seans içinde tekrar etmeyen şarkı önerileri getirir
 */
function shuffleRecommendations() {
  // Hava durumu yoksa fallback kullan
  const weatherCondition = props.weather && props.weather.weather ? 
    props.weather.weather[0].main : 
    fallbackWeather.weather[0].main
  
  // Mood yoksa happy fallback
  const currentMood = props.mood || "happy"
  
  // Seans bilgisini loglama
  console.log(`Şarkı önerisi istendi. Seansta önerilen şarkı sayısı: ${getSessionRecommendationsCount()}`)
  
  // Tekrar etmeyen öneriler getir
  songs.value = getRecommendations(currentMood, weatherCondition)
  // Oyunlaştırma: yeni öneri paketinde her benzersiz istasyon için damga, her şarkı için puan kazandır
  const uniqueStations = new Set()
  songs.value.forEach(s => {
    // Şarkı başına 2 puan (öneri alındı)
    addPassengerPoint(2)
    // İstasyon damgası
    if (Array.isArray(s.stations)) s.stations.forEach(st => uniqueStations.add(st))
  })
  uniqueStations.forEach(st => addStationStamp(st))
  emit('gamification-updated')
  
  // Dinleme geçmişine ekle
  addToHistory(songs.value)
  
  // Çalma listesi ismini güncelle
  generatePlaylistName()
}

// Benzer şarkılar öner
function recommendSimilar(song) {
  // Hava durumu yoksa fallback kullan
  const weatherCondition = props.weather && props.weather.weather ? 
    props.weather.weather[0].main : 
    fallbackWeather.weather[0].main
  
  // Mood yoksa happy fallback
  const currentMood = props.mood || "happy"
  
  songs.value = getRecommendations(currentMood, weatherCondition)
    .filter(s => s.genre === song.genre && s.title !== song.title)
  
  addToHistory(songs.value)
  // Benzer önerilerde de puan/damga
  const uniqueStations = new Set()
  songs.value.forEach(s => {
    addPassengerPoint(1)
    if (Array.isArray(s.stations)) s.stations.forEach(st => uniqueStations.add(st))
  })
  uniqueStations.forEach(st => addStationStamp(st))
  emit('gamification-updated')
  generatePlaylistName()
}

// Spotify playlist arama linki oluştur ve yeni sekmede aç
function createPlaylist() {
  // Playlist adı oluştur
  generatePlaylistName()
  // Şarkı isimlerini birleştir
  const query = songs.value.map(s => s.spotifyQuery).join(' ')
  // Spotify arama linki
  const url = `https://open.spotify.com/search/${encodeURIComponent(query)}`
  window.open(url, '_blank')
  // Mock olarak playlisti localStorage'a kaydet
  localStorage.setItem('mockSpotifyPlaylist', JSON.stringify({
    name: playlistName.value,
    songs: songs.value,
    created: new Date().toISOString()
  }))
}

// Playlist adını şehir, hava, mood ve tarih ile oluştur
function generatePlaylistName() {
  const city = props.weather?.name || fallbackWeather.name
  const weather = props.weather?.weather?.[0]?.main || fallbackWeather.weather[0].main
  const mood = props.mood || 'Mood'
  const date = new Date().toISOString().slice(0, 10)
  playlistName.value = `${city} • ${weather} • ${mood} • ${date}`
}

// Playlisti SQLite veritabanına kaydet
async function savePlaylist() {
  try {
    generatePlaylistName()
    
    // Yükleme durumu göster
    const saveButton = document.querySelector('.save');
    const originalText = saveButton.innerHTML;
    saveButton.innerHTML = '<span>💾</span><span>Kaydediliyor...</span>';
    saveButton.disabled = true;
    
    // Playlist verisini hazırla
    const playlistData = {
      name: `🤖 ${playlistName.value}`, // AI ile oluşturulduğunu belirt
      songs: songs.value.map(song => ({
        title: song.title,
        artist: song.artist,
        genre: song.genre,
        year: song.year,
        popularity: song.popularity
      })),
      stations: [...new Set(songs.value.flatMap(song => song.stations || ['earth']))],
      moods: props.mood ? [props.mood] : ['happy'],
      weather: props.weather?.weather?.[0]?.main ? [props.weather.weather[0].main.toLowerCase()] : ['clear'],
      source: 'ai', // AI kaynaklı olduğunu işaretle
      type: 'ai-suggestions'
    };
    
    // SQLite API'ye kaydet
    const result = await MusicApiClient.savePlaylist(playlistData);
    
    // Başarı mesajı
    saveButton.innerHTML = '<span>✅</span><span>Kaydedildi!</span>';
    
    // LocalStorage'a da yedek kaydet
    localStorage.setItem('savedPlaylist', JSON.stringify({
      name: playlistData.name,
      songs: songs.value,
      created: new Date().toISOString(),
      source: 'ai',
      type: 'ai-suggestions'
    }));
    
    // 2 saniye sonra butonu eski haline getir
    setTimeout(() => {
      saveButton.innerHTML = originalText;
      saveButton.disabled = false;
    }, 2000);
    
    console.log('✅ AI Playlist başarıyla kaydedildi:', result);
    
  } catch (error) {
    console.error('❌ Playlist kaydedilemedi:', error);
    
    // Hata durumunda buton
    const saveButton = document.querySelector('.save');
    saveButton.innerHTML = '<span>❌</span><span>Hata!</span>';
    
    // Fallback: localStorage'a kaydet
    generatePlaylistName();
    localStorage.setItem('savedPlaylist', JSON.stringify({
      name: `🤖 ${playlistName.value}`,
      songs: songs.value,
      created: new Date().toISOString(),
      source: 'ai',
      type: 'ai-suggestions'
    }));
    
    setTimeout(() => {
      saveButton.innerHTML = '<span>💾</span><span>Kaydet</span>';
      saveButton.disabled = false;
    }, 3000);
  }
}

// Gelişmiş arama sonuçları
function onSearchResults(searchResults) {
  console.log('🔍 Arama sonuçları:', searchResults.length, 'şarkı bulundu')
  
  // Arama sonuçlarını mevcut şarkılarla değiştir
  songs.value = searchResults
  playlistName.value = `🔍 Arama Sonuçları (${searchResults.length} şarkı)`
  
  // Gamification
  addPassengerPoint(2) // Arama için puan
}

// Arama yükleme durumu
function onSearchLoading(isLoading) {
  // Ana loading state'i etkilemeden sadece konsola log
  console.log(isLoading ? '🔍 Arama yapılıyor...' : '✅ Arama tamamlandı')
}

// Playlist yüklendi
function onPlaylistLoaded(playlistData) {
  console.log('📂 Playlist yüklendi:', playlistData.name)
  
  // Playlist'i current songs olarak ayarla
  songs.value = playlistData.songs || []
  playlistName.value = playlistData.name
  
  // Gamification
  addPassengerPoint(3) // Playlist yükleme için puan
  
  // İstasyon stamp'leri ekle
  if (playlistData.stations) {
    playlistData.stations.forEach(station => addStationStamp(station))
  }
}

// Playlist silindi
function onPlaylistDeleted(deletedPlaylist) {
  console.log('🗑️ Playlist silindi:', deletedPlaylist.name)
  
  // Eğer silinen playlist şu anda çalıyorsa temizle
  if (playlistName.value === deletedPlaylist.name) {
    songs.value = []
    playlistName.value = ''
  }
}

// Şarkı dinlendi (Global Player'a yönlendir)
function onSongPlayed(song) {
  console.log('🎵 MusicPlayer: Şarkı Cosmic Journey\'e gönderiliyor:', song.title)
  
  // Global player'a şarkıyı gönder ve widget'ı aç
  musicActions.playSong(song, true)
  
  // Gamification puanları
  addPassengerPoint(5)
  if (Array.isArray(song?.stations)) song.stations.forEach(st => addStationStamp(st))
  emit('gamification-updated')
}

// Paylaş: Spotify için şarkı araması aç
function shareToSpotify(song) {
  try {
    const query = song?.spotifyQuery ? song.spotifyQuery : `${song.title} ${song.artist}`
    const url = `https://open.spotify.com/search/${encodeURIComponent(query)}`
    window.open(url, '_blank')
    showNotification('Spotify araması yeni sekmede açıldı', 'success')
  } catch (e) {
    console.error('shareToSpotify hata:', e)
    showNotification('Spotify paylaşımı başarısız oldu', 'error')
  }
}

// Paylaş: YouTube için arama aç
function shareToYouTube(song) {
  try {
    const query = `${song.title} ${song.artist}`
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
    window.open(url, '_blank')
    showNotification('YouTube araması yeni sekmede açıldı', 'success')
  } catch (e) {
    console.error('shareToYouTube hata:', e)
    showNotification('YouTube paylaşımı başarısız oldu', 'error')
  }
}

// Günlük playlist öner
function getDailyPlaylist() {
  // Hava durumu yoksa fallback kullan
  const weatherCondition = props.weather && props.weather.weather ? 
    props.weather.weather[0].main : 
    fallbackWeather.weather[0].main
  
  const hour = new Date().getHours()
  let mood = props.mood || "happy"
  
  if (hour < 10) mood = 'calm'
  else if (hour > 20) mood = 'sleepy'
  else if (hour > 16) mood = 'party'
  
  songs.value = getRecommendations(mood, weatherCondition)
  addToHistory(songs.value)
  generatePlaylistName()
}

// Paylaş menüsünü toggle et
function toggleShareMenu() {
  showShareMenu.value = !showShareMenu.value
}

// Sosyal paylaşım - Gelişmiş versiyon
function sharePlaylist(platform) {
  generatePlaylistName()
  
  // Paylaşım metni oluştur
  const topSongs = songs.value.slice(0, 3).map(song => `🎵 ${song.title} - ${song.artist}`).join('\n')
  const message = `🎵 Kozmik Müzik Playlist'im: ${playlistName.value}\n\n${topSongs}${songs.value.length > 3 ? `\n... ve ${songs.value.length - 3} şarkı daha!` : ''}\n\n🚀 Kozmik müzik deneyimi için bizi takip edin!`
  
  let url = ''
  
  // Platform kontrolü
  if (platform === 'twitter') {
    url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
  } else if (platform === 'facebook') {
    url = `https://www.facebook.com/sharer/sharer.php?u=&quote=${encodeURIComponent(message)}`
  } else if (platform === 'whatsapp') {
    // Mobil cihaz kontrolü
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      // Mobil cihazlarda WhatsApp uygulamasını aç
      url = `whatsapp://send?text=${encodeURIComponent(message)}`
      
      // WhatsApp uygulaması yoksa web versiyonunu aç
      const link = document.createElement('a')
      link.href = url
      link.click()
      
      // 2 saniye sonra web versiyonunu aç (uygulama açılmazsa)
      setTimeout(() => {
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
      }, 2000)
      
      showShareMenu.value = false
      return
    } else {
      // Desktop'ta WhatsApp Web
      url = `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`
    }
  } else if (platform === 'instagram') {
    // Instagram için modern yaklaşım
    const shareData = {
      title: playlistName.value,
      text: message,
      url: window.location.href
    }
    
    // Web Share API kontrolü (mobil cihazlarda)
    if (navigator.share && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      navigator.share(shareData)
        .then(() => console.log('✅ Başarıyla paylaşıldı'))
        .catch(() => {
          // Fallback: Clipboard + Instagram aç
          copyToClipboardAndOpenInstagram(message)
        })
    } else {
      // Desktop: Clipboard + Instagram aç
      copyToClipboardAndOpenInstagram(message)
    }
    
    showShareMenu.value = false
    return
  }
  
  // URL varsa aç
  if (url) {
    window.open(url, '_blank')
  }
  
  showShareMenu.value = false
}

// Instagram için yardımcı fonksiyon
function copyToClipboardAndOpenInstagram(message) {
  // Modern clipboard API kontrolü
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(message)
      .then(() => {
        showNotification('📋 Metin kopyalandı! Instagram\'a yapıştırabilirsiniz.', 'success')
        // Instagram'ı aç
        setTimeout(() => {
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
          if (isMobile) {
            // Mobil: Instagram uygulamasını aç
            window.location.href = 'instagram://camera'
            // Uygulama yoksa web versiyonu
            setTimeout(() => {
              window.open('https://www.instagram.com/', '_blank')
            }, 1500)
          } else {
            // Desktop: Instagram web
            window.open('https://www.instagram.com/', '_blank')
          }
        }, 1000)
      })
      .catch(() => {
        // Fallback: Alert ile göster
        showNotification(`Instagram için bu metni kopyalayın:\n\n${message}`, 'info')
      })
  } else {
    // Eski tarayıcılar için fallback
    try {
      const textArea = document.createElement('textarea')
      textArea.value = message
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      showNotification('📋 Metin kopyalandı! Instagram\'a yapıştırabilirsiniz.', 'success')
      
      // Instagram'ı aç
      setTimeout(() => {
        window.open('https://www.instagram.com/', '_blank')
      }, 1000)
      
    } catch (error) {
      showNotification(`Instagram için bu metni manuel kopyalayın:\n\n${message}`, 'info')
    }
  }
}

// Bildirim gösterme fonksiyonu
function showNotification(message, type = 'info') {
  // Mevcut bildirimleri temizle
  const existingNotifications = document.querySelectorAll('.share-notification')
  existingNotifications.forEach(notif => notif.remove())
  
  // Yeni bildirim oluştur
  const notification = document.createElement('div')
  notification.className = `share-notification ${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <span class="notification-text">${message.replace(/\n/g, '<br>')}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `
  
  // CSS stilleri ekle
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 15px;
    border-radius: 10px;
    border-left: 4px solid ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
    max-width: 350px;
    z-index: 10000;
    backdrop-filter: blur(10px);
    animation: slideInRight 0.3s ease;
  `
  
  // CSS animasyonu ekle
  if (!document.querySelector('#notification-styles')) {
    const styles = document.createElement('style')
    styles.id = 'notification-styles'
    styles.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .notification-content {
        display: flex;
        align-items: flex-start;
        gap: 10px;
      }
      .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 18px;
        margin-left: auto;
      }
      .notification-text {
        flex: 1;
        font-size: 14px;
        line-height: 1.4;
      }
    `
    document.head.appendChild(styles)
  }
  
  document.body.appendChild(notification)
  
  // 5 saniye sonra otomatik kaldır
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOutRight 0.3s ease'
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

watch(() => props.mood, () => {
  // Mood değiştiğinde yeni öneriler getir
  shuffleRecommendations()
})

watch(() => props.weather, (newVal) => {
  // Weather değiştiğinde yeni öneriler getir
  shuffleRecommendations()
})

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    // Varsayılan değerlerle başla
    shuffleRecommendations()
    loading.value = false
  }, 800)
})
</script>

<style scoped>
.glassmorphism {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.2);
}

.playlist-controls {
  animation: float 6s ease-in-out infinite;
  padding: 0.5rem !important; /* Küçültülmüş padding */
}

.control-button {
  padding: 0.5rem 1rem; /* Küçültülmüş padding */
  border-radius: 20px; /* Küçültülmüş border radius */
  color: white;
  font-size: 0.75rem; /* Küçültülmüş font */
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem; /* Küçültülmüş gap */
}

.control-button:hover {
  transform: scale(1.05);
}

.control-button .icon {
  font-size: 0.875rem; /* Küçültülmüş icon boyutu */
}

.daily {
  background: linear-gradient(135deg, #9333ea, #3b82f6);
}

.daily:hover {
  background: linear-gradient(135deg, #7c3aed, #2563eb);
}

.discover {
  background: linear-gradient(135deg, #059669, #0d9488);
}

.discover:hover {
  background: linear-gradient(135deg, #047857, #0f766e);
}

.save {
  background: linear-gradient(135deg, #ea580c, #dc2626);
}

.save:hover {
  background: linear-gradient(135deg, #c2410c, #b91c1c);
}

.test {
  background: linear-gradient(135deg, #2196F3, #1976D2);
}

.test:hover {
  background: linear-gradient(135deg, #1976D2, #1565C0);
}

.twitter {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.twitter:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

/* Paylaş Dropdown Stilleri */
.share-dropdown {
  position: relative;
  display: inline-block;
  z-index: 1000;
}

.share-dropdown .control-button.share {
  background: linear-gradient(135deg, #a855f7, #ec4899);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.share-dropdown .control-button.share:hover {
  background: linear-gradient(135deg, #9333ea, #db2777);
}

.dropdown-arrow {
  font-size: 0.75rem;
  transition: transform 0.3s ease;
}

.share-dropdown.active .dropdown-arrow {
  transform: rotate(180deg);
}

.share-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 8px;
  margin-top: 8px;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.share-option {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.share-option:last-child {
  margin-bottom: 0;
}

.share-option:hover {
  transform: translateX(4px);
  background: rgba(255, 255, 255, 0.1);
}

.share-option.facebook {
  background: linear-gradient(135deg, #1877f2, #4267B2);
}

.share-option.whatsapp {
  background: linear-gradient(135deg, #25d366, #128c7e);
}

.share-option.whatsapp:hover {
  background: linear-gradient(135deg, #128c7e, #075e54);
  transform: scale(1.05);
}

.share-option.instagram {
  background: linear-gradient(135deg, #fd5949, #d6249f, #285AEB);
}

.share-option.instagram:hover {
  background: linear-gradient(135deg, #d6249f, #fd5949, #285AEB);
  transform: scale(1.05);
}

.share-option.twitter {
  background: linear-gradient(135deg, #1da1f2, #0d8bd9);
}

.share-option.twitter:hover {
  background: linear-gradient(135deg, #0d8bd9, #0c7abf);
  transform: scale(1.05);
}

.share-option.facebook {
  background: linear-gradient(135deg, #1877f2, #166fe5);
}

.share-option.facebook:hover {
  background: linear-gradient(135deg, #166fe5, #1464d8);
  transform: scale(1.05);
}

.platform-icon {
  font-size: 18px;
  transition: transform 0.2s ease;
}

.share-option:hover .platform-icon {
  transform: scale(1.2);
}

.playlist-name {
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  margin-top: 0.75rem;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.songs-section {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  animation: float 6s ease-in-out infinite 0.5s;
}

.loading-state {
  text-align: center;
  padding: 3rem 0;
  color: white;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
</style>
