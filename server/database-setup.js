import Database from 'better-sqlite3';
import { musicDatabase } from '../src/data/musicDatabase.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Veritabanı dosyasının yolu
const dbPath = join(__dirname, 'music.db');

console.log('🎵 Kozmik Müzik Veritabanı Kurulumu Başlıyor...');

// Veritabanı bağlantısı
const db = new Database(dbPath);

// Veritabanı tablolarını oluştur
function createTables() {
  console.log('📋 Tablolar oluşturuluyor...');
  
  // Songs tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS songs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      genre TEXT NOT NULL,
      year INTEGER,
      spotify_query TEXT,
      popularity INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Stations tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS stations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      display_name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Moods tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS moods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `);

  // Weather conditions tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS weather_conditions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      condition TEXT UNIQUE NOT NULL
    )
  `);

  // İlişki tabloları
  db.exec(`
    CREATE TABLE IF NOT EXISTS song_stations (
      song_id TEXT,
      station_id TEXT,
      PRIMARY KEY (song_id, station_id),
      FOREIGN KEY (song_id) REFERENCES songs(id),
      FOREIGN KEY (station_id) REFERENCES stations(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS song_moods (
      song_id TEXT,
      mood_id INTEGER,
      PRIMARY KEY (song_id, mood_id),
      FOREIGN KEY (song_id) REFERENCES songs(id),
      FOREIGN KEY (mood_id) REFERENCES moods(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS song_weather (
      song_id TEXT,
      weather_id INTEGER,
      temp_min REAL,
      temp_max REAL,
      PRIMARY KEY (song_id, weather_id),
      FOREIGN KEY (song_id) REFERENCES songs(id),
      FOREIGN KEY (weather_id) REFERENCES weather_conditions(id)
    )
  `);

  console.log('✅ Tablolar başarıyla oluşturuldu!');
}

// Stations verilerini ekle
function insertStations() {
  console.log('🚀 İstasyonlar ekleniyor...');
  
  const stations = [
    { id: 'earth', name: 'earth', display_name: 'Dünya İstasyonu', description: 'Neşeli ve tanıdık şarkılar' },
    { id: 'mars', name: 'mars', display_name: 'Mars İstasyonu', description: 'Uzay ve gelecek temalı müzikler' },
    { id: 'venus', name: 'venus', display_name: 'Venüs İstasyonu', description: 'Romantik ve duygusal şarkılar' },
    { id: 'jupiter', name: 'jupiter', display_name: 'Jüpiter İstasyonu', description: 'Klasik ve epik müzikler' },
    { id: 'sun', name: 'sun', display_name: 'Güneş İstasyonu', description: 'Parlak ve enerjik şarkılar' },
    { id: 'neptune', name: 'neptune', display_name: 'Neptün İstasyonu', description: 'Sakin ve meditatif müzikler' },
    { id: 'milkyway', name: 'milkyway', display_name: 'Samanyolu İstasyonu', description: 'Synthwave ve nostaljik' },
    { id: 'andromeda', name: 'andromeda', display_name: 'Andromeda İstasyonu', description: 'Deneysel ve kozmik' },
    { id: 'blackhole', name: 'blackhole', display_name: 'Kara Delik İstasyonu', description: 'Melankolik ve derin' },
    { id: 'quasar', name: 'quasar', display_name: 'Kuasar İstasyonu', description: 'Yüksek enerjili elektronik' }
  ];

  const insertStation = db.prepare(`
    INSERT OR REPLACE INTO stations (id, name, display_name, description)
    VALUES (?, ?, ?, ?)
  `);

  for (const station of stations) {
    insertStation.run(station.id, station.name, station.display_name, station.description);
  }

  console.log(`✅ ${stations.length} istasyon eklendi!`);
}

