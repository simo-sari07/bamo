"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { STORE_CONFIG } from "@/config/store.config";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotalMAD,
    formatPrice,
    language,
    t,
  } = useStore();

  const router = useRouter();

  if (!isCartOpen) return null;

  const thresholdMAD = STORE_CONFIG.freeShippingThresholdMAD;
  const isFreeShipping = cartSubtotalMAD >= thresholdMAD;
  const remainingForFreeShipping = Math.max(0, thresholdMAD - cartSubtotalMAD);
  const progressPercent = Math.min(100, Math.round((cartSubtotalMAD / thresholdMAD) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F6F2EC] flex flex-col shadow-2xl border-l border-black/10">
          {/* Header */}
          <div className="p-6 border-b border-black/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#111111]" />
              <h2 className="font-headline text-lg uppercase tracking-wider text-[#111111]">
                {t.cart.title}
              </h2>
              <span className="text-xs bg-black/10 text-[#111111] px-2 py-0.5 rounded-full font-medium">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full hover:bg-black/5 transition"
            >
              <X className="w-5 h-5 text-[#111111]" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-6 py-3 bg-[#EFE9DF] border-b border-black/10">
            <div className="text-xs text-[#111111] font-medium mb-1.5 flex justify-between items-center">
              <span>
                {isFreeShipping
                  ? t.cart.freeShippingSuccess
                  : t.cart.freeShippingRemaining.replace(
                      "{amount}",
                      formatPrice(remainingForFreeShipping)
                    )}
              </span>
              <span className="text-[10px] text-[#6B6864] font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#111111] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-[#6B6864]" />
                </div>
                <p className="text-sm text-[#6B6864] mb-4">{t.cart.empty}</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full border border-black/20 text-xs uppercase tracking-widest font-medium hover:bg-[#111111] hover:text-white transition"
                >
                  {t.cart.continueShopping}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant.id}`}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-black/5 shadow-xs"
                >
                  <div className="relative w-20 h-24 bg-[#F6F2EC] rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name[language]}
                      fill
                      className="object-contain p-1.5"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-semibold text-[#111111] leading-tight line-clamp-2">
                          {item.product.name[language]}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.variant.id)}
                          className="text-[#6B6864] hover:text-black p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#6B6864] mt-0.5">{item.variant.label}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-black/15 rounded-full bg-[#F6F2EC]">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.variant.id, item.quantity - 1)
                          }
                          className="p-1 hover:text-black text-[#6B6864]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-medium text-[#111111]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.variant.id, item.quantity + 1)
                          }
                          className="p-1 hover:text-black text-[#6B6864]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-[#111111]">
                        {formatPrice(item.variant.priceMAD * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with subtotal and checkout */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-black/10 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-[#111111]">
                  <span className="font-medium">{t.cart.subtotal}</span>
                  <span className="font-bold font-mono">{formatPrice(cartSubtotalMAD)}</span>
                </div>
                <p className="text-[11px] text-[#6B6864]">{t.cart.shippingNotice}</p>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/checkout");
                }}
                className="w-full py-3.5 bg-[#111111] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#333333] transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
              >
                <span>{t.cart.checkout}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
