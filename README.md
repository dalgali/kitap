# Kitap Kurdu Dünyası

Yaz mevsimi için hazırlanmış, öğrencilerin okudukları kitapları paylaşabildiği ve en çok okuyanların görülebildiği bir okuma takip sayfası.

Canlı adres: [https://dalgali.github.io/kitap/](https://dalgali.github.io/kitap/)

## Ne Yapar

- Öğrenciler sınıf kodu, ad soyad, okul numarası, sınıf, şube, kitap adı ve puan girer.
- Yarım yıldız desteği vardır.
- İsteğe bağlı olarak üç kelime, alıntı cümlesi, öneri ve okuma kanıtı eklenebilir.
- En çok okuyanlar sıralanır ve okudukları kitaplar listelenir.
- Canlı akış kartlarında kitap bilgileri, yorum, puan ve ek alanlar anonim etiketlerle gösterilir.
- Türkçe büyük harf dönüşümü doğru çalışır.

## Tasarım Notu

Arayüz öğrencilerin hoşuna gidecek daha yumuşak, renkli ve hafif bir görselle tasarlandı.
Amaç, formu sıkıcı bir tablo gibi değil, paylaşılabilir bir yaz okuma panosu gibi göstermekti.

## Nasıl Çalışır

Bu proje iki parçadan oluşur:

1. Statik arayüz: `index.html`
2. Google Sheets arka ucu: `apps-script/Code.gs`

Ön yüz GitHub Pages üzerinden yayınlanır.
Kayıtlar ise Google Sheet'e, Apps Script web app üzerinden yazılır.

## Kurulum

### 1. GitHub Pages

- Repo'yu GitHub'a yükle.
- `Settings > Pages` kısmından `main` branch'ini yayınla.
- Yayınlanan adresi öğrencilere ver.

### 2. Google Sheet

- Yeni bir Google Sheet aç.
- Form yanıtlarının yazılacağı sayfayı hazırla.
- `Uzantılar > Apps Script` bölümünü aç.

### 3. Apps Script

- Repo içindeki [apps-script/Code.gs](/Users/cemaldalgali/Projects/kitap/apps-script/Code.gs) içeriğini Apps Script'teki `Code.gs` dosyasına yapıştır.
- `Deploy > New deployment > Web app` seç.
- `Execute as`: `Me`
- `Who has access`: okul hesabı varsa sadece o domain, yoksa ihtiyaca göre `Anyone`
- Yeni deployment URL'sini `index.html` içindeki `SCRIPT_URL` değişkenine bağla.

### 4. Sınıf Kodu

- Formda `Sınıf Kodu` alanı vardır.
- Kod HTML içinde görünmez; doğrulama Apps Script tarafındadır.
- Şu değerler kabul edilir:
  - `75`
  - `75EDRO`
  - bunların küçük/büyük harf varyasyonları

### 5. Public / Admin Ayrımı

- Public endpoint artık ham isim ve okul numarası döndürmez.
- Öğrenciler `Okur #1`, `Okur #2` gibi anonim etiketler görür.
- Tam listeyi görmek için Apps Script projesinde `ADMIN_VIEW_KEY` script property tanımlanır.
- Admin görünümü `?view=admin&key=...` ile açılır.
- Bu anahtar GitHub'da değil, Apps Script projesinde tutulmalıdır.

## Sheet Sütunları

Apps Script kayıtları şu alanlarla saklar:

- Zaman Damgası
- Ad Soyad
- Okul No
- Sınıf
- Şube
- Kitap Adı
- Yorum
- Puan
- Fotoğraf URL
- Üç Kelime
- Alıntı
- Öneri
- Öğrenci Anahtarı
- Sınıf Kodu

## Güvenlik ve Moderasyon

- Form gönderimleri Apps Script tarafında doğrulanır.
- Puan aralığı 0,5 ile 5 arasındadır.
- Yarim puanlar desteklenir.
- Sınıf, şube, alan uzunluğu ve hızlı tekrar gönderim sınırları vardır.
- Uygunsuz kelime kontrolü front-end'de yapılır.
- GitHub tarafında `main` branch'i ruleset ile korunabilir.

## Notlar

- Public görünümde ad soyad ve okul numarası gösterilmez.
- Admin görünümünde tam kayıtlar açılabilir.
- Canlı akış ve sıralama aynı veriden beslenir.
- Yarım yıldız görünümü SVG ile çizilir, bu yüzden cihazdan cihaza değişmez.

## Lisans

Bu proje `All Rights Reserved` olarak yayınlanıyor.
Kaynak kodu, sahibinin yazılı izni olmaksızın kopyalanamaz, değiştirilemez, dağıtılamaz veya türev çalışmalarda kullanılamaz.
