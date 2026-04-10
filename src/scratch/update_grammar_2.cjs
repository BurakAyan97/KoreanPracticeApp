const fs = require('fs');
const path = require('path');

const a1Path = path.join(__dirname, '../content/grammar/a1.json');
const a2Path = path.join(__dirname, '../content/grammar/a2.json');

const a1 = JSON.parse(fs.readFileSync(a1Path, 'utf8'));
const a2 = JSON.parse(fs.readFileSync(a2Path, 'utf8'));

// ======== A1 ADDITIONS ========

// 1. Çoğul Eki (-들)
// A1-L3 (a1-l02a) "Kişi Zamirleri, İyelik (의) ve Milliyetler" dersine ekleyelim.
const zamirlerDersi = a1.lessons.find(l => l.id.includes('l02') && l.title.includes('Zamirleri'));
if (zamirlerDersi) {
    zamirlerDersi.title = "L3: Zamirler, Çoğul Eki (들) ve Milliyetler";
    zamirlerDersi.rules.push({
        name: "Çoğul Eki: 들",
        pattern: "isim/zamir + 들",
        explanation: "Korecede Türkçedeki gibi her şeye çoğul eki eklenmek zorunda değildir. Vurgu yapılmak istendiğinde insanlar ve canlılar için '들' (ler/lar) kullanılır. 우리 (biz) -> 우리들 (bizler), 학생 (öğrenci) -> 학생들 (öğrenciler)."
    });
}

// 2. Yer Yön Belirteçleri (앞, 뒤, 위, 아래, 옆, 안, 밖)
// A1-L6 (a1-l06) "있다 / 없다 ve Yer Bildirme" dersine eklenecek.
const yerDersi = a1.lessons.find(l => l.id === "a1-l06");
if (yerDersi) {
    yerDersi.title = "L6: 있다 / 없다 ve Yer/Yön Belirteçleri";
    yerDersi.rules.push({
        name: "Yer Yön Sözcükleri",
        pattern: "isim + Yer Kelimesi + 에",
        explanation: "앞 (Ön), 뒤 (Arka), 위 (Üst), 아래 (Alt), 옆 (Yan), 안 (İç), 밖 (Dış). Örn: 책상 위에 (Masanın üstünde), 문 앞에 (Kapının önünde)."
    });
    yerDersi.examples.push({
        koText: "고양이가 의자 아래에 있어요.",
        trText: "Kedi sandalyenin altındadır.",
        pairs: [
            { ko: "고양이", tr: "kedi", key: "w1", type: "word" },
            { ko: "가", tr: "(özne eki)", key: "sf1", type: "suffix" },
            { ko: "의자", tr: "sandalye", key: "w2", type: "word" },
            { ko: "아래", tr: "alt", key: "w3", type: "word" },
            { ko: "에", tr: "-da", key: "sf2", type: "suffix" },
            { ko: "있어요", tr: "vardır", key: "w4", type: "word" }
        ]
    });
}

// 3. Geçmişin Geçmişi ve Sahiplik (-았/었었어요 ve 것)
const gecmisDersi = a1.lessons.find(l => l.title.includes('Geçmiş'));
if (gecmisDersi) {
    gecmisDersi.rules.push({
        name: "Miş'li veya Daha Önceki Geçmiş Zaman",
        pattern: "fiil + 았/었었어요",
        explanation: "Geçmişte olmuş ve etkisi artık bitmiş bir olayı veya Türkçedeki miş'li geçmiş / yordu anlamını verir. Örn: 갔어요 (gitti) -> 갔었어요 (gitmişti / gidiyordu)."
    });
}

