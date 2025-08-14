/**
 * Offline Mode Fallback Data
 * API'ler mevcut olmadığında kullanılacak statik veriler
 */

export const offlineMusic = [
  // Pop Station Songs
  {
    id: 'pop-1',
    title: 'Cosmic Dreams',
    artist: 'Star Voyagers',
    genre: 'pop',
    year: 2023,
    popularity: 8,
    stations: ['earth', 'venus'],
    moods: ['happy', 'energetic'],
    weather: { conditions: ['clear', 'clouds'], tempRange: [15, 25] }
  },
  {
    id: 'pop-2',
    title: 'Galaxy Dance',
    artist: 'Luna Band',
    genre: 'pop',
    year: 2023,
    popularity: 7,
    stations: ['earth', 'binarystar'],
    moods: ['happy', 'energetic'],
    weather: { conditions: ['clear'], tempRange: [20, 30] }
  },
  {
    id: 'pop-3',
    title: 'Stardust Love',
    artist: 'Venus Collective',
    genre: 'pop',
    year: 2024,
    popularity: 9,
    stations: ['venus', 'earth'],
    moods: ['romantic', 'happy'],
    weather: { conditions: ['clear', 'clouds'], tempRange: [18, 28] }
  },

  // Rock Station Songs
  {
    id: 'rock-1',
    title: 'Mars Thunder',
    artist: 'Red Planet Rockers',
    genre: 'rock',
    year: 2023,
    popularity: 8,
    stations: ['mars', 'supernova'],
    moods: ['energetic', 'adventurous'],
    weather: { conditions: ['clear', 'rain'], tempRange: [10, 25] }
  },
  {
    id: 'rock-2',
    title: 'Asteroid Belt',
    artist: 'Space Metal',
    genre: 'rock',
    year: 2024,
    popularity: 7,
    stations: ['mars', 'blackhole'],
    moods: ['dark', 'energetic'],
    weather: { conditions: ['storm', 'clouds'], tempRange: [5, 20] }
  },
  {
    id: 'rock-3',
    title: 'Solar Flare',
    artist: 'Sun Destroyers',
    genre: 'rock',
    year: 2023,
    popularity: 9,
    stations: ['supernova', 'mars'],
    moods: ['energetic', 'adventurous'],
    weather: { conditions: ['clear'], tempRange: [15, 35] }
  },

  // Jazz Station Songs
  {
    id: 'jazz-1',
    title: 'Saturn Swing',
    artist: 'Ring Jazz Quartet',
    genre: 'jazz',
    year: 2023,
    popularity: 8,
    stations: ['saturn', 'quark'],
    moods: ['calm', 'nostalgic'],
    weather: { conditions: ['clouds', 'rain'], tempRange: [10, 20] }
  },
  {
    id: 'jazz-2',
    title: 'Nebula Blues',
    artist: 'Cosmic Blue',
    genre: 'jazz',
    year: 2024,
    popularity: 7,
    stations: ['quark', 'saturn'],
    moods: ['sad', 'nostalgic'],
    weather: { conditions: ['rain', 'clouds'], tempRange: [5, 15] }
  },
  {
    id: 'jazz-3',
    title: 'Midnight on Titan',
    artist: 'Moon Jazz Society',
    genre: 'jazz',
    year: 2023,
    popularity: 9,
    stations: ['saturn', 'neptune'],
    moods: ['calm', 'romantic'],
    weather: { conditions: ['clear', 'clouds'], tempRange: [12, 22] }
  },

  // Electronic Station Songs
  {
    id: 'electronic-1',
    title: 'Digital Cosmos',
    artist: 'Cyber Planets',
    genre: 'electronic',
    year: 2024,
    popularity: 8,
    stations: ['neptune', 'pulsar'],
    moods: ['energetic', 'adventurous'],
    weather: { conditions: ['clear', 'clouds'], tempRange: [15, 25] }
  },
  {
    id: 'electronic-2',
    title: 'Binary Code Dreams',
    artist: 'AI Symphony',
    genre: 'electronic',
    year: 2023,
    popularity: 7,
    stations: ['binarystar', 'neptune'],
    moods: ['calm', 'energetic'],
    weather: { conditions: ['clear'], tempRange: [18, 28] }
  },
  {
    id: 'electronic-3',
    title: 'Pulsar Beats',
    artist: 'Neutron Star DJs',
    genre: 'electronic',
    year: 2024,
    popularity: 9,
    stations: ['pulsar', 'binarystar'],
    moods: ['energetic', 'happy'],
    weather: { conditions: ['clear', 'clouds'], tempRange: [20, 30] }
  },

  // Ambient Station Songs
  {
    id: 'ambient-1',
    title: 'Deep Space Meditation',
    artist: 'Void Soundscapes',
    genre: 'ambient',
    year: 2023,
    popularity: 8,
    stations: ['neptune', 'cryochill'],
    moods: ['calm', 'nostalgic'],
    weather: { conditions: ['snow', 'clouds'], tempRange: [-5, 10] }
  },
  {
    id: 'ambient-2',
    title: 'Frozen Galaxy',
    artist: 'Ice Planet Collective',
    genre: 'ambient',
    year: 2024,
    popularity: 7,
    stations: ['cryochill', 'neptune'],
    moods: ['calm', 'sad'],
    weather: { conditions: ['snow', 'clear'], tempRange: [-10, 5] }
  },
  {
    id: 'ambient-3',
    title: 'Aurora Dreams',
    artist: 'Polar Winds',
    genre: 'ambient',
    year: 2023,
    popularity: 9,
    stations: ['cryochill', 'andromeda'],
    moods: ['calm', 'nostalgic'],
    weather: { conditions: ['snow', 'clouds'], tempRange: [-5, 8] }
  },

  // World Music Station Songs
  {
    id: 'world-1',
    title: 'Galactic Folk Tales',
    artist: 'Universal Nomads',
    genre: 'worldmusic',
    year: 2023,
    popularity: 8,
    stations: ['milkyway', 'comet'],
    moods: ['nostalgic', 'adventurous'],
    weather: { conditions: ['clear', 'clouds'], tempRange: [12, 25] }
  },
  {
    id: 'world-2',
    title: 'Comet Journey',
    artist: 'Traveling Stars',
    genre: 'worldmusic',
    year: 2024,
    popularity: 7,
    stations: ['comet', 'milkyway'],
    moods: ['adventurous', 'happy'],
    weather: { conditions: ['clear', 'rain'], tempRange: [10, 22] }
  },
  {
    id: 'world-3',
    title: 'Home Galaxy',
    artist: 'Milky Way Ensemble',
    genre: 'worldmusic',
    year: 2023,
    popularity: 9,
    stations: ['milkyway', 'earth'],
    moods: ['nostalgic', 'happy'],
    weather: { conditions: ['clear', 'clouds'], tempRange: [15, 28] }
  },

  // Classical/Orchestral Songs
  {
    id: 'classical-1',
    title: 'Jupiter Symphony',
    artist: 'Gas Giant Orchestra',
    genre: 'orchestral',
    year: 2023,
    popularity: 8,
    stations: ['jupiter'],
    moods: ['calm', 'nostalgic'],
    weather: { conditions: ['clear', 'clouds'], tempRange: [10, 20] }
  },
  {
    id: 'classical-2',
    title: 'Rings of Saturn Waltz',
    artist: 'Planetary Philharmonic',
    genre: 'orchestral',
    year: 2024,
    popularity: 9,
    stations: ['saturn', 'jupiter'],
    moods: ['romantic', 'calm'],
    weather: { conditions: ['clear'], tempRange: [15, 25] }
  },

  // Experimental/Dark Songs
  {
    id: 'experimental-1',
    title: 'Event Horizon',
    artist: 'Black Hole Scientists',
    genre: 'experimental',
    year: 2023,
    popularity: 7,
    stations: ['blackhole', 'andromeda'],
    moods: ['dark', 'adventurous'],
    weather: { conditions: ['storm', 'clouds'], tempRange: [0, 15] }
  },
  {
    id: 'experimental-2',
    title: 'Unknown Signals',
    artist: 'Andromeda Research',
    genre: 'experimental',
    year: 2024,
    popularity: 8,
    stations: ['andromeda', 'blackhole'],
    moods: ['dark', 'nostalgic'],
    weather: { conditions: ['storm', 'rain'], tempRange: [5, 18] }
  }
];

