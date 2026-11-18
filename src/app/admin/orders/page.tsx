"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Package,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch(`/api/admin/orders?status=${statusFilter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e) {
      console.error("Failed to update status:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(term) ||
      o.customerName.toLowerCase().includes(term) ||
      o.customerPhone.includes(term) ||
      o.city.toLowerCase().includes(term)
    );
  });

  const statuses = [
    { id: "ALL", label: "Toutes" },
    { id: "PENDING", label: "En Attente (COD)" },
    { id: "PACKED", label: "Emballée" },
    { id: "SHIPPED", label: "Expédiée" },
    { id: "DELIVERED", label: "Livrée & Encaissée" },
    { id: "CANCELLED", label: "Annulée" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="border-b border-black/10 pb-6">
        <h1 className="font-headline text-2xl sm:text-3xl font-black uppercase text-[#111111]">
          Commandes Cash on Delivery
        </h1>
        <p className="text-xs text-[#6B6864] mt-1">
          Gérez le cycle de livraison des colis et confirmez les expéditions avec les coursiers.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {statuses.map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                statusFilter === st.id
                  ? "bg-[#111111] text-white shadow-xs"
                  : "bg-white text-[#111111] border border-black/10 hover:border-black/30"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#6B6864] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par N°, nom, ville..."
            className="w-full bg-white pl-10 pr-4 py-2 rounded-full border border-black/15 text-xs text-[#111111] focus:outline-hidden focus:border-black"
          />
        </div>
      </div>

      {/* Orders Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-xs text-[#6B6864]">
          Chargement des commandes...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-black/10 text-xs text-[#6B6864]">
          Aucune commande trouvée.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const whatsappUrl = `https://wa.me/212${order.customerPhone.replace(
              /^0/,
              ""
            )}?text=${encodeURIComponent(
              `Bonjour ${order.customerName}, la maison BAMO Parfums vous contacte au sujet de votre commande N° ${order.orderNumber} pour un montant de ${
                order.totalCents / 100
              } DH à livrer à ${order.city}.`
            )}`;

            return (
              <div
                key={order.id}
                className="bg-white p-6 rounded-2xl border border-black/10 shadow-xs space-y-4 hover:border-black/30 transition"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-black text-[#111111]">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[11px] font-mono text-[#6B6864]">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#6B6864] uppercase font-bold">
                      Statut :
                    </span>
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`font-mono text-xs font-bold rounded-full px-3 py-1 border cursor-pointer ${
                        order.status === "PENDING"
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : order.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-900 border-blue-300"
                          : order.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-gray-100 text-gray-900 border-gray-300"
                      }`}
                    >
                      <option value="PENDING">PENDING (En attente confirmation)</option>
                      <option value="PACKED">PACKED (Colis préparé)</option>
                      <option value="SHIPPED">SHIPPED (En cours d&apos;acheminement)</option>
                      <option value="DELIVERED">DELIVERED (Livré & Encaissé)</option>
                      <option value="CANCELLED">CANCELLED (Annulée)</option>
                    </select>
                  </div>
                </div>

                {/* Details 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Column 1: Client & Phone */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#6B6864] tracking-wider block">
                      Client & Contact
                    </span>
                    <div className="font-bold text-[#111111]">{order.customerName}</div>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="inline-flex items-center gap-1 text-[#111111] hover:underline"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{order.customerPhone}</span>
                      </a>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold hover:bg-emerald-700"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Column 2: Adresse de livraison */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#6B6864] tracking-wider block">
                      Adresse de livraison (Maroc)
                    </span>
                    <div className="flex items-start gap-1.5 text-[#111111]">
                      <MapPin className="w-3.5 h-3.5 text-[#6B6864] shrink-0 mt-0.5" />
                      <span>
                        <strong className="block text-[#111111]">{order.city}</strong>
                        {order.shippingAddress}
                      </span>
                    </div>
                    {order.notes && (
                      <p className="text-[11px] text-[#6B6864] italic pt-1">
                        Note: &quot;{order.notes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Column 3: Parfums & Montant COD */}
                  <div className="space-y-1 bg-[#F6F2EC] p-3 rounded-xl border border-black/5">
                    <span className="text-[10px] uppercase font-bold text-[#6B6864] tracking-wider block">
                      Articles & Total Cash on Delivery
                    </span>
                    <div className="space-y-1 pt-0.5">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((it: any, i: number) => {
                          const name = it.productNameSaved || it.productName || "Extrait de Parfum BAMO";
                          const label = it.variantLabel || "50 ml";
                          const price = it.priceMAD ?? (it.unitPriceCents ? it.unitPriceCents / 100 : 0);
                          return (
                            <div key={it.id || i} className="flex justify-between text-[11px]">
                              <span>
                                {it.quantity}x {name} ({label})
                              </span>
                              <span className="font-mono font-semibold">
                                {price * (it.quantity || 1)} DH
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-[11px]">Extrait de Parfum BAMO</div>
                      )}
                    </div>
                    <div className="border-t border-black/10 pt-1.5 flex justify-between font-bold text-xs text-[#111111]">
                      <span>Total à encaisser :</span>
                      <span className="font-mono text-sm text-emerald-800">
                        {(order.totalMAD ?? (order.totalCents ? order.totalCents / 100 : 0)).toLocaleString("fr-FR")} DH
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
