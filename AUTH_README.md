# LMS Authentication Sistemi

## Genel Bakış
Bu proje, Next.js 14 App Router kullanarak oluşturulmuş bir LMS (Learning Management System) frontend uygulamasıdır. Mock authentication sistemi ile korunan sayfalar ve kullanıcı yönetimi içerir.

## Özellikler

### 🔐 Authentication
- **Mock Authentication**: Gerçek backend olmadan çalışan authentication sistemi
- **LocalStorage Token**: `lms_token` key'i ile token saklama
- **Protected Routes**: Dashboard sayfaları token kontrolü ile korunuyor
- **Auto Redirect**: Token yoksa otomatik olarak login sayfasına yönlendirme

### 👤 Kullanıcı Bilgileri
- **Demo Hesap**: 
  - E-posta: `merve@example.com`
  - Şifre: `password123`
- **Mock User Data**: Kullanıcı bilgileri `useAuth` hook'unda gömülü

### 🎨 UI/UX
- **Modern Design**: Pastel mavi tema ile şık tasarım
- **Responsive**: Mobil ve desktop uyumlu
- **Form Validation**: React Hook Form + Zod ile form doğrulama
- **Loading States**: Authentication sırasında loading göstergeleri

## Dosya Yapısı

```
src/
├── app/
│   ├── (dashboard)/          # Korunan dashboard sayfaları
│   │   ├── layout.tsx       # Auth guard ile korunan layout
│   │   ├── page.tsx         # Dashboard ana sayfa
│   │   ├── courses/         # Derslerim sayfası
│   │   ├── assignments/     # Ödevler sayfası
│   │   ├── grades/          # Notlar sayfası
│   │   ├── messages/        # Mesajlar sayfası
│   │   └── settings/        # Ayarlar sayfası
│   ├── login/               # Login sayfası
│   │   ├── layout.tsx       # Login layout
│   │   └── page.tsx         # Login form
│   ├── layout.tsx           # Ana layout
│   └── page.tsx             # Ana sayfa (auth kontrolü)
├── components/
│   └── ui/
│       ├── Sidebar.tsx      # Sidebar bileşeni
│       └── UserCard.tsx     # Kullanıcı kartı
├── hooks/
│   └── useAuth.tsx          # Authentication hook
└── styles/
    └── globals.css          # Global stiller
```

## Kullanım

### 1. Giriş Yapma
- `/login` sayfasına git
- Demo hesap bilgilerini kullan:
  - E-posta: `merve@example.com`
  - Şifre: `password123`
- Başarılı girişte otomatik olarak `/dashboard`'a yönlendirilir

### 2. Dashboard Erişimi
- Tüm dashboard sayfaları token kontrolü ile korunuyor
- Token yoksa otomatik olarak `/login`'e yönlendirilir
- Sidebar'dan farklı sayfalara navigasyon yapılabilir

### 3. Çıkış Yapma
- Sidebar'ın altındaki "Çıkış Yap" butonuna tıkla
- Token silinir ve `/login` sayfasına yönlendirilir

## Teknik Detaylar

### useAuth Hook
```typescript
const { user, isLoading, login, logout, getUser, isAuthenticated } = useAuth();
```

**Fonksiyonlar:**
- `login(email, password)`: Giriş yap
- `logout()`: Çıkış yap
- `getUser()`: Kullanıcı bilgisini al
- `isAuthenticated()`: Giriş durumunu kontrol et

**State:**
- `user`: Giriş yapmış kullanıcı bilgisi
- `isLoading`: Authentication durumu

### Auth Guard
Dashboard layout'ta `useEffect` ile token kontrolü yapılıyor:
```typescript
useEffect(() => {
  if (!isLoading && !isAuthenticated()) {
    router.push("/login");
  }
}, [isLoading, isAuthenticated, router]);
```

### Token Storage
- **Key**: `lms_token`
- **Format**: `mock_token_{timestamp}_{random}`
- **Storage**: LocalStorage
- **Lifetime**: Browser session (sayfa kapatılana kadar)

## Test Senaryoları

### ✅ Başarılı Testler
1. **Login**: Doğru bilgilerle giriş yapma
2. **Protected Routes**: Token ile dashboard erişimi
3. **Logout**: Çıkış yapma ve login'e yönlendirme
4. **Auto Redirect**: Token yoksa login'e yönlendirme

### 🔒 Güvenlik
- Token olmadan dashboard sayfalarına erişim engelleniyor
- Her sayfa yenilemesinde token kontrolü yapılıyor
- Logout sonrası token tamamen siliniyor

## Geliştirme Notları

- **Mock System**: Gerçek backend entegrasyonu için `useAuth` hook'u güncellenebilir
- **Token Expiry**: Gerçek uygulamada token süresi kontrolü eklenebilir
- **Refresh Token**: Otomatik token yenileme mekanizması eklenebilir
- **Error Handling**: Daha detaylı hata yönetimi geliştirilebilir

## Bağımlılıklar

- `react-hook-form`: Form yönetimi
- `zod`: Form doğrulama
- `lucide-react`: İkonlar
- `next/navigation`: Routing
- `tailwindcss`: Styling
