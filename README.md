# 🌌 Kozmik Müzik İstasyonları 

Modern Vue 3 ile geliştirilmiş kozmik temalı müzik keşif platformu. Ruh haline göre şarkı önerileri ve etkileşimli kozmik istasyonlar.<<< HEAD
# � Kozmik Müzik İstasyonları 

Modern Vue 3 ile geliştirilmiş kozmik temalı müzik keşif platformu. Ruh haline göre şarkı önerileri ve etkileşimli kozmik istasyonlar.

## ✨ Özellikler

- 🌟 **Kozmik Tema**: Yıldızlar, meteorlar ve uzay temalı görsel efektler
- 🎵 **Akıllı Müzik Önerileri**: Ruh hali ve hava durumu bazlı şarkı önerileri
- 🌌 **16 Kozmik İstasyon**: Dünya'dan Aurora Tınısı'na kadar farklı müzik istasyonları
- �️ **İnteraktif Tooltips**: İstasyonlar üzerine gelince detaylı bilgiler
- 🌦️ **Hava Durumu Entegrasyonu**: OpenWeatherMap API ile gerçek hava durumu
- 📱 **Responsive Tasarım**: Mobile-first responsive arayüz
- 🎮 **Offline Mode**: API'ler çalışmadığında offline müzik veritabanı
- 🔍 **Gelişmiş Arama**: Şarkı, sanatçı ve tür bazlı arama sistemi

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 20.19.0+ veya 22.12.0+
- npm veya yarn

### Kurulum

```bash
# Projeyi klonlayın
git clone https://github.com/kullaniciadi/mood-music-yepyeni.git
cd mood-music-yepyeni

# Bağımlılıkları yükleyin
npm install

# Environment dosyasını oluşturun
cp .env.example .env

# .env dosyasını editörde açın ve API key'lerinizi girin
# (Opsiyonel - API key'leri olmasa da offline mode çalışır)

# Veritabanını kurun
npm run setup-db

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama http://localhost:5173 adresinde çalışacak.

## 🛠️ Teknoloji Stack'i

### Frontend
- **Vue 3** - Composition API ile modern reactive framework
- **Vite** - Hızlı geliştirme ve build tool
- **TailwindCSS** - Utility-first CSS framework
- **Particles.js** - Kozmik arka plan efektleri

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **SQLite** - Hafif veritabanı
- **Better SQLite3** - Performanslı SQLite binding

### API'ler
- **OpenWeatherMap** - Hava durumu verileri
- **Jamendo** - Müzik veritabanı (opsiyonel)
- **Spotify Web API** - Müzik metadata (opsiyonel)

## 📁 Proje Yapısı

```
mood-music-yepyeni/
├── src/
│   ├── components/          # Vue bileşenleri
│   │   ├── CosmicStations.vue    # Ana istasyon görünümü
│   │   ├── MusicPlayer.vue       # Müzik çalar
│   │   └── ...
│   ├── data/               # Statik veri dosyaları
│   │   ├── stations.js          # İstasyon tanımları
│   │   ├── musicDatabase.js     # Müzik veritabanı
│   │   └── offlineData.js       # Offline fallback data
│   ├── utils/              # Yardımcı fonksiyonlar
│   │   ├── musicEngine.js       # Müzik öneri motoru
│   │   └── musicPlayerStore.js  # Vuex store
│   ├── api/                # API istemcileri
│   └── views/              # Sayfa bileşenleri
├── server/                 # Backend sunucu dosyaları
│   ├── music-api.js            # SQLite API sunucusu
│   ├── database-setup.js       # Veritabanı kurulum
│   └── ...
└── public/                 # Statik dosyalar
```

## � Kozmik İstasyonlar

Platform 16 farklı kozmik istasyon içerir:

- 🌍 **Dünya** - Pop, rock, mainstream
- 🌙 **Ay** - Ambient, chill-out 
- ☀️ **Güneş** - Energetic, upbeat
- ♂️ **Mars** - Rock, metal, aggressive
- ♃ **Jüpiter** - Classical, orchestral
- ♄ **Satürn** - Electronic, synthetic
- ♆ **Neptün** - Trance, psytrance
- ❄️ **Uranüs** - Ambient, chillstep
- 🌌 **Aurora Tınısı** - Synthwave, dream pop *(Yeni!)*
- Ve daha fazlası...

## 🎮 Kullanım

1. **İstasyon Seçin**: Ruh halinize uygun kozmik istasyonu seçin
2. **Hover Etkileşimi**: İstasyonlar üzerine gelince detaylı bilgileri görün
3. **Müzik Keşfedin**: Otomatik olarak önerilen şarkıları dinleyin
4. **Hava Durumu**: Konum izni vererek hava durumuna göre öneriler alın
5. **Arama Yapın**: Gelişmiş arama ile istediğiniz müziği bulun

## � Geliştirme Komutları

```bash
# Geliştirme sunucusu (Hot reload)
npm run dev

# Müzik API sunucusu (Port 8790)
npm run music-api

# Veritabanı kurulumu/sıfırlama
npm run setup-db

# Production build
npm run build

# Build preview
npm run preview
```

## 🌍 Environment Variables

Uygulama API key'leri olmadan da çalışır (offline mode), ancak tam özellikler için aşağıdaki API key'lerini alabilirsiniz:

### 🔑 API Key'lerini Alma

#### 1. OpenWeatherMap (Ücretsiz)
```bash
# 1. https://openweathermap.org/api adresine gidin
# 2. Ücretsiz hesap oluşturun
# 3. API key'inizi alın
# 4. .env dosyasına ekleyin:
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

#### 2. Spotify (Opsiyonel)
```bash
# 1. https://developer.spotify.com/ adresine gidin
# 2. "Create an App" ile uygulama oluşturun
# 3. Redirect URI: http://localhost:5173/callback
# 4. .env dosyasına ekleyin:
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

### 🛡️ Güvenlik
```bash
# .env dosyasını ASLA GitHub'a yüklemeyin!
# Sadece .env.example dosyası yüklenir
# .env dosyası .gitignore'da otomatik olarak ignore edilir
```

## � Özelleştirme

### Yeni İstasyon Ekleme

`src/data/stations.js` dosyasına yeni istasyon ekleyin:

```javascript
{
  id: 'yeni-istasyon',
  name: 'Yeni İstasyon',
  emoji: '🌟',
  description: 'İstasyon açıklaması',
  genres: ['genre1', 'genre2'],
  moods: ['happy', 'calm'],
  weather: [
    { condition: 'clear', tempRange: [15, 25] }
  ],
  popularity: 8
}
```

### Yeni Müzik Ekleme

`src/data/musicDatabase.js` dosyasına yeni şarkılar ekleyin:

```javascript
{
  title: 'Şarkı Adı',
  artist: 'Sanatçı',
  genre: 'pop',
  moods: ['happy', 'energetic'],
  stations: ['earth', 'venus'],
  // ... diğer özellikler
}
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## � Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- Vue.js ekibine modern reactive framework için
- TailwindCSS ekibine utility-first CSS için  
- OpenWeatherMap'e ücretsiz hava durumu API'si için
- Tüm katkıda bulunanlara

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

🌌 **Kozmik müzik yolculuğunuz başlasın!** 🚀