// 4. Yeni Ders: Soru Kelimeleri ve 것 (Benimki)
const soruDersi = {
    id: "a1-sorular-1",
    order: 12.5,
    title: "L12.5: Tüm Soru Kelimeleri ve 'şey' (것) Kullanımı",
    description: "Korecede 'kim, nerede, nasıl' gibi soru kelimelerini ve şey/benimki yapısını tek derste öğreniyoruz.",
    teacherExplanation: "Korece soru kelimeleri cümlede cümlenin başına geçmek zorunda değildir, sorulan ögenin yerine geçer. Ayrıca '것' kelimesi 'şey/nesne' anlamına gelir ve iyelik ekiyle birleşince 'benim şeyim = benimki (제 것)' anlamını taşır.",
    rules: [
        { name: "Kim, Ne, Nerede", pattern: "누구, 무엇(뭐), 어디", explanation: "누구: Kim / 무엇: Ne / 어디: Nerede" },
        { name: "Ne Zaman, Neden, Nasıl", pattern: "언제, 왜, 어떻게", explanation: "언제: Ne zaman / 왜: Neden / 어떻게: Nasıl" },
        { name: "Hangi, Ne tür", pattern: "어느, 무슨, 어떤", explanation: "어느: Hangi (Seçenekler arası) / 무슨: Hangi/Ne (Belirsiz nesne) / 어떤: Nasıl tür bir." },
        { name: "Sahiplik Zamiri: 제 것", pattern: "Zamir + 것", explanation: "'것' şey demektir. 제 것 (Benim şeyim -> Benimki), 네 것 (Seninki). Konuşmada 내 거, 제 거 diye kısalır." }
    ],
    examples: [
        {
            koText: "이것은 제 거 예요?",
            trText: "Bu benimki (benim şeyim) mi?",
            pairs: [
                { ko: "이것", tr: "bu nesne", key: "w1", type: "word" },
                { ko: "은", tr: "(konu)", key: "sf1", type: "suffix" },
                { ko: "제 거", tr: "benimki", key: "w2", type: "word" },
                { ko: "예요?", tr: "-mi (olmak)", key: "sf2", type: "suffix" }
            ]
        }
    ],
    checkpoints: ["Tüm Soru kelimelerinin anlamlarını biliyorum.", "제 거 ve 네 거 yapılarını biliyorum."]
};
a1.lessons.push(soruDersi);

// 5. Cümle Başı Bağlaçları
const baglacA1Dersi = {
    id: "a1-baglaclar-1",
    order: 13.5,
    title: "L13.5: Cümleleri Birbirine Bağlayan Zarflar",
    description: "Cümle başında kullanılan ve cümlenin akışını belirleyen kelimeler.",
    teacherExplanation: "Tıpkı Türkçedeki gibi iki farklı cümleyi bağlamak için cümle başı bağlaçları kullanılır.",
    rules: [
        { name: "Ve: 그리고", pattern: "Cümle 1. 그리고 Cümle 2.", explanation: "İki durumu veya eylemi sıralarken 've, ardından' anlamında." },
        { name: "Bu yüzden: 그래서", pattern: "Cümle 1. 그래서 Cümle 2.", explanation: "Sebep sonuç belirtir '...oldu, bu yüzden...'." },
        { name: "Ama, Ancak: 그렇지만 / 하지만", pattern: "Cümle 1. 그렇지만 Cümle 2.", explanation: "Zıtlıklarda kullanılır." },
        { name: "Fakat / Bu arada: 그런데 / 근데", pattern: "Cümle 1. 그런데 Cümle 2.", explanation: "Konuyu değiştirirken veya ancak derken kullanılır." }
    ],
    examples: [
        {
            koText: "배가 아파요. 그래서 병원에 가요.",
            trText: "Karnım ağrıyor. Bu yüzden hastaneye gidiyorum.",
            pairs: [
                { ko: "배가", tr: "karnım", key: "w1", type: "word" },
                { ko: "아파요", tr: "ağrıyor", key: "w2", type: "word" },
                { ko: "그래서", tr: "bu yüzden", key: "w3", type: "word" },
                { ko: "병원에", tr: "hastaneye", key: "w4", type: "word" },
                { ko: "가요", tr: "gidiyorum", key: "w5", type: "word" }
            ]
        }
    ],
    checkpoints: ["Ve, bu yüzden, ama kelimelerini cümle başında kullanabiliyorum."]
};
a1.lessons.push(baglacA1Dersi);


