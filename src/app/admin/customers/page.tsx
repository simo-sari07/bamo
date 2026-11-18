"use client";

import React, { useEffect, useState } from "react";
import { Users, Phone, MapPin, MessageSquare, ShoppingBag } from "lucide-react";

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      });
  }, []);

  // Group by phone number
  const customerMap: Record<string, any> = {};
  orders.forEach((o) => {
    const amount = o.totalMAD ?? (o.totalCents ? o.totalCents / 100 : 0);
    if (!customerMap[o.customerPhone]) {
      customerMap[o.customerPhone] = {
        name: o.customerName,
        phone: o.customerPhone,
        city: o.city,
        address: o.shippingAddress,
        ordersCount: 1,
        totalSpent: amount,
        lastOrder: o.createdAt,
      };
    } else {
      customerMap[o.customerPhone].ordersCount += 1;
      customerMap[o.customerPhone].totalSpent += amount;
    }
  });

  const customers = Object.values(customerMap);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-black/10 pb-6">
        <h1 className="font-headline text-2xl sm:text-3xl font-black uppercase text-[#111111]">
          Clients BAMO ({customers.length})
        </h1>
        <p className="text-xs text-[#6B6864] mt-1">
          Base de données des clients Cash on Delivery et historique d&apos;achats.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-black/10 shadow-xs overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6B6864] space-y-2">
            <Users className="w-8 h-8 mx-auto text-[#6B6864]/40" />
            <p className="font-semibold text-[#111111]">Aucun client pour le moment.</p>
            <p>Les profils clients apparaîtront ici dès que des commandes seront passées.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F2EC] border-b border-black/10 text-[11px] text-[#6B6864] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Nom du Client</th>
                  <th className="py-3 px-4 font-semibold">Téléphone</th>
                  <th className="py-3 px-4 font-semibold">Ville de livraison</th>
                  <th className="py-3 px-4 font-semibold">Commandes</th>
                  <th className="py-3 px-4 font-semibold">Total Dépensé</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {customers.map((c: any) => {
                  const whatsappUrl = `https://wa.me/212${c.phone.replace(/^0/, "")}`;

                  return (
                    <tr key={c.phone} className="hover:bg-[#F6F2EC]/40 transition">
                      <td className="py-3 px-4 font-bold text-[#111111]">
                        {c.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#6B6864]">
                        {c.phone}
                      </td>
                      <td className="py-3 px-4 text-[#111111] font-medium">
                        {c.city}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="px-2 py-0.5 rounded-full bg-black/5 font-bold">
                          {c.ordersCount} cmd
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#111111]">
                        {c.totalSpent.toLocaleString("fr-FR")} DH
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-full text-[11px] font-bold hover:bg-emerald-700 transition"
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
