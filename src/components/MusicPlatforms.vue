<template>
  <div class="music-platforms-container">
    <h3 class="platform-title">Playlist Oluştur</h3>
    <div class="platforms-grid">
      <!-- Spotify Platform -->
      <div class="platform-card spotify-card" @click="openSpotify">
        <div class="platform-logo">
          <svg viewBox="0 0 24 24" class="platform-icon">
            <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.062 14.545c-.15.233-.464.305-.697.156-1.91-1.167-4.312-1.432-7.142-.785-.302.069-.604-.117-.673-.418-.069-.302.117-.604.418-.673 3.101-.71 5.722-.409 7.928.907.233.15.305.463.156.696zm.995-2.214c-.188.291-.581.384-.873.196-2.188-1.346-5.522-1.735-8.118-.95-.377.114-.775-.099-.889-.475-.114-.377.099-.775.475-.889 2.984-.901 6.723-.466 9.21 1.09.291.188.384.581.196.873zm.086-2.304c-2.623-1.558-6.954-1.703-9.463--.942-.452.137-.93-.119-1.067-.571-.137-.452.119-.93.571-1.067 2.88-.874 7.669-.706 10.707 1.087.351.208.467.663.259 1.014-.208.351-.663.467-1.014.259z"/>
          </svg>
        </div>
        <div class="platform-info">
          <h4>Spotify</h4>
          <p>Dünya çapında popüler</p>
        </div>
      </div>

      <!-- YouTube Music Platform -->
      <div class="platform-card youtube-card" @click="openYouTubeMusic">
        <div class="platform-logo">
          <svg viewBox="0 0 24 24" class="platform-icon">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 13.5v-7l6 3.5-6 3.5z"/>
          </svg>
        </div>
        <div class="platform-info">
          <h4>YouTube Music</h4>
          <p>Geniş müzik arşivi</p>
        </div>
      </div>

    </div>

    <!-- Playlist Modal -->
    <div v-if="showPlaylistModal" class="playlist-modal-overlay" @click="closeModal">
      <div class="playlist-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedPlatform.name }} Playlist'i Oluştur</h3>
          <button @click.stop="closeModal" class="close-button">×</button>
        </div>
        <div class="modal-content">
          <div class="playlist-form">
            <div class="form-group">
              <label for="playlistName">Playlist Adı</label>
              <input 
                v-model="playlistName" 
                id="playlistName"
                type="text" 
                placeholder="Örn: Cosmic Chill Vibes"
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="playlistDescription">Açıklama</label>
              <textarea 
                v-model="playlistDescription"
                id="playlistDescription"
                placeholder="Bu playlist'i nasıl tanımlarsın?"
                class="form-textarea"
              ></textarea>
            </div>
            <div class="current-songs" v-if="currentSongs.length">
              <h4>Eklenecek Şarkılar ({{ currentSongs.length }})</h4>
              <div class="song-list">
                <div v-for="song in currentSongs" :key="song.id" class="song-item">
                  <span class="song-title">{{ song.title }}</span>
                  <span class="song-artist">{{ song.artist }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click.stop="closeModal" class="cancel-button">İptal</button>
          <button @click.stop="createPlaylist" class="create-button" :disabled="!playlistName.trim()">
            Playlist Oluştur
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  currentSongs: {
    type: Array,
    default: () => []
  },
  currentMood: {
    type: String,
    default: ''
  }
})

const showPlaylistModal = ref(false)
const selectedPlatform = ref(null)
const playlistName = ref('')
const playlistDescription = ref('')

const openSpotify = () => {
  selectedPlatform.value = {
    name: 'Spotify',
    color: '#1DB954',
    url: 'https://open.spotify.com'
  }
  playlistName.value = `Cosmic ${props.currentMood || 'Vibes'} Mix`
  playlistDescription.value = `Moodumun müzik yolculuğu - ${new Date().toLocaleDateString('tr-TR')}`
  showPlaylistModal.value = true
}

const openYouTubeMusic = () => {
  selectedPlatform.value = {
    name: 'YouTube Music',
    color: '#FF0000',
    url: 'https://music.youtube.com'
  }
  playlistName.value = `Galactic ${props.currentMood || 'Journey'} 🚀`
  playlistDescription.value = `Uzaysal müzik koleksiyonum - ${new Date().toLocaleDateString('tr-TR')}`
  showPlaylistModal.value = true
}

const closeModal = () => {
  showPlaylistModal.value = false
  selectedPlatform.value = null
  playlistName.value = ''
  playlistDescription.value = ''
}

const createPlaylist = () => {
  if (!playlistName.value.trim()) return
  
  // Platform seçimi kontrolü
  if (!selectedPlatform.value || !selectedPlatform.value.name) {
    alert('Lütfen önce bir müzik platformu seçin! 🎵')
    return
  }
  
  // Playlist oluşturma simülasyonu
  const playlistData = {
    name: playlistName.value,
    description: playlistDescription.value,
    songs: props.currentSongs,
    platform: selectedPlatform.value.name,
    createdAt: new Date()
  }
  
  // localStorage'a kaydet
  const savedPlaylists = JSON.parse(localStorage.getItem('cosmicPlaylists') || '[]')
  savedPlaylists.push(playlistData)
  localStorage.setItem('cosmicPlaylists', JSON.stringify(savedPlaylists))
  
  // Platform'a yönlendir
  const url = generatePlatformUrl()
  if (url) {
    window.open(url, '_blank')
  }
  
  closeModal()
  
  // Başarı bildirimi (gelecekte toast notification eklenebilir)
  alert(`${selectedPlatform.value?.name || 'Bilinmeyen Platform'} playlist'i oluşturuldu! 🎵`)
}

