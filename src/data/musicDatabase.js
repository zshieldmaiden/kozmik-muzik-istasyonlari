/**
 * Kozmik Müzik İstasyonları için Müzik Veritabanı
 * 
 * Bu veritabanı, her durak için özel olarak seçilmiş şarkıları içerir.
 * Şarkılar genre (tür), mood (ruh hali) ve weather (hava durumu) etiketlerine göre sınıflandırılmıştır.
 * 
 * Şarkı özellikleri:
 * - title: Şarkı adı
 * - artist: Sanatçı adı
 * - genre: Şarkının ana türü
 * - year: Yayın yılı
 * - spotifyQuery: Spotify araması için kullanılacak string
 * - moods: Şarkıya uygun ruh halleri dizisi
 * - weather: Şarkıya uygun hava durumları dizisi
 * - station: Hangi kozmik istasyonda bulunduğu (birden fazla istasyonda olabilir)
 * - popularity: Popülerlik puanı (1-10)
 */


// Kozmik istasyon tabanlı yeni müzik veritabanı
// Her şarkı birden fazla istasyona, mood'a ve hava durumuna atanabilir
export const musicDatabase = [
  // DÜNYA İSTASYONU - Earth Station
  {
    id: 'earth-001',
    title: 'Happy',
    artist: 'Pharrell Williams',
    genre: 'pop',
    year: 2013,
    spotifyQuery: 'Happy Pharrell Williams',
    moods: ['happy', 'energetic', 'excited'],
    weather: {
      conditions: ['clear', 'clouds'],
      tempRange: [15, 30]
    },
    stations: ['earth'],
    popularity: 9
  },
  {
    id: 'earth-002',
    title: 'Can\'t Stop the Feeling!',
    artist: 'Justin Timberlake',
    genre: 'pop',
    year: 2016,
    spotifyQuery: 'Can\'t Stop the Feeling Justin Timberlake',
    moods: ['happy', 'energetic', 'excited'],
    weather: {
      conditions: ['clear', 'clouds'],
      tempRange: [15, 30]
    },
    stations: ['earth'],
    popularity: 8
  },
  {
    id: 'earth-003',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    genre: 'funk',
    year: 2014,
    spotifyQuery: 'Uptown Funk Mark Ronson Bruno Mars',
    moods: ['happy', 'energetic', 'excited'],
    weather: {
      conditions: ['clear', 'clouds'],
      tempRange: [15, 30]
    },
    stations: ['earth'],
    popularity: 9
  },
  {
    id: 'earth-004',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    genre: 'pop',
    year: 2017,
    spotifyQuery: 'Shape of You Ed Sheeran',
    moods: ['happy', 'romantic', 'energetic'],
    weather: {
      conditions: ['clear', 'clouds'],
      tempRange: [15, 30]
    },
    stations: ['earth', 'venus'],
    popularity: 10
  },
  {
    id: 'earth-005',
    title: 'Haydi Gel İçelim',
    artist: 'Yüzyüzeyken Konuşuruz',
    genre: 'indie',
    year: 2018,
    spotifyQuery: 'Haydi Gel İçelim Yüzyüzeyken Konuşuruz',
    moods: ['nostalgic', 'relaxed', 'peaceful'],
    weather: {
      conditions: ['clouds', 'rain'],
      tempRange: [10, 20]
    },
    stations: ['earth'],
    popularity: 7
  },
  {
    id: 'earth-006',
    title: 'Dünya Marşı',
    artist: 'Barış Manço',
    genre: 'rock',
    year: 1978,
    spotifyQuery: 'Dünya Marşı Barış Manço',
    moods: ['nostalgic', 'happy', 'peaceful'],
    weather: {
      conditions: ['clear', 'clouds'],
      tempRange: [10, 25]
    },
    stations: ['earth'],
    popularity: 8
  },
  {
    id: 'earth-007',
    title: 'What a Wonderful World',
    artist: 'Louis Armstrong',
    genre: 'jazz',
    year: 1967,
    spotifyQuery: 'What a Wonderful World Louis Armstrong',
    moods: ['peaceful', 'happy', 'relaxed'],
    weather: {
      conditions: ['clear', 'clouds'],
      tempRange: [15, 25]
    },
    stations: ['earth'],
    popularity: 9
  },
  {
    id: 'earth-008',
    title: 'Here Comes the Sun',
    artist: 'The Beatles',
    genre: 'rock',
    year: 1969,
    spotifyQuery: 'Here Comes the Sun The Beatles',
    moods: ['happy', 'peaceful', 'hopeful'],
    weather: {
      conditions: ['clear'],
      tempRange: [20, 30]
    },
    stations: ['earth'],
    popularity: 10
  },

  // MARS İSTASYONU - Mars Station
  {
    id: 'mars-001',
    title: 'Life on Mars?',
    artist: 'David Bowie',
    genre: 'rock',
    year: 1971,
    spotifyQuery: 'Life on Mars David Bowie',
    moods: ['curious', 'mysterious', 'energetic'],
    weather: {
      conditions: ['clear', 'dust'],
      tempRange: [-50, 20]
    },
    stations: ['mars'],
    popularity: 9
  },
  {
    id: 'mars-002',
    title: 'Space Oddity',
    artist: 'David Bowie',
    genre: 'rock',
    year: 1969,
    spotifyQuery: 'Space Oddity David Bowie',
    moods: ['mysterious', 'lonely', 'curious'],
    weather: {
      conditions: ['clear', 'dust'],
      tempRange: [-50, 20]
    },
    stations: ['mars', 'milkyway'],
    popularity: 10
  },
  {
    id: 'mars-003',
    title: 'Rocket Man',
    artist: 'Elton John',
    genre: 'rock',
    year: 1972,
    spotifyQuery: 'Rocket Man Elton John',
    moods: ['lonely', 'nostalgic', 'dreamy'],
    weather: {
      conditions: ['clear', 'dust'],
      tempRange: [-50, 20]
    },
    stations: ['mars'],
    popularity: 9
  },
  {
    id: 'mars-004',
    title: 'Harder Better Faster Stronger',
    artist: 'Daft Punk',
    genre: 'electronic',
    year: 2001,
    spotifyQuery: 'Harder Better Faster Stronger Daft Punk',
    moods: ['energetic', 'robotic', 'futuristic'],
    weather: {
      conditions: ['clear', 'dust'],
      tempRange: [-50, 20]
    },
    stations: ['mars', 'quasar'],
    popularity: 8
  },
  {
    id: 'mars-005',
    title: 'Get Lucky',
    artist: 'Daft Punk ft. Pharrell Williams',
    genre: 'electronic',
    year: 2013,
    spotifyQuery: 'Get Lucky Daft Punk Pharrell Williams',
    moods: ['happy', 'energetic', 'futuristic'],
    weather: {
      conditions: ['clear'],
      tempRange: [-30, 30]
    },
    stations: ['mars'],
    popularity: 9
  },
  {
    id: 'mars-006',
    title: 'One More Time',
    artist: 'Daft Punk',
    genre: 'electronic',
    year: 2000,
    spotifyQuery: 'One More Time Daft Punk',
    moods: ['energetic', 'happy', 'futuristic'],
    weather: {
      conditions: ['clear', 'dust'],
      tempRange: [-50, 20]
    },
    stations: ['mars'],
    popularity: 8
  },

  // VENÜS İSTASYONU - Venus Station
  {
    id: 'venus-001',
    title: 'Venus',
    artist: 'Bananarama',
    genre: 'pop',
    year: 1986,
    spotifyQuery: 'Venus Bananarama',
    moods: ['romantic', 'energetic', 'happy'],
    weather: {
      conditions: ['hot', 'volcanic'],
      tempRange: [400, 500]
    },
    stations: ['venus'],
    popularity: 7
  },
  {
    id: 'venus-002',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    genre: 'pop',
    year: 2017,
    spotifyQuery: 'Perfect Ed Sheeran',
    moods: ['romantic', 'peaceful', 'happy'],
    weather: {
      conditions: ['warm', 'clear'],
      tempRange: [20, 35]
    },
    stations: ['venus'],
    popularity: 10
  },
  {
    id: 'venus-003',
    title: 'All of Me',
    artist: 'John Legend',
    genre: 'soul',
    year: 2013,
    spotifyQuery: 'All of Me John Legend',
    moods: ['romantic', 'peaceful', 'loving'],
    weather: {
      conditions: ['warm', 'clear'],
      tempRange: [15, 30]
    },
    stations: ['venus'],
    popularity: 9
  },
  {
    id: 'venus-004',
    title: 'Thinking Out Loud',
    artist: 'Ed Sheeran',
    genre: 'pop',
    year: 2014,
    spotifyQuery: 'Thinking Out Loud Ed Sheeran',
    moods: ['romantic', 'peaceful', 'loving'],
    weather: {
      conditions: ['warm', 'clear'],
      tempRange: [15, 30]
    },
    stations: ['venus'],
    popularity: 9
  },
  {
    id: 'venus-005',
    title: 'La Vie En Rose',
    artist: 'Édith Piaf',
    genre: 'chanson',
    year: 1947,
    spotifyQuery: 'La Vie En Rose Édith Piaf',
    moods: ['romantic', 'nostalgic', 'dreamy'],
    weather: {
      conditions: ['warm', 'sunset'],
      tempRange: [15, 25]
    },
    stations: ['venus'],
    popularity: 8
  },
  {
    id: 'venus-006',
    title: 'Fly Me to the Moon',
    artist: 'Frank Sinatra',
    genre: 'jazz',
    year: 1964,
    spotifyQuery: 'Fly Me to the Moon Frank Sinatra',
    moods: ['romantic', 'dreamy', 'classy'],
    weather: {
      conditions: ['night', 'clear'],
      tempRange: [10, 25]
    },
    stations: ['venus', 'milkyway'],
    popularity: 10
  },

  // JÜPİTER İSTASYONU - Jupiter Station
  {
    id: 'jupiter-001',
    title: 'Jupiter',
    artist: 'Gustav Holst',
    genre: 'classical',
    year: 1916,
    spotifyQuery: 'Jupiter Gustav Holst The Planets',
    moods: ['majestic', 'powerful', 'inspiring'],
    weather: {
      conditions: ['stormy', 'gaseous'],
      tempRange: [-150, -100]
    },
    stations: ['jupiter'],
    popularity: 8
  },
  {
    id: 'jupiter-002',
    title: 'Also sprach Zarathustra',
    artist: 'Richard Strauss',
    genre: 'classical',
    year: 1896,
    spotifyQuery: 'Also sprach Zarathustra Richard Strauss',
    moods: ['majestic', 'powerful', 'dramatic'],
    weather: {
      conditions: ['stormy', 'dramatic'],
      tempRange: [-150, -100]
    },
    stations: ['jupiter'],
    popularity: 9
  },
  {
    id: 'jupiter-003',
    title: 'Interstellar Main Theme',
    artist: 'Hans Zimmer',
    genre: 'soundtrack',
    year: 2014,
    spotifyQuery: 'Interstellar Main Theme Hans Zimmer',
    moods: ['epic', 'emotional', 'inspiring'],
    weather: {
      conditions: ['stormy', 'cosmic'],
      tempRange: [-150, -100]
    },
    stations: ['jupiter', 'milkyway'],
    popularity: 9
  },
  {
    id: 'jupiter-004',
    title: 'Ode to Joy',
    artist: 'Ludwig van Beethoven',
    genre: 'classical',
    year: 1824,
    spotifyQuery: 'Ode to Joy Beethoven Symphony No. 9',
    moods: ['joyful', 'majestic', 'inspiring'],
    weather: {
      conditions: ['clear', 'majestic'],
      tempRange: [-150, -100]
    },
    stations: ['jupiter'],
    popularity: 10
  },
  {
    id: 'jupiter-005',
    title: 'Imperial March',
    artist: 'John Williams',
    genre: 'soundtrack',
    year: 1980,
    spotifyQuery: 'Imperial March John Williams Star Wars',
    moods: ['powerful', 'dramatic', 'dark'],
    weather: {
      conditions: ['stormy', 'dramatic'],
      tempRange: [-150, -100]
    },
    stations: ['jupiter', 'blackhole'],
    popularity: 9
  },

  // GÜNEŞ İSTASYONU - Sun Station
  {
    id: 'sun-001',
    title: 'Here Comes the Sun',
    artist: 'The Beatles',
    genre: 'rock',
    year: 1969,
    spotifyQuery: 'Here Comes the Sun The Beatles',
    moods: ['happy', 'uplifting', 'bright'],
    weather: {
      conditions: ['sunny', 'clear'],
      tempRange: [5778, 5778]
    },
    stations: ['sun'],
    popularity: 10
  },
  {
    id: 'sun-002',
    title: 'Good Day Sunshine',
    artist: 'The Beatles',
    genre: 'rock',
    year: 1966,
    spotifyQuery: 'Good Day Sunshine The Beatles',
    moods: ['happy', 'energetic', 'bright'],
    weather: {
      conditions: ['sunny', 'bright'],
      tempRange: [5778, 5778]
    },
    stations: ['sun'],
    popularity: 8
  },
  {
    id: 'sun-003',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    genre: 'synthpop',
    year: 2019,
    spotifyQuery: 'Blinding Lights The Weeknd',
    moods: ['energetic', 'bright', 'nostalgic'],
    weather: {
      conditions: ['bright', 'electric'],
      tempRange: [5778, 5778]
    },
    stations: ['sun'],
    popularity: 10
  },
  {
    id: 'sun-004',
    title: 'Walking on Sunshine',
    artist: 'Katrina and the Waves',
    genre: 'pop',
    year: 1985,
    spotifyQuery: 'Walking on Sunshine Katrina and the Waves',
    moods: ['happy', 'energetic', 'uplifting'],
    weather: {
      conditions: ['sunny', 'bright'],
      tempRange: [5778, 5778]
    },
    stations: ['sun'],
    popularity: 8
  },
  {
    id: 'sun-005',
    title: 'Sunshine',
    artist: 'Keane',
    genre: 'alternative',
    year: 2006,
    spotifyQuery: 'Sunshine Keane',
    moods: ['bright', 'hopeful', 'uplifting'],
    weather: {
      conditions: ['sunny', 'warm'],
      tempRange: [5778, 5778]
    },
    stations: ['sun'],
    popularity: 7
  },
  {
    id: 'sun-006',
    title: 'Güneş',
    artist: 'Sezen Aksu',
    genre: 'turkish pop',
    year: 1985,
    spotifyQuery: 'Güneş Sezen Aksu',
    moods: ['nostalgic', 'warm', 'emotional'],
    weather: {
      conditions: ['sunny', 'warm'],
      tempRange: [5778, 5778]
    },
    stations: ['sun'],
    popularity: 9
  },

  // NEPTÜN İSTASYONU - Neptune Station
  {
    id: 'neptune-001',
    title: 'Aqueous Transmission',
    artist: 'Incubus',
    genre: 'alternative',
    year: 2001,
    spotifyQuery: 'Aqueous Transmission Incubus',
    moods: ['peaceful', 'dreamy', 'meditative'],
    weather: {
      conditions: ['oceanic', 'blue'],
      tempRange: [-220, -200]
    },
    stations: ['neptune'],
    popularity: 7
  },
  {
    id: 'neptune-002',
    title: 'Weightless',
    artist: 'Marconi Union',
    genre: 'ambient',
    year: 2011,
    spotifyQuery: 'Weightless Marconi Union',
    moods: ['peaceful', 'relaxed', 'meditative'],
    weather: {
      conditions: ['calm', 'floating'],
      tempRange: [-220, -200]
    },
    stations: ['neptune'],
    popularity: 6
  },
  {
    id: 'neptune-003',
    title: 'Ocean',
    artist: 'John Butler Trio',
    genre: 'instrumental',
    year: 2012,
    spotifyQuery: 'Ocean John Butler Trio',
    moods: ['peaceful', 'emotional', 'meditative'],
    weather: {
      conditions: ['oceanic', 'flowing'],
      tempRange: [-220, -200]
    },
    stations: ['neptune'],
    popularity: 8
  },
  {
    id: 'neptune-004',
    title: 'Deep Blue Day',
    artist: 'Brian Eno',
    genre: 'ambient',
    year: 1983,
    spotifyQuery: 'Deep Blue Day Brian Eno',
    moods: ['peaceful', 'dreamy', 'contemplative'],
    weather: {
      conditions: ['deep', 'blue'],
      tempRange: [-220, -200]
    },
    stations: ['neptune'],
    popularity: 7
  },
  {
    id: 'neptune-005',
    title: 'Porcelain',
    artist: 'Moby',
    genre: 'electronic',
    year: 1999,
    spotifyQuery: 'Porcelain Moby',
    moods: ['peaceful', 'melancholic', 'dreamy'],
    weather: {
      conditions: ['calm', 'ethereal'],
      tempRange: [-220, -200]
    },
    stations: ['neptune'],
    popularity: 8
  },

  // SAMANYOLU İSTASYONU - Milky Way Station
  {
    id: 'milkyway-001',
    title: 'Midnight City',
    artist: 'M83',
    genre: 'synthwave',
    year: 2011,
    spotifyQuery: 'Midnight City M83',
    moods: ['nostalgic', 'dreamy', 'energetic'],
    weather: {
      conditions: ['starry', 'night'],
      tempRange: [-270, 0]
    },
    stations: ['milkyway'],
    popularity: 9
  },
  {
    id: 'milkyway-002',
    title: 'Turbo Killer',
    artist: 'Carpenter Brut',
    genre: 'synthwave',
    year: 2015,
    spotifyQuery: 'Turbo Killer Carpenter Brut',
    moods: ['energetic', 'dark', 'futuristic'],
    weather: {
      conditions: ['neon', 'electric'],
      tempRange: [-270, 0]
    },
    stations: ['milkyway'],
    popularity: 7
  },
  {
    id: 'milkyway-003',
    title: 'Sunset',
    artist: 'The Midnight',
    genre: 'synthwave',
    year: 2016,
    spotifyQuery: 'Sunset The Midnight',
    moods: ['nostalgic', 'peaceful', 'dreamy'],
    weather: {
      conditions: ['sunset', 'neon'],
      tempRange: [-270, 0]
    },
    stations: ['milkyway'],
    popularity: 8
  },
  {
    id: 'milkyway-004',
    title: 'A Real Hero',
    artist: 'College & Electric Youth',
    genre: 'synthwave',
    year: 2011,
    spotifyQuery: 'A Real Hero College Electric Youth',
    moods: ['heroic', 'nostalgic', 'dreamy'],
    weather: {
      conditions: ['cinematic', 'neon'],
      tempRange: [-270, 0]
    },
    stations: ['milkyway'],
    popularity: 8
  },
  {
    id: 'milkyway-005',
    title: 'Starlight',
    artist: 'Muse',
    genre: 'rock',
    year: 2006,
    spotifyQuery: 'Starlight Muse',
    moods: ['romantic', 'dreamy', 'cosmic'],
    weather: {
      conditions: ['starry', 'clear'],
      tempRange: [-270, 0]
    },
    stations: ['milkyway'],
    popularity: 9
  },

  // ANDROMEDA İSTASYONU - Andromeda Station
  {
    id: 'andromeda-001',
    title: 'Andromeda',
    artist: 'Weyes Blood',
    genre: 'experimental',
    year: 2019,
    spotifyQuery: 'Andromeda Weyes Blood',
    moods: ['dreamy', 'experimental', 'cosmic'],
    weather: {
      conditions: ['galactic', 'distant'],
      tempRange: [-273, -250]
    },
    stations: ['andromeda'],
    popularity: 6
  },
  {
    id: 'andromeda-002',
    title: 'Cosmic Dancer',
    artist: 'T. Rex',
    genre: 'glam rock',
    year: 1971,
    spotifyQuery: 'Cosmic Dancer T. Rex',
    moods: ['cosmic', 'energetic', 'experimental'],
    weather: {
      conditions: ['cosmic', 'dancing'],
      tempRange: [-273, -250]
    },
    stations: ['andromeda'],
    popularity: 7
  },
  {
    id: 'andromeda-003',
    title: 'Svefn-g-englar',
    artist: 'Sigur Rós',
    genre: 'post-rock',
    year: 1999,
    spotifyQuery: 'Svefn-g-englar Sigur Rós',
    moods: ['ethereal', 'dreamy', 'otherworldly'],
    weather: {
      conditions: ['ethereal', 'floating'],
      tempRange: [-273, -250]
    },
    stations: ['andromeda'],
    popularity: 7
  },
  {
    id: 'andromeda-004',
    title: 'Echoes',
    artist: 'Pink Floyd',
    genre: 'progressive rock',
    year: 1971,
    spotifyQuery: 'Echoes Pink Floyd',
    moods: ['psychedelic', 'cosmic', 'experimental'],
    weather: {
      conditions: ['cosmic', 'echoing'],
      tempRange: [-273, -250]
    },
    stations: ['andromeda'],
    popularity: 9
  },
  {
    id: 'andromeda-005',
    title: 'Space Age Bachelor Pad Music',
    artist: 'Stereolab',
    genre: 'experimental',
    year: 1993,
    spotifyQuery: 'Space Age Bachelor Pad Music Stereolab',
    moods: ['retro-futuristic', 'experimental', 'cool'],
    weather: {
      conditions: ['retro', 'space-age'],
      tempRange: [-273, -250]
    },
    stations: ['andromeda'],
    popularity: 6
  },

  // KARA DELİK İSTASYONU - Black Hole Station
  {
    id: 'blackhole-001',
    title: 'Black Hole Sun',
    artist: 'Soundgarden',
    genre: 'grunge',
    year: 1994,
    spotifyQuery: 'Black Hole Sun Soundgarden',
    moods: ['dark', 'mysterious', 'melancholic'],
    weather: {
      conditions: ['void', 'dark'],
      tempRange: [-273, -273]
    },
    stations: ['blackhole'],
    popularity: 9
  },
  {
    id: 'blackhole-002',
    title: 'The Sound of Silence',
    artist: 'Simon & Garfunkel',
    genre: 'folk',
    year: 1964,
    spotifyQuery: 'The Sound of Silence Simon & Garfunkel',
    moods: ['melancholic', 'contemplative', 'lonely'],
    weather: {
      conditions: ['silent', 'empty'],
      tempRange: [-273, -273]
    },
    stations: ['blackhole'],
    popularity: 10
  },
  {
    id: 'blackhole-003',
    title: 'Hurt',
    artist: 'Johnny Cash',
    genre: 'country',
    year: 2002,
    spotifyQuery: 'Hurt Johnny Cash',
    moods: ['melancholic', 'regretful', 'deep'],
    weather: {
      conditions: ['empty', 'void'],
      tempRange: [-273, -273]
    },
    stations: ['blackhole'],
    popularity: 9
  },
  {
    id: 'blackhole-004',
    title: 'Mad World',
    artist: 'Gary Jules',
    genre: 'alternative',
    year: 2001,
    spotifyQuery: 'Mad World Gary Jules',
    moods: ['melancholic', 'lonely', 'surreal'],
    weather: {
      conditions: ['surreal', 'empty'],
      tempRange: [-273, -273]
    },
    stations: ['blackhole'],
    popularity: 8
  },
  {
    id: 'blackhole-005',
    title: 'Breathe Me',
    artist: 'Sia',
    genre: 'pop',
    year: 2004,
    spotifyQuery: 'Breathe Me Sia',
    moods: ['vulnerable', 'emotional', 'introspective'],
    weather: {
      conditions: ['suffocating', 'intense'],
      tempRange: [-273, -273]
    },
    stations: ['blackhole'],
    popularity: 8
  },

  // KUASAR İSTASYONU - Quasar Station (Özel İstasyon)
  {
    id: 'quasar-001',
    title: 'Levels',
    artist: 'Avicii',
    genre: 'edm',
    year: 2011,
    spotifyQuery: 'Levels Avicii',
    moods: ['energetic', 'euphoric', 'intense'],
    weather: {
      conditions: ['high-energy', 'electric'],
      tempRange: [1000000, 2000000]
    },
    stations: ['quasar'],
    popularity: 10
  },
  {
    id: 'quasar-002',
    title: 'Bangarang',
    artist: 'Skrillex',
    genre: 'dubstep',
    year: 2011,
    spotifyQuery: 'Bangarang Skrillex',
    moods: ['energetic', 'intense', 'aggressive'],
    weather: {
      conditions: ['explosive', 'electric'],
      tempRange: [1000000, 2000000]
    },
    stations: ['quasar'],
    popularity: 8
  },
  {
    id: 'quasar-003',
    title: 'Titanium',
    artist: 'David Guetta ft. Sia',
    genre: 'edm',
    year: 2011,
    spotifyQuery: 'Titanium David Guetta Sia',
    moods: ['powerful', 'energetic', 'uplifting'],
    weather: {
      conditions: ['metallic', 'strong'],
      tempRange: [1000000, 2000000]
    },
    stations: ['quasar'],
    popularity: 10
  },
  {
    id: 'quasar-004',
    title: 'Animals',
    artist: 'Martin Garrix',
    genre: 'big room',
    year: 2013,
    spotifyQuery: 'Animals Martin Garrix',
    moods: ['wild', 'energetic', 'intense'],
    weather: {
      conditions: ['wild', 'untamed'],
      tempRange: [1000000, 2000000]
    },
    stations: ['quasar'],
    popularity: 9
  },
  {
    id: 'quasar-005',
    title: 'Strobe',
    artist: 'Deadmau5',
    genre: 'progressive house',
    year: 2009,
    spotifyQuery: 'Strobe Deadmau5',
    moods: ['hypnotic', 'energetic', 'progressive'],
    weather: {
      conditions: ['flashing', 'hypnotic'],
      tempRange: [1000000, 2000000]
    },
    stations: ['quasar'],
    popularity: 9
  },

  // MOTİVASYON
  {
    id: 'motivation-001',
    title: 'Eye of the Tiger',
    artist: 'Survivor',
    genre: 'rock',
    year: 1982,
    spotifyQuery: 'Eye of the Tiger Survivor',
    moods: ['motivasyon', 'energetic'],
    weather: {
      conditions: ['clear', 'clouds'],
      tempRange: [10, 30]
    },
    stations: ['mars', 'earth'],
    popularity: 10
  },
  {
    id: 'motivation-002',
    title: 'Stronger',
    artist: 'Kanye West',
    genre: 'hip hop',
    year: 2007,
    spotifyQuery: 'Stronger Kanye West',
    moods: ['motivasyon', 'energetic'],
    weather: {
      conditions: ['clear', 'clouds'],
      tempRange: [10, 30]
    },
    stations: ['mars'],
    popularity: 9
  },
  // RAHATLAMA
  {
    id: 'relax-001',
    title: 'Weightless',
    artist: 'Marconi Union',
    genre: 'ambient',
    year: 2011,
    spotifyQuery: 'Weightless Marconi Union',
    moods: ['rahatlama', 'calm', 'relaxed'],
    weather: {
      conditions: ['clouds', 'rain'],
      tempRange: [0, 20]
    },
    stations: ['neptune', 'saturn'],
    popularity: 10
  },
  {
    id: 'relax-002',
    title: 'Spiegel im Spiegel',
    artist: 'Arvo Pärt',
    genre: 'classical',
    year: 1978,
    spotifyQuery: 'Spiegel im Spiegel Arvo Pärt',
    moods: ['rahatlama', 'dinginvederin'],
    weather: {
      conditions: ['clouds', 'rain'],
      tempRange: [0, 20]
    },
    stations: ['neptune', 'jupiter'],
    popularity: 8
  },
  // İSYANKÂR
  {
    id: 'rebel-001',
    title: 'Killing In The Name',
    artist: 'Rage Against The Machine',
    genre: 'rock',
    year: 1992,
    spotifyQuery: 'Killing In The Name Rage Against The Machine',
    moods: ['isyankar', 'angry', 'intense'],
    weather: {
      conditions: ['storm', 'thunderstorm'],
      tempRange: [5, 30]
    },
    stations: ['mars', 'blackhole', 'andromeda'],
    popularity: 10
  },
  {
    id: 'rebel-002',
    title: 'Rap God',
    artist: 'Eminem',
    genre: 'rap',
    year: 2013,
    spotifyQuery: 'Rap God Eminem',
    moods: ['isyankar', 'intense'],
    weather: {
      conditions: ['storm', 'thunderstorm'],
      tempRange: [5, 30]
    },
    stations: ['mars', 'andromeda'],
    popularity: 9
  },
  // DİNGİN VE DERİN
  {
    id: 'deep-001',
    title: 'River Flows In You',
    artist: 'Yiruma',
    genre: 'classical',
    year: 2001,
    spotifyQuery: 'River Flows In You Yiruma',
    moods: ['dinginvederin', 'calm', 'peaceful'],
    weather: {
      conditions: ['clouds', 'rain'],
      tempRange: [0, 20]
    },
    stations: ['jupiter', 'neptune'],
    popularity: 10
  },
  {
    id: 'deep-002',
    title: 'Nature Sounds',
    artist: 'Doğa',
    genre: 'nature',
    year: 2020,
    spotifyQuery: 'Nature Sounds',
    moods: ['dinginvederin', 'relaxed'],
    weather: {
      conditions: ['rain', 'clouds'],
      tempRange: [0, 20]
    },
    stations: ['neptune', 'earth'],
    popularity: 8
  },
  // Binary Star Harmony
  {
    id: 'binary-001',
    title: 'Endless Love',
    artist: 'Lionel Richie & Diana Ross',
    genre: 'r&b',
    year: 1981,
    spotifyQuery: 'Endless Love Lionel Richie Diana Ross',
    moods: ['romantic', 'chill'],
    weather: {
      conditions: ['clear', 'night'],
      tempRange: [10, 25]
    },
    stations: ['binary-star-harmony'],
    popularity: 9
  },
  // Supernova Pop Stage
  {
    id: 'supernova-001',
    title: 'Dynamite',
    artist: 'BTS',
    genre: 'k-pop',
    year: 2020,
    spotifyQuery: 'Dynamite BTS',
    moods: ['energetic', 'happy'],
    weather: {
      conditions: ['sunny', 'festival'],
      tempRange: [20, 35]
    },
    stations: ['supernova-pop-stage'],
    popularity: 10
  },
  // Quark Jazz Club
  {
    id: 'quark-001',
    title: 'Take Five',
    artist: 'Dave Brubeck',
    genre: 'jazz',
    year: 1959,
    spotifyQuery: 'Take Five Dave Brubeck',
    moods: ['chill', 'classy'],
    weather: {
      conditions: ['rainy', 'night'],
      tempRange: [5, 20]
    },
    stations: ['quark-jazz-club'],
    popularity: 8
  },
  // Comet Disco Hub
  {
    id: 'comet-001',
    title: 'Stayin’ Alive',
    artist: 'Bee Gees',
    genre: 'disco',
    year: 1977,
    spotifyQuery: 'Stayin Alive Bee Gees',
    moods: ['funky', 'dance'],
    weather: {
      conditions: ['clear', 'night'],
      tempRange: [10, 25]
    },
    stations: ['comet-disco-hub'],
    popularity: 10
  },
  // CryoChill Station
  {
    id: 'cryo-001',
    title: 'Cold Little Heart',
    artist: 'Michael Kiwanuka',
    genre: 'chillstep',
    year: 2016,
    spotifyQuery: 'Cold Little Heart Michael Kiwanuka',
    moods: ['calm', 'relaxing'],
    weather: {
      conditions: ['snowy', 'cloudy'],
      tempRange: [-10, 10]
    },
    stations: ['cryochill-station'],
    popularity: 8
  },
];
