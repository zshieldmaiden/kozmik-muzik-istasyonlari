import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Veritabanı bağlantısı
const dbPath = join(__dirname, 'music.db');
const db = new Database(dbPath);

// Veritabanı servis sınıfı
export class MusicDatabaseService {
  
  // Tüm şarkıları getir
  static getAllSongs() {
    const query = `
      SELECT 
        s.*,
        GROUP_CONCAT(DISTINCT st.station_id) as stations,
        GROUP_CONCAT(DISTINCT m.name) as moods,
        GROUP_CONCAT(DISTINCT wc.condition) as weather_conditions
      FROM songs s
      LEFT JOIN song_stations st ON s.id = st.song_id
      LEFT JOIN song_moods sm ON s.id = sm.song_id
      LEFT JOIN moods m ON sm.mood_id = m.id
      LEFT JOIN song_weather sw ON s.id = sw.song_id
      LEFT JOIN weather_conditions wc ON sw.weather_id = wc.id
      GROUP BY s.id
      ORDER BY s.popularity DESC, s.title
    `;
    
    const rows = db.prepare(query).all();
    return rows.map(this.formatSongRow);
  }

  // İstasyona göre şarkıları getir
  static getSongsByStation(stationId) {
    const query = `
      SELECT 
        s.*,
        GROUP_CONCAT(DISTINCT st.station_id) as stations,
        GROUP_CONCAT(DISTINCT m.name) as moods,
        GROUP_CONCAT(DISTINCT wc.condition) as weather_conditions
      FROM songs s
      JOIN song_stations st ON s.id = st.song_id
      LEFT JOIN song_moods sm ON s.id = sm.song_id
      LEFT JOIN moods m ON sm.mood_id = m.id
      LEFT JOIN song_weather sw ON s.id = sw.song_id
      LEFT JOIN weather_conditions wc ON sw.weather_id = wc.id
      WHERE st.station_id = ?
      GROUP BY s.id
      ORDER BY s.popularity DESC, s.title
    `;
    
    const rows = db.prepare(query).all(stationId);
    return rows.map(this.formatSongRow);
  }

  // Mood'a göre şarkıları getir
  static getSongsByMood(mood) {
    const query = `
      SELECT 
        s.*,
        GROUP_CONCAT(DISTINCT st.station_id) as stations,
        GROUP_CONCAT(DISTINCT m.name) as moods,
        GROUP_CONCAT(DISTINCT wc.condition) as weather_conditions
      FROM songs s
      JOIN song_moods sm ON s.id = sm.song_id
      JOIN moods m ON sm.mood_id = m.id
      LEFT JOIN song_stations st ON s.id = st.song_id
      LEFT JOIN song_weather sw ON s.id = sw.song_id
      LEFT JOIN weather_conditions wc ON sw.weather_id = wc.id
      WHERE m.name = ?
      GROUP BY s.id
      ORDER BY s.popularity DESC, s.title
    `;
    
    const rows = db.prepare(query).all(mood);
    return rows.map(this.formatSongRow);
  }

  // Hava durumuna göre şarkıları getir
  static getSongsByWeather(weatherCondition) {
    const query = `
      SELECT 
        s.*,
        GROUP_CONCAT(DISTINCT st.station_id) as stations,
        GROUP_CONCAT(DISTINCT m.name) as moods,
        GROUP_CONCAT(DISTINCT wc.condition) as weather_conditions
      FROM songs s
      JOIN song_weather sw ON s.id = sw.song_id
      JOIN weather_conditions wc ON sw.weather_id = wc.id
      LEFT JOIN song_stations st ON s.id = st.song_id
      LEFT JOIN song_moods sm ON s.id = sm.song_id
      LEFT JOIN moods m ON sm.mood_id = m.id
      WHERE wc.condition = ?
      GROUP BY s.id
      ORDER BY s.popularity DESC, s.title
    `;
    
    const rows = db.prepare(query).all(weatherCondition);
    return rows.map(this.formatSongRow);
  }

  // Genre'ye göre şarkıları getir
  static getSongsByGenre(genre) {
    const query = `
      SELECT 
        s.*,
        GROUP_CONCAT(DISTINCT st.station_id) as stations,
        GROUP_CONCAT(DISTINCT m.name) as moods,
        GROUP_CONCAT(DISTINCT wc.condition) as weather_conditions
      FROM songs s
      LEFT JOIN song_stations st ON s.id = st.song_id
      LEFT JOIN song_moods sm ON s.id = sm.song_id
      LEFT JOIN moods m ON sm.mood_id = m.id
      LEFT JOIN song_weather sw ON s.id = sw.song_id
      LEFT JOIN weather_conditions wc ON sw.weather_id = wc.id
      WHERE s.genre = ?
      GROUP BY s.id
      ORDER BY s.popularity DESC, s.title
    `;
    
    const rows = db.prepare(query).all(genre);
    return rows.map(this.formatSongRow);
  }

