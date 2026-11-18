"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { PRODUCTS } from "@/data/catalog";
import { Product } from "@/types/store";
import { Plus } from "lucide-react";
import { getLocalizedCategoryTag, getLocalizedBadge } from "@/lib/localize";

export function BestSellers() {
  const { t, language, formatPrice, addToCart } = useStore();
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [activeTab, setActiveTab] = useState<"bestsellers" | "sets">("bestsellers");

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          setProductsList(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const filteredProducts =
    activeTab === "sets"
      ? productsList.filter((p) => p.category === "sets")
      : productsList;

  return (
    <section id="bestsellers" className="w-full bg-[#F6F2EC] py-14 sm:py-20 border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Tabs */}
        <div className="flex items-center gap-6 mb-10">
          <button
            onClick={() => setActiveTab("bestsellers")}
            className={`font-headline text-xl sm:text-2xl flex items-center gap-2.5 transition-all ${
              activeTab === "bestsellers"
                ? "text-[#111111] font-bold"
                : "text-[#6B6864] hover:text-[#111111] font-normal"
            }`}
          >
            {activeTab === "bestsellers" && (
              <span className="w-2 h-2 rounded-full bg-[#111111] inline-block" />
            )}
            <span>{t.tabs.bestSellers}</span>
          </button>

          <button
            onClick={() => setActiveTab("sets")}
            className={`font-headline text-xl sm:text-2xl transition-all ${
              activeTab === "sets"
                ? "text-[#111111] font-bold flex items-center gap-2.5"
                : "text-[#888580] hover:text-[#111111] font-normal"
            }`}
          >
            {activeTab === "sets" && (
              <span className="w-2 h-2 rounded-full bg-[#111111] inline-block" />
            )}
            <span>{t.tabs.sets}</span>
          </button>
        </div>

        {/* 4-Column Product Grid with Hairline Dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-black/10 bg-[#F6F2EC]">
          {filteredProducts.map((product: Product) => {
            const hasDiscount = product.originalPriceMAD && product.originalPriceMAD > product.priceMAD;

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between p-6 sm:p-8 border-r border-b border-black/10 hover:bg-[#F2ECE4] transition-colors duration-200"
              >
                {/* Top Benefit Tag */}
                <div className="flex items-center justify-between text-[10px] tracking-[0.25em] text-[#6B6864] uppercase font-semibold">
                  <span>{getLocalizedCategoryTag(product.categoryTag, language)}</span>
                  {product.badge && (
                    <span className="text-[9px] bg-[#111111] text-white px-2 py-0.5 rounded-full font-mono">
                      {getLocalizedBadge(product.badge, language)}
                    </span>
                  )}
                </div>

                {/* Product Image Linking to PDP */}
                <Link
                  href={`/product/${product.slug}`}
                  className="relative my-8 h-64 sm:h-72 w-full flex items-center justify-center cursor-pointer"
                >
                  <div className="relative w-full h-full transform transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={product.image}
                      alt={product.name[language]}
                      fill
                      className="object-contain p-2 drop-shadow-sm"
                    />
                  </div>

                  {/* Quick Add Pill on Hover */}
                  <div className="absolute inset-x-0 bottom-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="bg-white/95 backdrop-blur-xs text-[#111111] border border-black/10 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#111111] hover:text-white transition shadow-md flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.actions.addToCart}</span>
                    </button>
                  </div>
                </Link>

                {/* Product Name & Pricing */}
                <div className="text-center space-y-1.5 pt-2">
                  <Link
                    href={`/product/${product.slug}`}
                    className="block text-xs sm:text-[13px] font-medium text-[#111111] tracking-wide leading-snug hover:opacity-70 transition"
                  >
                    {product.name[language]}
                  </Link>

                  <div className="flex items-center justify-center gap-2 font-mono text-xs">
                    <span className="font-semibold text-[#111111]">
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

        {/* Minimal Progress Slider Bar matching screenshot */}
        <div className="mt-10 flex justify-center">
          <div className="w-48 h-0.5 bg-black/15 rounded-full overflow-hidden">
            <div className="w-20 h-full bg-[#111111] rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
