(function (window) {
    const WORD_LIST_PATHS = [
        "data/profanity-tr.txt",
        "data/profanity-en.txt"
    ];

    const FALLBACK_BAD_WORDS = [
        "salak", "aptal", "mal", "gerizekali", "gerizekalı", "manyak", "oç", "piç",
        "sik", "amk", "aq", "orospu", "pezevenk", "göt", "yavşak", "şerefsiz",
        "pust", "puşt", "hıyar", "skerim", "sikerim", "amına", "kaltak", "fahişe",
        "gavat", "pç", "yarak", "yarrak", "taşşak", "tassak", "fuck", "shit",
        "bitch", "asshole", "bastard"
    ];

    const SAFE_WORDS = new Set([
        "sıkıcı",
        "sıkıldım",
        "sıkıldık",
        "sıkılmak",
        "sıkılmadım",
        "sıkılmadan",
        "sıkmayan",
        "sıkmadan"
    ]);

    const PREFIX_BLOCK_ROOTS = [
        "sik"
    ];

    const TURKISH_WORD_RE = /[a-zA-ZçğıöşüÇĞİÖŞÜ0-9]+(?:['’.-][a-zA-ZçğıöşüÇĞİÖŞÜ0-9]+)*/g;
    let badWords = new Set(FALLBACK_BAD_WORDS.map(normalizeToken));
    let loadPromise = null;

    function normalizeToken(value) {
        return String(value || "")
            .normalize("NFKC")
            .replace(/[\u200B-\u200D\uFEFF]/g, "")
            .toLocaleLowerCase("tr-TR")
            .trim();
    }

    function escapeRegExp(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function hasPhrase(text, phrase) {
        const pattern = `(^|[^a-zA-ZçğıöşüÇĞİÖŞÜ0-9])${escapeRegExp(phrase)}($|[^a-zA-ZçğıöşüÇĞİÖŞÜ0-9])`;
        return new RegExp(pattern, "iu").test(text);
    }

    function tokensOf(text) {
        return normalizeToken(text).match(TURKISH_WORD_RE) || [];
    }

    async function loadWordLists() {
        const loaded = new Set(badWords);

        await Promise.all(WORD_LIST_PATHS.map(async (path) => {
            const response = await fetch(path, { cache: "no-store" });
            if (!response.ok) throw new Error(`${path} yüklenemedi`);

            const text = await response.text();
            text.split(/\r?\n/)
                .map(normalizeToken)
                .filter((word) => word && !word.startsWith("#"))
                .forEach((word) => loaded.add(word));
        }));

        badWords = loaded;
    }

    function hazirOl() {
        if (!loadPromise) {
            loadPromise = loadWordLists().catch((error) => {
                console.warn("Sansür listeleri yüklenemedi, yerel yedek liste kullanılacak.", error);
            });
        }
        return loadPromise;
    }

    function icerikUygunMu(metin) {
        if (!metin) return { uygun: true };

        const kontrolMetni = normalizeToken(metin);
        const spamHarfRegex = /([a-zğçşüöı])\1{4,}/i;

        if (spamHarfRegex.test(kontrolMetni)) {
            return { uygun: false, neden: "Lütfen anlamsız harf tekrarları (spam) yapma! 🧐" };
        }

        if (/(asdasd|qweqwe|hjghjg)/i.test(kontrolMetni)) {
            return { uygun: false, neden: "Lütfen gerçek ve anlamlı cümleler yazmaya özen göster! ✍️" };
        }

        const metinTokenleri = tokensOf(kontrolMetni);

        if (metin.length > 3 && metinTokenleri.length === 1 && /^[^aeiouıüöyeâîû]{4,}$/i.test(kontrolMetni)) {
            return { uygun: false, neden: "Yazdığın kelimeler biraz anlaşılmaz görünüyor, tekrar kontrol eder misin? 🤔" };
        }

        for (const token of metinTokenleri) {
            if (SAFE_WORDS.has(token)) continue;

            if (badWords.has(token)) {
                return { uygun: false, neden: "Yazdığın mesaj okul kurallarına ve arkadaşlarına uygun olmayan kelimeler içeriyor! 🛑" };
            }

            if (PREFIX_BLOCK_ROOTS.some((root) => token.startsWith(root))) {
                return { uygun: false, neden: "Yazdığın mesaj okul kurallarına ve arkadaşlarına uygun olmayan kelimeler içeriyor! 🛑" };
            }
        }

        for (const word of badWords) {
            if (word.includes(" ") && hasPhrase(kontrolMetni, word)) {
                return { uygun: false, neden: "Yazdığın mesaj okul kurallarına ve arkadaşlarına uygun olmayan kelimeler içeriyor! 🛑" };
            }
        }

        return { uygun: true };
    }

    window.KitapModerasyon = {
        hazirOl,
        icerikUygunMu,
        _test: { normalizeToken, tokensOf }
    };

    hazirOl();
})(window);
