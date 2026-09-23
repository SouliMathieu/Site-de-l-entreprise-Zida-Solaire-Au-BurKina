"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, RefreshCw, Search, Wrench } from "lucide-react";

type Ticket = {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  installationType?: string | null;
  problemDescription: string;
  urgency: string;
  installedByZida: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Reçue" },
  { value: "in_progress", label: "En traitement" },
  { value: "completed", label: "Terminée" },
  { value: "cancelled", label: "Annulée" },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function SavAdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function loadTickets() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/repair-requests", { cache: "no-store" });
      if (!res.ok) throw new Error("Impossible de charger les tickets SAV");
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function updateStatus(ticketId: string, status: string) {
    setUpdatingId(ticketId);
    try {
      const res = await fetch(`/api/admin/repair-requests/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Mise à jour impossible");
      const updated = await res.json();
      setTickets((current) => current.map((ticket) => ticket.id === ticketId ? { ...ticket, ...updated } : ticket));
    } catch (error) {
      console.error(error);
      window.alert("Impossible de mettre à jour ce ticket SAV.");
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
      const matchesSearch = !q || [ticket.name, ticket.phone, ticket.installationType, ticket.problemDescription, ticket.address, ticket.id]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [tickets, search, statusFilter]);

  const counts = useMemo(() => ({
    pending: tickets.filter((ticket) => ticket.status === "pending").length,
    inProgress: tickets.filter((ticket) => ticket.status === "in_progress").length,
    completed: tickets.filter((ticket) => ticket.status === "completed").length,
    urgent: tickets.filter((ticket) => ticket.urgency === "high" && ticket.status !== "completed" && ticket.status !== "cancelled").length,
  }), [tickets]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Service après-vente</p>
          <h1 className="mt-1 text-2xl font-black text-gray-900">Tickets SAV</h1>
          <p className="mt-1 text-sm text-gray-500">Suivez les demandes créées depuis le site et l’application mobile.</p>
        </div>
        <button onClick={loadTickets} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="À traiter" value={counts.pending} icon={<Clock3 className="h-5 w-5 text-amber-600" />} />
        <StatCard label="En traitement" value={counts.inProgress} icon={<Wrench className="h-5 w-5 text-blue-600" />} />
        <StatCard label="Terminés" value={counts.completed} icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />} />
        <StatCard label="Urgents actifs" value={counts.urgent} icon={<AlertTriangle className="h-5 w-5 text-red-600" />} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Client, téléphone, équipement, problème..." className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-orange-400" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-400">
            <option value="all">Tous les statuts</option>
            {STATUS_OPTIONS.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">Chargement des tickets SAV...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <Wrench className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-3 font-semibold text-gray-700">Aucun ticket trouvé</p>
            <p className="mt-1 text-sm text-gray-500">Ajustez les filtres ou attendez une nouvelle demande.</p>
          </div>
        ) : filteredTickets.map((ticket) => (
          <article key={ticket.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[ticket.status] || STATUS_STYLES.pending}`}>
                    {STATUS_OPTIONS.find((item) => item.value === ticket.status)?.label || ticket.status}
                  </span>
                  {ticket.urgency === "high" && <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">Urgent</span>}
                  {ticket.installedByZida && <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700">Installation ZIDA</span>}
                </div>
                <h2 className="mt-3 text-lg font-black text-gray-900">{ticket.installationType || "Assistance technique"}</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">{ticket.problemDescription}</p>
                <div className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                  <p><span className="font-semibold text-gray-900">Client :</span> {ticket.name}</p>
                  <p><span className="font-semibold text-gray-900">Téléphone :</span> {ticket.phone}</p>
                  <p><span className="font-semibold text-gray-900">Adresse :</span> {ticket.address || "—"}</p>
                  <p><span className="font-semibold text-gray-900">Créé :</span> {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}</p>
                </div>
                <p className="mt-3 text-xs font-semibold text-gray-400">Réf. {ticket.id}</p>
              </div>

              <div className="w-full lg:w-48">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Statut</label>
                <select
                  value={ticket.status}
                  disabled={updatingId === ticket.id}
                  onChange={(e) => updateStatus(ticket.id, e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-orange-400 disabled:opacity-60"
                >
                  {STATUS_OPTIONS.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                </select>
                {updatingId === ticket.id && <p className="mt-2 text-xs text-gray-500">Mise à jour...</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-black text-gray-900">{value}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-2.5">{icon}</div>
      </div>
    </div>
  );
}
