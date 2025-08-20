import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8790;

// CORS konfigürasyonu - production için
const corsOptions = {
  origin: [
    'http://localhost:5175',
    'http://localhost:5174', 
    'http://localhost:5173',
    'https://kozmik-muzik-istasyonlari.netlify.app',
    'https://your-netlify-domain.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Kozmik Müzik API',
    version: '2.0.0'
  });
});

// =============================================================================
// DATABASE SERVICE (In-Memory with Persistence)
// =============================================================================

class KozmikDatabase {
  constructor() {
    this.songs = [
      {
        id: 1,
        title: 'Cosmic Dreams',
        artist: 'Space Orchestra',
        genre: 'Electronic',
        mood: 'enerjik',
        station_id: 1,
        stations: ['kuasar'],
        moods: ['enerjik'],
        weather: { conditions: ['güneşli'], tempRange: [20, 30] },
        url: 'https://example.com/song1.mp3',
        popularity: 85,
        year: 2024
      },
      {
        id: 2,
        title: 'Venus Love',
        artist: 'Romantic Stars',
        genre: 'Pop',
        mood: 'romantik',
        station_id: 3,
        stations: ['venus'],
        moods: ['romantik'],
        weather: { conditions: ['bulutlu'], tempRange: [15, 25] },
        url: 'https://example.com/song2.mp3',
        popularity: 92,
        year: 2024
      },
      {
        id: 3,
        title: 'Mars Rock Anthem',
        artist: 'Red Planet Band',
        genre: 'Rock',
        mood: 'enerjik',
        station_id: 4,
        stations: ['mars'],
        moods: ['enerjik', 'güçlü'],
        weather: { conditions: ['fırtınalı'], tempRange: [10, 20] },
        url: 'https://example.com/song3.mp3',
        popularity: 78,
        year: 2023
      }
    ];

    this.stations = [
      { id: 1, name: '🌟 KUASAR', description: 'Enerji dolu müzikler', key: 'kuasar' },
      { id: 2, name: '🌍 DÜNYA', description: 'Popüler hit şarkılar', key: 'earth' },
      { id: 3, name: '💖 VENÜS', description: 'Romantik müzikler', key: 'venus' },
      { id: 4, name: '🔴 MARS', description: 'Rock ve metal', key: 'mars' },
      { id: 5, name: '🎭 JÜPİTER', description: 'Orkestra ve klasik', key: 'jupiter' },
      { id: 6, name: '💍 SATÜRN', description: 'Mistik ve ambient', key: 'saturn' },
      { id: 7, name: '🌊 NEPTÜN', description: 'Derin ve sakin', key: 'neptune' },
      { id: 8, name: '🌌 SAMANYOLU', description: 'Karışık türler', key: 'milkyway' }
    ];

    this.moods = [
      { id: 1, name: 'enerjik' },
      { id: 2, name: 'sakin' },
      { id: 3, name: 'romantik' },
      { id: 4, name: 'melankolik' },
      { id: 5, name: 'güçlü' },
      { id: 6, name: 'mutlu' },
      { id: 7, name: 'huzurlu' },
      { id: 8, name: 'nostaljik' }
    ];

    this.genres = [
      { id: 1, name: 'Pop' },
      { id: 2, name: 'Rock' },
      { id: 3, name: 'Electronic' },
      { id: 4, name: 'Classical' },
      { id: 5, name: 'Jazz' },
      { id: 6, name: 'Ambient' },
      { id: 7, name: 'Alternative' },
      { id: 8, name: 'World Music' }
    ];

    this.nextSongId = 100;
  }

  // Şarkı CRUD operasyonları
  getAllSongs() {
    return this.songs;
  }

  getSongById(id) {
    return this.songs.find(song => song.id == id);
  }

  addSong(songData) {
    const newSong = {
      id: this.nextSongId++,
      ...songData,
      created_at: new Date().toISOString(),
      popularity: songData.popularity || Math.floor(Math.random() * 100)
    };
    this.songs.push(newSong);
    return newSong;
  }

  addMultipleSongs(songsArray) {
    const addedSongs = [];
    songsArray.forEach(songData => {
      const newSong = this.addSong(songData);
      addedSongs.push(newSong);
    });
    return addedSongs;
  }