  // Rastgele şarkı getir
  static getRandomSongs(limit = 10, filters = {}) {
    let whereConditions = [];
    let params = [];
    
    if (filters.station) {
      whereConditions.push('st.station_id = ?');
      params.push(filters.station);
    }
    
    if (filters.mood) {
      whereConditions.push('m.name = ?');
      params.push(filters.mood);
    }
    
    if (filters.genre) {
      whereConditions.push('s.genre = ?');
      params.push(filters.genre);
    }

    const whereClause = whereConditions.length > 0 ? 
      `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const query = `
      SELECT 
        s.*,
        GROUP_CONCAT(DISTINCT st.station_id) as stations,
        GROUP_CONCAT(DISTINCT m.name) as moods,
        GROUP_CONCAT(DISTINCT wc.condition) as weather_conditions
      FROM songs s
      LEFT JOIN song_stations st ON s.id = st.song_id
      LEFT JOIN song_moods sm ON s.id = sm.song_id
      LEFT JOIN moods m ON sm.mood_id = m.id
      LEFT JOIN song_weather sw ON s.id = sw.song_id
      LEFT JOIN weather_conditions wc ON sw.weather_id = wc.id
      ${whereClause}
      GROUP BY s.id
      ORDER BY RANDOM()
      LIMIT ?
    `;
    
    params.push(limit);
    const rows = db.prepare(query).all(...params);
    return rows.map(this.formatSongRow);
  }

  // Arama fonksiyonu
  static searchSongs(searchTerm) {
    const query = `
      SELECT 
        s.*,
        GROUP_CONCAT(DISTINCT st.station_id) as stations,
        GROUP_CONCAT(DISTINCT m.name) as moods,
        GROUP_CONCAT(DISTINCT wc.condition) as weather_conditions
      FROM songs s
      LEFT JOIN song_stations st ON s.id = st.song_id
      LEFT JOIN song_moods sm ON s.id = sm.song_id
      LEFT JOIN moods m ON sm.mood_id = m.id
      LEFT JOIN song_weather sw ON s.id = sw.song_id
      LEFT JOIN weather_conditions wc ON sw.weather_id = wc.id
      WHERE s.title LIKE ? OR s.artist LIKE ? OR s.genre LIKE ?
      GROUP BY s.id
      ORDER BY s.popularity DESC, s.title
    `;
    
    const searchPattern = `%${searchTerm}%`;
    const rows = db.prepare(query).all(searchPattern, searchPattern, searchPattern);
    return rows.map(this.formatSongRow);
  }

  // Tüm istasyonları getir
  static getAllStations() {
    const query = `
      SELECT 
        st.*,
        COUNT(ss.song_id) as song_count
      FROM stations st
      LEFT JOIN song_stations ss ON st.id = ss.station_id
      GROUP BY st.id
      ORDER BY st.display_name
    `;
    
    return db.prepare(query).all();
  }

  // Tüm mood'ları getir
  static getAllMoods() {
    const query = `
      SELECT 
        m.*,
        COUNT(sm.song_id) as song_count
      FROM moods m
      LEFT JOIN song_moods sm ON m.id = sm.mood_id
      GROUP BY m.id
      ORDER BY song_count DESC, m.name
    `;
    
    return db.prepare(query).all();
  }

  // Tüm genre'leri getir
  static getAllGenres() {
    const query = `
      SELECT 
        genre,
        COUNT(*) as song_count
      FROM songs
      GROUP BY genre
      ORDER BY song_count DESC, genre
    `;
    
    return db.prepare(query).all();
  }

  // Yeni şarkı ekle
  static addSong(songData) {
    const transaction = db.transaction(() => {
      // Şarkıyı ekle
      const insertSong = db.prepare(`
        INSERT INTO songs (id, title, artist, genre, year, spotify_query, popularity)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      insertSong.run(
        songData.id,
        songData.title,
        songData.artist,
        songData.genre,
        songData.year,
        songData.spotifyQuery,
        songData.popularity || 0
      );

      // İlişkileri ekle
      if (songData.stations) {
        const insertStation = db.prepare('INSERT INTO song_stations (song_id, station_id) VALUES (?, ?)');
        songData.stations.forEach(station => {
          insertStation.run(songData.id, station);
        });
      }

      if (songData.moods) {
        const getMoodId = db.prepare('SELECT id FROM moods WHERE name = ?');
        const insertMood = db.prepare('INSERT INTO song_moods (song_id, mood_id) VALUES (?, ?)');
        
        songData.moods.forEach(mood => {
          const moodResult = getMoodId.get(mood);
          if (moodResult) {
            insertMood.run(songData.id, moodResult.id);
          }
        });
      }
    });

    transaction();
    return { success: true, id: songData.id };
  }

  // Veritabanı istatistikleri
  static getStats() {
    const stats = {
      totalSongs: db.prepare('SELECT COUNT(*) as count FROM songs').get().count,
      totalStations: db.prepare('SELECT COUNT(*) as count FROM stations').get().count,
      totalMoods: db.prepare('SELECT COUNT(*) as count FROM moods').get().count,
      totalGenres: db.prepare('SELECT COUNT(DISTINCT genre) as count FROM songs').get().count,
      popularSongs: db.prepare('SELECT title, artist, popularity FROM songs ORDER BY popularity DESC LIMIT 5').all()
    };
    
    return stats;
  }

  // Satır formatlama yardımcı fonksiyonu
  static formatSongRow(row) {
    return {
      id: row.id,
      title: row.title,
      artist: row.artist,
      genre: row.genre,
      year: row.year,
      spotifyQuery: row.spotify_query,
      popularity: row.popularity,
      stations: row.stations ? row.stations.split(',') : [],
      moods: row.moods ? row.moods.split(',') : [],
      weather: {
        conditions: row.weather_conditions ? row.weather_conditions.split(',') : []
      }
    };
  }

  // Veritabanı bağlantısını kapat
  static close() {
    db.close();
  }
}

export default MusicDatabaseService;
