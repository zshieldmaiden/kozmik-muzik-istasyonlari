/**
 * Spotify API Entegrasyonu
 * 
 * Bu dosya Spotify Web API ile entegrasyon sağlar.
 * Kullanıcı authentication'ı, müzik arama, playlist oluşturma ve 
 * şarkı önerilerini içerir.
 */

// Spotify Web API İstemcisi
const SPOTIFY_CONFIG = {
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'YOUR_SPOTIFY_CLIENT_ID',
  clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || 'YOUR_SPOTIFY_CLIENT_SECRET', 
  redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:5176/callback',
  scopes: 'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state playlist-read-private playlist-modify-public playlist-modify-private user-top-read'
}

// NOT: .env dosyasına gerçek API key'lerinizi ekleyin!

// API Yapılandırma Kontrolü
export function isConfigured() {
  return Promise.resolve(
    SPOTIFY_CONFIG.clientId && 
    SPOTIFY_CONFIG.clientSecret && 
    SPOTIFY_CONFIG.clientId.length > 0 && 
    SPOTIFY_CONFIG.clientSecret.length > 0
  )
}

// Access token için state
let accessToken = null
let tokenExpiration = null

/**
 * Spotify yetkilendirme URL'si oluştur
 */
export function getSpotifyAuthUrl() {
  const params = new URLSearchParams({
    cae78479: SPOTIFY_CONFIG.clientId,
    response_type: 'code',
    redirect_uri: SPOTIFY_CONFIG.redirectUri,
    scope: SPOTIFY_CONFIG.scopes,
    state: generateRandomString(16),
    show_dialog: true
  })
  
  return `https://accounts.spotify.com/authorize?${params.toString()}`
}

/**
 * Rastgele string oluşturucu (state için)
 */
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let text = ''
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  
  return text
}

/**
 * Authorization code ile access token al
 */
export async function getAccessToken(authorizationCode) {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${SPOTIFY_CONFIG.clientId}:${SPOTIFY_CONFIG.clientSecret}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: SPOTIFY_CONFIG.redirectUri
      })
    })
    
    if (!response.ok) {
      throw new Error('Token alınamadı')
    }
    
    const data = await response.json()
    
    accessToken = data.access_token
    tokenExpiration = Date.now() + (data.expires_in * 1000)
    
    // Token'ı localStorage'a kaydet
    localStorage.setItem('spotify_access_token', accessToken)
    localStorage.setItem('spotify_token_expiration', tokenExpiration.toString())
    
    return data
  } catch (error) {
    console.error('Spotify token hatası:', error)
    throw error
  }
}

/**
 * Mevcut access token'ın geçerliliğini kontrol et
 */
export function isTokenValid() {
  if (!accessToken && localStorage.getItem('spotify_access_token')) {
    accessToken = localStorage.getItem('spotify_access_token')
    tokenExpiration = parseInt(localStorage.getItem('spotify_token_expiration'))
  }
  
  return accessToken && tokenExpiration && Date.now() < tokenExpiration
}

/**
 * Spotify API ile şarkı ara
 */
export async function searchTracks(query, limit = 20) {
  if (!isTokenValid()) {
    throw new Error('Spotify token geçersiz. Lütfen tekrar giriş yapın.')
  }
  
  try {
    const params = new URLSearchParams({
      q: query,
      type: 'track',
      limit: limit.toString(),
      market: 'TR' // Türkiye pazarı
    })
    
    const response = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Arama başarısız')
    }
    
    const data = await response.json()
    return data.tracks.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      imageUrl: track.album.images[0]?.url,
      previewUrl: track.preview_url,
      spotifyUrl: track.external_urls.spotify,
      duration: track.duration_ms,
      popularity: track.popularity,
      explicit: track.explicit
    }))
  } catch (error) {
    console.error('Spotify arama hatası:', error)
    throw error
  }
}

/**
 * Kullanıcının top şarkılarını al
 */
export async function getUserTopTracks(timeRange = 'medium_term', limit = 20) {
  if (!isTokenValid()) {
    throw new Error('Spotify token geçersiz. Lütfen tekrar giriş yapın.')
  }
  
  try {
    const params = new URLSearchParams({
      time_range: timeRange, // short_term, medium_term, long_term
      limit: limit.toString()
    })
    
    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Top şarkılar alınamadı')
    }
    
    const data = await response.json()
    return data.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      imageUrl: track.album.images[0]?.url,
      spotifyUrl: track.external_urls.spotify,
      popularity: track.popularity
    }))
  } catch (error) {
    console.error('Top şarkılar hatası:', error)
    throw error
  }
}

/**
 * Önerilen şarkıları al (seed bazlı)
 */