  searchSongs({ station, mood, genre, weather, query, limit = 50 }) {
    let results = [...this.songs];

    if (station) {
      results = results.filter(song => 
        song.stations?.includes(station) || song.station_id == station
      );
    }

    if (mood) {
      results = results.filter(song => 
        song.moods?.includes(mood) || song.mood === mood
      );
    }

    if (genre) {
      results = results.filter(song => 
        song.genre?.toLowerCase().includes(genre.toLowerCase())
      );
    }

    if (weather) {
      results = results.filter(song => 
        song.weather?.conditions?.includes(weather)
      );
    }

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(song => 
        song.title?.toLowerCase().includes(q) ||
        song.artist?.toLowerCase().includes(q) ||
        song.genre?.toLowerCase().includes(q)
      );
    }

    return results.slice(0, limit);
  }

  getRandomSongs(count = 10) {
    const shuffled = [...this.songs].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  getStats() {
    return {
      totalSongs: this.songs.length,
      totalStations: this.stations.length,
      totalMoods: this.moods.length,
      totalGenres: this.genres.length,
      lastUpdated: new Date().toISOString()
    };
  }
}

// =============================================================================
// AI SERVICE (Groq Integration)
// =============================================================================

class GroqAIService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.baseUrl = 'https://api.groq.com/openai/v1';
    this.model = 'llama-3.1-8b-instant';
  }

  async generateMusicRecommendation(prompt, options = {}) {
    if (!this.apiKey) {
      return this.getFallbackRecommendation(prompt);
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Sen bir müzik önerisi uzmanısın. Kozmik temalı müzik istasyonları için şarkı önerileri yapıyorsun. Türkçe yanıt ver.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options.temperature || 0.8,
          max_tokens: options.maxTokens || 1024
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || this.getFallbackRecommendation(prompt);
    } catch (error) {
      console.error('❌ Groq AI error:', error.message);
      return this.getFallbackRecommendation(prompt);
    }
  }

  getFallbackRecommendation(prompt) {
    const fallbacks = [
      '🌌 Kozmik enerjiler müzik önerisi hazırlıyor...\n\n💫 Önerilen Şarkılar:\n1. Daft Punk - One More Time\n2. M83 - Midnight City\n3. Justice - D.A.N.C.E.\n4. The Chemical Brothers - Block Rockin\' Beats\n5. deadmau5 - Ghosts \'n\' Stuff',
      '🚀 Müzik galaksisi taranıyor...\n\n⭐ Kozmik Seçimler:\n1. Röyksopp - Eple\n2. Air - La Femme d\'Argent\n3. Bonobo - Kiara\n4. Thievery Corporation - Lebanese Blonde\n5. Zero 7 - In the Waiting Line',
      '🌟 Harmonia dalgaları analiz ediliyor...\n\n🎵 Mistik Melodiler:\n1. Boards of Canada - Roygbiv\n2. Aphex Twin - Xtal\n3. Brian Eno - An Ending (Ascent)\n4. Sigur Rós - Hoppípolla\n5. Godspeed You! Black Emperor - Storm'
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  async generateAuralisResponse(userText, context = {}) {
    const prompt = `Sen Auralis, kozmik müzik rehberisin! Kullanıcının "${userText}" mesajına göre şu formatta yanıt ver:

🌌 Ruh Hali Analizi: [Tek cümleyle açıkla]
🌟 Seçilen İstasyon: [İstasyon emoji ve adı] - [Neden seçildi?]

💫 Kozmik Müzik Önerileri:
1. [Sanatçı] - [Şarkı] | [Kısa açıklama]
2. [Sanatçı] - [Şarkı] | [Kısa açıklama]
3. [Sanatçı] - [Şarkı] | [Kısa açıklama]
4. [Sanatçı] - [Şarkı] | [Kısa açıklama]
5. [Sanatçı] - [Şarkı] | [Kısa açıklama]

🚀 Kozmik Mesaj: [Motivasyonlu kısa mesaj]

Türkçe yanıt ver!`;

    return await this.generateMusicRecommendation(prompt, { temperature: 0.9 });
  }
}

// =============================================================================
// INITIALIZE SERVICES
// =============================================================================

const db = new KozmikDatabase();
const aiService = new GroqAIService();

// =============================================================================
// API ROUTES
// =============================================================================

// Ana endpoint - API bilgileri
app.get('/api', (req, res) => {
  res.json({
    name: 'Kozmik Müzik API - Production',
    version: '2.0.0',
    description: 'Full-stack müzik platform API (Database + AI)',
    features: ['Database Management', 'AI Music Recommendations', 'Auralis Chat', 'Search & Filter'],
    endpoints: {
      '/api/songs': 'Tüm şarkıları getir',
      '/api/songs/search': 'Şarkı ara (query params)',
      '/api/songs/random': 'Rastgele şarkılar',
      '/api/stations': 'Müzik istasyonları',
      '/api/moods': 'Ruh halleri',
      '/api/genres': 'Müzik türleri',
      '/api/ai/recommendations': 'AI müzik önerileri',
      '/api/ai/auralis': 'Auralis chat',
      '/api/stats': 'Platform istatistikleri'
    },
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// Songs endpoints
app.get('/api/songs', (req, res) => {
  console.log('🎶 Songs endpoint çağrıldı');
  const songs = db.getAllSongs();
  res.json({
    success: true,
    count: songs.length,
    data: songs
  });
});

app.get('/api/songs/search', (req, res) => {
  console.log('🔍 Song search:', req.query);
  const results = db.searchSongs(req.query);
  res.json({
    success: true,
    count: results.length,
    data: results,
    query: req.query
  });
});

app.get('/api/songs/advanced-search', (req, res) => {
  console.log('🔍 Advanced search endpoint çağrıldı');
  const results = db.searchSongs(req.query);
  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

app.get('/api/songs/random', (req, res) => {
  const count = parseInt(req.query.count) || 10;
  const songs = db.getRandomSongs(count);
  res.json({
    success: true,
    count: songs.length,
    data: songs
  });
});

app.post('/api/songs', (req, res) => {
  console.log('➕ Yeni şarkı ekleniyor:', req.body.title || 'No title');
  try {
    const newSong = db.addSong(req.body);
    res.json({
      success: true,
      message: 'Şarkı başarıyla eklendi',
      data: newSong
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/songs/batch', (req, res) => {
  console.log('➕ Batch şarkı ekleme:', req.body.length || 'Unknown count');
  try {
    const songs = req.body.songs || req.body;
    const addedSongs = db.addMultipleSongs(songs);
    res.json({
      success: true,
      message: `${addedSongs.length} şarkı başarıyla eklendi`,
      data: addedSongs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Stations, Moods, Genres
app.get('/api/stations', (req, res) => {
  console.log('📡 Stations endpoint çağrıldı');
  res.json({
    success: true,
    count: db.stations.length,
    data: db.stations
  });
});

app.get('/api/moods', (req, res) => {
  console.log('😊 Moods endpoint çağrıldı');
  res.json({
    success: true,
    count: db.moods.length,
    data: db.moods
  });
});

app.get('/api/genres', (req, res) => {
  console.log('🎵 Genres endpoint çağrıldı');
  res.json({
    success: true,
    count: db.genres.length,
    data: db.genres
  });
});

// AI Endpoints
app.post('/api/ai/recommendations', async (req, res) => {
  console.log('🤖 AI recommendations çağrıldı');
  try {
    const { mood, weather, history, customPrompt } = req.body;
    
    let prompt = customPrompt || `${mood} ruh haline uygun şarkılar öner.`;
    if (weather) prompt += ` Hava durumu: ${weather}.`;
    if (history?.length) prompt += ` Geçmişte önerilen: ${history.join(', ')}.`;
    
    const recommendation = await aiService.generateMusicRecommendation(prompt);
    
    res.json({
      success: true,
      data: {
        recommendation,
        mood,
        weather,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'AI servisinde hata oluştu'
    });
  }
});

app.post('/api/ai/auralis', async (req, res) => {
  console.log('🚀 Auralis chat çağrıldı');
  try {
    const { userText, weather, history } = req.body;
    
    const response = await aiService.generateAuralisResponse(userText, {
      weather,
      history
    });
    
    res.json({
      success: true,
      data: {
        response,
        userText,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Auralis chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Auralis servisinde hata oluştu'
    });
  }
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  const stats = db.getStats();
  res.json({
    success: true,
    data: stats
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint bulunamadı',
    availableEndpoints: '/api'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Sunucu hatası',
    message: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Kozmik Müzik API sunucusu http://0.0.0.0:${PORT} adresinde çalışıyor`);
  console.log(`📊 API dokümantasyonu: http://0.0.0.0:${PORT}/api`);
  console.log(`🤖 AI servis durumu: ${process.env.GROQ_API_KEY ? '✅ Aktif' : '⚠️ Fallback mode'}`);
  console.log(`🗄️ Database: ✅ In-memory (${db.songs.length} şarkı)`);
});
