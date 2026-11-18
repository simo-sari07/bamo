"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Successful login, navigate to admin dashboard
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Mot de passe incorrect.");
      }
    } catch {
      setError("Erreur de connexion au serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center p-4 font-poppins selection:bg-[#E9B949] selection:text-black">
      <div className="w-full max-w-md bg-[#1C1A17] p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#E9B949]">
            <Lock className="w-6 h-6" />
          </div>
          <span className="font-headline text-3xl font-bold uppercase tracking-[0.25em] text-white block">
            BAMO
          </span>
          <span className="text-[10px] font-mono tracking-widest text-[#E9B949] uppercase font-semibold">
            ESPACE ADMINISTRATEUR SÉCURISÉ
          </span>
          <p className="text-xs text-white/60 pt-1 leading-relaxed">
            Authentification requise pour gérer le catalogue, le stock et les commandes Cash on Delivery.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center leading-normal">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
              Mot de Passe Administrateur
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoFocus
                className="w-full bg-white/5 border border-white/15 px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#E9B949] font-mono transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white text-[#111111] hover:bg-[#E9B949] transition font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            <span>{loading ? "Vérification en cours..." : "Connexion au Backoffice"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security badge and hint */}
        <div className="pt-4 border-t border-white/10 text-center space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Protection HMAC-SHA256 & anti-bruteforce</span>
          </div>

          <div>
            <Link
              href="/"
              className="text-xs text-white/60 hover:text-white transition underline"
            >
              Retourner à la boutique
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
