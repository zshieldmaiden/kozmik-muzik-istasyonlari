import express from 'express';
import cors from 'cors';
import { MusicDatabaseService } from './database-service.js';

const app = express();
const PORT = process.env.PORT || 8790;

// Middleware
app.use(cors());
app.use(express.json());

// Ana endpoint - API bilgileri
app.get('/api', (req, res) => {
  res.json({
    name: 'Kozmik Müzik API',
    version: '1.0.0',
    description: 'SQLite tabanlı müzik veritabanı API\'si',
    endpoints: {
      '/api/songs': 'Tüm şarkıları getir',
      '/api/songs/station/:stationId': 'İstasyona göre şarkıları getir',
      '/api/songs/mood/:mood': 'Mood\'a göre şarkıları getir',
      '/api/songs/genre/:genre': 'Genre\'ye göre şarkıları getir',
      '/api/songs/weather/:weather': 'Hava durumuna göre şarkıları getir',
      '/api/songs/random': 'Rastgele şarkılar getir',
      '/api/songs/search/:term': 'Şarkı ara',
      '/api/stations': 'Tüm istasyonları getir',
      '/api/moods': 'Tüm mood\'ları getir',
      '/api/genres': 'Tüm genre\'leri getir',
      '/api/stats': 'Veritabanı istatistikleri'
    }
  });
});

// Tüm şarkıları getir
app.get('/api/songs', (req, res) => {
  try {
    const songs = MusicDatabaseService.getAllSongs();
    res.json({
      success: true,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// İstasyona göre şarkıları getir
app.get('/api/songs/station/:stationId', (req, res) => {
  try {
    const { stationId } = req.params;
    const songs = MusicDatabaseService.getSongsByStation(stationId);
    res.json({
      success: true,
      station: stationId,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Mood'a göre şarkıları getir
app.get('/api/songs/mood/:mood', (req, res) => {
  try {
    const { mood } = req.params;
    const songs = MusicDatabaseService.getSongsByMood(mood);
    res.json({
      success: true,
      mood: mood,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Genre'ye göre şarkıları getir
app.get('/api/songs/genre/:genre', (req, res) => {
  try {
    const { genre } = req.params;
    const songs = MusicDatabaseService.getSongsByGenre(genre);
    res.json({
      success: true,
      genre: genre,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Hava durumuna göre şarkıları getir
app.get('/api/songs/weather/:weather', (req, res) => {
  try {
    const { weather } = req.params;
    const songs = MusicDatabaseService.getSongsByWeather(weather);
    res.json({
      success: true,
      weather: weather,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rastgele şarkılar getir
app.get('/api/songs/random', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const filters = {};
    
    if (req.query.station) filters.station = req.query.station;
    if (req.query.mood) filters.mood = req.query.mood;
    if (req.query.genre) filters.genre = req.query.genre;
    
    const songs = MusicDatabaseService.getRandomSongs(limit, filters);
    res.json({
      success: true,
      count: songs.length,
      filters: filters,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Şarkı ara
app.get('/api/songs/search/:term', (req, res) => {
  try {
    const { term } = req.params;
    const songs = MusicDatabaseService.searchSongs(term);
    res.json({
      success: true,
      searchTerm: term,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Tüm istasyonları getir
app.get('/api/stations', (req, res) => {
  try {
    const stations = MusicDatabaseService.getAllStations();
    res.json({
      success: true,
      count: stations.length,
      data: stations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Tüm mood'ları getir
app.get('/api/moods', (req, res) => {
  try {
    const moods = MusicDatabaseService.getAllMoods();
    res.json({
      success: true,
      count: moods.length,
      data: moods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Tüm genre'leri getir
app.get('/api/genres', (req, res) => {
  try {
    const genres = MusicDatabaseService.getAllGenres();
    res.json({
      success: true,
      count: genres.length,
      data: genres
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Yeni şarkı ekle
app.post('/api/songs', (req, res) => {
  try {
    const result = MusicDatabaseService.addSong(req.body);
    res.json({
      success: true,
      message: 'Şarkı başarıyla eklendi',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Veritabanı istatistikleri
app.get('/api/stats', (req, res) => {
  try {
    const stats = MusicDatabaseService.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint bulunamadı',
    suggestion: '/api endpoint\'ini ziyaret ederek mevcut endpoint\'leri görebilirsiniz'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('API Hatası:', error);
  res.status(500).json({
    success: false,
    error: 'Sunucu hatası'
  });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`🎵 Kozmik Müzik API sunucusu http://localhost:${PORT} adresinde çalışıyor`);
  console.log(`📊 API dokümantasyonu: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\\n🔌 API sunucusu kapatılıyor...');
  MusicDatabaseService.close();
  process.exit(0);
});
