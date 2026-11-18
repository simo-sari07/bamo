"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useStore } from "@/lib/store-context";

export default function NotFound() {
  const { language } = useStore();
  const isAr = language === "ar";

  return (
    <main className="min-h-screen flex flex-col bg-[#F6F2EC]">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 my-auto">
        <span className="text-xs font-mono font-bold tracking-widest text-[#E9B949] uppercase">
          404 • {isAr ? "الصفحة غير موجودة" : "Page Introuvable"}
        </span>
        <h1 className="font-headline text-4xl sm:text-5xl font-bold uppercase tracking-tight text-[#111111]">
          {isAr ? "عفواً، هذه الصفحة غير متاحة" : "Page Non Trouvée"}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6864] max-w-md">
          {isAr
            ? "الصفحة التي تبحث عنها قد تم نقلها أو لم تعد متوفرة."
            : "La page que vous recherchez n'existe pas ou a été déplacée."}
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block bg-[#111111] text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#333333] transition"
          >
            {isAr ? "العودة للرئيسية" : "Retour à l'accueil"}
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
