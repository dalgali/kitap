const SHEET_NAME = "Form Yanıtları 1";
const DRIVE_FOLDER_ID = "";
const SUBMIT_COOLDOWN_SECONDS = 20;
const ALLOWED_CLASS_CODES = new Set(["75", "75EDRO"]);
const ADMIN_VIEW_KEY_PROPERTY = "ADMIN_VIEW_KEY";

const HEADERS = [
  "Zaman Damgası",
  "Ad Soyad",
  "Okul No",
  "Sınıf",
  "Şube",
  "Kitap Adı",
  "Yorum",
  "Puan",
  "Fotoğraf URL",
  "Üç Kelime",
  "Alıntı",
  "Öneri",
  "Öğrenci Anahtarı",
  "Sınıf Kodu"
];

const ALLOWED_CLASSES = new Set(["5", "6", "7", "8"]);
const ALLOWED_BRANCHES = new Set(["A", "B", "C", "Ç", "D", "E", "F", "G", "H", "I", "İ", "J", "K", "L", "M", "N", "O", "Ö", "P", "R", "S", "Ş", "T", "U", "Ü", "V", "Y", "Z"]);
const ALLOWED_RECOMMENDATIONS = new Set(["Evet", "Hayır", "Kararsızım", ""]);

function doGet(e) {
  const sheet = getSheet_();
  ensureHeaders_(sheet);

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return json_([]);
  }

  const headers = values[0].map(String);
  const rows = values.slice(1).filter(row => row.some(cell => cell !== ""));
  const adminView = isAdminRequest_(e);
  const records = rows.map(row => rowToObject_(headers, row));

  if (adminView) {
    return json_(records.map(item => {
      const puan = normalizePuan_(item["Puan"]);
      return {
        zaman: stringifyDate_(item["Zaman Damgası"]),
        adSoyad: safeText_(item["Ad Soyad"], 80),
        okulNo: safeText_(item["Okul No"], 16),
        sinifKodu: safeText_(item["Sınıf Kodu"], 12).toLocaleUpperCase("tr-TR"),
        sinif: safeText_(item["Sınıf"], 2),
        sube: safeText_(item["Şube"], 2).toLocaleUpperCase("tr-TR"),
        kitapAdi: safeText_(item["Kitap Adı"], 90),
        yorum: safeText_(item["Yorum"], 500),
        puan: puan,
        puanOndalik: puan,
        puanNokta: puan.toFixed(1),
        puanMetni: puan.toFixed(1).replace(".", ","),
        fotoUrl: safeUrl_(item["Fotoğraf URL"]) || "Fotoğraf Yok",
        ucKelime: safeText_(item["Üç Kelime"], 60),
        kitabiAnlatanUcKelime: safeText_(item["Üç Kelime"], 60),
        alintiCumle: safeText_(item["Alıntı"], 220),
        alinti: safeText_(item["Alıntı"], 220),
        onerirMi: safeText_(item["Öneri"], 20),
        arkadaslaraOneri: safeText_(item["Öneri"], 20),
        ogrenciAnahtari: safeText_(item["Öğrenci Anahtarı"], 128),
        ogrenciGorunenAd: safeText_(item["Ad Soyad"], 80),
        ogrenciGorunenNo: safeText_(item["Okul No"], 16)
      };
    }).reverse());
  }

  const labelMap = new Map();
  let labelCount = 1;

  const result = records.map(item => {
    const puan = normalizePuan_(item["Puan"]);
    const privateKey = publicReaderKey_(item);
    if (!labelMap.has(privateKey)) {
      const number = labelCount++;
      labelMap.set(privateKey, {
        id: `okur-${number}`,
        label: `Okur #${number}`
      });
    }
    const publicReader = labelMap.get(privateKey);

    return {
      publicOkurId: publicReader.id,
      okurEtiketi: publicReader.label,
      sinif: safeText_(item["Sınıf"], 2),
      sube: safeText_(item["Şube"], 2).toLocaleUpperCase("tr-TR"),
      kitapAdi: safeText_(item["Kitap Adı"], 90),
      yorum: safeText_(item["Yorum"], 500),
      puan: puan,
      puanOndalik: puan,
      puanNokta: puan.toFixed(1),
      puanMetni: puan.toFixed(1).replace(".", ","),
      fotoUrl: safeUrl_(item["Fotoğraf URL"]) || "Fotoğraf Yok",
      ucKelime: safeText_(item["Üç Kelime"], 60),
      kitabiAnlatanUcKelime: safeText_(item["Üç Kelime"], 60),
      alintiCumle: safeText_(item["Alıntı"], 220),
      alinti: safeText_(item["Alıntı"], 220),
      onerirMi: safeText_(item["Öneri"], 20),
      arkadaslaraOneri: safeText_(item["Öneri"], 20)
    };
  }).reverse();

  return json_(result);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);

  try {
    const payload = parsePayload_(e);
    const record = validatePayload_(payload);
    enforceCooldown_(record.ogrenciAnahtari || `${record.okulNo}|${record.adSoyad}`);

    const sheet = getSheet_();
    ensureHeaders_(sheet);

    sheet.appendRow([
      new Date(),
      record.adSoyad,
      record.okulNo,
      record.sinif,
      record.sube,
      record.kitapAdi,
      record.yorum,
      record.puan,
      uploadPhoto_(payload.fotoBase64),
      record.ucKelime,
      record.alintiCumle,
      record.onerirMi,
      record.ogrenciAnahtari,
      record.sinifKodu
    ]);

    return json_({ status: "success" });
  } catch (error) {
    return json_({ status: "error", message: error.message });
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];
}

