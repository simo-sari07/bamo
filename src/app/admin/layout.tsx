"use client";

import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  ExternalLink,
  Menu,
  X,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  // If on /admin/login, bypass sidebar layout
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsVerifying(false);
      return;
    }

    fetch("/api/admin/auth")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
        } else {
          setIsVerifying(false);
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-[#E9B949] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono tracking-widest text-white/60 uppercase">
            Vérification de la session sécurisée...
          </p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "Tableau de Bord", href: "/admin", icon: LayoutDashboard },
    { name: "Commandes (COD)", href: "/admin/orders", icon: ShoppingBag },
    { name: "Catalogue Produits", href: "/admin/products", icon: Package },
    { name: "Clients", href: "/admin/customers", icon: Users },
    { name: "Paramètres & Sécurité", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#111111] flex flex-col md:flex-row font-poppins">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111111] text-white">
        <div className="flex items-center gap-2">
          <span className="font-headline tracking-widest text-sm font-bold uppercase">
            BAMO ADMIN
          </span>
          <span className="text-[9px] bg-[#E9B949] text-black font-bold font-mono px-2 py-0.5 rounded-full">
            SÉCURISÉ
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded text-white hover:opacity-75 cursor-pointer"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:flex flex-col w-full md:w-64 bg-[#111111] text-white shrink-0 min-h-screen p-6 justify-between border-r border-black/20`}
      >
        <div className="space-y-8">
          {/* Brand & Badge */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-headline text-2xl font-bold uppercase tracking-[0.2em] text-white">
                BAMO
              </span>
              <span className="text-[9px] bg-[#E9B949] text-black font-bold font-mono px-2 py-0.5 rounded-full">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-white/50 tracking-wider">
              Haute Parfumerie Backoffice
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <NextLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                    isActive
                      ? "bg-white text-[#111111] shadow-xs"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NextLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar Info with Logout */}
        <div className="pt-8 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Session Sécurisée</span>
          </div>

          <NextLink
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/80 transition"
          >
            <span>Voir la boutique</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </NextLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 transition cursor-pointer"
          >
            <span>Déconnexion</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
