const fs = require('fs');
const path = require('path');

const a1Path = path.join(__dirname, '../content/grammar/a1.json');
const a2Path = path.join(__dirname, '../content/grammar/a2.json');

const a1 = JSON.parse(fs.readFileSync(a1Path, 'utf8'));
const a2 = JSON.parse(fs.readFileSync(a2Path, 'utf8'));

// Düzeltme 1: A1 L01 -> L02 Birleşimi
// We will just rename and adjust description a bit, L1 is Alfabe, L2 is hece kurma
a1.lessons[0].title = "L1: Hangul - Alfabe, Ünlüler ve Ünsüzler";
a1.lessons[1].title = "L2: Hece Kurma, Okuma Kuralları ve Batchim";


// Zamirler ve Ülkeler -> Injecting as a new lesson before L3
const newL3 = {
  id: "a1-l02a",
  order: 2.5,
  title: "L3: Kişi Zamirleri, İyelik (의) ve Milliyetler",
  description: "Ben, sen, o zamirleri, benim ve senin demeyi ve ülkeler/meslekler bağlamını öğreniyoruz.",
  teacherExplanation: "Korecede zamirler konuşma seviyesine göre değişir. 'Ben' demek için saygılı 저 veya samimi 나 kullanılır. Sahiplik belirtmek için (benim, senin) 의 eki kullanılır (telaffuzu 'e' şeklindedir). Bu derste ayrıca ülke, milliyet ve meslekleri cümle içinde kullanmayı da göreceğiz.",
  rules: [
    {
      name: "Kişi Zamirleri",
      pattern: "저 (saygılı ben), 나 (samimi ben), 우리 (biz)",
      explanation: "Korecede 'sen' (너/당신) kullanımı kısıtlıdır, genellikle kişinin unvanı veya adı kullanılır."
    },
    {
      name: "İyelik Eki: 의",
      pattern: "isim + 의",
      explanation: "Aitlik belirtir (benim, senin, Ali'nin). 저의 -> 제 (benim), 나의 -> 내 (benim - samimi) olarak kısaltılabilir."
    }
  ],
  examples: [
    {
      koText: "제 이름은 알리예요.",
      trText: "Benim adım Ali'dir.",
      pairs: [
        { ko: "제", tr: "benim", key: "w1", type: "word" },
        { ko: "이름", tr: "isim", key: "w2", type: "word" },
        { ko: "은", tr: "(konu eki)", key: "topic", type: "suffix" },
        { ko: "알리", tr: "Ali", key: "w3", type: "word" },
        { ko: "예요", tr: "-dir / olmak", key: "copula", type: "suffix" }
      ]
    },
    {
      koText: "이것은 내 책이에요.",
      trText: "Bu benim kitabımdır.",
      pairs: [
        { ko: "이것", tr: "bu nesne", key: "w1", type: "word" },
        { ko: "은", tr: "(konu eki)", key: "topic", type: "suffix" },
        { ko: "내", tr: "benim(samimi)", key: "w2", type: "word" },
        { ko: "책", tr: "kitap", key: "w3", type: "word" },
        { ko: "이에요", tr: "-dır / olmak", key: "copula", type: "suffix" }
      ]
    }
  ],
  checkpoints: [
    "Kişi zamirlerini biliyorum.",
    "İyelik eki (의) ve 제/내 kısaltmalarını biliyorum."
  ]
};

// Bu, Şu, O
a1.lessons.find(l => l.id === "a1-l05").title = "L5: İşaret Sıfatları (이, 그, 저) ve İşaret Zamirleri";
a1.lessons.find(l => l.id === "a1-l05").rules.push({
    name: "Özne Eki: 이/가",
    pattern: "isim + 이/가",
    explanation: "Cümlenin öznesini belirtir. 은/는 konu ekidir (kimin hakkında konuştuğumuz), 이/가 ise gerçek özne ekidir (eylemi kimin yaptığı)."
});

// A1: Hal Ekleri güncellemesi: 에, 에서, 부터 까지
// Let's create a specific particle lesson for (으)로 as well
const newParticleLesson = {
  id: "a1-particle-ro",
  order: 7.5,
  title: "L7.5: Yön ve Araç Eki - (으)로 ve Diğer Ekler",
  description: "(으)로 ekinin yön ve araç olarak kullanımını, ayrıca diğer bazı önemli ekleri öğreniyoruz.",
  teacherExplanation: "(으)로 eki, iki ana anlama gelir: 1) Bir yöne doğru (-e doğru: Seoul'e doğru gidiyorum) 2) Bir araçla (-ile: Otobüsle geldim, kalemle yazdım).",
  rules: [
    {
      name: "Yön ve Araç: (으)로",
      pattern: "isim + (으)로",
      explanation: "Sessiz harfle bitenlere 으로, sesli ve 'ㄹ' ile bitenlere 로 eklenir. 'Taksiyle' veya 'Sağa doğru' derken kullanılır."
    }
  ],
  examples: [
    {
      koText: "버스로 가요.",
      trText: "Otobüsle gidiyorum.",
      pairs: [
        { ko: "버스", tr: "otobüs", key: "w1", type: "word" },
        { ko: "로", tr: "ile (araç)", key: "topic", type: "suffix" },
        { ko: "가요", tr: "gidiyorum", key: "w2", type: "word" }
      ]
    }
  ],
  checkpoints: [
    "(으)로 ekinin araç ('ile') ve yön ('e doğru') kullanımını kavradım."
  ]
};