const generatePlatformUrl = () => {
  // Platform kontrolü
  if (!selectedPlatform.value || !selectedPlatform.value.name) {
    return null
  }

  const songs = props.currentSongs.map(song => `${song.artist} ${song.title}`).join(' ')
  
  switch (selectedPlatform.value.name) {
    case 'Spotify':
      return `https://open.spotify.com/search/${encodeURIComponent(songs.substring(0, 100))}`
    case 'YouTube Music':
      return `https://music.youtube.com/search?q=${encodeURIComponent(songs.substring(0, 100))}`
    default:
      return null
  }
}
</script>

<style scoped>
/* Panel yüksekliği küçültülmüş MusicPlatforms container */
.music-platforms-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem; /* Normal border radius */
  padding: 0.5rem; /* Biraz daha fazla padding */
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: float 6s ease-in-out infinite;
  position: relative;
  z-index: 1;
  max-height: 80px; /* Panel yüksekliği artırıldı */
  overflow: hidden; /* Taşan içerik gizlendi */
}

.platform-title {
  color: white;
  font-size: 0.8rem; /* Okunabilir boyut */
  font-weight: 700;
  margin-bottom: 0.2rem; /* Az margin */
  text-align: center;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

/* Panel yüksekliğine uygun platforms grid */
.platforms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); /* %50 genişletildi: 160px → 240px */
  gap: 0.5rem; /* Daha fazla gap */
  max-width: 100%;
  max-height: 40px; /* Grid yüksekliği artırıldı */
  overflow: hidden;
  justify-content: center; /* Grid içeriğini ortala */
  justify-items: center; /* Grid elemanlarını ortala */
}

/* Panel yüksekliğine uygun platform cards */
.platform-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  border-radius: 0.5rem; /* Normal border radius */
  padding: 0.4rem; /* Daha fazla padding */
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  aspect-ratio: 7.5; /* %50 daha geniş: 5 → 7.5 */
  display: flex;
  flex-direction: row; /* Yan yana düzen */
  align-items: center;
  justify-content: center;
  gap: 0.2rem; /* Daha fazla gap */
  max-height: 35px; /* Kart yüksekliği artırıldı */
  width: 100%; /* Kartın tam genişlik alması */
  max-width: 300px; /* Maximum genişlik sınırı */
  margin: 0 auto; /* Kartı ortala */
}

.platform-card:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Panel boyutuna uygun icon ve logo */
.platform-logo {
  width: 1.5rem; /* Daha büyük boyut */
  height: 1.5rem; /* Daha büyük boyut */
  flex-shrink: 0;
}

.platform-icon {
  font-size: 1.2rem; /* Daha büyük boyut */
  opacity: 0.8;
}

.spotify-card .platform-logo {
  background: rgba(29, 185, 84, 0.2);
  border: 1px solid rgba(29, 185, 84, 0.3);
}

.spotify-card:hover .platform-logo {
  background: rgba(29, 185, 84, 0.3);
  box-shadow: 0 4px 20px rgba(29, 185, 84, 0.2);
}

.youtube-card .platform-logo {
  background: rgba(255, 0, 0, 0.2);
  border: 1px solid rgba(255, 0, 0, 0.3);
}

.youtube-card:hover .platform-logo {
  background: rgba(255, 0, 0, 0.3);
  box-shadow: 0 4px 20px rgba(255, 0, 0, 0.2);
}

.platform-info {
  text-align: center;
}

.platform-info h4 {
  color: white;
  font-weight: 600;
  font-size: 0.8rem; /* Daha büyük ve okunabilir */
  margin-bottom: 0.1rem; /* Biraz margin */
}

.platform-info p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.7rem; /* Daha büyük ve okunabilir */
}

/* Modal Styles */
.playlist-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.playlist-modal {
  background: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 28rem;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  position: relative;
  z-index: 10000;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  color: white;
  font-size: 1.125rem;
  font-weight: 700;
}

.close-button {
  color: rgba(255, 255, 255, 0.6);
  background: none;
  border: none;
  font-size: 1.5rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 10001;
  pointer-events: auto;
}

.close-button:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.modal-content {
  padding: 1.5rem;
  max-height: 50vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-input, .form-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: white;
  transition: all 0.3s ease;
  position: relative;
  z-index: 10001;
  pointer-events: auto;
}

.form-input::placeholder, .form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.form-textarea {
  resize: none;
  height: 6rem;
}

.current-songs {
  margin-top: 1.5rem;
}

.current-songs h4 {
  color: white;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.song-list {
  max-height: 8rem;
  overflow-y: auto;
}

.song-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
}

.song-title {
  display: block;
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
}

.song-artist {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-button {
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;
  z-index: 10001;
  pointer-events: auto;
}

.cancel-button:hover {
  color: white;
}

.create-button {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #9333ea, #3b82f6);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 10001;
  pointer-events: auto;
}

.create-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #7c3aed, #2563eb);
}

.create-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

/* Scrollbar */
.modal-content::-webkit-scrollbar,
.song-list::-webkit-scrollbar {
  width: 4px;
}

.modal-content::-webkit-scrollbar-track,
.song-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.modal-content::-webkit-scrollbar-thumb,
.song-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.modal-content::-webkit-scrollbar-thumb:hover,
.song-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
