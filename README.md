# kitap
Kitap okuma takibi

## Apps Script

Google Sheet'e bağlı Apps Script kodu repo içinde `apps-script/Code.gs` dosyasında tutulur.

Yarım yıldızların doğru görünmesi için Apps Script `doGet` tarafında puanı `4,5` metni olarak `parseFloat` ile okumamalı; önce virgülü noktaya çevirip `4.5` olarak JSON'a döndürmelidir. `apps-script/Code.gs` bunu yapar ve formdan gelen veriyi sunucu tarafında da doğrular.

Canlı sistemi güncellemek için Google Sheet'te `Uzantılar > Apps Script` bölümünü aç, `Code.gs` içeriğini repo'daki `apps-script/Code.gs` ile değiştir ve yeni dağıtım oluştur.
