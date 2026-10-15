// components/admin/OrderStatusClient.tsx
"use client";

import { useState } from "react";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type Status = (typeof STATUSES)[number];

interface Props {
  orderId: string;
  initialStatus: string;
  fulfillmentMethod: "DELIVERY" | "PICKUP";
}

export function OrderStatusClient({ orderId, initialStatus, fulfillmentMethod }: Props) {
  const [status, setStatus] = useState<Status>(
    (initialStatus as Status) || "PENDING"
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as Status;
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Erreur serveur");
      }

      setStatus(newStatus);
      setMessage("Statut mis à jour.");
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <label
        htmlFor="order-status"
        className="text-xs font-medium text-slate-700"
      >
        Statut de la commande
      </label>
      <select
        id="order-status"
        value={status}
        disabled={loading}
        onChange={handleChange}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
      >
        {STATUSES.filter((s) => fulfillmentMethod === "PICKUP" ? s !== "SHIPPED" : s !== "READY_FOR_PICKUP").map((s) => (
          <option key={s} value={s}>
            {s === "READY_FOR_PICKUP" ? "Prête à récupérer" : s === "DELIVERED" && fulfillmentMethod === "PICKUP" ? "Remise au client" : ({ PENDING: "En attente", CONFIRMED: "Confirmée", PREPARING: "En préparation", SHIPPED: "Expédiée", DELIVERED: "Livrée", CANCELLED: "Annulée" } as Record<string,string>)[s]}
          </option>
        ))}
      </select>
      {message && (
        <p className="text-[11px] text-slate-500">
          {message}
        </p>
      )}
    </div>
  );
}
