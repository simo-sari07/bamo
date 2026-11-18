"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store-context";

export function Hero() {
  const { t } = useStore();

  return (
    <section className="relative w-full overflow-hidden border-b border-black/10 bg-[#F6F2EC]">
      {/* Cinematic Full-Bleed Real BAMO Photoshoot Hero */}
      <div className="relative w-full h-[65vh] sm:h-[75vh] md:h-[82vh] lg:h-[88vh] flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        {/* Real BAMO High-Resolution Photoshoot Background */}
        <Image
          src="/images/bamo-hero-banner.jpg"
          alt="BAMO Haute Parfumerie"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Subtle Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />

        {/* Top Minimal Eyebrow */}
        <div className="relative z-10 text-center sm:text-left rtl:sm:text-right">
          <span className="text-[11px] font-mono tracking-[0.35em] text-white/90 uppercase font-semibold">
            {t.hero.eyebrow}
          </span>
        </div>

        {/* Center/Bottom Grand Brand Name & Minimal CTA */}
        <div className="relative z-10 text-center space-y-4 my-auto">
          <h1 className="font-headline text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-bold text-white uppercase tracking-[0.25em] drop-shadow-sm select-none">
            BAMO
          </h1>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block bg-white text-[#111111] px-9 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.25em] hover:bg-[#111111] hover:text-white transition-all shadow-md active:scale-95"
            >
              {t.hero.cta}
            </Link>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="relative z-10 flex items-center justify-between text-white/80 text-[10px] uppercase font-mono tracking-widest pt-4">
          <span className="hidden sm:inline-block">{t.hero.moroccoDelivery}</span>
          <div className="mx-auto sm:mx-0 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>{t.hero.scrollDown}</span>
          </div>
          <span className="hidden sm:inline-block">{t.hero.codBadge}</span>
        </div>
      </div>

      {/* Clean Continuous Marquee Scroll Animation for BAMO */}
      <div className="w-full bg-[#111111] text-white py-3 overflow-hidden border-t border-b border-black/20">
        <div className="animate-marquee whitespace-nowrap text-xs font-mono tracking-[0.35em] uppercase font-semibold text-white/90 flex items-center">
          {/* Double loop of translated marquee items for seamless loop */}
          {[...t.hero.marquee, ...t.hero.marquee].map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="mx-6">{item}</span>
              <span className="mx-6 text-[#E9B949]">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
