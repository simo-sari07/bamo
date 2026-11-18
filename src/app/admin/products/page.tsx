"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/store";
import {
  Plus,
  Package,
  ExternalLink,
  Edit,
  Trash2,
  Check,
  AlertTriangle,
  Search,
  ImageIcon,
  Sparkles,
  X,
  Save,
  RotateCcw,
} from "lucide-react";

// Available library images for quick selection
const AVAILABLE_IMAGES = [
  { url: "/products/bamo-roselia.jpg", label: "Roselia (Rose & Doré)" },
  { url: "/products/bamo-divine.jpg", label: "Divine (Jasmin & Noir)" },
  { url: "/products/bamo-nuit-dor.jpg", label: "Nuit d'Or (Ambre & Cuir)" },
  { url: "/products/bamo-verona.jpg", label: "Verona (Caramel Solaire)" },
  { url: "/images/bamo-hero-banner.jpg", label: "Bannière Flacons Marbre" },
  { url: "/images/bamo-editorial-close.jpg", label: "Gros Plan Éditorial" },
  { url: "/images/bamo-sourcing-book.jpg", label: "Livre d'Essences BAMO" },
  { url: "/images/bamo-luxury-campaign.jpg", label: "Campagne Prestige BAMO" },
];

export default function AdminProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Create Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState<"parfums" | "homme" | "femme" | "sets">("parfums");
  const [newStock, setNewStock] = useState("45");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("/products/bamo-roselia.jpg");
  const [newConcentration, setNewConcentration] = useState("Extrait de Parfum (32% de concentration)");

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState<"parfums" | "homme" | "femme" | "sets">("parfums");
  const [editStock, setEditStock] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editConcentration, setEditConcentration] = useState("");
  const [editGallery, setEditGallery] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.products) {
        setProductsList(data.products);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  // CREATE PRODUCT HANDLER
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice.trim()) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          priceMAD: parseInt(newPrice, 10),
          category: newCategory,
          gender: newCategory === "homme" ? "homme" : newCategory === "femme" ? "femme" : "unisexe",
          stock: parseInt(newStock, 10) || 50,
          description: newDescription.trim(),
          image: newImage,
          concentration: newConcentration,
          gallery: [newImage],
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProductsList([data.product, ...productsList]);
        setCreateModalOpen(false);
        showToast("Nouveau parfum ajouté avec succès !");
        // Reset form
        setNewName("");
        setNewPrice("");
        setNewDescription("");
        setNewStock("45");
      }
    } catch (err) {
      console.error("Create product failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setEditName(prod.name.fr);
    setEditPrice(prod.priceMAD.toString());
    setEditCategory(prod.category as any);
    const stock = prod.variants.reduce((sum, v) => sum + v.stock, 0);
    setEditStock(stock.toString());
    setEditDescription(prod.description.fr);
    setEditImage(prod.image);
    setEditConcentration(prod.concentration || "Extrait de Parfum (32%)");
    setEditGallery(prod.gallery && prod.gallery.length > 0 ? prod.gallery : [prod.image]);
    setEditModalOpen(true);
  };

  // SAVE EDITED PRODUCT HANDLER
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSaving(true);
    try {
      const parsedPrice = parseInt(editPrice, 10) || editingProduct.priceMAD;
      const parsedStock = parseInt(editStock, 10) || 50;

      const updatedVariants = editingProduct.variants.map((v, i) =>
        i === 0
          ? { ...v, priceMAD: parsedPrice, stock: parsedStock }
          : v
      );

      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct.id,
          updates: {
            name: {
              fr: editName,
              en: editName,
              ar: editName,
            },
            priceMAD: parsedPrice,
            category: editCategory,
            gender: editCategory === "homme" ? "homme" : editCategory === "femme" ? "femme" : "unisexe",
            concentration: editConcentration,
            description: {
              fr: editDescription,
              en: editDescription,
              ar: editDescription,
            },
            image: editImage,
            gallery: editGallery,
            variants: updatedVariants,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProductsList((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? data.product : p))
        );
        setEditModalOpen(false);
        showToast("Fiche parfum et images mises à jour !");
      }
    } catch (err) {
      console.error("Save edit failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // DELETE PRODUCT HANDLER
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Confirmez-vous la suppression définitive du parfum "${name}" ?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProductsList((prev) => prev.filter((p) => p.id !== id));
        showToast("Parfum supprimé du catalogue.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Quick toggle gallery image
  const toggleGalleryImage = (url: string) => {
    if (editGallery.includes(url)) {
      if (editGallery.length > 1) {
        setEditGallery(editGallery.filter((u) => u !== url));
      }
    } else {
      setEditGallery([...editGallery, url]);
    }
  };

  // Filter products by search and category
  const filteredProducts = productsList.filter((prod) => {
    const matchesCategory = categoryFilter === "all" || prod.category === categoryFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm.trim() ||
      prod.name.fr.toLowerCase().includes(term) ||
      prod.slug.toLowerCase().includes(term) ||
      (prod.categoryTag && prod.categoryTag.toLowerCase().includes(term));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-poppins">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-[#E9B949] text-xs font-semibold animate-slide-up">
          <Check className="w-4 h-4 text-[#E9B949]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-6">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-black uppercase text-[#111111]">
            Catalogue & Gestion des Parfums ({productsList.length})
          </h1>
          <p className="text-xs text-[#6B6864] mt-1">
            Gestion complète des flacons, modification des photos, prix en Dirhams et stocks.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#111111] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition shadow-md cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#E9B949]" />
          <span>Ajouter un Parfum</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {[
            { id: "all", label: "Tous les Parfums" },
            { id: "parfums", label: "Extraits Pur" },
            { id: "femme", label: "Pour Elle" },
            { id: "homme", label: "Pour Lui" },
            { id: "sets", label: "Coffrets" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                categoryFilter === cat.id
                  ? "bg-[#111111] text-white shadow-xs"
                  : "bg-white text-[#111111] border border-black/10 hover:border-black/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-[#6B6864] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom..."
            className="w-full bg-white border border-black/15 text-xs text-[#111111] rounded-full pl-9 pr-4 py-2 focus:outline-hidden focus:border-black"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-black/10 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#6B6864] space-y-3">
            <div className="w-8 h-8 border-2 border-black/20 border-t-[#111111] rounded-full animate-spin mx-auto" />
            <p>Chargement du catalogue...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6B6864] space-y-3">
            <Package className="w-8 h-8 mx-auto text-[#6B6864]/40" />
            <p className="font-semibold text-[#111111]">Aucun parfum trouvé.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F2EC] border-b border-black/10 text-[11px] text-[#6B6864] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Photo</th>
                  <th className="py-3.5 px-4 font-semibold">Nom & Gamme</th>
                  <th className="py-3.5 px-4 font-semibold">Concentration</th>
                  <th className="py-3.5 px-4 font-semibold">Prix de Vente</th>
                  <th className="py-3.5 px-4 font-semibold">Stock Total</th>
                  <th className="py-3.5 px-4 font-semibold">Statut</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredProducts.map((prod) => {
                  const totalStock = prod.variants.reduce((sum, v) => sum + v.stock, 0);

                  return (
                    <tr key={prod.id} className="hover:bg-[#F6F2EC]/40 transition">
                      {/* Photo Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="relative w-12 h-14 bg-[#F6F2EC] rounded-xl overflow-hidden border border-black/10">
                          <Image
                            src={prod.image}
                            alt={prod.name.fr}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      </td>

                      {/* Name & Subtitle */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#111111] text-[13px]">{prod.name.fr}</div>
                        <div className="text-[10px] text-[#6B6864] uppercase tracking-wider">
                          {prod.categoryTag}
                        </div>
                      </td>

                      {/* Concentration */}
                      <td className="py-3.5 px-4 text-[#6B6864] font-medium">
                        {prod.concentration || "Extrait de Parfum Pur"}
                      </td>

                      {/* Price in MAD */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#111111] text-sm">
                        {prod.priceMAD} DH
                      </td>

                      {/* Stock Level */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-mono font-bold text-xs ${
                            totalStock > 15 ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {totalStock <= 15 && <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                          {totalStock} unités
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800">
                          ACTIF
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                        <Link
                          href={`/product/${prod.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-[#111111] bg-black/5 hover:bg-black/10 rounded-lg font-medium transition"
                          title="Voir sur la boutique"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Voir</span>
                        </Link>

                        <button
                          onClick={() => openEditModal(prod)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs text-white bg-[#111111] hover:bg-[#333333] rounded-lg font-semibold transition cursor-pointer"
                        >
                          <Edit className="w-3 h-3 text-[#E9B949]" />
                          <span>Modifier</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name.fr)}
                          className="inline-flex items-center p-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* EDIT PRODUCT MODAL (COMPLETE WITH IMAGE CHANGER & GALLERY) */}
      {/* ========================================================================= */}
      {editModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setEditModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div>
                <h2 className="font-headline text-lg uppercase tracking-wider text-[#111111] font-bold">
                  Modifier la fiche : {editingProduct.name.fr}
                </h2>
                <p className="text-xs text-[#6B6864]">
                  Modifiez la photo principale, les angles de vue, les prix et les notes.
                </p>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-full text-black hover:bg-black/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-6">
              {/* 1. IMAGE EDITOR SECTION */}
              <div className="space-y-3 bg-[#F6F2EC] p-4 rounded-2xl border border-black/10">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#111111]" />
                  <label className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Photo Principale du Flacon
                  </label>
                </div>

                {/* Current Active Image Preview */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-24 bg-white rounded-xl overflow-hidden border border-black/15 shrink-0 shadow-xs">
                    <Image
                      src={editImage}
                      alt="Preview"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[11px] font-semibold text-[#111111] block">
                      URL de l&apos;image sélectionnée :
                    </span>
                    <input
                      type="text"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      className="w-full bg-white px-3 py-2 rounded-xl border border-black/15 text-xs text-[#111111] font-mono focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Quick Image Picker from library */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-[#6B6864] tracking-wider block mb-2">
                    Sélectionner dans la photothèque BAMO :
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {AVAILABLE_IMAGES.map((img) => {
                      const isSelected = editImage === img.url;
                      return (
                        <button
                          key={img.url}
                          type="button"
                          onClick={() => setEditImage(img.url)}
                          className={`relative h-16 bg-white rounded-xl border p-1 transition overflow-hidden cursor-pointer ${
                            isSelected
                              ? "border-[#111111] ring-2 ring-[#E9B949] shadow-sm"
                              : "border-black/10 opacity-70 hover:opacity-100"
                          }`}
                          title={img.label}
                        >
                          <Image src={img.url} alt={img.label} fill className="object-contain p-0.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Angles de vue / Gallery */}
                <div className="pt-2 border-t border-black/10">
                  <span className="text-[10px] uppercase font-bold text-[#6B6864] tracking-wider block mb-2">
                    Galerie d&apos;angles ({editGallery.length} photos actives) :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_IMAGES.map((img) => {
                      const inGallery = editGallery.includes(img.url);
                      return (
                        <button
                          key={img.url}
                          type="button"
                          onClick={() => toggleGalleryImage(img.url)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition cursor-pointer border ${
                            inGallery
                              ? "bg-[#111111] text-white border-black"
                              : "bg-white text-[#6B6864] border-black/10 hover:border-black/30"
                          }`}
                        >
                          {inGallery ? "✓ " : "+ "}
                          {img.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. GENERAL INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Nom du parfum *
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Gamme / Catégorie
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e: any) => setEditCategory(e.target.value)}
                    className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden"
                  >
                    <option value="parfums">Extrait de Parfum (Unisexe)</option>
                    <option value="femme">Pour Elle (Femme)</option>
                    <option value="homme">Pour Lui (Homme)</option>
                    <option value="sets">Coffrets & Packs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Prix de vente (DH) *
                  </label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    required
                    className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] font-mono focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Stock d&apos;unités disponibles
                  </label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    required
                    className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] font-mono focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Concentration
                  </label>
                  <input
                    type="text"
                    value={editConcentration}
                    onChange={(e) => setEditConcentration(e.target.value)}
                    placeholder="Ex: Extrait de Parfum (32% de concentration)"
                    className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Description Olfactive (Français)
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-5 py-2.5 border border-black/15 rounded-full text-xs font-semibold hover:bg-black/5 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-7 py-2.5 bg-[#111111] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#333333] shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Save className="w-4 h-4 text-[#E9B949]" />
                  <span>{isSaving ? "Enregistrement..." : "Enregistrer les modifications"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE PRODUCT MODAL */}
      {/* ========================================================================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setCreateModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div>
                <h2 className="font-headline text-lg uppercase tracking-wider text-[#111111] font-bold">
                  Nouveau Parfum BAMO
                </h2>
                <p className="text-xs text-[#6B6864]">
                  Ajoutez un nouveau flacon à votre catalogue en ligne.
                </p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-full text-black hover:bg-black/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Nom du parfum *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ex: BAMO Imperial Musk"
                  required
                  className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Prix (DH) *
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="ex: 550"
                    required
                    className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                    Stock initial
                  </label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Catégorie
                </label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden"
                >
                  <option value="parfums">Extrait de Parfum (Unisexe)</option>
                  <option value="femme">Pour Elle (Femme)</option>
                  <option value="homme">Pour Lui (Homme)</option>
                  <option value="sets">Coffrets & Packs</option>
                </select>
              </div>

              {/* Photo selection for new product */}
              <div className="space-y-2 bg-[#F6F2EC] p-3.5 rounded-2xl border border-black/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block">
                  Choisir la photo du flacon :
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {AVAILABLE_IMAGES.slice(0, 4).map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setNewImage(img.url)}
                      className={`relative h-16 bg-white rounded-xl border p-1 transition overflow-hidden cursor-pointer ${
                        newImage === img.url
                          ? "border-[#111111] ring-2 ring-[#E9B949]"
                          : "border-black/10 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img.url} alt={img.label} fill className="object-contain p-0.5" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Description olfactive
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Notes de tête, cœur et sillage..."
                  rows={3}
                  className="w-full bg-[#F6F2EC] px-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#111111] focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-5 py-2.5 border border-black/15 rounded-full text-xs font-semibold hover:bg-black/5 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#111111] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#333333] cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? "Ajout..." : "Créer le Produit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
