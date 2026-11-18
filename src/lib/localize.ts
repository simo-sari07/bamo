import { LanguageCode } from "@/types/store";

export function getLocalizedCategoryTag(tag: string | undefined, lang: LanguageCode): string {
  if (!tag) {
    if (lang === "ar") return "مستخلص عطر نقي 32%";
    if (lang === "en") return "PURE EXTRAIT DE PARFUM 32%";
    return "EXTRAIT DE PARFUM 32%";
  }

  if (lang === "ar") {
    if (tag.includes("FLORAL")) return "01 مستخلص زهري فاخر";
    if (tag.includes("SIGNATURE")) return "02 بصمة عطرية شرقية";
    if (tag.includes("AMBRÉ") || tag.includes("AMBRE")) return "03 مستخلص عنبري ملكي";
    if (tag.includes("SOLAIRE")) return "04 مستخلص شرقي شمسي";
    if (tag.includes("COFFRET")) return "مجموعة الـ 4 عطور الحصرية";
    return "مستخلص عطر فاخر 32%";
  }

  if (lang === "en") {
    if (tag.includes("FLORAL")) return "01 FLORAL / EXTRAIT DE PARFUM";
    if (tag.includes("SIGNATURE")) return "02 SIGNATURE / EXTRAIT DE PARFUM";
    if (tag.includes("AMBRÉ") || tag.includes("AMBRE")) return "03 NOBLE AMBER / EXTRAIT";
    if (tag.includes("SOLAIRE")) return "04 SOLAR GOURMAND / EXTRAIT";
    if (tag.includes("COFFRET")) return "PRESTIGE 4-FRAGRANCE SET";
    return "EXTRAIT DE PARFUM 32%";
  }

  return tag;
}

export function getLocalizedBadge(badge: string | undefined, lang: LanguageCode): string {
  if (!badge) return "";

  if (lang === "ar") {
    if (badge.includes("27%")) return "توفير 27%";
    if (badge.includes("OFFRE") || badge.includes("BEST") || badge.includes("ICONIQUE")) return "الأكثر طلباً";
    return "عرض حصري";
  }

  if (lang === "en") {
    if (badge.includes("27%")) return "SAVE 27%";
    if (badge.includes("OFFRE") || badge.includes("BEST") || badge.includes("ICONIQUE")) return "BEST SELLER";
    return "EXCLUSIVE OFFER";
  }

  return badge;
}

export function getLocalizedVariantLabel(label: string, lang: LanguageCode): string {
  if (lang === "ar") {
    return label
      .replace("Extrait de Parfum Pur", "مستخلص عطر نقي")
      .replace("Extrait de Parfum", "مستخلص عطر")
      .replace("Flacon Prestige", "قنينة بريستيج فاخرة")
      .replace("Pack 4 Flacons (4 x 50ml)", "باك 4 قنينات كاملة (4 × 50 مل)")
      .replace("Pack 4 Flacons", "باك 4 قنينات كاملة");
  }
  return label;
}

const NOTE_TRANSLATIONS_AR: Record<string, string> = {
  "Litchi de Madagascar": "ليتشي مدغشقر الفاخر",
  "Baies Roses": "التوت الوردي",
  "Bergamote Scintillante": "البرغموت الإيطالي المنعش",
  "Rose de Damas Absolue": "خلاصة الورد الدمشقي النادر",
  "Pivoine Blanche": "الفاوانيا البيضاء",
  "Fleur d'Amandier": "زهر اللوز",
  "Musc Blanc Coton": "المسك الأبيض القطني",
  "Bois de Cèdre de l'Atlas": "خشب أرز الأطلس المغربي",
  "Ambre Doux": "العنبر الناعم",
  "Jasmin Sambac Nocturne": "ياسمين السامباك الليلي",
  "Néroli de Nabeul": "زهر الليمون (النيرولي)",
  "Vanille Noire de Madagascar": "الفانيليا السوداء الملكية",
  "Fleur d'Oranger Absolue": "خلاصة زهر البرتقال",
  "Patchouli Blanc": "الباتشولي الأبيض",
  "Ambre Doré Magnétique": "العنبر الذهبي المغناطيسي",
  "Fève Tonka": "حبوب التونكا",
  "Bergamote d'Italie": "برغموت إيطاليا",
  "Cardamome Verte": "الهيل الأخضر الفاخر",
  "Poivre Noir Sauvage": "الفلفل الأسود البري",
  "Cuir Velouté": "الجلد المخملي الفاخر",
  "Oud Précieux d'Assam": "العود الملكي الفاخر",
  "Ambre Sombre": "العنبر الداكن النبيل",
  "Bois de Gaïac": "خشب الغاياك العطري",
  "Encens Royal": "اللبان والبخور الملكي",
  "Agrumes Solaires": "الحمضيات المشمسة المنعشة",
  "Gingembre Frais": "الزنجبيل المنعش",
  "Fleur de Sel": "بلورات زهر الملح",
  "Caramel Beurre Salé": "الكراميل بالزبدة المملحة",
  "Jasmin Solaire": "الياسمين الشمسي",
  "Ylang-Ylang des Comores": "زهرة الإيلنغ الفواحة",
  "Vanille Bourbon": "فانيليا بوربون الغنية",
  "Bois Flotté": "الأخشاب الدافئة",
  "Muscs Dorés": "المسك الذهبي",
  "4 Flacons Signature (4 x 50ml)": "4 قنينات كاملة بحجم (4 × 50 مل)",
  "Fleurs Nobles & Agrumes Rares": "أندر الزهور الملكية والحمضيات",
  "Oud, Cuir, Vanille & Ambre": "العود، الجلد، الفانيليا والعنبر",
  "Sillage Incomparable (32% Pure)": "ثبات وفوحان استثنائي (تركيز 32%)",
};

export function getLocalizedNote(note: string, lang: LanguageCode): string {
  if (lang === "ar" && NOTE_TRANSLATIONS_AR[note]) {
    return NOTE_TRANSLATIONS_AR[note];
  }
  return note;
}
