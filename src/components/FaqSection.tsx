"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useStore } from "@/lib/store-context";

export function FaqSection() {
  const { t } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full bg-[#EFE9DF] py-16 sm:py-20 border-b border-black/10 font-poppins">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-[10px] font-mono tracking-widest text-[#111111] uppercase font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-[#E9B949]" />
            <span>{t.faq.tag}</span>
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl font-black uppercase text-[#111111]">
            {t.faq.titlePart1} <span className="accent-underline">{t.faq.titleAccent}</span>
          </h2>
          <p className="text-xs text-[#6B6864]">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="space-y-3">
          {t.faq.items.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-black/10 overflow-hidden shadow-2xs transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-5 text-left rtl:text-right flex items-center justify-between gap-4 cursor-pointer hover:bg-black/2 transition"
                >
                  <span className="font-headline text-xs sm:text-sm font-bold text-[#111111]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#111111] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#55524E] leading-relaxed border-t border-black/5 pt-3 text-left rtl:text-right">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
