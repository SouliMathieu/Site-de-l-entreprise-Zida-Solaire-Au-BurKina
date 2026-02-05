// app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, ShoppingCart, FileText, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Dashboard | Admin ZIDA SOLAIRE",
  description: "Tableau de bord administrateur ZIDA SOLAIRE.",
};

export default async function AdminDashboardPage() {
  // Statistiques générales
  const [totalProducts, totalOrders, totalRequests, recentOrders] =
    await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.installationRequest.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          customer: {
            select: { firstName: true, lastName: true },
          },
        },
      }),
    ]);

  // Calcul du chiffre d'affaires total
  const ordersWithTotal = await prisma.order.findMany({
    where: { status: { in: ["DELIVERED", "CONFIRMED", "SHIPPED"] } },
    select: { total: true },
  });

  const totalRevenue = ordersWithTotal.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  // Commandes par statut
  const pendingOrders = await prisma.order.count({
    where: { status: "PENDING" },
  });
  const confirmedOrders = await prisma.order.count({
    where: { status: "CONFIRMED" },
  });

  // Demandes de devis par statut
  const newRequests = await prisma.installationRequest.count({
    where: { status: "NEW" },
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Vue d'ensemble de votre activité ZIDA SOLAIRE.
        </p>
      </div>

      {/* Cartes KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Produits actifs */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">
                Produits actifs
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {totalProducts}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Link
            href="/admin/produits"
            className="mt-4 inline-flex text-xs font-semibold text-blue-600 hover:underline"
          >
            Gérer les produits →
          </Link>
        </div>

        {/* Commandes totales */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">
                Commandes totales
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {totalOrders}
              </p>
              <p className="mt-1 text-[11px] text-amber-600">
                {pendingOrders} en attente
              </p>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <ShoppingCart className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <Link
            href="/admin/commandes"
            className="mt-4 inline-flex text-xs font-semibold text-orange-600 hover:underline"
          >
            Voir les commandes →
          </Link>
        </div>

        {/* Demandes de devis */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">
                Demandes de devis
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {totalRequests}
              </p>
              <p className="mt-1 text-[11px] text-blue-600">
                {newRequests} nouvelles
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <Link
            href="/admin/devis"
            className="mt-4 inline-flex text-xs font-semibold text-purple-600 hover:underline"
          >
            Voir les demandes →
          </Link>
        </div>

        {/* Chiffre d'affaires */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">
                Chiffre d'affaires
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {totalRevenue.toLocaleString("fr-FR")}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">FCFA</p>
            </div>
            <div className="rounded-full bg-emerald-100 p-3">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <p className="mt-4 text-[11px] text-slate-500">
            Commandes confirmées + livrées
          </p>
        </div>
      </div>

      {/* Dernières commandes */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Dernières commandes
          </h2>
          <Link
            href="/admin/commandes"
            className="text-xs font-semibold text-orange-600 hover:underline"
          >
            Voir toutes →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune commande récente.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-slate-200">
                <tr className="text-left text-xs font-semibold text-slate-600">
                  <th className="pb-3">N° commande</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Statut</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => {
                  const customerName = order.customer
                    ? `${order.customer.firstName} ${order.customer.lastName}`
                    : "Client inconnu";

                  const createdAt = new Date(order.createdAt).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    }
                  );

                  let statusColor = "bg-slate-100 text-slate-700";
                  if (order.status === "PENDING")
                    statusColor = "bg-amber-100 text-amber-700";
                  if (order.status === "CONFIRMED")
                    statusColor = "bg-blue-100 text-blue-700";
                  if (order.status === "DELIVERED")
                    statusColor = "bg-emerald-100 text-emerald-700";

                  return (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="py-3 font-mono text-xs">
                        <Link
                          href={`/admin/commandes/${order.id}`}
                          className="text-orange-600 hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 text-slate-800">{customerName}</td>
                      <td className="py-3 font-semibold text-slate-900">
                        {Number(order.total).toLocaleString("fr-FR")} FCFA
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColor}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-slate-500">
                        {createdAt}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Liens rapides */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/produits"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-orange-300 hover:shadow-md transition-all"
        >
          <h3 className="text-sm font-semibold text-slate-900">
            Gérer les produits
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Ajouter, modifier ou supprimer des produits
          </p>
        </Link>

        <Link
          href="/admin/commandes?status=PENDING"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-orange-300 hover:shadow-md transition-all"
        >
          <h3 className="text-sm font-semibold text-slate-900">
            Commandes en attente
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Traiter les nouvelles commandes ({pendingOrders})
          </p>
        </Link>

        <Link
          href="/admin/devis?status=NEW"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-orange-300 hover:shadow-md transition-all"
        >
          <h3 className="text-sm font-semibold text-slate-900">
            Nouvelles demandes de devis
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Consulter les nouvelles demandes ({newRequests})
          </p>
        </Link>
      </div>
    </main>
  );
}
