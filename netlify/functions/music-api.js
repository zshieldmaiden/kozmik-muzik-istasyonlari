// Netlify Function - Simple Music API
const musicData = {
  songs: [
    { id: 1, title: "Galactic Winds", artist: "Cosmic Voyager", genre: "ambient" },
    { id: 2, title: "Aurora Dance", artist: "Northern Lights", genre: "synthwave" },
    { id: 3, title: "Event Horizon", artist: "Void Explorer", genre: "dark-ambient" }
  ],
  stations: [
    { id: "andromeda", name: "Andromeda" },
    { id: "aurora", name: "Aurora" },
    { id: "blackhole", name: "Black Hole" }
  ]
};

export default async (request, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (request.method === 'OPTIONS') {
    return new Response('', { status: 200, headers });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace('/.netlify/functions/music-api', '');

  if (path === '/api/songs') {
    return new Response(JSON.stringify({
      success: true,
      data: musicData.songs
    }), { status: 200, headers });
  }

  if (path === '/api/stations') {
    return new Response(JSON.stringify({
      success: true,
      data: musicData.stations
    }), { status: 200, headers });
  }

  return new Response(JSON.stringify({
    message: 'Kozmik Music API Ready!',
    path: path
  }), { status: 200, headers });
};
