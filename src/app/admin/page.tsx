"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  PackageCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  Phone,
  MessageSquare,
  CheckCircle2,
  Truck,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch((err) => console.error("Error loading orders:", err))
      .finally(() => setLoading(false));
  }, []);

  const getOrderTotal = (o: any) => o.totalMAD ?? (o.totalCents ? o.totalCents / 100 : 0);
  const totalRevenue = orders.reduce((acc, o) => acc + getOrderTotal(o), 0);
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const shippedCount = orders.filter((o) => o.status === "SHIPPED").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-6">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111111]">
            Tableau de Bord
          </h1>
          <p className="text-xs text-[#6B6864] mt-1">
            Gestion des commandes Cash on Delivery et suivi du catalogue BAMO.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-[#111111] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#333333] transition shadow-xs"
          >
            Gérer les Commandes
          </Link>
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-white text-[#111111] border border-black/15 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-black/5 transition shadow-xs"
          >
            Catalogue
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Chiffre d'Affaires */}
        <div className="p-6 bg-white rounded-2xl border border-black/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6B6864]">
            <span className="text-xs uppercase tracking-wider font-semibold">Chiffre d&apos;Affaires</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-black text-[#111111]">
            {totalRevenue.toLocaleString("fr-FR")} DH
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            Commandes Cash on Delivery
          </span>
        </div>

        {/* Card 2: En Attente de Livraison */}
        <div className="p-6 bg-white rounded-2xl border border-black/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6B6864]">
            <span className="text-xs uppercase tracking-wider font-semibold">En Attente</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-black text-[#111111]">
            {pendingCount}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">
            À confirmer par appel/WhatsApp
          </span>
        </div>

        {/* Card 3: Expédiées */}
        <div className="p-6 bg-white rounded-2xl border border-black/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6B6864]">
            <span className="text-xs uppercase tracking-wider font-semibold">Expédiées</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-black text-[#111111]">
            {shippedCount}
          </div>
          <span className="text-[11px] text-blue-700 font-medium">
            Colis en cours d&apos;acheminement
          </span>
        </div>

        {/* Card 4: Livrées & Encaissées */}
        <div className="p-6 bg-white rounded-2xl border border-black/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6B6864]">
            <span className="text-xs uppercase tracking-wider font-semibold">Livrées (Encaissées)</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-black text-[#111111]">
            {deliveredCount}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">
            Espèces reçues avec succès
          </span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-black/10 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-lg uppercase tracking-wider text-[#111111] font-bold">
              Commandes Récentes (Paiement à la livraison)
            </h2>
            <p className="text-xs text-[#6B6864]">
              Contactez directement les clients via WhatsApp pour confirmer la commande avant expédition.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-[#111111] font-semibold hover:underline flex items-center gap-1"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-xs text-[#6B6864]">
            Chargement des commandes...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center bg-[#F6F2EC]/40 rounded-xl border border-black/10 space-y-3">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto text-[#6B6864]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-[#111111]">
              Aucune commande pour le moment
            </h3>
            <p className="text-xs text-[#6B6864] max-w-sm mx-auto">
              Les nouvelles commandes Cash on Delivery passées par vos clients apparaîtront ici automatiquement en temps réel.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/10 text-[11px] text-[#6B6864] uppercase tracking-wider">
                <tr>
                  <th className="pb-3 font-semibold">N° Commande</th>
                  <th className="pb-3 font-semibold">Client</th>
                  <th className="pb-3 font-semibold">Ville</th>
                  <th className="pb-3 font-semibold">Parfums</th>
                  <th className="pb-3 font-semibold">Montant</th>
                  <th className="pb-3 font-semibold">Statut</th>
                  <th className="pb-3 font-semibold text-right">Actions Rapides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {orders.map((order) => {
                  const whatsappUrl = `https://wa.me/212${order.customerPhone.replace(
                    /^0/,
                    ""
                  )}?text=${encodeURIComponent(
                    `Bonjour ${order.customerName}, nous vous contactons de la maison BAMO Parfums concernant votre commande N° ${order.orderNumber}. Confirmez-vous votre adresse de livraison à ${order.city} ?`
                  )}`;

                  return (
                    <tr key={order.id} className="hover:bg-[#F6F2EC]/50 transition">
                      <td className="py-3.5 font-mono font-bold text-[#111111]">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3.5">
                        <div className="font-semibold text-[#111111]">
                          {order.customerName}
                        </div>
                        <div className="text-[11px] text-[#6B6864]">
                          {order.customerPhone}
                        </div>
                      </td>
                      <td className="py-3.5 font-medium text-[#111111]">
                        {order.city}
                      </td>
                      <td className="py-3.5 text-[#6B6864]">
                        {order.items && order.items.length > 0
                          ? order.items.map((it: any) => it.productNameSaved || it.productName).join(", ")
                          : "Extrait de Parfum BAMO"}
                      </td>
                      <td className="py-3.5 font-mono font-bold text-[#111111]">
                        {getOrderTotal(order).toLocaleString("fr-FR")} DH
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                            order.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : order.status === "SHIPPED"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "DELIVERED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right space-x-2">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-full text-[11px] font-semibold hover:bg-emerald-700 transition"
                          title="Confirmer sur WhatsApp"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
