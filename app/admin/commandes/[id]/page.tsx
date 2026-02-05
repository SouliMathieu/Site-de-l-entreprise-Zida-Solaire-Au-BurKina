// app/admin/commandes/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { OrderStatusClient } from "@/components/admin/OrderStatusClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Détail commande | Admin ZIDA SOLAIRE",
  description: "Détail d'une commande client ZIDA SOLAIRE.",
};

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: true,
    },
  });

  if (!order) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-red-600">Commande introuvable.</p>
        <Link
          href="/admin/commandes"
          className="mt-4 inline-flex text-xs text-orange-600 hover:underline"
        >
          ← Retour aux commandes
        </Link>
      </main>
    );
  }

  const customer = order.customer;
  const createdAt = new Date(order.createdAt).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link
        href="/admin/commandes"
        className="text-xs text-orange-600 hover:underline"
      >
        ← Retour aux commandes
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Commande {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Créée le {createdAt} — Total{" "}
            {Number(order.total).toLocaleString("fr-FR")} FCFA
          </p>
        </div>

        <OrderStatusClient orderId={order.id} initialStatus={order.status} />
      </div>

      {/* Infos client */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 text-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-2">
          Informations client
        </h2>
        <p className="text-slate-800">
          {customer
            ? `${customer.firstName} ${customer.lastName}`
            : "Client inconnu"}
        </p>
        <p className="text-slate-700">
          Téléphone : {order.customerPhone || customer?.phone || "-"}
        </p>
        <p className="text-slate-700">
          Email : {order.customerEmail || customer?.email || "-"}
        </p>
        <p className="text-slate-700">
          Ville : {order.deliveryCity || customer?.city || "-"}
        </p>
        <p className="text-slate-700">
          Adresse : {order.deliveryAddress || customer?.address || "-"}
        </p>
        {order.customerNotes && (
          <p className="text-xs text-slate-500 mt-2">
            Notes client : {order.customerNotes}
          </p>
        )}
      </section>

      {/* Articles */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-sm space-y-3">
        <h2 className="text-base font-semibold text-slate-900 mb-2">
          Articles
        </h2>

        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex-1">
                <p className="text-slate-800">{item.productName}</p>
                <p className="text-xs text-slate-500">
                  {item.quantity} ×{" "}
                  {Number(item.price).toLocaleString("fr-FR")} FCFA
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {Number(item.subtotal).toLocaleString("fr-FR")} FCFA
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Sous-total</span>
            <span className="font-semibold text-slate-900">
              {Number(order.subtotal).toLocaleString("fr-FR")} FCFA
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Livraison</span>
            <span className="font-medium text-slate-800">
              {Number(order.deliveryFee).toLocaleString("fr-FR")} FCFA
            </span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="font-semibold text-slate-900">Total TTC</span>
            <span className="text-lg font-bold text-slate-900">
              {Number(order.total).toLocaleString("fr-FR")} FCFA
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
