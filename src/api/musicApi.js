import axios from 'axios';
import { stations } from '../data/stations.js';
import { searchOfflineMusic, getWeatherBasedRecommendations } from '../data/offlineData.js';

const API_BASE_URL = 'http://localhost:8790/api';

// Axios instance for external APIs
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Static fallback data
const FALLBACK_DATA = {
  stations: stations,
  moods: [
    { id: 'happy', name: 'Mutlu', color: '#FFD700' },
    { id: 'sad', name: 'Hüzünlü', color: '#4169E1' },
    { id: 'energetic', name: 'Enerjik', color: '#FF4500' },
    { id: 'calm', name: 'Sakin', color: '#32CD32' },
    { id: 'romantic', name: 'Romantik', color: '#FF69B4' },
    { id: 'dark', name: 'Karanlık', color: '#2F4F4F' },
    { id: 'adventurous', name: 'Maceracı', color: '#FF8C00' },
    { id: 'nostalgic', name: 'Nostaljik', color: '#DDA0DD' }
  ],
  genres: [
    { id: 'pop', name: 'Pop', color: '#FF6B6B' },
    { id: 'rock', name: 'Rock', color: '#4ECDC4' },
    { id: 'jazz', name: 'Jazz', color: '#45B7D1' },
    { id: 'electronic', name: 'Electronic', color: '#96CEB4' },
    { id: 'classical', name: 'Klasik', color: '#FFEAA7' },
    { id: 'ambient', name: 'Ambient', color: '#DDA0DD' },
    { id: 'world', name: 'Dünya Müziği', color: '#FD79A8' },
    { id: 'experimental', name: 'Deneysel', color: '#6C5CE7' }
  ]
};

// API client sınıfı
export class MusicApiClient {
  
  // Tüm şarkıları getir
  static async getAllSongs() {
    try {
      const response = await api.get('/songs');
      return response.data;
    } catch (error) {
      console.error('Şarkılar alınırken hata:', error);
      throw error;
    }
  }

  // İstasyona göre şarkıları getir
  static async getSongsByStation(stationId) {
    try {
      const response = await api.get(`/songs/station/${stationId}`);
      return response.data;
    } catch (error) {
      console.error(`${stationId} istasyonu şarkıları alınırken hata:`, error);
      throw error;
    }
  }

  // Mood'a göre şarkıları getir
  static async getSongsByMood(mood) {
    try {
      const response = await api.get(`/songs/mood/${mood}`);
      return response.data;
    } catch (error) {
      console.error(`${mood} mood şarkıları alınırken hata:`, error);
      throw error;
    }
  }

  // Genre'ye göre şarkıları getir
  static async getSongsByGenre(genre) {
    try {
      const response = await api.get(`/songs/genre/${genre}`);
      return response.data;
    } catch (error) {
      console.error(`${genre} genre şarkıları alınırken hata:`, error);
      throw error;
    }
  }

  // Hava durumuna göre şarkıları getir
  static async getSongsByWeather(weather) {
    try {
      const response = await api.get(`/songs/weather/${weather}`);
      return response.data;
    } catch (error) {
      console.error(`${weather} hava durumu şarkıları alınırken hata:`, error);
      throw error;
    }
  }

  // Rastgele şarkılar getir
  static async getRandomSongs(limit = 10, filters = {}) {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit);
      
      if (filters.station) params.append('station', filters.station);
      if (filters.mood) params.append('mood', filters.mood);
      if (filters.genre) params.append('genre', filters.genre);
      
