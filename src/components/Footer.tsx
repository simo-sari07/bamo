"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { STORE_CONFIG } from "@/config/store.config";
import { ArrowRight, Check, MessageSquare, ShieldCheck, Lock } from "lucide-react";

export function Footer() {
  const { t, language, currency, setIsLangModalOpen } = useStore();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const currConfig = STORE_CONFIG.currencies[currency];
  const langConfig = STORE_CONFIG.languages[language];

  return (
    <footer className="w-full bg-[#EFE9DF] text-[#111111] pt-16 pb-12 border-t border-black/10 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-black/10 text-left rtl:text-right">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="font-headline text-3xl font-black uppercase tracking-[0.2em] text-[#111111]"
            >
              {STORE_CONFIG.brandName}
            </Link>
            <p className="text-xs text-[#6B6864] leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>

            <div className="pt-1 flex items-center gap-3">
              <button
                onClick={() => setIsLangModalOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/15 bg-white text-xs text-[#111111] hover:bg-black/5 transition cursor-pointer"
                title={t.languageModal.title}
              >
                <span>{langConfig.flag}</span>
                <span className="font-medium">{langConfig.name}</span>
                <span className="text-[#6B6864]">({currConfig.code})</span>
              </button>

              <a
                href={`https://wa.me/${STORE_CONFIG.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#111111]">
              {t.footer.shopTitle}
            </h4>
            <ul className="space-y-2 text-xs text-[#6B6864]">
              <li>
                <Link href="/shop" className="hover:text-black transition">
                  {t.footer.allCollection}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=femme" className="hover:text-black transition">
                  {t.footer.forHer}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=homme" className="hover:text-black transition">
                  {t.footer.forHim}
                </Link>
              </li>
              <li>
                <Link href="/product/pack-prestige-4-parfums" className="hover:text-black transition font-semibold text-[#111111]">
                  {t.footer.pack4}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#111111]">
              {t.footer.aboutTitle}
            </h4>
            <ul className="space-y-2 text-xs text-[#6B6864]">
              <li>
                <Link href="/#sourcing" className="hover:text-black transition">
                  {t.footer.sourcing}
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-black transition">
                  {t.footer.faq}
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-black transition">
                  {t.footer.checkout}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-black transition inline-flex items-center gap-1 text-[11px] opacity-70 hover:opacity-100">
                  <Lock className="w-3 h-3" />
                  <span>{t.footer.adminBackoffice}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#111111]">
              {t.footer.newsletterTitle}
            </h4>
            <p className="text-xs text-[#6B6864] leading-relaxed">
              {t.footer.newsletterDesc}
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-white rounded-full border border-black/10 text-xs text-[#111111]">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{t.footer.newsletterThanks}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.footer.newsletterPlaceholder}
                  required
                  className="w-full bg-white px-4 py-2.5 rounded-full border border-black/15 text-xs text-[#111111] placeholder-[#6B6864] focus:outline-hidden focus:border-black"
                />
                <button
                  type="submit"
                  className="bg-[#111111] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#333333] transition shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t.footer.newsletterSubmit}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6B6864] gap-4">
          <p>
            © {new Date().getFullYear()} {STORE_CONFIG.brandName} Haute Parfumerie. {t.footer.rights}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.footer.secureCod}</span>
            </span>
            <span>•</span>
            <span>{t.footer.allMorocco}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
