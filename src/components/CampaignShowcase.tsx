"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Clock, Award, ArrowRight } from "lucide-react";

export function CampaignShowcase() {
  return (
    <section className="w-full bg-[#111111] text-white py-16 sm:py-24 border-b border-white/10 font-poppins overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: New High-End Campaign Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[420px] sm:h-[520px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
              <Image
                src="/images/bamo-luxury-campaign.jpg"
                alt="BAMO Haute Parfumerie Prestige Campaign"
                fill
                priority
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E9B949] uppercase block font-bold">
                    ÉDITION PRESTIGE
                  </span>
                  <span className="text-xs font-semibold text-white">
                    Flacons de Cristal & Bouchons Brossés
                  </span>
                </div>
                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-mono font-medium">
                  32% Extrait
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[10px] font-mono tracking-widest text-[#E9B949] uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#E9B949]" />
              <span>CAMPAGNE OFFICIELLE 2026</span>
            </div>

            <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight">
              L&apos;Alchimie de la <span className="accent-underline text-white">Haute Parfumerie</span>
            </h2>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Chaque extrait de parfum BAMO naît de la rencontre entre le savoir-faire ancestral des maîtres parfumeurs et les matières premières les plus rares : rose de Damas fraîchement cueillie, ambre doré profond, vanille noire de Madagascar et jasmin sambac nocturne.
            </p>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <Clock className="w-4 h-4 text-[#E9B949]" />
                <span className="text-xs font-bold block text-white">Tenue 16h+</span>
                <p className="text-[10px] text-white/60">Sillage durable sur peau et textiles précieux</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <Award className="w-4 h-4 text-[#E9B949]" />
                <span className="text-xs font-bold block text-white">Extrait Pur 32%</span>
                <p className="text-[10px] text-white/60">La plus haute concentration du marché</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#E9B949]" />
                <span className="text-xs font-bold block text-white">Paiement COD</span>
                <p className="text-[10px] text-white/60">Réglez après réception et vérification</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/product/pack-prestige-4-parfums"
                className="px-8 py-4 bg-white text-[#111111] hover:bg-[#E9B949] rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg text-center flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Commander le Pack (1 490 DH)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop"
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold uppercase tracking-wider transition text-center"
              >
                Explorer le Catalogue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
