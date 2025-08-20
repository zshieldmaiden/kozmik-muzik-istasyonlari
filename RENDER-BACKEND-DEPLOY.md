# 🚀 Kozmik Müzik Backend - Render Deploy Rehberi

## 📋 Gereksinimler

- GitHub repository'si
- Render.com hesabı (ücretsiz)
- Groq API key (groq.com'dan alın)
- OpenWeather API key (opsiyonel)

## 🔧 Deploy Adımları

### 1. Render.com'a Giriş Yapın

1. [render.com](https://render.com) adresine gidin
2. GitHub hesabınızla giriş yapın
3. Dashboard'a geçin

### 2. Yeni Web Service Oluşturun

1. **"New +" butonuna tıklayın**
2. **"Web Service"** seçin
3. **GitHub repository'nizi bağlayın**
4. Repository: `kozmik-muzik-istasyonlari`
5. Branch: `main`

### 3. Service Ayarları

```yaml
Name: kozmik-muzik-backend
Environment: Node
Region: Frankfurt (EU) veya Oregon (US)
Branch: main
Root Directory: server
Build Command: npm install
Start Command: node music-api.js
```

### 4. Environment Variables

**Environment Variables** bölümünde şunları ekleyin:

```bash
# ZORUNLU
GROQ_API_KEY=your_groq_api_key_here

# OPSİYONEL
OPENWEATHER_KEY=your_openweather_key_here
NODE_ENV=production
PORT=8790

# CORS Origins (Frontend URL'inizi ekleyin)
CORS_ORIGINS=https://your-frontend.netlify.app,http://localhost:5173,http://localhost:5174
```

### 5. Plan Seçimi

- **Free Plan** seçin (başlangıç için yeterli)
- Aylık 750 saat ücretsiz
- Auto-sleep: 15 dakika inaktivite sonrası

### 6. Deploy Butonuna Basın

**"Create Web Service"** butonuna tıklayın

## 📡 Backend URL'i

Deploy tamamlandıktan sonra backend URL'iniz:
```
https://kozmik-muzik-backend.onrender.com
```

## 🧪 Test

Backend çalışıyor mu test edin:
```bash
curl https://kozmik-muzik-backend.onrender.com/api
```

## 🔗 Frontend Entegrasyonu

Frontend'inizi (Netlify) backend'e bağlamak için:

1. **Frontend environment variable'ına backend URL'i ekleyin:**
```bash
VITE_API_BASE_URL=https://kozmik-muzik-backend.onrender.com/api
```

2. **Netlify'da Environment Variables:**
   - Site Settings > Environment Variables
   - `VITE_API_BASE_URL` ekleyin
   - Redeploy yapın

## 🚨 Önemli Notlar

### Free Plan Limitleri:
- 750 saat/ay (yaklaşık 31 gün)
- 15 dakika inaktivite sonrası sleep mode
- İlk request'te 30 saniye startup süresi

### Performans İpuçları:
- Keep-alive ping servisi kullanın
- Caching stratejileri ekleyin
- Database optimizasyonları yapın

### Monitoring:
- Render dashboard'tan logları izleyin
- Uptime monitoring servisi ekleyin
- Error tracking entegre edin

## 🔄 Güncellemeler

Kod güncellemesi için:
1. GitHub'a push yapın
2. Render otomatik deploy yapar
3. Logs'tan deploy durumunu izleyin

## 🆘 Sorun Giderme

### Deploy Başarısız Olursa:
1. Logs'u kontrol edin
2. package.json dependencies'i kontrol edin
3. Environment variables'ı doğrulayın
4. Start command'i kontrol edin

### Runtime Hataları:
1. Application logs'u inceleyin
2. Environment variables eksik mi?
3. Database bağlantısı var mı?
4. API key'ler doğru mu?

## 📞 Destek

- Render Documentation: https://render.com/docs
- Groq AI Documentation: https://groq.com/docs
- GitHub Issues: Repository'nizde issue açın

---

✨ **Deploy başarılı olduğunda backend URL'inizi frontend'e entegre etmeyi unutmayın!**
