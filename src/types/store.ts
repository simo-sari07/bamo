export type CurrencyCode = "MAD" | "EUR" | "USD";
export type LanguageCode = "fr" | "en" | "ar";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromMAD: number;
  flag: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  label: string; // e.g. "50 ml", "100 ml", "Coffret"
  priceMAD: number;
  stock: number;
}

export interface OlfactiveNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: {
    fr: string;
    en: string;
    ar: string;
  };
  subtitle?: {
    fr: string;
    en: string;
    ar: string;
  };
  categoryTag: string;
  category: "parfums" | "homme" | "femme" | "sets";
  family?: "boise" | "oriental" | "floral" | "frais";
  gender: "unisexe" | "homme" | "femme";
  concentration: string;
  description: {
    fr: string;
    en: string;
    ar: string;
  };
  priceMAD: number;
  originalPriceMAD?: number;
  image: string;
  gallery?: string[];
  badge?: string;
  variants: ProductVariant[];
  notes?: OlfactiveNotes;
  longevity?: string;
  sillage?: string;
  rating?: number;
  reviewsCount?: number;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface CODOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city: string;
  shippingAddress: string;
  notes?: string;
  items: {
    productId: string;
    variantId: string;
    productName: string;
    variantLabel: string;
    priceMAD: number;
    quantity: number;
  }[];
  totalMAD: number;
}