// Offline search function
export function searchOfflineMusic(criteria) {
  let results = [...offlineMusic];

  // Text search
  if (criteria.searchTerm) {
    const term = criteria.searchTerm.toLowerCase();
    results = results.filter(song => 
      song.title.toLowerCase().includes(term) ||
      song.artist.toLowerCase().includes(term) ||
      song.genre.toLowerCase().includes(term)
    );
  }

  // Station filter
  if (criteria.station) {
    results = results.filter(song => 
      song.stations.includes(criteria.station)
    );
  }

  // Mood filter
  if (criteria.mood) {
    results = results.filter(song => 
      song.moods.includes(criteria.mood)
    );
  }

  // Genre filter
  if (criteria.genre) {
    results = results.filter(song => 
      song.genre === criteria.genre
    );
  }

  // Year filter
  if (criteria.yearMin) {
    results = results.filter(song => 
      song.year >= parseInt(criteria.yearMin)
    );
  }

  if (criteria.yearMax) {
    results = results.filter(song => 
      song.year <= parseInt(criteria.yearMax)
    );
  }

  // Sort results
  if (criteria.sortBy) {
    results.sort((a, b) => {
      const field = criteria.sortBy;
      const order = criteria.sortOrder === 'desc' ? -1 : 1;
      
      if (field === 'popularity') {
        return (b[field] - a[field]) * order;
      } else if (field === 'year') {
        return (b[field] - a[field]) * order;
      } else {
        return a[field].localeCompare(b[field]) * order;
      }
    });
  }

  return results;
}

// Weather-based music recommendations
export function getWeatherBasedRecommendations(weather) {
  const temp = weather.temp || 20;
  const condition = weather.conditions || 'clear';

  let results = [...offlineMusic];

  // Temperature-based filtering
  results = results.filter(song => {
    const [min, max] = song.weather.tempRange;
    return temp >= min && temp <= max;
  });

  // Weather condition filtering
  results = results.filter(song => 
    song.weather.conditions.includes(condition)
  );

  // Sort by popularity and return top 10
  return results
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);
}