export async function getRecommendations(seedTracks = [], seedArtists = [], seedGenres = [], options = {}) {
  if (!isTokenValid()) {
    throw new Error('Spotify token geçersiz. Lütfen tekrar giriş yapın.')
  }
  
  try {
    const params = new URLSearchParams({
      limit: (options.limit || 20).toString(),
      market: 'TR'
    })
    
    if (seedTracks.length > 0) {
      params.append('seed_tracks', seedTracks.slice(0, 5).join(','))
    }
    if (seedArtists.length > 0) {
      params.append('seed_artists', seedArtists.slice(0, 5).join(','))
    }
    if (seedGenres.length > 0) {
      params.append('seed_genres', seedGenres.slice(0, 5).join(','))
    }
    
    // Audio features parametreleri
    if (options.targetValence !== undefined) {
      params.append('target_valence', options.targetValence.toString())
    }
    if (options.targetEnergy !== undefined) {
      params.append('target_energy', options.targetEnergy.toString())
    }
    if (options.targetDanceability !== undefined) {
      params.append('target_danceability', options.targetDanceability.toString())
    }
    
    const response = await fetch(`https://api.spotify.com/v1/recommendations?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Öneriler alınamadı')
    }
    
    const data = await response.json()
    return data.tracks.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      imageUrl: track.album.images[0]?.url,
      previewUrl: track.preview_url,
      spotifyUrl: track.external_urls.spotify,
      popularity: track.popularity
    }))
  } catch (error) {
    console.error('Öneriler hatası:', error)
    throw error
  }
}

/**
 * Playlist oluştur
 */
export async function createPlaylist(name, description = '', isPublic = true) {
  if (!isTokenValid()) {
    throw new Error('Spotify token geçersiz. Lütfen tekrar giriş yapın.')
  }
  
  try {
    // Önce kullanıcı bilgilerini al
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    if (!userResponse.ok) {
      throw new Error('Kullanıcı bilgileri alınamadı')
    }
    
    const userData = await userResponse.json()
    
    // Playlist oluştur
    const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        description,
        public: isPublic
      })
    })
    
    if (!playlistResponse.ok) {
      throw new Error('Playlist oluşturulamadı')
    }
    
    const playlistData = await playlistResponse.json()
    return {
      id: playlistData.id,
      name: playlistData.name,
      description: playlistData.description,
      url: playlistData.external_urls.spotify,
      imageUrl: playlistData.images[0]?.url
    }
  } catch (error) {
    console.error('Playlist oluşturma hatası:', error)
    throw error
  }
}

/**
 * Playlist'e şarkı ekle
 */
export async function addTracksToPlaylist(playlistId, trackUris) {
  if (!isTokenValid()) {
    throw new Error('Spotify token geçersiz. Lütfen tekrar giriş yapın.')
  }
  
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: trackUris
      })
    })
    
    if (!response.ok) {
      throw new Error('Şarkılar playlist\'e eklenemedi')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Şarkı ekleme hatası:', error)
    throw error
  }
}

/**
 * Ruh haline göre özel öneriler al
 */
export async function getRecommendationsByMood(mood, limit = 20) {
  const moodToAudioFeatures = {
    happy: { valence: 0.8, energy: 0.7, danceability: 0.6 },
    sad: { valence: 0.2, energy: 0.3, danceability: 0.4 },
    energetic: { valence: 0.7, energy: 0.9, danceability: 0.8 },
    relaxed: { valence: 0.5, energy: 0.3, danceability: 0.4 },
    romantic: { valence: 0.6, energy: 0.4, danceability: 0.5 },
    nostalgic: { valence: 0.4, energy: 0.4, danceability: 0.5 },
    excited: { valence: 0.9, energy: 0.8, danceability: 0.7 },
    peaceful: { valence: 0.6, energy: 0.2, danceability: 0.3 }
  }
  
  const features = moodToAudioFeatures[mood] || moodToAudioFeatures.happy
  
  try {
    return await getRecommendations([], [], [], {
      limit,
      targetValence: features.valence,
      targetEnergy: features.energy,
      targetDanceability: features.danceability
    })
  } catch (error) {
    console.error('Mood bazlı öneriler hatası:', error)
    throw error
  }
}

/**
 * Logout - token'ları temizle
 */
export function logout() {
  accessToken = null
  tokenExpiration = null
  localStorage.removeItem('spotify_access_token')
  localStorage.removeItem('spotify_token_expiration')
}

/**
 * Kullanıcı bilgilerini al
 */
export async function getUserProfile() {
  if (!isTokenValid()) {
    throw new Error('Spotify token geçersiz. Lütfen tekrar giriş yapın.')
  }
  
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Kullanıcı profili alınamadı')
    }
    
    const data = await response.json()
    return {
      id: data.id,
      name: data.display_name,
      email: data.email,
      imageUrl: data.images[0]?.url,
      followers: data.followers.total,
      country: data.country
    }
  } catch (error) {
    console.error('Kullanıcı profili hatası:', error)
    throw error
  }
}
