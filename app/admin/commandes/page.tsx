// app/admin/commandes/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Commandes | Admin ZIDA SOLAIRE",
  description: "Liste des commandes clients ZIDA SOLAIRE pour le backoffice.",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: {
          firstName: true,
          lastName: true,
          phone: true,
          city: true,
        },
      },
    },
    take: 100,
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Commandes</h1>
          <p className="mt-1 text-sm text-slate-600">
            Suivi des commandes clients (100 dernières).
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-slate-500">
          Aucune commande pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold text-slate-600">
                <th className="px-4 py-3">N° commande</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Téléphone</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Créée le</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const customerName = order.customer
                  ? `${order.customer.firstName} ${order.customer.lastName}`
                  : "Client inconnu";

                const createdAt = new Date(order.createdAt).toLocaleString(
                  "fr-FR",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );

                return (
                  <tr
                    key={order.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {customerName}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {order.customer?.phone ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {order.customer?.city ?? "-"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {Number(order.total).toLocaleString("fr-FR")} FCFA
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {createdAt}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/commandes/${order.id}`}
                        className="text-xs font-semibold text-orange-600 hover:underline"
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
