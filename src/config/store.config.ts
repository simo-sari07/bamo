import { CurrencyCode, CurrencyConfig, LanguageCode } from "@/types/store";

export const STORE_CONFIG = {
  brandName: "BAMO",
  brandSubtitle: "Haute Parfumerie & Extraits de Parfum",
  freeShippingThresholdMAD: 600, // Free shipping above 600 MAD
  standardShippingMAD: 35, // 35 DH standard shipping in Morocco
  defaultCurrency: "MAD" as CurrencyCode,
  defaultLanguage: "fr" as LanguageCode, // French is popular for luxury perfume in Morocco, with EN and AR available
  currencies: {
    MAD: {
      code: "MAD",
      symbol: "DH",
      rateFromMAD: 1.0,
      flag: "🇲🇦",
      name: "Dirham Marocain",
    },
    EUR: {
      code: "EUR",
      symbol: "€",
      rateFromMAD: 0.093,
      flag: "🇫🇷",
      name: "Euro",
    },
    USD: {
      code: "USD",
      symbol: "$",
      rateFromMAD: 0.1,
      flag: "🇺🇸",
      name: "US Dollar",
    },
  } as Record<CurrencyCode, CurrencyConfig>,
  languages: {
    fr: { code: "fr", name: "Français", dir: "ltr", flag: "🇫🇷" },
    en: { code: "en", name: "English", dir: "ltr", flag: "🇬🇧" },
    ar: { code: "ar", name: "العربية", dir: "rtl", flag: "🇲🇦" },
  } as Record<LanguageCode, { code: LanguageCode; name: string; dir: "ltr" | "rtl"; flag: string }>,
  moroccanCities: [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Tanger",
    "Fès",
    "Agadir",
    "Meknès",
    "Oujda",
    "Kénitra",
    "Tétouan",
    "Mohammédia",
    "El Jadida",
    "Salé",
    "Nador",
    "Safi",
    "Béni Mellal",
    "Khouribga",
    "Témara",
    "Dakhla",
    "Laâyoune",
  ],
  contact: {
    email: "contact@bamoparfums.ma",
    phone: "+212 6 00 00 00 00",
    whatsapp: "+212600000000",
    city: "Casablanca, Maroc",
  },
};
