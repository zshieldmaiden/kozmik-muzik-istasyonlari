# Render ile Backend Deploy

## Render Avantajları
- ✅ Tam Node.js/Express sunucu desteği
- ✅ PostgreSQL/SQLite veritabanı desteği
- ✅ GitHub entegrasyonu
- ✅ Ücretsiz tier (750 saat/ay)
- ✅ Otomatik HTTPS ve SSL
- ✅ Kolay domain bağlama
- ✅ Auto-deploy (git push ile otomatik deploy)

## 🚀 Render Deploy Adımları

### 1. Render Hesabı
1. https://render.com/ git
2. GitHub ile giriş yap
3. "New Web Service" seç

### 2. Backend Repo Ayarları
- Repository: `kozmik-muzik-istasyonlari` seç
- Root Directory: `server`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `node music-api.js`

### 3. Environment Variables
Render dashboard'da ekle:
```
PORT=10000
NODE_ENV=production
DATABASE_URL=./music.db
```

### 4. Deploy
- "Create Web Service" butonuna tıkla
- Otomatik build başlar
- URL: `https://your-app-name.onrender.com`

## 🔧 Backend Hazırlığı

### package.json oluştur (server klasöründe)
```json
{
  "name": "kozmik-muzik-backend",
  "version": "1.0.0",
  "main": "music-api.js",
  "scripts": {
    "start": "node music-api.js",
    "dev": "nodemon music-api.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.6"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Alternatifler
- **Railway**: Benzer özellikler, farklı fiyatlandırma
- **Vercel**: Serverless functions ile