// ======== A2 ADDITIONS ========

// 1. Zarf Yapan (-게) ve Kıyaslama (더, 제일)
// Yeni ders
const zarfKiyaslamaDers = {
    id: "a2-zarf-kiyas-1",
    order: 1.5,
    title: "L1.5: Zarflar (-게) ve Kıyaslama Dereceleri (더, 제일/가장)",
    description: "Sıfatları zarfa çevirme ve eylemleri/nesneleri birbiriyle kıyaslama yapıları.",
    teacherExplanation: "Korecede sıfatlar eylemleri direkt niteleyemez. Nitelemeleri için '-게' alıp zarf olurlar (hızlı koştu). Miktar ve derece belirtirken de '더' (daha) ve '제일' (en) kelimeleri fiil/sıfatın önünde yer alır.",
    rules: [
        { name: "Zarf Türetme: -게", pattern: "sıfat kökü + 게", explanation: "Sıfatı zarfa dönüştürür. 예쁘다 (güzel) -> 예쁘게 (güzelce). 크게 말하세요 (yüksek sesle konuşun)." },
        { name: "Daha: 더", pattern: "더 + sıfat/fiil", explanation: "Daha büyük, daha çok vb. Örn: 더 크다 (Daha büyük)." },
        { name: "En: 제일 / 가장", pattern: "제일/가장 + sıfat/fiil", explanation: "Herhangi bir şeyin 'en' üst noktası olduğunu belirtir. 제일 좋다 (En iyisi)." }
    ],
    examples: [
        {
            koText: "더 예쁘게 쓰세요.",
            trText: "Daha güzelce (düzgün) yazınız.",
            pairs: [
                { ko: "더", tr: "daha", key: "w1", type: "word" },
                { ko: "예쁘", tr: "güzel", key: "w2", type: "word" },
                { ko: "게", tr: "-ce", key: "sf1", type: "suffix" },
                { ko: "쓰", tr: "yaz", key: "w3", type: "word" },
                { ko: "세요", tr: "-ınız (emir)", key: "sf2", type: "suffix" }
            ]
        }
    ],
    checkpoints: ["Sıfatlara 게 ekleyip zarf oluşturabiliyorum.", "더 ve 제일 ile karşılaştırma yapabiliyorum."]
};
a2.lessons.push(zarfKiyaslamaDers);

// 2. Dolaylı Anlatım Full Set
const dolayliAnlatim = {
    id: "a2-dolayli-1",
    order: 16.5,
    title: "L16.5: Dolaylı Anlatım (Reported Speech - 다고/자고/라고/냐고 하다)",
    description: "Başkasının söylediği cümleleri aktarma kuralları (Dedi ki, sordu, yapalım dedi vb.)",
    teacherExplanation: "Başkasının ağzından laf aktarırken cümlenin türüne göre ek değişir. Düz cümle ise 다고, soru ise 냐고, emir ise 라고, teklif ise 자고 eki ile 하다 (söylemek) birleştirilir.",
    rules: [
        { name: "Düz Cümle: 다고 하다", pattern: "fiil+ㄴ/는 다고 하다 / sıfat+다고 하다", explanation: "'Yağmur yağıyor' dedi. (비가 온다고 했어요)." },
        { name: "Soru Cümlesi: 냐고 하다/묻다", pattern: "fiil/sıfat + 냐고 하다", explanation: "'Nereye gidiyorsun?' diye sordu. (어디 가냐고 물었어요)." },
        { name: "Emir Cümlesi: (으)라고 하다", pattern: "fiil + (으)라고 하다", explanation: "'Buraya gel' dedi. (오라고 했어요)." },
        { name: "Teklif Cümlesi: 자고 하다", pattern: "fiil + 자고 하다", explanation: "'Birlikte yiyelim' dedi. (같이 먹자고 했어요)." }
    ],
    examples: [
        {
            koText: "내일 비가 온다고 했어요.",
            trText: "Yarın yağmur yağacağını söyledi.",
            pairs: [
                { ko: "내일", tr: "yarın", key: "w1", type: "word" },
                { ko: "비가", tr: "yağmur", key: "w2", type: "word" },
                { ko: "온", tr: "yağacağı", key: "w3", type: "word" },
                { ko: "다고 했어요", tr: "söyledi", key: "sf1", type: "suffix" }
            ]
        }
    ],
    checkpoints: ["Düz cümle ile soruyu farklı şekilde aktarabiliyorum."]
};
a2.lessons.push(dolayliAnlatim);

