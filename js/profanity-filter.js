(function (window) {
    const WORD_LIST_PATHS = [
        "data/profanity-tr.txt",
        "data/profanity-en.txt"
    ];

    const FALLBACK_BAD_WORDS = [
        "a.q", "a.q.", "abaza", "abazan", "ag", "ağzına sıçayım",
        "ahmak", "allah", "allahsız", "am", "am biti", "amarım",
        "ambiti", "amcığa", "amcığı", "amcığın", "amcığını", "amcığınızı",
        "amcık", "amcık hoşafı", "amcıklama", "amcıklandı", "amcıklar", "amcıklara",
        "amcıklarda", "amcıklardan", "amcıkları", "amcıkların", "amcıkta", "amcıktan",
        "amcik", "amck", "amckl", "amcklama", "amcklaryla", "amckta",
        "amcktan", "amcuk", "amı", "amık", "amın feryadı", "amın oglu",
        "amın oğlu", "amına", "amına koduğum", "amına koy", "amına koyarım", "amına koyayım",
        "amına koyyim", "amına s", "amına sikem", "amına sokam", "amınako", "amınakodum",
        "amınakoyim", "amını", "amını s", "amınoğlu", "amısına", "amısını",
        "amin oglu", "amina", "amina g", "amina k", "amina koyarim", "amina koyayım",
        "amina koyayim", "aminako", "aminakoyarim", "aminakoyim", "aminda", "amindan",
        "amindayken", "amini", "aminiyarraaniskiim", "aminoglu", "amiyum", "amk",
        "amk çocuğu", "amkafa", "amlar", "amlarnzn", "amlı", "amm",
        "ammak", "ammna", "amn", "amna", "amnda", "amndaki",
        "amngtn", "amnn", "amona", "amq", "amsız", "amsiz",
        "amsz", "amteri", "amugaa", "amuğa", "amuna", "ana",
        "anaaann", "anal", "analarn", "anam", "anamla", "anan",
        "anana", "anandan", "ananı", "ananı sikerim", "ananı sikeyim", "ananın",
        "ananın am", "ananın amı", "ananın dölü", "ananınki", "ananısikerim", "ananısikeyim",
        "ananızın", "ananızın am", "anani", "anani sikerim", "anani sikeyim", "ananin",
        "ananisikerim", "ananisikeyim", "anann", "ananz", "anas", "anası orospu",
        "anasını", "anasının am", "anasi", "anasinin", "anay", "anayin",
        "angut", "anneni", "annenin", "annesiz", "anuna", "aptal",
        "aq", "aq.", "ass", "asshole", "atkafası", "atmık",
        "attırdığım", "attrrm", "auzlu", "avrat", "ayklarmalrmsikerim", "azdım",
        "azdır", "azdırıcı", "babaannesi kaşar", "babanı", "babanın", "babani",
        "babası pezevenk", "bacağına sıçayım", "bacına", "bacını", "bacının", "bacini",
        "bacn", "bacndan", "bacy", "bastard", "basur", "beyinsiz",
        "bızır", "bitch", "biting", "bok", "boka", "bokbok",
        "bokça", "bokhu", "bokkkumu", "boklar", "boktan", "boku",
        "bokubokuna", "bokum", "bombok", "boner", "bosalmak", "boşalmak",
        "cenabet", "cibiliyetsiz", "cibilliyetini", "cibilliyetsiz", "cif", "cikar",
        "cim", "çingene", "Çingenede", "Çingeneden", "Çingeneler", "Çingenelerde",
        "Çingenelerden", "Çingenelere", "Çingeneleri", "Çingenelerin", "Çingenenin", "Çingeneye",
        "Çingeneyi", "çük", "dalaksız", "dallama", "daltassak", "dalyarak",
        "dalyarrak", "dangalak", "dassagi", "diktim", "dildo", "dingil",
        "dingilini", "dinsiz", "dkerim", "domal", "domalan", "domaldı",
        "domaldın", "domalık", "domalıyor", "domalmak", "domalmış", "domalsın",
        "domalt", "domaltarak", "domaltıp", "domaltır", "domaltırım", "domaltip",
        "domaltmak", "dölü", "dönek", "düdük", "eben", "ebeni",
        "ebenin", "ebeninki", "ebleh", "ecdadını", "ecdadini", "embesil",
        "emi", "fahise", "fahişe", "feriştah", "ferre", "fuck",
        "fucker", "fuckin", "fucking", "gavad", "gavat", "geber",
        "geberik", "gebermek", "gebermiş", "gebertir", "gerızekalı", "gerizekalı",
        "gerizekali", "gerzek", "giberim", "giberler", "gibis", "gibiş",
        "gibmek", "gibtiler", "goddamn", "godoş", "godumun", "gotelek",
        "gotlalesi", "gotlu", "gotten", "gotundeki", "gotunden", "gotune",
        "gotunu", "gotveren", "goyiim", "goyum", "goyuyim", "goyyim",
        "göt", "göt deliği", "göt herif", "göt oğlanı", "göt veren", "göt verir",
        "göte", "götelek", "götlalesi", "götlek", "götler", "götlerde",
        "götlerden", "götlere", "götleri", "götlerin", "götoğlanı", "götoş",
        "götte", "götten", "götü", "götün", "götüne", "götüne koyim",
        "götünekoyim", "götünü", "götveren", "götverende", "götverenden", "götverene",
        "götvereni", "götverenin", "götverenler", "götverenlerde", "götverenlerden", "götverenlere",
        "götverenleri", "götverenlerin", "gtelek", "gtn", "gtnde", "gtnden",
        "gtne", "gtten", "gtveren", "has siktir", "hasiktir", "hassikome",
        "hassiktir", "hassittir", "haysiyetsiz", "hayvan herif", "hırt", "hıyar",
        "hoşafı", "hödük", "hsktr", "huur", "ıbnelık", "ibina",
        "ibine", "ibinenin", "ibne", "ibnedir", "ibneleri", "ibnelik",
        "ibnelri", "ibneni", "ibnenin", "ibnerator", "ibnesi", "idiot",
        "idiyot", "imansz", "ipne", "iserim", "işerim", "itoğlu it",
        "kafam girsin", "kafasız", "kafasiz", "kahpe", "kahpenin", "kahpenin feryadı",
        "kaka", "kaltağa", "kaltağı", "kaltağın", "kaltak", "kaltaklar",
        "kaltaklara", "kaltaklarda", "kaltaklardan", "kaltakları", "kaltakların", "kaltakta",
        "kaltaktan", "kancık", "kancik", "kappe", "karhane", "kaşar",
        "kavat", "kavatn", "kaypak", "kayyum", "kerane", "kerhane",
        "kerhanelerde", "kevase", "kevaşe", "kevvase", "koca göt", "koduğmun",
        "koduğmunun", "kodumun", "kodumunun", "koduum", "koduumun", "koyarm",
        "koyayım", "koyiim", "koyiiym", "koyim", "koyum", "koyyim",
        "krar", "kukudaym", "laciye boyadım", "lavuk", "liboş", "madafaka",
        "mal", "malafat", "malak", "manyak", "mcik", "meme",
        "memelerini", "mezveleli", "minaamcık", "mincikliyim", "mna", "monakkoluyum",
        "motherfucker", "mudik", "o. çocuğu", "oc", "ocuu", "ocuun",
        "oç", "OÇ", "oğlan", "oğlancı", "oğlu it", "orosbucocuu",
        "orospu", "orospu cocugu", "orospu çoc", "orospu çocuğu", "orospu çocuğudur", "orospu çocukları",
        "orospucocugu", "orospuçocuğu", "orospuda", "orospudan", "orospudur", "orospular",
        "orospulara", "orospularda", "orospulardan", "orospuları", "orospuların", "orospunun",
        "orospunun evladı", "orospuya", "orospuydu", "orospuyu", "orospuyuz", "orostoban",
        "orostopol", "orrospu", "oruspu", "oruspu çocuğu", "oruspuçocuğu", "osbir",
        "ossurduum", "ossurmak", "ossuruk", "osur", "osurduu", "osuruk",
        "osururum", "otuz birci", "otuz bircide", "otuz birciden", "otuz birciler", "otuz bircilerde",
        "otuz bircilerden", "otuz bircilere", "otuz bircileri", "otuz bircilerin", "otuz bircinin", "otuz birciye",
        "otuz birciyi", "otuzbir", "öküz", "öşex", "patlak zar", "pç",
        "penis", "pezevek", "pezeven", "pezeveng", "pezevengi", "pezevengin evladı",
        "pezevenk", "pezo", "pic", "pici", "picler", "piç",
        "piç kurusu", "piçin oğlu", "piçler", "pipi", "pipiş", "pisliktir",
        "porno", "pussy", "pust", "puşt", "puşttur", "rahminde",
        "revizyonist", "s1kerim", "s1kerm", "s1krm", "sakso", "saksocu",
        "saksocuda", "saksocudan", "saksocular", "saksoculara", "saksocularda", "saksoculardan",
        "saksocuları", "saksocuların", "saksocunun", "saksocuya", "saksocuyu", "saksofon",
        "salaak", "salak", "salaq", "saxo", "sekis", "serefsiz",
        "sevgi koyarım", "sevişelim", "sexs", "shit", "sıçarım", "sıçmak",
        "sıçtığım", "sıecem", "sicarsin", "sie", "sik", "sikdi",
        "sikdiğim", "sike", "sikecem", "sikem", "siken", "sikenin",
        "siker", "siker sikmez", "sikerim", "sikerler", "sikersin", "sikertir",
        "sikertmek", "sikesen", "sikesicenin", "sikey", "sikeydim", "sikeyim",
        "sikeym", "siki", "sikicem", "sikici", "sikien", "sikienler",
        "sikiiim", "sikiiimmm", "sikiim", "sikiir", "sikiirken", "sikik",
        "sikil", "sikildiini", "sikilesice", "sikilir sikilmez", "sikilmi", "sikilmie",
        "sikilmis", "sikilmiş", "sikilsin", "sikim", "sikimde", "sikimden",
        "sikime", "sikimi", "sikimiin", "sikimin", "sikimle", "sikimsonik",
        "sikimtrak", "sikin", "sikinde", "sikinden", "sikine", "sikini",
        "sikip", "sikis", "sikisek", "sikisen", "sikish", "sikismis",
        "sikiş", "sikişen", "sikişme", "sikitiin", "sikiyim", "sikiym",
        "sikiyorum", "sikkim", "sikko", "sikler", "siklerde", "siklerden",
        "siklere", "sikleri", "sikleriii", "siklerin", "sikli", "sikm",
        "sikmek", "sikmem", "sikmemek", "sikmiler", "sikmisligim", "siksem",
        "sikseydin", "sikseyidin", "siksin", "siksinbaya", "siksinler", "siksiz",
        "siksok", "siksz", "sikt", "sikte", "sikten", "sikti",
        "siktigimin", "siktigiminin", "siktiğim", "siktiğimin", "siktiğiminin", "siktii",
        "siktiim", "siktiimin", "siktiiminin", "siktiler", "siktim", "siktimin",
        "siktiminin", "siktir", "siktir et", "siktir git", "siktir lan", "siktir ol git",
        "siktirgit", "siktirir", "siktirir siktirmez", "siktiririm", "siktiriyor", "siktirolgit",
        "sittimin", "sittir", "skcem", "skecem", "skem", "sker",
        "skerim", "skerm", "skeyim", "skiim", "skik", "skim",
        "skime", "skmek", "sksin", "sksn", "sksz", "sktiimin",
        "sktrr", "skyim", "slaleni", "sokam", "sokarım", "sokarim",
        "sokarm", "sokarmkoduumun", "sokayım", "sokaym", "sokiim", "soktuğumunun",
        "sokuk", "sokum", "sokuş", "sokuyum", "soxum", "sulaleni",
        "sülaleni", "sülalenizi", "sürtük", "şerefsiz", "şıllık", "taaklarn",
        "taaklarna", "tarrakimin", "tasak", "tassak", "taşağa", "taşağı",
        "taşağın", "taşak", "taşaklar", "taşaklara", "taşaklarda", "taşaklardan",
        "taşakları", "taşakların", "taşakta", "taşaktan", "taşşak", "tipini s.k",
        "tipinizi s.keyim", "tiyniyat", "toplarm", "topsun", "totoş", "vajina",
        "vajinanı", "veled", "veled i zina", "veledizina", "verdiimin", "weled",
        "weledizina", "whore", "xikeyim", "yaaraaa", "yalama", "yalarım",
        "yalarun", "yaraaam", "yarağa", "yarağı", "yarağın", "yarak",
        "yaraklar", "yaraklara", "yaraklarda", "yaraklardan", "yarakları", "yarakların",
        "yaraksız", "yarakta", "yaraktan", "yaraktr", "yaram", "yaraminbasi",
        "yaramn", "yararmorospunun", "yarra", "yarraaaa", "yarraak", "yarraam",
        "yarraamı", "yarragi", "yarragimi", "yarragina", "yarragindan", "yarragm",
        "yarrağ", "yarrağım", "yarrağımı", "yarraimin", "yarrak", "yarram",
        "yarramin", "yarraminbaşı", "yarramn", "yarran", "yarrana", "yarrrak",
        "yavak", "yavş", "yavşak", "yavşaktır", "yavuşak", "yılışık",
        "yilisik", "yogurtlayam", "yoğurtlayam", "yrrak", "zıkkımım", "zibidi",
        "zigsin", "zikeyim", "zikiiim", "zikiim", "zikik", "zikim",
        "ziksiiin", "ziksiin", "zulliyetini", "zviyetini"
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
            return { uygun: false, neden: "Lütfen anlamsız harf tekrarları (spam) yapma." };
        }

        if (/(asdasd|qweqwe|hjghjg)/i.test(kontrolMetni)) {
            return { uygun: false, neden: "Lütfen gerçek ve anlamlı cümleler yazmaya özen göster." };
        }

        const metinTokenleri = tokensOf(kontrolMetni);

        if (metin.length > 3 && metinTokenleri.length === 1 && /^[^aeiouıüöyeâîû]{4,}$/i.test(kontrolMetni)) {
            return { uygun: false, neden: "Yazdığın kelimeler biraz anlaşılmaz görünüyor, tekrar kontrol eder misin?" };
        }

        for (const token of metinTokenleri) {
            if (SAFE_WORDS.has(token)) continue;

            if (badWords.has(token)) {
                return { uygun: false, neden: "Yazdığın mesaj okul kurallarına ve arkadaşlarına uygun olmayan kelimeler içeriyor." };
            }

            if (PREFIX_BLOCK_ROOTS.some((root) => token.startsWith(root))) {
                return { uygun: false, neden: "Yazdığın mesaj okul kurallarına ve arkadaşlarına uygun olmayan kelimeler içeriyor." };
            }
        }

        for (const word of badWords) {
            if (word.includes(" ") && hasPhrase(kontrolMetni, word)) {
                return { uygun: false, neden: "Yazdığın mesaj okul kurallarına ve arkadaşlarına uygun olmayan kelimeler içeriyor." };
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
