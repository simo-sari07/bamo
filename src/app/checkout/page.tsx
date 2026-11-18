"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useStore } from "@/lib/store-context";
import { STORE_CONFIG } from "@/config/store.config";
import {
  Banknote,
  Truck,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";
import { getLocalizedVariantLabel } from "@/lib/localize";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotalMAD, formatPrice, language, t, clearCart, isCartLoaded } = useStore();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [city, setCity] = useState(STORE_CONFIG.moroccanCities[0]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const thresholdMAD = STORE_CONFIG.freeShippingThresholdMAD;
  const shippingFeeMAD = cartSubtotalMAD >= thresholdMAD ? 0 : STORE_CONFIG.standardShippingMAD;
  const orderTotalMAD = cartSubtotalMAD + shippingFeeMAD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setErrorMessage(t.checkout.fillRequired);
      return;
    }

    if (cart.length === 0) {
      setErrorMessage(t.cart.empty);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/orders/cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          city,
          shippingAddress,
          notes,
          items: cart.map((item) => ({
            productId: item.product.id,
            variantId: item.variant.id,
            productName: item.product.name[language],
            variantLabel: item.variant.label,
            priceMAD: item.variant.priceMAD,
            quantity: item.quantity,
          })),
          totalMAD: orderTotalMAD,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        clearCart();
        router.push(
          `/order-success?orderNumber=${encodeURIComponent(
            data.orderNumber
          )}&name=${encodeURIComponent(customerName)}&total=${orderTotalMAD}&city=${encodeURIComponent(
            city
          )}`
        );
      } else {
        setErrorMessage(data.error || "Une erreur est survenue lors de l'enregistrement.");
      }
    } catch {
      setErrorMessage("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCartLoaded) {
    return (
      <main className="min-h-screen flex flex-col bg-[#F6F2EC]">
        <Header />
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4 my-auto">
          <div className="w-8 h-8 border-2 border-black/20 border-t-[#111111] rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#6B6864] font-mono uppercase tracking-wider">
            {t.checkout.loadingCart}
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex flex-col bg-[#F6F2EC]">
        <Header />
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 my-auto">
          <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 text-[#6B6864]" />
          </div>
          <h2 className="font-headline text-2xl font-bold text-[#111111]">
            {t.checkout.emptyCartTitle}
          </h2>
          <p className="text-xs text-[#6B6864]">
            {t.checkout.emptyCartSubtitle}
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block bg-[#111111] text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#333333] transition"
            >
              {t.checkout.startShopping}
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#F6F2EC]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-left rtl:text-right">
        <div className="max-w-2xl mx-auto mb-10 text-center space-y-2">
          <h1 className="font-headline text-3xl sm:text-4xl font-black uppercase text-[#111111]">
            {t.checkout.title} <span className="accent-underline">{t.checkout.titleAccent}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6864]">
            {t.checkout.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Customer Details Form (Left) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-black/10 shadow-xs space-y-6">
            <div className="border-b border-black/10 pb-4">
              <h2 className="font-headline text-lg uppercase tracking-wider text-[#111111] font-bold">
                {t.checkout.step1Title}
              </h2>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {errorMessage}
              </div>
            )}

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  {t.checkout.fullName}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t.checkout.fullNamePlaceholder}
                  required
                  className="w-full bg-[#F6F2EC] px-4 py-3 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    {t.checkout.phone}
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={t.checkout.phonePlaceholder}
                    required
                    className="w-full bg-[#F6F2EC] px-4 py-3 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden focus:border-black font-mono"
                  />
                  <span className="text-[10px] text-[#6B6864] mt-1 block">
                    {t.checkout.phoneHelp}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    {t.checkout.city}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#F6F2EC] px-4 py-3 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden focus:border-black cursor-pointer font-medium"
                  >
                    {STORE_CONFIG.moroccanCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  {t.checkout.address}
                </label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder={t.checkout.addressPlaceholder}
                  required
                  className="w-full bg-[#F6F2EC] px-4 py-3 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  {t.checkout.emailLabel}
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder={t.checkout.emailPlaceholder}
                  className="w-full bg-[#F6F2EC] px-4 py-3 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  {t.checkout.notes}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.checkout.notesPlaceholder}
                  rows={2}
                  className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden focus:border-black"
                />
              </div>

              {/* Payment Method Badge */}
              <div className="pt-4 border-t border-black/10">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                  {t.checkout.step2Title}
                </label>
                <div className="p-4 bg-[#EFE9DF] rounded-xl border border-black/15 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wide">
                      {t.checkout.codOption}
                    </h4>
                    <p className="text-[11px] text-[#6B6864] mt-0.5">
                      {t.checkout.codDesc}
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary (Right) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-black/10 shadow-xs space-y-6">
            <h3 className="font-headline text-lg uppercase tracking-wider text-[#111111] font-bold border-b border-black/10 pb-4">
              {t.checkout.orderSummaryTitle}
            </h3>

            {/* Items list */}
            <div className="divide-y divide-black/5 max-h-80 overflow-y-auto space-y-3">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant.id}`}
                  className="flex items-center gap-3 pt-3 first:pt-0"
                >
                  <div className="relative w-16 h-20 bg-[#F6F2EC] rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name[language]}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#111111] truncate">
                      {item.product.name[language]}
                    </h4>
                    <p className="text-[11px] text-[#6B6864]">
                      {getLocalizedVariantLabel(item.variant.label, language)}
                    </p>
                    <span className="text-[11px] text-[#6B6864]">
                      {t.checkout.quantityLabel} {item.quantity}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono text-[#111111]">
                    {formatPrice(item.variant.priceMAD * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 border-t border-black/10 pt-4 text-xs">
              <div className="flex justify-between text-[#6B6864]">
                <span>{t.checkout.subtotalLabel}</span>
                <span className="font-mono text-[#111111] font-semibold">
                  {formatPrice(cartSubtotalMAD)}
                </span>
              </div>
              <div className="flex justify-between text-[#6B6864]">
                <span>{t.checkout.shippingLabel}</span>
                <span className="font-mono text-[#111111] font-semibold">
                  {shippingFeeMAD === 0 ? t.checkout.freeShipping : formatPrice(shippingFeeMAD)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#111111] border-t border-black/10 pt-3">
                <span>{t.checkout.orderTotal}</span>
                <span className="font-mono">{formatPrice(orderTotalMAD)}</span>
              </div>
            </div>

            {/* Confirm Order CTA Button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#111111] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#333333] transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 active:scale-95"
            >
              <Banknote className="w-4 h-4 text-[#E9B949]" />
              <span>
                {isSubmitting
                  ? t.checkout.submitting
                  : `${t.checkout.submitOrder} (${formatPrice(orderTotalMAD)})`}
              </span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            {/* Trust Assurances */}
            <div className="space-y-2 pt-2 border-t border-black/5 text-[11px] text-[#6B6864]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#111111]" />
                <span>{t.checkout.trustDelivery}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#111111]" />
                <span>{t.checkout.trustInspection}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
