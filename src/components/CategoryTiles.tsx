"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store-context";

export function CategoryTiles() {
  const { t } = useStore();

  const categories = [
    {
      id: "femme",
      tag: t.categoryTiles.elle.tag,
      title: t.categoryTiles.elle.title,
      subtitle: t.categoryTiles.elle.subtitle,
      cta: t.categoryTiles.elle.cta,
      href: "/shop?category=femme",
      image: "/products/herosection.jpg",
    },
    {
      id: "pack",
      tag: t.categoryTiles.pack.tag,
      title: t.categoryTiles.pack.title,
      subtitle: t.categoryTiles.pack.subtitle,
      cta: t.categoryTiles.pack.cta,
      href: "/product/pack-prestige-4-parfums",
      image: "/images/bamo-luxury-campaign.jpg",
    },
    {
      id: "homme",
      tag: t.categoryTiles.lui.tag,
      title: t.categoryTiles.lui.title,
      subtitle: t.categoryTiles.lui.subtitle,
      cta: t.categoryTiles.lui.cta,
      href: "/shop?category=homme",
      image: "/images/bamo-editorial-close.jpg",
    },
  ];

  return (
    <section id="categories" className="w-full bg-[#F6F2EC] border-b border-black/10 font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x rtl:md:divide-x-reverse divide-black/10 min-h-[500px] lg:min-h-[580px]">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group relative flex flex-col justify-between p-8 sm:p-10 overflow-hidden min-h-[440px] md:min-h-full"
          >
            {/* Real BAMO Editorial Background Image - High Quality, No Text Artifacts */}
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              priority
              quality={95}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />

            {/* Subtle Gradient Overlay for Clean Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 group-hover:from-black/90 transition-colors pointer-events-none" />

            {/* Top Tag & Clean Horizontal Title */}
            <div className="relative z-10 space-y-1.5">
              <span className="text-[10px] font-mono tracking-widest text-[#E9B949] uppercase font-bold block">
                {cat.tag}
              </span>
              <h3 className="font-headline text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white drop-shadow-sm">
                {cat.title}
              </h3>
              <p className="text-xs text-white/80 max-w-xs leading-relaxed pt-1">
                {cat.subtitle}
              </p>
            </div>

            {/* Clean Pill Button at Bottom */}
            <div className="relative z-10 pt-8">
              <Link
                href={cat.href}
                className="inline-flex items-center gap-2 bg-white text-[#111111] px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#E9B949] hover:text-black transition-all shadow-md active:scale-95"
              >
                <span>{cat.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
