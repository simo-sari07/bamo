"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CurrencyCode, LanguageCode, Product, ProductVariant, CartItem } from "@/types/store";
import { STORE_CONFIG } from "@/config/store.config";
import { translations } from "@/lib/translations";

interface StoreContextType {
  language: LanguageCode;
  currency: CurrencyCode;
  setLanguage: (lang: LanguageCode) => void;
  setCurrency: (curr: CurrencyCode) => void;
  formatPrice: (amountMAD: number) => string;
  t: (typeof translations)["en"];
  cart: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotalMAD: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLangModalOpen: boolean;
  setIsLangModalOpen: (open: boolean) => void;
  isCartLoaded: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = "bamo_cart_items_v2";
const LANG_STORAGE_KEY = "bamo_lang_pref";
const CURR_STORAGE_KEY = "bamo_curr_pref";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(STORE_CONFIG.defaultLanguage);
  const [currency, setCurrencyState] = useState<CurrencyCode>(STORE_CONFIG.defaultCurrency);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Load persisted preferences and cart on client mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as LanguageCode | null;
      if (savedLang && STORE_CONFIG.languages[savedLang]) {
        setLanguageState(savedLang);
      }

      const savedCurr = localStorage.getItem(CURR_STORAGE_KEY) as CurrencyCode | null;
      if (savedCurr && STORE_CONFIG.currencies[savedCurr]) {
        setCurrencyState(savedCurr);
      }

      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to read from localStorage:", e);
    } finally {
      setIsCartLoaded(true);
    }
  }, []);

  // Save cart changes to localStorage
  useEffect(() => {
    if (isCartLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (e) {
        console.warn("Failed to write cart to localStorage:", e);
      }
    }
  }, [cart, isCartLoaded]);

  // Sync HTML lang and dir attributes
  useEffect(() => {
    const dir = STORE_CONFIG.languages[language]?.dir || "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {}
  };

  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr);
    try {
      localStorage.setItem(CURR_STORAGE_KEY, curr);
    } catch {}
  };

  const formatPrice = (amountMAD: number): string => {
    const config = STORE_CONFIG.currencies[currency];
    const converted = amountMAD * config.rateFromMAD;

    if (currency === "MAD") {
      return `${Math.round(converted)} ${config.symbol}`;
    } else if (currency === "EUR") {
      return `€${converted.toFixed(2)}`;
    } else {
      return `$${converted.toFixed(2)}`;
    }
  };

  const addToCart = (product: Product, variant?: ProductVariant, quantity = 1) => {
    const selectedVariant = variant || product.variants[0];
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.variant.id === selectedVariant.id
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [...prev, { product, variant: selectedVariant, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.variant.id === variantId))
    );
  };

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.variant.id === variantId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotalMAD = cart.reduce(
    (acc, item) => acc + item.variant.priceMAD * item.quantity,
    0
  );

  const t = translations[language];

  return (
    <StoreContext.Provider
      value={{
        language,
        currency,
        setLanguage,
        setCurrency,
        formatPrice,
        t,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotalMAD,
        isCartOpen,
        setIsCartOpen,
        isLangModalOpen,
        setIsLangModalOpen,
        isCartLoaded,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
