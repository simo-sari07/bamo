"use client";

import React from "react";
import { useStore } from "@/lib/store-context";
import { STORE_CONFIG } from "@/config/store.config";
import { CurrencyCode, LanguageCode } from "@/types/store";
import { X, Check } from "lucide-react";

export function LanguageCurrencyModal() {
  const {
    isLangModalOpen,
    setIsLangModalOpen,
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
  } = useStore();

  if (!isLangModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsLangModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md bg-[#F6F2EC] rounded-2xl p-6 shadow-2xl border border-black/10">
        <div className="flex items-center justify-between pb-4 border-b border-black/10">
          <h3 className="font-headline text-lg uppercase tracking-wider text-[#111111]">
            {t.languageModal.title}
          </h3>
          <button
            onClick={() => setIsLangModalOpen(false)}
            className="p-1 rounded-full hover:bg-black/5 transition"
          >
            <X className="w-5 h-5 text-[#111111]" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Currency Selection */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#6B6864] mb-3">
              {t.languageModal.currencyLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(STORE_CONFIG.currencies) as CurrencyCode[]).map((currCode) => {
                const item = STORE_CONFIG.currencies[currCode];
                const isSelected = currency === currCode;
                return (
                  <button
                    key={currCode}
                    onClick={() => setCurrency(currCode)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm transition-all ${
                      isSelected
                        ? "border-[#111111] bg-white shadow-xs font-semibold"
                        : "border-black/10 bg-white/50 hover:bg-white text-[#111111]/70"
                    }`}
                  >
                    <span className="text-xl mb-1">{item.flag}</span>
                    <span className="text-xs tracking-wider">{item.code}</span>
                    <span className="text-[10px] text-[#6B6864]">{item.symbol}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#6B6864] mb-3">
              {t.languageModal.languageLabel}
            </label>
            <div className="space-y-2">
              {(Object.keys(STORE_CONFIG.languages) as LanguageCode[]).map((langCode) => {
                const item = STORE_CONFIG.languages[langCode];
                const isSelected = language === langCode;
                return (
                  <button
                    key={langCode}
                    onClick={() => setLanguage(langCode)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm transition-all ${
                      isSelected
                        ? "border-[#111111] bg-white shadow-xs font-semibold text-[#111111]"
                        : "border-black/10 bg-white/50 hover:bg-white text-[#111111]/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.flag}</span>
                      <span className="tracking-wide">{item.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#111111]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setIsLangModalOpen(false)}
            className="w-full py-3.5 bg-[#111111] text-white rounded-full text-xs font-medium uppercase tracking-widest hover:bg-[#333333] transition"
          >
            {t.languageModal.save}
          </button>
        </div>
      </div>
    </div>
  );
}