      const response = await api.get(`/songs/random?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Rastgele şarkılar alınırken hata:', error);
      throw error;
    }
  }

  // Şarkı ara - Offline fallback ile
  static async searchSongs(searchTerm, filters = {}) {
    try {
      const response = await api.get(`/songs/search/${encodeURIComponent(searchTerm)}`);
      return { data: response.data, source: 'api' };
    } catch (error) {
      console.log('Local server mevcut değil, offline arama kullanılıyor');
      // Offline search kullan
      const criteria = {
        searchTerm,
        ...filters
      };
      const results = searchOfflineMusic(criteria);
      return { data: results, source: 'offline' };
    }
  }

  // Gelişmiş arama - Filtreler ile
  static async advancedSearch(criteria) {
    try {
      const response = await api.post('/songs/advanced-search', criteria);
      return { data: response.data, source: 'api' };
    } catch (error) {
      console.log('Local server mevcut değil, offline gelişmiş arama kullanılıyor');
      const results = searchOfflineMusic(criteria);
      return { data: results, source: 'offline' };
    }
  }

  // Yeni şarkı ekle
  static async addSong(songData) {
    try {
      const response = await api.post('/songs', songData);
      return response.data;
    } catch (error) {
      console.error('Şarkı eklenirken hata:', error);
      throw error;
    }
  }

  // Birden fazla şarkı ekle
  static async addMultipleSongs(songs) {
    try {
      const results = [];
      for (const song of songs) {
        const result = await this.addSong(song);
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error('Şarkılar eklenirken hata:', error);
      throw error;
    }
  }

  // Tüm istasyonları getir - Static data kullan
  static async getAllStations() {
    try {
      // İlk olarak local server'ı dene
      const response = await api.get('/stations');
      return { data: response.data, source: 'api' };
    } catch (error) {
      // Local server mevcut değil, static data kullanılıyor (offline mode)
      console.debug('🔧 API offline, fallback mode aktif');
      // Fallback olarak static data kullan
      return { data: FALLBACK_DATA.stations, source: 'static' };
    }
  }

  // Tüm mood'ları getir - Static data kullan
  static async getAllMoods() {
    try {
      const response = await api.get('/moods');
      return { data: response.data, source: 'api' };
    } catch (error) {
      console.debug('🔧 Mood API offline, fallback mode aktif');
      return { data: FALLBACK_DATA.moods, source: 'static' };
    }
  }

  // Tüm genre'leri getir - Static data kullan
  static async getAllGenres() {
    try {
      const response = await api.get('/genres');
      return { data: response.data, source: 'api' };
    } catch (error) {
      console.debug('🔧 Genre API offline, fallback mode aktif');
      return { data: FALLBACK_DATA.genres, source: 'static' };
    }
  }

  // Veritabanı istatistikleri getir - Graceful degradation
  static async getStats() {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.log('Local server mevcut değil, mock stats döndürülüyor');
      return {
        totalSongs: 1000,
        totalStations: FALLBACK_DATA.stations.length,
        totalMoods: FALLBACK_DATA.moods.length,
        totalGenres: FALLBACK_DATA.genres.length,
        lastUpdated: new Date().toISOString(),
        source: 'mock'
      };
    }
  }

  // Playlist'i veritabanına kaydet
  static async savePlaylist(playlistData) {
    try {
      const results = [];
      
      // Her şarkı için unique ID oluştur ve veritabanına ekle
      for (const song of playlistData.songs) {
        const songWithId = {
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: song.title || 'Bilinmeyen Şarkı',
          artist: song.artist || 'Bilinmeyen Sanatçı',
          genre: song.genre || 'pop',
          year: song.year || new Date().getFullYear(),
          spotifyQuery: `${song.title} ${song.artist}`.trim(),
          popularity: song.popularity || 5,
          stations: playlistData.stations || ['earth'],
          moods: playlistData.moods || ['happy'],
          weather: {
            conditions: playlistData.weather || ['clear'],
            tempRange: [15, 30]
          }
        };
        
        const result = await this.addSong(songWithId);
        results.push(result);
      }
      
      return {
        success: true,
        message: `${results.length} şarkı başarıyla veritabanına kaydedildi`,
        data: results
      };
    } catch (error) {
      console.error('Playlist kaydedilirken hata:', error);
      throw error;
    }
  }

  // API sunucusunun çalışıp çalışmadığını kontrol et
  static async checkHealth() {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('API sağlık kontrolü başarısız:', error);
      throw error;
    }
  }
}

export default MusicApiClient;
