# LMS UI - Öğrenme Yönetim Sistemi

## 🚀 Proje Hakkında

Bu proje, Next.js 14 App Router kullanarak oluşturulmuş modern bir LMS (Learning Management System) frontend uygulamasıdır. Öğrenciler için tasarlanmış, mock authentication sistemi ile korunan sayfalar ve kullanıcı yönetimi içerir.

## ✨ Özellikler

### 🔐 Authentication
- **Mock Authentication**: Gerçek backend olmadan çalışan authentication sistemi
- **LocalStorage Token**: `lms_token` key'i ile token saklama
- **Protected Routes**: Dashboard sayfaları token kontrolü ile korunuyor
- **Auto Redirect**: Token yoksa otomatik olarak login sayfasına yönlendirme

### 🎨 UI/UX
- **Modern Design**: Pastel mavi tema ile şık tasarım
- **Responsive**: Mobil ve desktop uyumlu
- **Tailwind CSS v4**: En son Tailwind CSS versiyonu
- **Form Validation**: React Hook Form + Zod ile form doğrulama
- **Loading States**: Authentication sırasında loading göstergeleri

### 📱 Responsive Tasarım
- **Desktop**: 260px genişliğinde sabit sidebar
- **Mobile**: Collapsible sidebar, hamburger menü
- **Breakpoint**: 768px altında mobile layout

## 🛠️ Teknolojiler

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **State Management**: React Hooks
- **TypeScript**: Tam tip desteği

## 📁 Dosya Yapısı

```
src/
├── app/
│   ├── (dashboard)/          # 🔒 Korunan dashboard sayfaları
│   │   ├── layout.tsx       # Auth guard ile korunan layout
│   │   ├── page.tsx         # Dashboard ana sayfa
│   │   ├── courses/         # 📚 Derslerim sayfası
│   │   ├── assignments/     # 📝 Ödevler sayfası
│   │   ├── grades/          # 🎓 Notlar sayfası
│   │   ├── messages/        # 💬 Mesajlar sayfası
│   │   └── settings/        # ⚙️ Ayarlar sayfası
│   ├── login/               # 🔐 Login sayfası
│   │   ├── layout.tsx       # Login layout
│   │   └── page.tsx         # Login form
│   ├── styles/              # 🎨 Global stiller
│   │   └── globals.css      # Tailwind CSS + custom styles
│   ├── layout.tsx           # Ana layout
│   └── page.tsx             # Ana sayfa (auth kontrolü)
├── components/
│   └── ui/
│       ├── Sidebar.tsx      # 🧭 Sidebar bileşeni
│       └── UserCard.tsx     # 👤 Kullanıcı kartı
└── hooks/
    └── useAuth.tsx          # 🔑 Authentication hook
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+ 
- npm veya yarn

### Kurulum
```bash
# Dependency'leri yükle
npm install

# Development server'ı başlat
npm run dev

# Production build
npm run build

# Production server'ı başlat
npm start
```

### Demo Hesap Bilgileri
- **E-posta**: `merve@example.com`
- **Şifre**: `password123`

## 🧪 Test Senaryoları

### ✅ Başarılı Testler
1. **Login**: Doğru bilgilerle giriş yapma
2. **Protected Routes**: Token ile dashboard erişimi
3. **Logout**: Çıkış yapma ve login'e yönlendirme
4. **Auto Redirect**: Token yoksa login'e yönlendirme
5. **Responsive**: Mobil ve desktop uyumluluk

### 🔒 Güvenlik
- Token olmadan dashboard sayfalarına erişim engelleniyor
- Her sayfa yenilemesinde token kontrolü yapılıyor
- Logout sonrası token tamamen siliniyor

## 🎯 Kullanım

### 1. Giriş Yapma
- `/login` sayfasına git
- Demo hesap bilgilerini kullan
- Başarılı girişte otomatik olarak `/dashboard`'a yönlendirilir

### 2. Dashboard Erişimi
- Tüm dashboard sayfaları token kontrolü ile korunuyor
- Token yoksa otomatik olarak `/login`'e yönlendirilir
- Sidebar'dan farklı sayfalara navigasyon yapılabilir

### 3. Çıkış Yapma
- Sidebar'ın altındaki "Çıkış Yap" butonuna tıkla
- Token silinir ve `/login` sayfasına yönlendirilir

## 🔧 Geliştirme

### Yeni Sayfa Ekleme
1. `src/app/(dashboard)/` altında yeni klasör oluştur
2. `page.tsx` dosyası ekle
3. Sidebar menüsüne yeni öğe ekle

### Stil Değişiklikleri
- Tailwind CSS v4 kullan
- `src/app/styles/globals.css` dosyasını düzenle
- Custom CSS variables kullan

### Authentication
- `src/hooks/useAuth.tsx` dosyasını düzenle
- Mock user data güncelle
- Yeni authentication method'ları ekle

## 📝 Notlar

- **Mock System**: Gerçek backend entegrasyonu için `useAuth` hook'u güncellenebilir
- **Token Expiry**: Gerçek uygulamada token süresi kontrolü eklenebilir
- **Refresh Token**: Otomatik token yenileme mekanizması eklenebilir
- **Error Handling**: Daha detaylı hata yönetimi geliştirilebilir

## 🤝 Katkıda Bulunma

1. Fork yap
2. Feature branch oluştur (`git checkout -b feature/amazing-feature`)
3. Commit yap (`git commit -m 'Add amazing feature'`)
4. Push yap (`git push origin feature/amazing-feature`)
5. Pull Request oluştur

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje hakkında sorularınız için issue açabilir veya pull request gönderebilirsiniz.
