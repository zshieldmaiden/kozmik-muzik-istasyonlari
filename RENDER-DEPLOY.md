# Kozmik Müzik İstasyonları - Render Deploy

## Environment Variables

Render.com'da bu environment variable'ları ekle:

```bash
# Groq AI API Key (Required)
VITE_GROQ_API_KEY=your_groq_api_key_here

# Optional: Backend service URL
VITE_API_BASE_URL=https://your-backend-service.render.com
```

## Deploy Steps

1. GitHub repository'yi Render'a bağla
2. Static Site olarak deploy et
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment variables ekle

## Backend Service (Optional)

SQLite backend için ayrı service olarak deploy et:
- Repository: `/server` klasörü
- Start command: `node gemini-proxy.cjs`
- Environment: Node.js

## Features

- ✅ Groq AI Integration (Ultra-fast LPU)
- ✅ Vue 3 + Vite Frontend
- ✅ Responsive Design
- ✅ Music Station Recommendations
- ✅ Weather-based Music Suggestions
- ✅ Spotify/YouTube Playlist Creation
