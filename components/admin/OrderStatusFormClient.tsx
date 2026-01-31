"use client";

import { useState } from "react";

interface OrderStatusFormClientProps {
  orderId: string;
  currentStatus: string;
}

const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function OrderStatusFormClient({
  orderId,
  currentStatus,
}: OrderStatusFormClientProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour.");
      }

      setMessage("Statut mis à jour.");
    } catch (err: any) {
      setMessage(err?.message || "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-xs">
      <label className="block text-slate-700">
        Nouveau statut
        <select
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-[#FF6B35] px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-[#e85f2f] disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "Mise à jour..." : "Mettre à jour le statut"}
      </button>

      {message && (
        <p className="mt-1 text-[11px] text-slate-600">
          {message}
        </p>
      )}
    </form>
  );
}
