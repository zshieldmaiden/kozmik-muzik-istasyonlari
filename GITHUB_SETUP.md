# 🚀 GitHub'a Yükleme Rehberi

Bu proje API key'lerini güvenli şekilde yönetir. GitHub'a yüklemek için aşağıdaki adımları takip edin:

## 🔐 Güvenlik Kontrolleri ✅

✅ .env dosyası .gitignore'da
✅ .env.example şablon dosyası hazır  
✅ API key'leri kodda hardcode edilmemiş
✅ SECURITY.md dosyası eklendi
✅ README.md güvenlik talimatları içeriyor

## 📝 GitHub'a Yükleme Adımları

### 1. GitHub'da Repository Oluşturun
```bash
# GitHub.com'da yeni repository oluşturun:
# Repository name: kozmik-muzik-istasyonlari
# Description: Modern Vue 3 ile geliştirilmiş kozmik temalı müzik keşif platformu
# Public/Private: Public (önerilir)
# Initialize with README: HAYIR (zaten var)
```

### 2. Git Komutları
```bash
# İlk commit (henüz yapılmadıysa)
git commit -m "🌌 İlk commit: Kozmik Müzik İstasyonları v1.0.0

✨ Özellikler:
- 16 kozmik müzik istasyonu (Aurora Tınısı dahil)
- Vue 3 + Vite modern frontend
- İnteraktif tooltips ve hover efektleri
- Akıllı müzik öneri sistemi
- Hava durumu entegrasyonu
- Offline mode desteği
- Kozmik animasyonlar (yıldızlar, meteorlar)
- Responsive tasarım
- SQLite veritabanı

🛡️ Güvenlik:
- API key'leri .env.example şablonunda
- .env dosyası .gitignore'da
- Güvenlik dokümantasyonu eklendi

🚀 Kurulum:
npm install && cp .env.example .env && npm run setup-db && npm run dev"

# GitHub repository'yi bağlayın (URL'yi kendi repository'nizle değiştirin)
git remote add origin https://github.com/KULLANICI-ADINIZ/kozmik-muzik-istasyonlari.git

# Ana dalı push edin
git push -u origin main
```

### 3. Son Kontrol
```bash
# GitHub'a yüklendikten sonra kontrol edin:
# ✅ .env dosyası GitHub'da görünmüyor
# ✅ .env.example dosyası görünüyor
# ✅ README.md kurulum talimatları doğru
# ✅ SECURITY.md güvenlik talimatları var
```

## 🔄 Gelecek Güncellemeler

```bash
# Yeni özellik ekledikten sonra:
git add .
git commit -m "✨ Yeni özellik: açıklama"
git push origin main

# UYARI: Her push'tan önce .env dosyasının commit edilmediğinden emin olun!
git status  # .env dosyası listede olmamalı
```

## 🆘 Sorun Giderme

### .env dosyası yanlışlıkla commit edilirse:
```bash
# Dosyayı unstage edin
git reset HEAD .env

# Veya commit'ten sonra:
git rm --cached .env
git commit -m "🔒 .env dosyası kaldırıldı (güvenlik)"

# Derhal API key'lerinizi değiştirin!
```

### Repository URL'sini değiştirmek için:
```bash
git remote set-url origin https://github.com/YENI-KULLANICI/YENI-REPO.git
```

## ✅ Final Checklist

- [ ] GitHub repository oluşturuldu
- [ ] git remote add origin yapıldı  
- [ ] İlk commit yapıldı
- [ ] git push origin main yapıldı
- [ ] GitHub'da .env dosyası görünmüyor
- [ ] README.md doğru görünüyor
- [ ] API key'leri güvenli

🎉 Tebrikler! Projeniz güvenli şekilde GitHub'a yüklendi!
