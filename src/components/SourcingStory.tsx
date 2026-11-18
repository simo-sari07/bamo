"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store-context";

// Elegant botanical flower line art SVG
function BotanicalFlowerSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M100 80 C85 50, 50 60, 65 95 C45 105, 55 140, 90 130 C100 155, 140 145, 135 115 C160 100, 145 65, 115 75 Z" opacity="0.85" />
      <path d="M100 85 C90 70, 75 75, 80 95 C70 105, 80 120, 95 115 C105 130, 125 120, 120 105 C130 95, 125 75, 108 82 Z" opacity="0.6" />
      <circle cx="100" cy="100" r="8" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M100 135 C100 165, 90 185, 80 195" strokeWidth="1.5" />
      <path d="M96 150 C80 145, 60 155, 55 170 C70 175, 90 165, 96 150 Z" />
      <path d="M98 165 C115 160, 135 170, 140 185 C125 190, 105 180, 98 165 Z" />
    </svg>
  );
}

// Vintage perfume flacon engraving
function BotanicalPerfumeBottleSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="72" y="20" width="16" height="12" rx="2" />
      <path d="M74 32 L74 55 C74 65, 50 85, 50 115 L50 170 C50 176, 54 180, 60 180 L100 180 C106 180, 110 176, 110 170 L110 115 C110 85, 86 65, 86 55 L86 32" />
      <line x1="62" y1="115" x2="98" y2="115" strokeDasharray="3 3" opacity="0.6" />
      <path d="M35 100 C50 70, 95 75, 125 60" strokeWidth="1.4" />
      <path d="M55 85 C65 75, 75 80, 70 92 C60 95, 52 90, 55 85 Z" />
      <path d="M85 75 C95 65, 105 70, 100 82 C90 85, 82 80, 85 75 Z" />
      <ellipse cx="68" cy="98" rx="6" ry="8" transform="rotate(-20 68 98)" fill="currentColor" fillOpacity="0.08" />
      <ellipse cx="108" cy="78" rx="6" ry="8" transform="rotate(25 108 78)" fill="currentColor" fillOpacity="0.08" />
    </svg>
  );
}

// Botanical seeds / essence droplets
function BotanicalSeedsSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M60 70 C50 50, 70 30, 90 45 C105 60, 90 85, 75 80 C65 78, 62 75, 60 70 Z" />
      <path d="M85 75 C105 55, 125 65, 120 85 C115 100, 95 100, 85 88 Z" />
      <path d="M40 85 C30 75, 45 60, 55 70 C62 78, 55 90, 45 90 Z" />
      <path d="M90 45 C95 25, 115 20, 120 35 C115 48, 100 48, 90 45 Z" />
      <path d="M60 40 C45 30, 40 45, 52 55" />
    </svg>
  );
}

export function SourcingStory() {
  const { t } = useStore();

  return (
    <section id="sourcing" className="relative w-full bg-[#F6F2EC] py-16 sm:py-24 border-b border-black/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* Column 1 (Left): Headline, story text, CTA, and real editorial photo */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 relative">
            <div className="space-y-6">
              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] leading-[1.08] tracking-tight">
                {t.sourcing.titlePart1}
                <br />
                {t.sourcing.titlePart2}
                <br />
                <span className="accent-underline">{t.sourcing.titleAccent}</span>
              </h2>

              <p className="text-xs sm:text-[13px] text-[#6B6864] leading-relaxed max-w-md pt-2">
                {t.sourcing.body}
              </p>

              <div>
                <Link
                  href="/shop"
                  className="inline-block bg-[#111111] text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#333333] transition-all shadow-md active:scale-95"
                >
                  {t.sourcing.cta}
                </Link>
              </div>
            </div>

            {/* Overlapping real editorial essence photo & flower sketch */}
            <div className="relative pt-6">
              <div className="relative h-48 sm:h-56 w-full sm:w-80 rounded-2xl overflow-hidden shadow-xs border border-black/10">
                <Image
                  src="/images/bamo-luxury-campaign.jpg"
                  alt="BAMO Essence Collective"
                  fill
                  quality={95}
                  className="object-cover object-center"
                />
              </div>
              <BotanicalFlowerSvg className="absolute -top-10 right-4 sm:-right-4 w-36 h-36 text-black/60 pointer-events-none" />
            </div>
          </div>

          {/* Column 2 (Center): Real BAMO Roselia & Verona on Marble in sunlight */}
          <div className="lg:col-span-4 flex flex-col items-center space-y-4">
            <div className="relative w-full h-[360px] sm:h-[440px] rounded-2xl overflow-hidden shadow-xs border border-black/10">
              <Image
                src="/images/bamo-editorial-close.jpg"
                alt="BAMO Perfumes on Marble"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="text-center">
              <span className="text-[11px] font-mono tracking-wider text-[#6B6864] uppercase">
                {t.sourcing.marulaCaption}
              </span>
            </div>
            <BotanicalSeedsSvg className="w-36 h-20 text-black/50" />
          </div>

          {/* Column 3 (Right): Flacon engraving + Panoramic BAMO Marble Scene */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-6">
            <div className="flex justify-center p-4 bg-white/40 rounded-2xl border border-black/5">
              <BotanicalPerfumeBottleSvg className="w-32 h-40 text-black/70" />
            </div>

            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden shadow-xs border border-black/10">
              <Image
                src="/images/bamo-hero-banner.jpg"
                alt="BAMO Perfume Composition"
                fill
                quality={95}
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
