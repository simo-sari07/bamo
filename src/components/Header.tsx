"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { STORE_CONFIG } from "@/config/store.config";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";

export function Header() {
  const {
    t,
    language,
    currency,
    setIsLangModalOpen,
    setIsCartOpen,
    cartCount,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const currConfig = STORE_CONFIG.currencies[currency];
  const langConfig = STORE_CONFIG.languages[language];

  return (
    <header className="sticky top-0 z-40 bg-[#F6F2EC] border-b border-black/10">
      {/* Top Announcement Bar */}
      <div className="border-b border-black/5 bg-[#EFE9DF] text-[11px] tracking-wider py-1.5 px-4 text-[#111111]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button className="p-0.5 text-[#6B6864] hover:text-[#111111] transition">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div className="text-center font-normal tracking-wide px-2 truncate">
            {t.announcement}
          </div>
          <button className="p-0.5 text-[#6B6864] hover:text-[#111111] transition">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#111111] hover:text-black cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Brand Logo (Left) */}
          <div className="flex items-center">
            <Link
              href="/"
              className="font-headline text-2xl md:text-3xl font-bold uppercase tracking-[0.25em] text-[#111111] hover:opacity-80 transition"
            >
              {STORE_CONFIG.brandName}
            </Link>
          </div>

          {/* Navigation Links (Center) - Real Routing to /shop, /pack, /#sourcing */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            <Link
              href="/shop"
              className="text-xs uppercase tracking-[0.2em] text-[#111111] hover:opacity-60 transition font-medium"
            >
              {t.nav.shop}
            </Link>
            <Link
              href="/product/pack-prestige-4-parfums"
              className="text-xs uppercase tracking-[0.2em] text-[#111111] hover:opacity-60 transition font-medium"
            >
              {t.nav.pack}
            </Link>
            <Link
              href="/#sourcing"
              className="text-xs uppercase tracking-[0.2em] text-[#111111] hover:opacity-60 transition font-medium"
            >
              {t.nav.learn}
            </Link>
            <Link
              href="/#bestsellers"
              className="text-xs uppercase tracking-[0.2em] text-[#111111] hover:opacity-60 transition font-medium"
            >
              {t.nav.bestsellers}
            </Link>
          </nav>

          {/* Right Utilities (Language/Currency, Search, Bag) */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            {/* Language & Currency Pill Selector */}
            <button
              onClick={() => setIsLangModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#111111] hover:bg-black/5 rounded-full transition border border-black/10 cursor-pointer"
              title="Changer la devise & la langue"
            >
              <span className="text-sm">{langConfig.flag}</span>
              <span className="font-mono text-[11px] font-semibold tracking-wider">
                {currConfig.code}
              </span>
              <ChevronDown className="w-3 h-3 text-[#6B6864]" />
            </button>

            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 text-[#111111] hover:opacity-60 transition cursor-pointer"
              aria-label="Recherche"
            >
              <Search className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.8} />
            </button>

            {/* Shopping Bag Button with Counter */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 text-[#111111] hover:opacity-60 transition cursor-pointer"
              aria-label="Panier"
            >
              <ShoppingBag className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#111111] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Inline Search Bar */}
      {searchOpen && (
        <div className="border-t border-black/10 bg-[#EFE9DF] py-3 px-4 transition-all">
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            <Search className="w-4 h-4 text-[#6B6864]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              className="w-full bg-transparent text-xs text-[#111111] placeholder-[#6B6864] focus:outline-hidden"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-[#6B6864] hover:text-[#111111]"
              >
                {t.nav.searchClear}
              </button>
            )}
            <button
              onClick={() => setSearchOpen(false)}
              className="p-1 text-[#6B6864] hover:text-[#111111]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/10 bg-[#F6F2EC] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest font-semibold text-[#111111]"
            >
              {t.nav.shop}
            </Link>
            <Link
              href="/product/pack-prestige-4-parfums"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest font-semibold text-[#111111]"
            >
              {t.nav.pack}
            </Link>
            <Link
              href="/#sourcing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest font-semibold text-[#111111]"
            >
              {t.nav.learn}
            </Link>
            <Link
              href="/#bestsellers"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest font-semibold text-[#111111]"
            >
              {t.nav.bestsellers}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
