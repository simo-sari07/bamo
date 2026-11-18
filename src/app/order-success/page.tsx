"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { STORE_CONFIG } from "@/config/store.config";
import { useStore } from "@/lib/store-context";
import { CheckCircle2, MessageSquare, ArrowRight, PackageCheck, PhoneCall } from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const { t, language } = useStore();

  const orderNumber = searchParams.get("orderNumber") || "BAMO-CONFIRMED";
  const name = searchParams.get("name") || (language === "ar" ? "عميلنا العزيز" : "Cher Client");
  const total = searchParams.get("total") || "690";
  const city = searchParams.get("city") || (language === "ar" ? "المغرب" : "Maroc");

  const whatsappMessage = encodeURIComponent(
    `${t.orderSuccess.whatsappMsgPrefix} ${orderNumber} ${t.orderSuccess.whatsappMsgMiddle} ${name} ${t.orderSuccess.whatsappMsgCity} ${city}.`
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6 text-left rtl:text-right">
      {/* Icon */}
      <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2 text-center">
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
          {t.orderSuccess.confirmedBadge}
        </span>
        <h1 className="font-headline text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111111]">
          {t.orderSuccess.thankYou} {name} !
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6864] max-w-md mx-auto leading-relaxed">
          {t.orderSuccess.subtitle}
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-black/10 pb-3">
          <span className="text-xs text-[#6B6864] uppercase font-semibold">
            {t.orderSuccess.orderNumber}
          </span>
          <span className="font-mono text-sm font-bold text-[#111111]">
            #{orderNumber}
          </span>
        </div>

        <div className="flex justify-between items-center border-b border-black/10 pb-3">
          <span className="text-xs text-[#6B6864] uppercase font-semibold">
            {t.orderSuccess.paymentMethod}
          </span>
          <span className="text-xs font-bold text-[#111111]">
            {t.orderSuccess.codLabel}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-[#6B6864] uppercase font-semibold">
            {t.orderSuccess.totalDue}
          </span>
          <span className="font-mono text-lg font-black text-[#111111]">
            {total} DH
          </span>
        </div>
      </div>

      {/* What happens next steps */}
      <div className="p-6 bg-[#EFE9DF] rounded-2xl border border-black/10 space-y-3">
        <h3 className="font-headline text-xs uppercase tracking-wider text-[#111111] font-bold flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-[#111111]" />
          <span>{t.orderSuccess.nextStepsTitle}</span>
        </h3>
        <ul className="text-xs text-[#6B6864] space-y-2">
          <li className="flex items-start gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
            <span>{t.orderSuccess.step1}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-black/10 text-[10px] font-bold text-[#111111] flex items-center justify-center shrink-0 mt-0.5">
              ✓
            </span>
            <span>
              {t.orderSuccess.step2.replace("{amount}", `${total} DH`)}
            </span>
          </li>
        </ul>
      </div>

      {/* WhatsApp Button & Return to Shop */}
      <div className="space-y-3 pt-2">
        <a
          href={`https://wa.me/${STORE_CONFIG.contact.whatsapp}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 bg-emerald-600 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.orderSuccess.whatsappFollowUp}</span>
        </a>

        <Link
          href="/"
          className="w-full py-3.5 bg-[#111111] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#333333] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{t.orderSuccess.continueShopping}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F6F2EC]">
      <Header />
      <Suspense fallback={<div className="p-12 text-center text-xs">...</div>}>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </main>
  );
}