// Moods ve weather conditions'ları ekle
function insertMoodsAndWeather() {
  console.log('🎭 Moodlar ve hava durumları ekleniyor...');
  
  // Unique mood'ları topla
  const moodsSet = new Set();
  const weatherSet = new Set();
  
  musicDatabase.forEach(song => {
    song.moods.forEach(mood => moodsSet.add(mood));
    song.weather.conditions.forEach(condition => weatherSet.add(condition));
  });

  const insertMood = db.prepare('INSERT OR IGNORE INTO moods (name) VALUES (?)');
  const insertWeather = db.prepare('INSERT OR IGNORE INTO weather_conditions (condition) VALUES (?)');

  moodsSet.forEach(mood => insertMood.run(mood));
  weatherSet.forEach(condition => insertWeather.run(condition));

  console.log(`✅ ${moodsSet.size} mood ve ${weatherSet.size} hava durumu eklendi!`);
}

// Şarkıları ve ilişkilerini ekle
function insertSongs() {
  console.log('🎵 Şarkılar ekleniyor...');

  const insertSong = db.prepare(`
    INSERT OR REPLACE INTO songs (id, title, artist, genre, year, spotify_query, popularity)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertSongStation = db.prepare(`
    INSERT OR REPLACE INTO song_stations (song_id, station_id) VALUES (?, ?)
  `);

  const insertSongMood = db.prepare(`
    INSERT OR REPLACE INTO song_moods (song_id, mood_id) VALUES (?, ?)
  `);

  const insertSongWeather = db.prepare(`
    INSERT OR REPLACE INTO song_weather (song_id, weather_id, temp_min, temp_max) VALUES (?, ?, ?, ?)
  `);

  // Helper queries
  const getMoodId = db.prepare('SELECT id FROM moods WHERE name = ?');
  const getWeatherId = db.prepare('SELECT id FROM weather_conditions WHERE condition = ?');

  for (const song of musicDatabase) {
    // Şarkıyı ekle
    insertSong.run(
      song.id,
      song.title,
      song.artist,
      song.genre,
      song.year,
      song.spotifyQuery,
      song.popularity
    );

    // Stations ilişkisi
    song.stations.forEach(station => {
      insertSongStation.run(song.id, station);
    });

    // Moods ilişkisi
    song.moods.forEach(mood => {
      const moodResult = getMoodId.get(mood);
      if (moodResult) {
        insertSongMood.run(song.id, moodResult.id);
      }
    });

    // Weather ilişkisi
    song.weather.conditions.forEach(condition => {
      const weatherResult = getWeatherId.get(condition);
      if (weatherResult) {
        insertSongWeather.run(
          song.id, 
          weatherResult.id, 
          song.weather.tempRange[0], 
          song.weather.tempRange[1]
        );
      }
    });
  }

  console.log(`✅ ${musicDatabase.length} şarkı ve ilişkileri eklendi!`);
}

// İndeks oluştur
function createIndexes() {
  console.log('📇 İndeksler oluşturuluyor...');
  
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_songs_genre ON songs(genre);
    CREATE INDEX IF NOT EXISTS idx_songs_popularity ON songs(popularity);
    CREATE INDEX IF NOT EXISTS idx_song_stations_station ON song_stations(station_id);
    CREATE INDEX IF NOT EXISTS idx_song_moods_mood ON song_moods(mood_id);
    CREATE INDEX IF NOT EXISTS idx_song_weather_weather ON song_weather(weather_id);
  `);

  console.log('✅ İndeksler oluşturuldu!');
}

// Ana kurulum fonksiyonu
function setupDatabase() {
  try {
    createTables();
    insertStations();
    insertMoodsAndWeather();
    insertSongs();
    createIndexes();
    
    console.log('🎉 Veritabanı kurulumu tamamlandı!');
    console.log(`📍 Veritabanı konumu: ${dbPath}`);
    
    // Test sorgusu
    const songCount = db.prepare('SELECT COUNT(*) as count FROM songs').get();
    console.log(`📊 Toplam şarkı sayısı: ${songCount.count}`);
    
  } catch (error) {
    console.error('❌ Veritabanı kurulumunda hata:', error);
  } finally {
    db.close();
  }
}

// Kurulumu başlat
setupDatabase();
