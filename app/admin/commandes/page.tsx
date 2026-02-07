// app/admin/commandes/page.tsx
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";
import { OrdersFilter } from "@/components/admin/OrdersFilter";
import { OrderActionsClient } from "@/components/admin/OrderActionsClient";
import { PackageSearch } from "lucide-react";

export const metadata = {
  title: "Commandes | Admin ZIDA SOLAIRE",
  description: "Suivi des commandes clients.",
};

interface AdminOrdersPageProps {
  searchParams: Promise<{
    status?: string;
    period?: string;
  }>;
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PREPARING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const STATUS_CLASS: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PREPARING: "bg-purple-50 text-purple-700",
  SHIPPED: "bg-indigo-50 text-indigo-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
};

function getPeriodDate(period?: string | null): Date | null {
  const now = new Date();
  if (!period) return null;

  if (period === "today") {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (period === "7days") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }
  if (period === "30days") {
    const d = new Date(now);
    d.setDate(d.getDate() - 30);
    return d;
  }
  return null;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const statusFilter = (params.status ?? "") as OrderStatus | "";
  const periodFilter = params.period ?? "";

  const where: any = {};

  if (statusFilter) {
    where.status = statusFilter;
  }

  const fromDate = getPeriodDate(periodFilter);
  if (fromDate) {
    where.createdAt = { gte: fromDate };
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      customer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-xl">
              <PackageSearch className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
              <p className="text-sm text-gray-500">
                Suivi des commandes clients ({orders.length} résultat
                {orders.length > 1 ? "s" : ""}).
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <OrdersFilter />
          </div>
        </div>

        {/* Filtres (mobile) */}
        <div className="md:hidden">
          <OrdersFilter />
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-10 flex flex-col items-center justify-center text-gray-500">
              <PackageSearch className="w-10 h-10 mb-3 text-gray-300" />
              <p className="font-semibold">Aucune commande trouvée</p>
              <p className="text-sm text-gray-400 mt-1">
                Essayez d’ajuster les filtres de statut ou de période.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      N° commande
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Téléphone
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Ville
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">
                      Créée le
                    </th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    const customer = order.customer;
                    const customerName =
                      (customer &&
                        [customer.firstName, customer.lastName]
                          .filter(Boolean)
                          .join(" ")) ||
                      "Client";

                    const status = order.status as OrderStatus;

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-6 py-3 font-mono text-xs text-gray-700">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-3 text-gray-800 font-medium">
                          {customerName}
                        </td>
                        <td className="px-6 py-3 text-gray-700">
                          {customer?.phone || "-"}
                        </td>
                        <td className="px-6 py-3 text-gray-700">
                          {customer?.city || "-"}
                        </td>
                        <td className="px-6 py-3 font-semibold text-gray-900">
                          {Number(order.total).toLocaleString("fr-FR")}{" "}
                          <span className="text-xs text-gray-500">FCFA</span>
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CLASS[status]}`}
                          >
                            {STATUS_LABEL[status]}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-3">
                          <OrderActionsClient
                            orderId={order.id}
                            orderNumber={order.orderNumber}
                          />
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
    </div>
  );
}
