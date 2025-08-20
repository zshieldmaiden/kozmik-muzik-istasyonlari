# 🚀 Kozmik Müzik İstasyonları - Full Deployment Guide

## Deployment Özeti
✅ **Frontend**: Netlify (otomatik deploy)  
✅ **Backend**: Render (manuel deploy)  
✅ **Database**: In-Memory (production-ready)  
✅ **AI Service**: Groq API integration  

---

## 🌐 Render Backend Deployment

### 1. Render'a Git
- [render.com](https://render.com) → Sign up/Login
- Dashboard → "New +" → "Web Service"

### 2. Repository Bağlantısı
```
Repository: https://github.com/zshieldmaiden/kozmik-muzik-istasyonlari
Branch: main
Root Directory: . (default)
```

### 3. Build & Start Ayarları
```yaml
Name: kozmik-muzik-backend
Environment: Node
Region: Oregon (US West) - ya da en yakın
Branch: main
Build Command: cd server && npm install
Start Command: cd server && npm start
```

### 4. Environment Variables (Render Dashboard)
```
NODE_ENV=production
PORT=10000
GROQ_API_KEY=[your-groq-api-key] (isteğe bağlı)
```

### 5. Advanced Settings
```
Auto-Deploy: Yes
Health Check Path: /health
```

---

## 🎯 Netlify Frontend Güncelleme

### Otomatik Deploy
✅ GitHub'a push yaptığımız için otomatik deploy olacak
✅ Netlify dashboard'da build logs'u görebilirsin

### Environment Variables (Netlify Dashboard)
```
VITE_GROQ_API_KEY=[your-groq-api-key] (isteğe bağlı)
```

---

## 🔗 Bağlantı Kurma

### 1. Render Deploy Sonrası
1. Render'dan backend URL'ini al (örn: `https://kozmik-muzik-backend.onrender.com`)
2. Netlify environment variables'a ekle:
   ```
   VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
   ```

### 2. Test Endpoints
```bash
# Health check
https://your-backend.onrender.com/health

# API info
https://your-backend.onrender.com/api

# Songs
https://your-backend.onrender.com/api/songs

# AI recommendations
POST https://your-backend.onrender.com/api/ai/recommendations
```

---

## 🛠️ Production API Features

### Database Service
- ✅ In-memory database (3 initial songs)
- ✅ CRUD operations
- ✅ Advanced search & filtering
- ✅ Station, mood, genre management

### AI Service
- ✅ Groq API integration
- ✅ Fallback recommendations
- ✅ Auralis chat responses
- ✅ Music recommendation engine

### API Endpoints
```
GET  /health - Health check
GET  /api - API documentation
GET  /api/songs - All songs
GET  /api/songs/search - Search songs
POST /api/songs - Add song
POST /api/songs/batch - Add multiple songs
GET  /api/stations - All stations
GET  /api/moods - All moods
GET  /api/genres - All genres
POST /api/ai/recommendations - AI music recommendations
POST /api/ai/auralis - Auralis chat
GET  /api/stats - Platform statistics
```

---

## 🐛 Troubleshooting

### Render Build Fails
1. Check build logs in Render dashboard
2. Verify `server/package.json` dependencies
3. Check Node.js version (>=18.0.0)

### CORS Issues
✅ Production CORS configured for Netlify domains
✅ Credentials support enabled
✅ All HTTP methods allowed

### Environment Variables
- GROQ_API_KEY optional (fallback mode works)
- PORT automatically set by Render
- NODE_ENV=production required

---

## 📊 Monitoring

### Render Dashboard
- Service status
- Logs & metrics
- Deploy history
- Environment variables

### Netlify Dashboard  
- Build logs
- Deploy previews
- Environment variables
- Form submissions

---

## 🚀 Deployment Commands

```bash
# Local test
cd server && npm start

# Manual deploy (if needed)
git add .
git commit -m "production updates"
git push origin main

# Check deployment
curl https://your-backend.onrender.com/health
```

---

## 🎵 Post-Deployment

1. ✅ Test frontend: your-netlify-site.netlify.app
2. ✅ Test backend: your-backend.onrender.com/health
3. ✅ Test integration: Frontend → Backend API calls
4. ✅ Test AI features (if GROQ_API_KEY provided)
5. ✅ Test music search & playlist features

---

**🌌 Kozmik müzik yolculuğunuz başlasın! 🚀**
