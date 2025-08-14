# 🚀 Deploy Rehberi

Bu rehber Kozmik Müzik İstasyonları projesini çeşitli platformlara deploy etmek için adım adım talimatlar içerir.

## 🌐 Netlify Deploy (Önerilen)

### Adım 1: Netlify Hesabı
1. https://netlify.com adresine gidin
2. GitHub hesabınızla giriş yapın
3. "New site from Git" butonuna tıklayın

### Adım 2: Repository Bağlayın
1. GitHub'ı seçin
2. `kozmik-muzik-istasyonlari` repository'sini seçin
3. Deploy ayarları:
   - **Branch**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### Adım 3: Environment Variables (Opsiyonel)
Site Settings > Environment variables'da ekleyin:
```
VITE_OPENWEATHER_API_KEY=your_api_key_here
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### Adım 4: Deploy
- "Deploy site" butonuna tıklayın
- 2-3 dakika bekleyin
- Site URL'niz hazır! (örn: https://cosmic-music-stations.netlify.app)

---

## 🔧 Vercel Deploy

### Adım 1: Vercel Hesabı
1. https://vercel.com adresine gidin
2. GitHub ile giriş yapın
3. "New Project" > "Import Git Repository"

### Adım 2: Deploy Ayarları
1. Repository'yi seçin
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`

### Adım 3: Environment Variables
Dashboard'da environment variables ekleyin (Netlify ile aynı)

---

## 📄 GitHub Pages Deploy

### Adım 1: Workflow Dosyası
`.github/workflows/deploy.yml` oluşturun:

\`\`\`yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
\`\`\`

### Adım 2: GitHub Pages Ayarları
1. Repository > Settings > Pages
2. Source: "GitHub Actions"
3. Workflow çalıştırın

---

## ⚡ Hızlı Deploy Komutu

Netlify CLI ile tek komutla deploy:

\`\`\`bash
# Netlify CLI kurulumu
npm install -g netlify-cli

# Login
netlify login

# Build ve deploy
npm run build
netlify deploy --prod --dir=dist
\`\`\`

---

## 🔍 Deploy Sonrası Kontrol

✅ **Test Checklist:**
- [ ] Site açılıyor
- [ ] Kozmik animasyonlar çalışıyor
- [ ] İstasyonlar görünüyor
- [ ] Hover tooltipleri çalışıyor
- [ ] Offline mode çalışıyor
- [ ] Responsive tasarım düzgün
- [ ] Console'da major hatalar yok

---

## 🛠️ Sorun Giderme

### Build Hatası
\`\`\`bash
# Local build test
npm run build
npm run preview
\`\`\`

### Environment Variables Sorunu
- .env.example'dan kopyalayın
- VITE_ prefix'i ekleyin
- Deploy platform'da environment variables ayarlayın

### 404 Hatası
- netlify.toml dosyasının mevcut olduğundan emin olun
- _redirects dosyası public/ klasöründe olmalı

---

## 🌟 Demo URLs

Deploy sonrası örnek URL'ler:
- **Netlify**: https://kozmik-muzik-istasyonlari.netlify.app
- **Vercel**: https://kozmik-muzik-istasyonlari.vercel.app
- **GitHub Pages**: https://username.github.io/kozmik-muzik-istasyonlari

🎉 **Tebrikler! Projeniz artık canlı!** 🚀
