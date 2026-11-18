"use client";

import React from "react";
import { Star, CheckCircle } from "lucide-react";
import { useStore } from "@/lib/store-context";

export function CustomerReviews() {
  const { t } = useStore();

  return (
    <section className="w-full bg-[#F6F2EC] py-16 sm:py-20 border-b border-black/10 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-mono tracking-widest text-[#6B6864] uppercase font-semibold">
            {t.reviews.tag}
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl font-black uppercase text-[#111111]">
            {t.reviews.titlePart1} <span className="accent-underline">{t.reviews.titleAccent}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6864]">
            {t.reviews.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.reviews.items.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-black/10 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition text-left rtl:text-right"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#E9B949]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#6B6864] font-mono">{rev.date}</span>
                </div>

                <p className="text-xs text-[#333333] leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#111111] flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <span className="text-[10px] text-[#6B6864] font-normal">({rev.city})</span>
                  </div>
                  <span className="text-[10px] text-[#E9B949] font-medium block">
                    {rev.perfume}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>{t.reviews.verifiedPurchase}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
