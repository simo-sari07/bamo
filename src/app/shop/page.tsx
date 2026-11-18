"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { LanguageCurrencyModal } from "@/components/LanguageCurrencyModal";
import { useStore } from "@/lib/store-context";
import { PRODUCTS } from "@/data/catalog";
import { Product } from "@/types/store";
import { Plus, SlidersHorizontal, Sparkles } from "lucide-react";
import { getLocalizedCategoryTag, getLocalizedBadge } from "@/lib/localize";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category") || "all";

  const { t, language, formatPrice, addToCart } = useStore();
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [sortBy, setSortBy] = useState<string>("featured");

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const categories = [
    { id: "all", label: t.shop.all },
    { id: "parfums", label: t.shop.parfums },
    { id: "homme", label: t.shop.forHim },
    { id: "femme", label: t.shop.forHer },
    { id: "sets", label: t.shop.sets },
  ];

  let filtered = products.filter((p) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "homme") return p.gender === "homme" || p.gender === "unisexe";
    if (selectedCategory === "femme") return p.gender === "femme" || p.gender === "unisexe";
    return p.category === selectedCategory;
  });

  if (sortBy === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.priceMAD - b.priceMAD);
  } else if (sortBy === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.priceMAD - a.priceMAD);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-left rtl:text-right">
      {/* Title & Banner */}
      <div className="border-b border-black/10 pb-8 mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-[10px] font-mono tracking-widest text-[#111111] uppercase font-semibold">
          <Sparkles className="w-3 h-3 text-[#E9B949]" />
          <span>{t.shop.tag}</span>
        </div>
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#111111]">
          {t.shop.titlePart1} <span className="accent-underline">{t.shop.titleAccent}</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6864] max-w-xl">
          {t.shop.subtitle}
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#111111] text-white shadow-xs"
                  : "bg-white text-[#111111] border border-black/10 hover:border-black/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B6864]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-black/15 text-xs text-[#111111] rounded-full px-3.5 py-2 focus:outline-hidden cursor-pointer"
          >
            <option value="featured">{t.shop.sortFeatured}</option>
            <option value="price-asc">{t.shop.sortPriceAsc}</option>
            <option value="price-desc">{t.shop.sortPriceDesc}</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l rtl:border-l-0 rtl:border-r border-black/10 bg-[#F6F2EC]">
        {filtered.map((product: Product) => {
          const hasDiscount = product.originalPriceMAD && product.originalPriceMAD > product.priceMAD;

          return (
            <div
              key={product.id}
              className="group relative flex flex-col justify-between p-6 sm:p-8 border-r rtl:border-r-0 rtl:border-l border-b border-black/10 hover:bg-[#F2ECE4] transition-colors duration-200"
            >
              {/* Category Tag */}
              <div className="flex items-center justify-between text-[10px] tracking-[0.2em] text-[#6B6864] uppercase font-semibold">
                <span>{getLocalizedCategoryTag(product.categoryTag, language)}</span>
                {product.badge && (
                  <span className="text-[9px] bg-[#111111] text-white px-2 py-0.5 rounded-full font-mono">
                    {getLocalizedBadge(product.badge, language)}
                  </span>
                )}
              </div>

              {/* Product Image Link */}
              <Link
                href={`/product/${product.slug}`}
                className="relative my-8 h-64 sm:h-72 w-full flex items-center justify-center cursor-pointer"
              >
                <div className="relative w-full h-full transform transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={product.image}
                    alt={product.name[language]}
                    fill
                    className="object-contain p-2 drop-shadow-md"
                  />
                </div>

                {/* Quick Add Pill */}
                <div className="absolute inset-x-0 bottom-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="bg-white/95 backdrop-blur-xs text-[#111111] border border-black/10 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#111111] hover:text-white transition shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.actions.addToCart}</span>
                  </button>
                </div>
              </Link>

              {/* Title & Price */}
              <div className="text-center space-y-1.5 pt-2">
                <Link
                  href={`/product/${product.slug}`}
                  className="block text-xs sm:text-[13px] font-semibold text-[#111111] tracking-wide leading-snug hover:opacity-70 transition"
                >
                  {product.name[language]}
                </Link>

                <div className="flex items-center justify-center gap-2 font-mono text-xs">
                  <span className="font-bold text-[#111111]">
                    {formatPrice(product.priceMAD)}
                  </span>
                  {hasDiscount && product.originalPriceMAD && (
                    <span className="text-[#888580] line-through text-[11px]">
                      {formatPrice(product.originalPriceMAD)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ShopPage() {
  const { t } = useStore();

  return (
    <main className="min-h-screen flex flex-col bg-[#F6F2EC]">
      <Header />
      <Suspense fallback={<div className="p-12 text-center text-xs text-[#6B6864] font-mono">{t.shop.loading}</div>}>
        <ShopContent />
      </Suspense>
      <CartDrawer />
      <LanguageCurrencyModal />
      <Footer />
    </main>
  );
}
