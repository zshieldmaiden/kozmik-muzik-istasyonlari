# 🛡️ Güvenlik Kontrolü

Bu dosyayı GitHub'a yüklemeden önce kontrol edin:

## ✅ Güvenli Dosyalar (GitHub'a yüklenebilir)
- ✅ .env.example (şablon dosya)
- ✅ README.md 
- ✅ package.json
- ✅ tüm src/ dosyaları
- ✅ .gitignore

## ❌ Güvenli OLMAYAN Dosyalar (GitHub'a YÜKLENMEMELİ)
- ❌ .env (gerçek API key'leri içerir)
- ❌ .env.local
- ❌ .env.development.local
- ❌ *.db dosyaları
- ❌ node_modules/

## 🔍 GitHub'a Yüklemeden Önce Kontrol Edin

```bash
# Hangi dosyaların commit edileceğini kontrol edin
git status

# .env dosyasının ignore edildiğini kontrol edin
git check-ignore .env

# Eğer .env dosyası gösteriliyorsa, .gitignore'a ekleyin!
```

## 🚨 Eğer Yanlışlıkla API Key Yüklediyseniz

1. Derhal API key'lerinizi değiştirin
2. Git history'den silmek için:
```bash
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all
```

3. Yeni API key'leri alın ve .env dosyasını güncelleyin

## 💡 En İyi Uygulamalar

- Her zaman .env.example kullanın
- API key'lerini kod içine yazmayın
- Production'da environment variables kullanın
- Regular olarak .gitignore kontrol edin
