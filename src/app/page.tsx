"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BestSellers } from "@/components/BestSellers";
import { CategoryTiles } from "@/components/CategoryTiles";
import { SourcingStory } from "@/components/SourcingStory";
import { CustomerReviews } from "@/components/CustomerReviews";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { LanguageCurrencyModal } from "@/components/LanguageCurrencyModal";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F6F2EC] selection:bg-[#E9B949] selection:text-black">
      {/* Top Header & Navigation */}
      <Header />

      {/* Hero Section with Full-Bleed Photoshoot & Continuous Scroll Animation */}
      <Hero />

      {/* Best Sellers 4-Column Product Grid with Hairline Dividers */}
      <BestSellers />

      {/* 3-Column Editorial Category Tiles */}
      <CategoryTiles />

      {/* Precious Ingredients Sourcing & Botanical Sketches */}
      <SourcingStory />

      {/* Verified Moroccan Client Reviews & Testimonials */}
      <CustomerReviews />

      {/* Frequently Asked Questions (FAQ COD & Delivery) */}
      <FaqSection />

      {/* Global Interactive Drawers & Modals */}
      <CartDrawer />
      <LanguageCurrencyModal />

      {/* Luxury Footer */}
      <Footer />
    </main>
  );
}
