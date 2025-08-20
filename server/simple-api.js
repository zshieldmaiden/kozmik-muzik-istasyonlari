import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8790;

// CORS ayarları - localhost:5175'ten gelen isteklere izin ver
app.use(cors({
  origin: ['http://localhost:5175', 'http://localhost:5174', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Mock veri - gerçek veritabanı yerine
const mockStations = [
  { id: 1, name: '🌟 KUASAR', description: 'Enerji dolu müzikler' },
  { id: 2, name: '🌍 DÜNYA', description: 'Popüler hit şarkılar' },
  { id: 3, name: '💖 VENÜS', description: 'Romantik müzikler' },
  { id: 4, name: '🔴 MARS', description: 'Rock ve metal' }
];

const mockMoods = [
  { id: 1, name: 'enerjik' },
  { id: 2, name: 'sakin' },
  { id: 3, name: 'romantik' },
  { id: 4, name: 'melankolik' }
];

const mockGenres = [
  { id: 1, name: 'Pop' },
  { id: 2, name: 'Rock' },
  { id: 3, name: 'Electronic' },
  { id: 4, name: 'Classical' }
];

const mockSongs = [
  {
    id: 1,
    title: 'Cosmic Dreams',
    artist: 'Space Orchestra',
    genre: 'Electronic',
    mood: 'enerjik',
    station_id: 1,
    url: 'https://example.com/song1.mp3'
  },
  {
    id: 2,
    title: 'Venus Love',
    artist: 'Romantic Stars',
    genre: 'Pop',
    mood: 'romantik',
    station_id: 3,
    url: 'https://example.com/song2.mp3'
  }
];

// API Routes
app.get('/api', (req, res) => {
  res.json({
    name: 'Kozmik Müzik API - Simple Mode',
    version: '1.0.0',
    status: 'active'
  });
});

app.get('/api/stations', (req, res) => {
  console.log('📡 Stations endpoint çağrıldı');
  res.json({
    success: true,
    count: mockStations.length,
    data: mockStations
  });
});

app.get('/api/moods', (req, res) => {
  console.log('😊 Moods endpoint çağrıldı');
  res.json({
    success: true,
    count: mockMoods.length,
    data: mockMoods
  });
});

app.get('/api/genres', (req, res) => {
  console.log('🎵 Genres endpoint çağrıldı');
  res.json({
    success: true,
    count: mockGenres.length,
    data: mockGenres
  });
});

app.get('/api/songs/advanced-search', (req, res) => {
  console.log('🔍 Advanced search endpoint çağrıldı');
  res.json({
    success: true,
    count: mockSongs.length,
    data: mockSongs
  });
});

app.get('/api/songs', (req, res) => {
  console.log('🎶 Songs endpoint çağrıldı');
  res.json({
    success: true,
    count: mockSongs.length,
    data: mockSongs
  });
});

// Şarkı ekleme endpoint'i
app.post('/api/songs', (req, res) => {
  console.log('➕ Yeni şarkı ekleniyor:', req.body);
  
  const newSong = {
    id: Date.now(), // Basit ID oluştur
    ...req.body,
    created_at: new Date().toISOString()
  };
  
  // Mock array'e ekle
  mockSongs.push(newSong);
  
  res.json({
    success: true,
    message: 'Şarkı başarıyla eklendi',
    data: newSong
  });
});

// Birden fazla şarkı ekleme endpoint'i
app.post('/api/songs/batch', (req, res) => {
  console.log('➕ Birden fazla şarkı ekleniyor:', req.body.length);
  
  const songs = req.body.songs || req.body;
  const addedSongs = [];
  
  songs.forEach(songData => {
    const newSong = {
      id: Date.now() + Math.random(), // Benzersiz ID
      ...songData,
      created_at: new Date().toISOString()
    };
    mockSongs.push(newSong);
    addedSongs.push(newSong);
  });
  
  res.json({
    success: true,
    message: `${addedSongs.length} şarkı başarıyla eklendi`,
    data: addedSongs
  });
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🎵 Basit Kozmik Müzik API http://localhost:${PORT} adresinde çalışıyor`);
  console.log(`📡 CORS aktif - Frontend: http://localhost:5175`);
});