function ensureHeaders_(sheet) {
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const current = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(String);

  if (!current[0]) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    return;
  }

  const missing = HEADERS.filter(header => !current.includes(header));
  if (missing.length > 0) {
    sheet.getRange(1, current.length + 1, 1, missing.length).setValues([missing]);
  }
}

function rowToObject_(headers, row) {
  return headers.reduce((object, header, index) => {
    object[header] = row[index];
    return object;
  }, {});
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Boş gönderim alındı.");
  }
  return JSON.parse(e.postData.contents);
}

function validatePayload_(payload) {
  const adSoyad = safeText_(payload.adSoyad || payload.ogrenciGorunenAd, 80);
  const okulNo = safeText_(payload.okulNo || payload.ogrenciGorunenNo, 16);
  const sinif = safeText_(payload.sinif, 2);
  const sube = safeText_(payload.sube, 2).toLocaleUpperCase("tr-TR");
  const sinifKodu = normalizeClassCode_(payload.sinifKodu);
  const kitapAdi = safeText_(payload.kitapAdi, 90);
  const yorum = safeText_(payload.yorum, 500);
  const puan = normalizePuan_(payload.puanOndalik || payload.puanNokta || payload.puanMetni || payload.puan);
  const ucKelime = safeText_(payload.ucKelime || payload.kitabiAnlatanUcKelime, 60);
  const alintiCumle = safeText_(payload.alintiCumle || payload.alinti, 220);
  const onerirMi = safeText_(payload.onerirMi || payload.arkadaslaraOneri, 20);
  const ogrenciAnahtari = safeText_(payload.ogrenciAnahtari, 128);

  if (!adSoyad || !okulNo || !sinifKodu || !sinif || !sube || !kitapAdi || !yorum) {
    throw new Error("Zorunlu alanlar eksik.");
  }
  if (!ALLOWED_CLASS_CODES.has(sinifKodu)) {
    throw new Error("Sınıf kodu yanlış.");
  }
  if (!ALLOWED_CLASSES.has(sinif)) {
    throw new Error("Sınıf bilgisi geçersiz.");
  }
  if (!ALLOWED_BRANCHES.has(sube)) {
    throw new Error("Şube bilgisi geçersiz.");
  }
  if (!ALLOWED_RECOMMENDATIONS.has(onerirMi)) {
    throw new Error("Öneri bilgisi geçersiz.");
  }
  if (puan < 0.5 || puan > 5 || Math.round(puan * 2) !== puan * 2) {
    throw new Error("Puan yarım yıldız aralıklarıyla 0,5 ile 5 arasında olmalı.");
  }

  return { adSoyad, okulNo, sinif, sube, kitapAdi, yorum, puan, ucKelime, alintiCumle, onerirMi, ogrenciAnahtari, sinifKodu };
}

function enforceCooldown_(key) {
  const cache = CacheService.getScriptCache();
  const cacheKey = `submit:${key}`;
  if (cache.get(cacheKey)) {
    throw new Error("Çok hızlı gönderim yapıldı.");
  }
  cache.put(cacheKey, "1", SUBMIT_COOLDOWN_SECONDS);
}

function normalizePuan_(value) {
  const number = Number(String(value ?? "").trim().replace(",", "."));
  if (!Number.isFinite(number)) {
    return 0;
  }
  return Math.max(0, Math.min(5, Math.round(number * 2) / 2));
}

function normalizeClassCode_(value) {
  return safeText_(value, 12).toLocaleUpperCase("tr-TR");
}

function publicReaderKey_(item) {
  const storedKey = safeText_(item["Öğrenci Anahtarı"], 128);
  if (storedKey) {
    return storedKey;
  }

  return [
    safeText_(item["Ad Soyad"], 80),
    safeText_(item["Okul No"], 16),
    safeText_(item["Sınıf"], 2),
    safeText_(item["Şube"], 2)
  ].join("|") || `legacy-${Utilities.getUuid()}`;
}

function isAdminRequest_(e) {
  const key = PropertiesService.getScriptProperties().getProperty(ADMIN_VIEW_KEY_PROPERTY);
  if (!key || !e || !e.parameter) {
    return false;
  }

  const view = String(e.parameter.view || e.parameter.mode || "").toLocaleLowerCase("tr-TR");
  const providedKey = String(e.parameter.key || e.parameter.adminKey || "").trim();
  return (view === "admin" || view === "private") && providedKey === key;
}

function safeText_(value, maxLength) {
  return String(value ?? "")
    .trim()
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/^[=+\-@]/, "'$&")
    .slice(0, maxLength);
}

function safeUrl_(value) {
  const url = safeText_(value, 500);
  return /^https?:\/\//i.test(url) ? url : "";
}

function uploadPhoto_(base64) {
  if (!base64) {
    return "Fotoğraf Yok";
  }
  if (!DRIVE_FOLDER_ID) {
    return "Fotoğraf Yok";
  }

  const parts = String(base64).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!parts) {
    return "Fotoğraf Yok";
  }

  const blob = Utilities.newBlob(Utilities.base64Decode(parts[2]), parts[1], `kitap-${Date.now()}`);
  const file = DriveApp.getFolderById(DRIVE_FOLDER_ID).createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function stringifyDate_(value) {
  if (Object.prototype.toString.call(value) === "[object Date]" && !Number.isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "dd.MM.yyyy HH:mm:ss");
  }
  return safeText_(value, 40);
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
