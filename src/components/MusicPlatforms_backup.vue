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
          <button @click="closeModal" class="close-button">×</button>
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
          <button @click="closeModal" class="cancel-button">İptal</button>
          <button @click="createPlaylist" class="create-button" :disabled="!playlistName.trim()">
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
.music-platforms-container {
  @apply bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20;
  animation: float 6s ease-in-out infinite;
}

.platform-title {
  @apply text-white text-xl font-bold mb-4 text-center;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(135px, 1fr));
  gap: 1.1rem;
  max-width: 100%;
}

  @apply bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/20;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
}

  @apply w-9 h-9 rounded-full flex items-center justify-center;
}

  @apply w-6 h-6 text-white;
}

.spotify-card .platform-logo {
  @apply bg-green-500/20 border border-green-400/30;
}

.spotify-card:hover .platform-logo {
  @apply bg-green-500/30 shadow-lg shadow-green-500/20;
}

.youtube-card .platform-logo {
  @apply bg-red-500/20 border border-red-400/30;
}

.youtube-card:hover .platform-logo {
  @apply bg-red-500/30 shadow-lg shadow-red-500/20;
}

.platform-info {
  @apply text-center;
}

.platform-info h4 {
  @apply text-white font-semibold text-sm mb-1;
}

.platform-info p {
  @apply text-white/70 text-xs;
}

/* Modal Styles */
.playlist-modal-overlay {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4;
}

.playlist-modal {
  @apply bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/20 max-w-md w-full max-h-[90vh] overflow-hidden;
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-white/10;
}

.modal-header h3 {
  @apply text-white text-lg font-bold;
}

.close-button {
  @apply text-white/60 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors;
}

.modal-content {
  @apply p-6 max-h-[50vh] overflow-y-auto;
}

.form-group {
  @apply mb-4;
}

.form-group label {
  @apply block text-white text-sm font-medium mb-2;
}

.form-input, .form-textarea {
  @apply w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all;
}

.form-textarea {
  @apply resize-none h-24;
}

.current-songs {
  @apply mt-6;
}

.current-songs h4 {
  @apply text-white font-medium mb-3;
}

.song-list {
  @apply space-y-2 max-h-32 overflow-y-auto;
}

.song-item {
  @apply bg-white/5 rounded-lg p-3 border border-white/10;
}

.song-title {
  @apply block text-white font-medium text-sm;
}

.song-artist {
  @apply block text-white/70 text-xs mt-1;
}

.modal-footer {
  @apply flex items-center justify-end gap-3 p-6 border-t border-white/10;
}

.cancel-button {
  @apply px-4 py-2 text-white/70 hover:text-white transition-colors;
}

.create-button {
  @apply px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all;
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
  @apply bg-white/5 rounded;
}

.modal-content::-webkit-scrollbar-thumb,
.song-list::-webkit-scrollbar-thumb {
  @apply bg-white/20 rounded;
}

.modal-content::-webkit-scrollbar-thumb:hover,
.song-list::-webkit-scrollbar-thumb:hover {
  @apply bg-white/30;
}
</style>
