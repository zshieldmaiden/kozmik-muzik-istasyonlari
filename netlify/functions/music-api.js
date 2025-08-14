// Netlify Function - Music API
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // OPTIONS request için CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { path } = event;
    const params = event.queryStringParameters || {};

    // Basit API endpoint'leri
    if (path.includes('/api/recommendations')) {
      const { mood, weather } = params;
      
      // Offline verilerden öneri döndür
      const recommendations = {
        mood: mood || 'happy',
        weather: weather || 'sunny',
        songs: [
          { title: "Cosmic Journey", artist: "Space Ambient", duration: "4:32" },
          { title: "Stellar Waves", artist: "Galaxy Sounds", duration: "3:45" }
        ]
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(recommendations)
      };
    }

    // Varsayılan response
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