// 3. Edilgen ve Ettirgen Çatılar
const pasifAktif = {
    id: "a2-edilgen-ettirgen-1",
    order: 17.8,
    title: "L17.8: Edilgen (피동) ve Ettirgen (사동) Fiiller",
    description: "Yapılmak/Görülmek (Passive) ile Yaptırmak/Göstermek (Causative) fiil çatıları.",
    teacherExplanation: "Türkçedeki gibi kelime köküne gelen bir ekle (이, 히, 리, 기) fiiller edilgen hale gelir (보다: Görmek -> 보이다: Görünmek). Ettirgen fiiller (Yaptırmak, Yedirmek) için ise 이, 히, 리, 기, 우, 구, 추 eklerinden biri veya '-게 하다' kullanılır (먹다: Yemek -> 먹이다: Yedirmek).",
    rules: [
        { name: "Edilgen Çatı (Passive): 이/히/리/기", pattern: "fiil + 이/히/리/기", explanation: "Fiilin kendiliğinden yapıldığını belirtir. 듣다 (Duymak) -> 들리다 (Duyulmak)." },
        { name: "Ettirgen Çatı (Causative): 이/히/리/기/우/구/추", pattern: "fiil + 이/히/리/기/우/구/추 veya 게 하다", explanation: "Eylemin başkasına yaptırıldığını anlatır. 알다 (Bilmek) -> 알리다 (Bildirmek)." }
    ],
    examples: [
        {
            koText: "산이 보여요.",
            trText: "Dağ görünüyor.",
            pairs: [
                { ko: "산이", tr: "dağ", key: "w1", type: "word" },
                { ko: "보여요", tr: "görünüyor (보+이+어요)", key: "w2", type: "word" }
            ]
        },
        {
            koText: "아이에게 밥을 먹여요.",
            trText: "Çocuğa yemek yediriyor.",
            pairs: [
                { ko: "아이", tr: "çocuk", key: "w1", type: "word" },
                { ko: "에게", tr: "-a/e", key: "sf1", type: "suffix" },
                { ko: "밥을", tr: "yemek", key: "w2", type: "word" },
                { ko: "먹여요", tr: "yediriyor (먹+이+어요)", key: "w3", type: "word" }
            ]
        }
    ],
    checkpoints: ["Edilgen ve Ettirgen yapı eklerinin ne anlama geldiğini biliyorum."]
};
a2.lessons.push(pasifAktif);


// Sort orders and re-id
a1.lessons.sort((a,b) => a.order - b.order);
a2.lessons.sort((a,b) => a.order - b.order);

a1.lessons.forEach((l, idx) => {
    l.id = 'a1-l' + String(idx + 1).padStart(2, '0');
    l.order = idx + 1;
});
a2.lessons.forEach((l, idx) => {
    l.id = 'a2-l' + String(idx + 1).padStart(2, '0');
    l.order = idx + 1;
});

fs.writeFileSync(a1Path, JSON.stringify(a1, null, 2), 'utf8');
fs.writeFileSync(a2Path, JSON.stringify(a2, null, 2), 'utf8');

console.log('Successfully updated grammar with the 60 video series items!');
