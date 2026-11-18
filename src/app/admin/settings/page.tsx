"use client";

import React, { useState } from "react";
import { STORE_CONFIG } from "@/config/store.config";
import { Settings, Save, Check, Truck, MessageSquare, Lock, KeyRound, ShieldAlert } from "lucide-react";

export default function AdminSettingsPage() {
  const [brandName, setBrandName] = useState(STORE_CONFIG.brandName);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    STORE_CONFIG.freeShippingThresholdMAD.toString()
  );
  const [standardShipping, setStandardShipping] = useState(
    STORE_CONFIG.standardShippingMAD.toString()
  );
  const [phone, setPhone] = useState(STORE_CONFIG.contact.phone);
  const [whatsapp, setWhatsapp] = useState(STORE_CONFIG.contact.whatsapp);
  const [email, setEmail] = useState(STORE_CONFIG.contact.email);
  const [savedSettings, setSavedSettings] = useState(false);

  // Security / Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{ success?: string; error?: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ error: "Les deux nouveaux mots de passe ne correspondent pas." });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus({ error: "Le mot de passe doit comporter au moins 6 caractères." });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordStatus({ success: "Mot de passe administrateur modifié avec succès !" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordStatus({ error: data.error || "Erreur lors de la modification du mot de passe." });
      }
    } catch {
      setPasswordStatus({ error: "Erreur de connexion avec le serveur." });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-poppins">
      <div className="border-b border-black/10 pb-6">
        <h1 className="font-headline text-2xl sm:text-3xl font-black uppercase text-[#111111]">
          Paramètres & Sécurité
        </h1>
        <p className="text-xs text-[#6B6864] mt-1">
          Configurez les tarifs Cash on Delivery, les coordonnées et renforcez la sécurité de votre backoffice.
        </p>
      </div>

      {/* 1. SHIPPING & COD SETTINGS */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-black/10 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-black/10 pb-3">
            <Truck className="w-4 h-4 text-[#111111]" />
            <h2 className="font-headline text-sm uppercase tracking-wider text-[#111111] font-bold">
              Tarification Livraison au Maroc (Cash on Delivery)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Seuil de livraison gratuite (DH)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] font-mono focus:outline-hidden"
              />
              <span className="text-[10px] text-[#6B6864] mt-1 block">
                Toute commande égale ou supérieure à ce montant bénéficiera de la livraison gratuite partout au Maroc.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Frais de livraison standard (DH)
              </label>
              <input
                type="number"
                value={standardShipping}
                onChange={(e) => setStandardShipping(e.target.value)}
                className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] font-mono focus:outline-hidden"
              />
              <span className="text-[10px] text-[#6B6864] mt-1 block">
                Tarif appliqué aux commandes inférieures au seuil gratuit.
              </span>
            </div>
          </div>
        </div>

        {/* 2. CONTACT & WHATSAPP */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-black/10 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-black/10 pb-3">
            <MessageSquare className="w-4 h-4 text-[#111111]" />
            <h2 className="font-headline text-sm uppercase tracking-wider text-[#111111] font-bold">
              Coordonnées & WhatsApp de Confirmation
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Numéro WhatsApp (Format international)
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+212600000000"
                className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] font-mono focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Téléphone Service Client
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] font-mono focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                E-mail de contact
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {savedSettings && (
            <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Paramètres généraux enregistrés !</span>
            </div>
          )}
          <button
            type="submit"
            className="ml-auto inline-flex items-center gap-2 px-8 py-3.5 bg-[#111111] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#333333] transition shadow-md active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#E9B949]" />
            <span>Enregistrer la configuration</span>
          </button>
        </div>
      </form>

      {/* 3. ADMIN SECURITY & PASSWORD MANAGEMENT */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-black/10 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-black/10 pb-3">
          <Lock className="w-4 h-4 text-[#111111]" />
          <h2 className="font-headline text-sm uppercase tracking-wider text-[#111111] font-bold">
            Sécurité & Mot de Passe Administrateur
          </h2>
        </div>

        <p className="text-xs text-[#6B6864] leading-relaxed">
          Pour garantir la sécurité de votre boutique BAMO, modifiez régulièrement votre mot de passe administrateur. Le mot de passe est haché avec l&apos;algorithme PBKDF2 (SHA-512) et sécurisé par signature HMAC-SHA256.
        </p>

        {passwordStatus?.error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{passwordStatus.error}</span>
          </div>
        )}

        {passwordStatus?.success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{passwordStatus.success}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
              Mot de Passe Actuel
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] font-mono focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Nouveau Mot de Passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Au moins 6 caractères"
                required
                className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] font-mono focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Confirmer le Nouveau Mot de Passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répétez le mot de passe"
                required
                className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#111111] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#333333] transition shadow-md active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <KeyRound className="w-4 h-4 text-[#E9B949]" />
              <span>{isUpdatingPassword ? "Mise à jour..." : "Changer le Mot de Passe"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
