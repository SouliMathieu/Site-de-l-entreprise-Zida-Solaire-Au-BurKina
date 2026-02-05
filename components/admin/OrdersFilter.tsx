// components/admin/OrdersFilter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

const STATUSES = [
  { value: "", label: "Tous les statuts" },
  { value: "PENDING", label: "En attente" },
  { value: "CONFIRMED", label: "Confirmée" },
  { value: "PREPARING", label: "En préparation" },
  { value: "SHIPPED", label: "Expédiée" },
  { value: "DELIVERED", label: "Livrée" },
  { value: "CANCELLED", label: "Annulée" },
];

const PERIODS = [
  { value: "", label: "Toutes les périodes" },
  { value: "today", label: "Aujourd'hui" },
  { value: "7days", label: "7 derniers jours" },
  { value: "30days", label: "30 derniers jours" },
];

export function OrdersFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") ?? "";
  const currentPeriod = searchParams.get("period") ?? "";

  function handleFilterChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/commandes?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="flex items-center gap-2">
        <label htmlFor="status-filter" className="text-xs font-medium text-slate-700">
          Statut
        </label>
        <select
          id="status-filter"
          value={currentStatus}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="period-filter" className="text-xs font-medium text-slate-700">
          Période
        </label>
        <select
          id="period-filter"
          value={currentPeriod}
          onChange={(e) => handleFilterChange("period", e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          {PERIODS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