a1.lessons.push(newL3);
a1.lessons.push(newParticleLesson);

// A1 Sayılar: Sino ve Yerel
a1.lessons.find(l => l.id === "a1-l08").title = "L8: Sino (Çin) ve Yerel Kore Sayıları, Tarih/Saat Söyleme";

// A1 Olumsuzluk: 안, 못, 지 않다
a1.lessons.find(l => l.id === "a1-l11").title = "L11: Olumsuz Cümleler 1 ve 2 (안, 못, -지 않다)";
a1.lessons.find(l => l.id === "a1-l11").rules.push(
  {
    name: "Uzun Olumsuz: -지 않다",
    pattern: "fiil kökü + 지 않다 / 않아요",
    explanation: "안 kelimesi cümlenin/fiilin önüne gelirken, -지 않다 fiilin sonuna eklenir. İkisi de aynı anlama gelir ('yapmıyorum')."
  },
  {
    name: "Yeteneksizlik/İmkansızlık Uzun Olumsuz: -지 못하다",
    pattern: "fiil kökü + 지 못하다 / 못해요",
    explanation: "못 kelimesinin uzun halidir. Bir şeyi isteseniz de yapamadığınızı belirtir."
  }
);


// ---------------- A2 UPDATES -------------------

// A2 L1: Add "Doğrudan Aktarım/Dolaylı Hitap" hint since YouTube list has it.
const a2Additions = [
  {
    id: "a2-particles-2",
    order: 3.5,
    title: "L3.5: Özel Ekler (밖에, 쯤, 처럼/같이, 마다, (이)나)",
    description: "Günlük hayatta çok kullanılan bazı özel edatları ve ekleri öğreniyoruz.",
    teacherExplanation: "Korecede Türkçedeki 'gibi, kadar, her, dışında' anlamlarına gelen ve doğrudan kelimeye bitişen ekler vardır. Bunlar cümleyi zenginleştirir. Örneğin: 커피만 (sadece kahve) ile 커피밖에 없다 (kahveden başka yok) benzer anlamlara gelebilir fakat 밖에 her zaman olumsuz fiille kullanılır.",
    rules: [
      { name: "Haricinde, -den başka: 밖에", pattern: "isim + 밖에 + olumsuz fiil", explanation: "Her zaman olumsuz bir fiille kullanılır. 'Sadece o var' veya 'Ondan başka yok' anlamı verir." },
      { name: "Civarında, Yaklaşık: 쯤", pattern: "zaman/miktar + 쯤", explanation: "'Saat 2 civarında', '10 kişi kadar' derken kullanılır." },
      { name: "Gibi, Kadar: 처럼 / 같이", pattern: "isim + 처럼 veya 같이", explanation: "'Kuş gibi uçuyor', 'Benim gibi' derken kullanılır." },
      { name: "Her: 마다", pattern: "isim + 마다", explanation: "'Her gün', 'Her ev' derken kullanılır." },
      { name: "Miktar Abartısı / Seçenek: (이)나", pattern: "isim + (이)나", explanation: "1) '...kadar çok' (beklentiden fazla miktar), 2) '...veya' (seçenek) anlamlarında kullanılır." }
    ],
    examples: [
      {
        koText: "돈이 천 원밖에 없어요.",
        trText: "Bin wondan başka param yok (Sadece bin wonum var).",
        pairs: [
          { ko: "돈이", tr: "para", key: "w1", type: "word" },
          { ko: "천 원", tr: "1000 won", key: "w2", type: "word" },
          { ko: "밖에", tr: "-den başka", key: "suffix", type: "suffix" },
          { ko: "없어요", tr: "yok", key: "w3", type: "word" }
        ]
      },
      {
        koText: "천사처럼 예뻐요.",
        trText: "Melek gibi güzeldir.",
        pairs: [
          { ko: "천사", tr: "melek", key: "w1", type: "word" },
          { ko: "처럼", tr: "gibi", key: "suffix", type: "suffix" },
          { ko: "예뻐요", tr: "güzeldir", key: "w2", type: "word" }
        ]
      }
    ],
    checkpoints: ["밖에 ekinin olumsuz fiille kullanıldığını öğrendim.", "처럼 ve 마다 eklerini ayırabiliyorum."]
  },
  {
    id: "a2-connectors-soon",
    order: 8.5,
    title: "L8.5: Anında Bildirim ve Süreç (자마자, 는 중, 어/아 있다)",
    description: "Bir şey olur olmaz, tam yaparken veya bir durumda kalma hallerini öğreneceğiz.",
    teacherExplanation: "Zamanla ilgili nüanslı bağlaçlar: Bir eylem biter bitmez diğeri başlarsa 자마자; eylem o an devam ediyorsa 는 중; eylem bitmiş ama durumu hala devam ediyorsa 아/어 있다 (Örn: kapının açık 'durması', oturuyor 'olmak') kullanılır.",
    rules: [
      { name: "Yapar Yapmaz: -자마자", pattern: "fiil kökü + 자마자", explanation: "Eylem gerçekleşir gerçekleşmez. 'Eve varır varmaz uyudum.'" },
      { name: "Tam o an (Süreç): -는 중", pattern: "fiil kökü + 는 중이다", explanation: "고 있다 gibi şimdiki zaman/süreç belirtir fakat daha çok tam o olayın ortasında olunduğunu vurgular." },
      { name: "Durumun Devamlılığı: -아/어 있다", pattern: "fiil kökü + 아/어 있다", explanation: "Dikkat! 고 있다 eylemin kendisinin devamlılığıdır (giyiniyorum). 아/어 있다 ise eylem bitmiş, durumu devam ediyordur (giyinmişim/üstümde duruyor, sandalyede oturmuş vaziyetteyim)." }
    ],
    examples: [
      {
        koText: "집에 도착하자마자 잤어요.",
        trText: "Eve varır varmaz uyudum.",
        pairs: [
          { ko: "집에", tr: "eve", key: "w1", type: "word" },
          { ko: "도착하", tr: "var", key: "w2", type: "word" },
          { ko: "자마자", tr: "-ır -ırmaz", key: "suffix", type: "suffix" },
          { ko: "잤어요", tr: "uyudum", key: "w3", type: "word" }
        ]
      }
    ],
    checkpoints: ["자마자 ile anında gerçekleşen eylemleri anlatabiliyorum.", "고 있다 ile 아/어 있다 farkını ayırt edebiliyorum."]
  },
  {
    id: "a2-emotions-assumptions",
    order: 17.5,
    title: "L17.5: Duygu Aktarımı, Tepkiler ve Varsayım (네/군요, 아/어하다, 것 같다)",
    description: "Korecede günlük konuşmada duyduğun/gördüğün şeylere şaşırma veya o an fark etme ifadeleri ve başkalarının duygularını aktarma.",
    teacherExplanation: "Korece iletişimde karşındakine tepki vermek çok önemlidir. -군요 (öyleymiş!) ve -네요 (öyle ya!) bu görevi üstlenir. İkincisi, 3. bir kişinin duygularından (o üzgün, o kızgın) bahsederken sıfatları '아/어하다' fiiline çevirmeliyiz. Üçüncüsü, tahminde bulunurken kullanılan -(으)ㄴ/는/(으)ㄹ 것 같다 (gibi görünüyor) yapısıdır.",
    rules: [
      { name: "Şaşırma / Yeni Fakındalık: -네요 ve -군요", pattern: "fiil/sıfat + 네요 / 군요", explanation: "네요 genellikle o an duyusal olarak fark edilen (Aa yağmur yağıyor!) eylemlerde; 군요 (isimler için 이군요) ise yeni öğrenilen bir bilgi üzerine tepkidir." },
      { name: "3. Tekil Duygusu: -아/어하다", pattern: "duygu sıfatı kökü + 아/어하다", explanation: "Korecede 1. ve 2. tekil şahıslar için kullanılan duygu sıfatları (korkmak, sevinmek), 3. kişi için doğrudan kullanılamaz. Sonuna 아/어하다 eklenerek fiilleştirilir." },
      { name: "Tahmin / Görünüş: -(으)ㄴ/는/(으)ㄹ 것 같다", pattern: "fiil/sıfat + 것 같다", explanation: "Türkçedeki 'gibi görünüyor' veya 'sanırım...' anlamını taşır. Zamanlara göre 은(geçmiş), 는(şimdiki), 을(gelecek) kullanılır." }
    ],
    examples: [
      {
        koText: "비가 오네요!",
        trText: "Aa, yağmur yağıyor ya!",
        pairs: [
          { ko: "비가", tr: "yağmur", key: "w1", type: "word" },
          { ko: "오", tr: "geliyor", key: "w2", type: "word" },
          { ko: "네요", tr: "(ünlem)", key: "suffix", type: "suffix" }
        ]
      },
      {
        koText: "비가 올 것 같아요.",
        trText: "Yağmur yağacak gibi görünüyor.",
        pairs: [
          { ko: "비가", tr: "yağmur", key: "w1", type: "word" },
          { ko: "올", tr: "yağacak", key: "w2", type: "word" },
          { ko: "것 같아요", tr: "gibi görünüyor / sanırım", key: "suffix", type: "suffix" }
        ]
      }
    ],
    checkpoints: ["네요 ve 군요 ile doğal tepki verebiliyorum.", "Başkalarının duygularından bahsederken 아/어하다 kullanmam gerektiğini biliyorum."]
  }
];

a2Additions.forEach(add => a2.lessons.push(add));

// A1: Sort by order
a1.lessons.sort((a,b) => a.order - b.order);
a2.lessons.sort((a,b) => a.order - b.order);

// Re-assign IDs and simple formatting if necessary
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

console.log('Successfully updated a1.json and a2.json!');
