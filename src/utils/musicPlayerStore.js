import { ref, reactive } from 'vue'

// Global müzik player state
export const musicPlayerState = reactive({
  isPlaying: false,
  currentSong: null,
  isWidgetOpen: false,
  autoPlay: false,
  playlist: [],
  currentIndex: 0
})

// Actions
export const musicPlayerActions = {
  // Şarkı çal ve widget'ı aç
  playSong(song, autoPlay = true) {
    console.log('🎵 Global player: Şarkı çalınıyor:', song.title)
    
    musicPlayerState.currentSong = song
    musicPlayerState.autoPlay = autoPlay
    musicPlayerState.isWidgetOpen = true
    
    // Playlist'e ekle (eğer yoksa)
    const exists = musicPlayerState.playlist.find(s => 
      s.title === song.title && s.artist === song.artist
    )
    
    if (!exists) {
      musicPlayerState.playlist.push(song)
      musicPlayerState.currentIndex = musicPlayerState.playlist.length - 1
    } else {
      musicPlayerState.currentIndex = musicPlayerState.playlist.findIndex(s => 
        s.title === song.title && s.artist === song.artist
      )
    }
  },

  // Widget'ı aç/kapat
  toggleWidget() {
    musicPlayerState.isWidgetOpen = !musicPlayerState.isWidgetOpen
    console.log('🎵 Widget toggle:', musicPlayerState.isWidgetOpen ? 'açıldı' : 'kapandı')
  },

  // Widget'ı aç
  openWidget() {
    musicPlayerState.isWidgetOpen = true
  },

  // Widget'ı kapat
  closeWidget() {
    musicPlayerState.isWidgetOpen = false
  },

  // Çalmayı durdur
  stopPlaying() {
    musicPlayerState.isPlaying = false
    musicPlayerState.currentSong = null
  },

  // Playlist'i değiştir
  setPlaylist(songs, startIndex = 0) {
    musicPlayerState.playlist = [...songs]
    musicPlayerState.currentIndex = startIndex
    if (songs.length > 0) {
      musicPlayerState.currentSong = songs[startIndex]
    }
  },

  // Sonraki şarkı
  nextSong() {
    if (musicPlayerState.playlist.length === 0) return
    
    musicPlayerState.currentIndex = (musicPlayerState.currentIndex + 1) % musicPlayerState.playlist.length
    musicPlayerState.currentSong = musicPlayerState.playlist[musicPlayerState.currentIndex]
    musicPlayerState.autoPlay = true
  },

  // Önceki şarkı
  previousSong() {
    if (musicPlayerState.playlist.length === 0) return
    
    musicPlayerState.currentIndex = musicPlayerState.currentIndex === 0 
      ? musicPlayerState.playlist.length - 1 
      : musicPlayerState.currentIndex - 1
    musicPlayerState.currentSong = musicPlayerState.playlist[musicPlayerState.currentIndex]
    musicPlayerState.autoPlay = true
  }
}

// Widget visibility helper
export const showMusicWidget = ref(false)

export function useMusicPlayer() {
  return {
    state: musicPlayerState,
    actions: musicPlayerActions,
    showWidget: showMusicWidget
  }
}
