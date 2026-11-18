"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store-context";

export function Preloader() {
  const pathname = usePathname();
  const { t } = useStore();
  const [loading, setLoading] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // If on admin routes, don't show the storefront preloader
    if (pathname && pathname.startsWith("/admin")) {
      setLoading(false);
      return;
    }

    // Luxury entrance timer
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 1200);

    const removeTimer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F6F2EC] select-none transition-all duration-700 ease-out pointer-events-auto ${
        exiting ? "opacity-0 -translate-y-2 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center space-y-4 text-center px-4">
        {/* Subtle Luxury Monogram / Diamond Accent */}
        <div className="w-8 h-8 flex items-center justify-center opacity-80">
          <div className="w-3.5 h-3.5 border border-[#111111] rotate-45 transform transition-transform duration-1000 ease-out" />
        </div>

        {/* Brand Name "BAMO" */}
        <div className="relative inline-block">
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-bold text-[#111111] uppercase tracking-[0.3em] pl-[0.3em] leading-none animate-preloader-text">
            BAMO
          </h1>

          {/* Golden expanding accent line */}
          <div className="h-[2px] bg-[#E9B949] rounded-full mt-3 mx-auto w-0 animate-preloader-line" />
        </div>

        {/* Minimal Sub-caption */}
        <p className="font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.35em] text-[#6B6864] pl-[0.35em] pt-1">
          {t.hero.eyebrow}
        </p>

        {/* Minimal pulse dot */}
        <div className="flex items-center gap-1.5 pt-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E9B949] animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#111111]/30 animate-pulse delay-150" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#111111]/15 animate-pulse delay-300" />
        </div>
      </div>
    </div>
  );
}
