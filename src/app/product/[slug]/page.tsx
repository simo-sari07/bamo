"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { LanguageCurrencyModal } from "@/components/LanguageCurrencyModal";
import { useStore } from "@/lib/store-context";
import { PRODUCTS } from "@/data/catalog";
import { Product } from "@/types/store";
import { STORE_CONFIG } from "@/config/store.config";
import { getLocalizedCategoryTag, getLocalizedBadge, getLocalizedVariantLabel, getLocalizedNote } from "@/lib/localize";
import {
  Star,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Check,
  Sparkles,
  Banknote,
  Truck,
  ShieldCheck,
} from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { slug } = resolvedParams;

  const initialProd = PRODUCTS.find((p) => p.slug === slug);
  const [productState, setProductState] = useState<Product | undefined>(initialProd);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          const found = data.products.find((p: Product) => p.slug === slug);
          if (found) {
            setProductState(found);
            setSelectedVariant(found.variants[0]);
          }
        }
      })
      .catch(() => {});
  }, [slug]);

  const product = productState || initialProd;
  if (!product) {
    notFound();
  }

  const { language, formatPrice, addToCart, t } = useStore();
  const isRTL = language === "ar";

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  // Express COD Form state
  const [codName, setCodName] = useState("");
  const [codPhone, setCodPhone] = useState("");
  const [codCity, setCodCity] = useState(STORE_CONFIG.moroccanCities[0]);
  const [codAddress, setCodAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  const handleExpressCOD = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codName.trim() || !codPhone.trim() || !codAddress.trim()) {
      setErrorMessage(t.pdp.fillRequired);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/orders/cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: codName,
          customerPhone: codPhone,
          city: codCity,
          shippingAddress: codAddress,
          items: [
            {
              productId: product.id,
              variantId: selectedVariant.id,
              productName: product.name[language],
              variantLabel: selectedVariant.label,
              priceMAD: selectedVariant.priceMAD,
              quantity: 1,
            },
          ],
          totalMAD: selectedVariant.priceMAD,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push(
          `/order-success?orderNumber=${encodeURIComponent(
            data.orderNumber
          )}&name=${encodeURIComponent(codName)}&total=${selectedVariant.priceMAD}&city=${encodeURIComponent(
            codCity
          )}`
        );
      } else {
        setErrorMessage(
          data.error ||
            (language === "ar"
              ? "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى."
              : "Une erreur est survenue lors de l'enregistrement.")
        );
      }
    } catch {
      setErrorMessage(
        language === "ar"
          ? "تعذر الاتصال بالخادم، يرجى التحقق من اتصالك والمحاولة مجدداً."
          : "Erreur de connexion. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant);
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 2500);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F6F2EC] font-poppins selection:bg-[#E9B949] selection:text-black">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1">
        {/* Minimal Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#6B6864] mb-6">
          <Link href="/" className="hover:text-black transition">
            {t.pdp.home}
          </Link>
          {isRTL ? (
            <ChevronLeft className="w-3 h-3 opacity-40" />
          ) : (
            <ChevronRight className="w-3 h-3 opacity-40" />
          )}
          <Link href="/shop" className="hover:text-black transition">
            {t.pdp.collection}
          </Link>
          {isRTL ? (
            <ChevronLeft className="w-3 h-3 opacity-40" />
          ) : (
            <ChevronRight className="w-3 h-3 opacity-40" />
          )}
          <span className="text-[#111111] font-semibold truncate max-w-xs">
            {product.name[language]}
          </span>
        </nav>

        {/* 2-Column Minimal Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Only the current product's bottle photo + sleek notes */}
          <div className="lg:col-span-6 space-y-4">
            {/* Single Product Bottle Image (NO thumbnails of other perfumes) */}
            <div className="relative w-full h-[420px] sm:h-[500px] bg-white rounded-3xl border border-black/10 overflow-hidden flex items-center justify-center p-8 shadow-xs">
              <div className="relative w-full h-full">
                <Image
                  src={product.image}
                  alt={product.name[language]}
                  fill
                  priority
                  quality={95}
                  className="object-contain drop-shadow-xl"
                />
              </div>

              {product.badge && (
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-[#111111] text-[#E9B949] px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                  {getLocalizedBadge(product.badge, language)}
                </div>
              )}
            </div>

            {/* Compact Olfactive Notes Bar (Minimalist) */}
            {product.notes && (
              <div className="p-5 bg-white rounded-2xl border border-black/10 space-y-2.5 text-xs shadow-2xs">
                <div className="flex items-center justify-between border-b border-black/5 pb-2">
                  <span className="font-headline text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                    {t.pdp.pyramidTitle}
                  </span>
                  <span className="text-[10px] text-[#6B6864] font-medium font-mono">
                    {t.pdp.concentrationBadge}
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-left rtl:text-right">
                  <p className="text-[#111111]">
                    <strong className="text-[#6B6864] uppercase font-bold text-[10px] mr-1.5 ml-1.5">
                      {t.pdp.topNotes} :
                    </strong>
                    {product.notes.top.map((n) => getLocalizedNote(n, language)).join(" • ")}
                  </p>
                  <p className="text-[#111111]">
                    <strong className="text-[#6B6864] uppercase font-bold text-[10px] mr-1.5 ml-1.5">
                      {t.pdp.heartNotes} :
                    </strong>
                    {product.notes.heart.map((n) => getLocalizedNote(n, language)).join(" • ")}
                  </p>
                  <p className="text-[#111111]">
                    <strong className="text-[#6B6864] uppercase font-bold text-[10px] mr-1.5 ml-1.5">
                      {t.pdp.baseNotes} :
                    </strong>
                    {product.notes.base.map((n) => getLocalizedNote(n, language)).join(" • ")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Title, Short Description, Format & Compact COD Form */}
          <div className="lg:col-span-6 space-y-5 text-left rtl:text-right">
            {/* Header info */}
            <div className="space-y-2 border-b border-black/10 pb-4">
              <span className="text-[10px] font-mono tracking-widest text-[#6B6864] uppercase font-semibold">
                {getLocalizedCategoryTag(product.categoryTag, language)}
              </span>

              <h1 className="font-headline text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
                {product.name[language]}
              </h1>

              {/* Price & Rating */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-bold font-mono text-[#111111]">
                    {formatPrice(selectedVariant.priceMAD)}
                  </span>
                  {product.originalPriceMAD && (
                    <span className="text-sm font-mono text-[#888580] line-through">
                      {formatPrice(product.originalPriceMAD)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <div className="flex text-[#E9B949]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-[#111111]">{product.rating}</span>
                  <span className="text-[11px] text-[#6B6864]">({product.reviewsCount} {t.pdp.reviewsCount})</span>
                </div>
              </div>
            </div>

            {/* Short Minimal Description in active language */}
            <p className="text-xs sm:text-[13px] text-[#55524E] leading-relaxed">
              {product.description[language]}
            </p>

            {/* Format Picker */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] block">
                {t.pdp.format}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                      selectedVariant.id === variant.id
                        ? "border-[#111111] bg-white font-bold text-[#111111] shadow-2xs"
                        : "border-black/10 bg-white/50 hover:bg-white text-[#6B6864]"
                    }`}
                  >
                    <span>{getLocalizedVariantLabel(variant.label, language)}</span>
                    <span className="font-mono text-[11px] text-[#111111]">
                      ({formatPrice(variant.priceMAD)})
                    </span>
                    {selectedVariant.id === variant.id && (
                      <Check className="w-3.5 h-3.5 text-[#111111]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Discovery Pack subtle link */}
            {product.id !== "bamo-pack-4" && (
              <div className="p-3 bg-white rounded-xl border border-[#E9B949]/40 flex items-center justify-between text-xs shadow-2xs">
                <span className="text-[11px] text-[#111111] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E9B949]" />
                  <span>{t.pdp.discoveryPack}</span>
                </span>
                <Link
                  href="/product/pack-prestige-4-parfums"
                  className="text-[11px] font-bold text-[#111111] hover:underline"
                >
                  {t.pdp.viewOffer}
                </Link>
              </div>
            )}

            {/* COMPACT & MINIMAL 1-CLICK CASH ON DELIVERY FORM */}
            <div className="bg-[#EFE9DF] rounded-2xl p-5 border border-black/15 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-headline text-xs font-bold uppercase tracking-wider text-[#111111]">
                    {t.pdp.order1Click}
                  </h3>
                  <p className="text-[10px] text-[#6B6864]">{t.pdp.codSubtitle}</p>
                </div>
                <span className="text-[9px] font-mono font-bold bg-[#111111] text-[#E9B949] px-2 py-0.5 rounded-full">
                  {t.pdp.codBadge}
                </span>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleExpressCOD} className="space-y-2.5">
                <input
                  type="text"
                  value={codName}
                  onChange={(e) => setCodName(e.target.value)}
                  placeholder={t.pdp.namePlaceholder}
                  required
                  className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] placeholder-[#888580] focus:outline-hidden focus:border-black"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    value={codPhone}
                    onChange={(e) => setCodPhone(e.target.value)}
                    placeholder={t.pdp.phonePlaceholder}
                    required
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] placeholder-[#888580] focus:outline-hidden focus:border-black font-mono"
                  />

                  <select
                    value={codCity}
                    onChange={(e) => setCodCity(e.target.value)}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden focus:border-black cursor-pointer font-medium"
                  >
                    {STORE_CONFIG.moroccanCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  value={codAddress}
                  onChange={(e) => setCodAddress(e.target.value)}
                  placeholder={t.pdp.addressPlaceholder}
                  required
                  className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] placeholder-[#888580] focus:outline-hidden focus:border-black"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#111111] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#333333] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-70 active:scale-98 cursor-pointer"
                >
                  <Banknote className="w-3.5 h-3.5 text-[#E9B949]" />
                  <span>
                    {isSubmitting
                      ? t.pdp.submitting
                      : `${t.pdp.confirmOrder} (${formatPrice(selectedVariant.priceMAD)})`}
                  </span>
                </button>
              </form>

              {/* Secondary Add to Cart */}
              <div className="pt-0.5 text-center">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="text-xs text-[#111111] hover:underline font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t.pdp.addToCart}</span>
                </button>
                {addedToCartToast && (
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                    {t.pdp.addedToast}
                  </p>
                )}
              </div>
            </div>

            {/* Clean Minimalist Guarantees */}
            <div className="flex items-center justify-between text-[11px] text-[#6B6864] pt-1 px-1">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#111111]" />
                <span>{t.pdp.deliveryTime}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5 text-[#111111]" />
                <span>{t.pdp.cashOnDelivery}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#111111]" />
                <span>{t.pdp.guaranteedPure}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <CartDrawer />
      <LanguageCurrencyModal />
      <Footer />
    </main>
  );
}
