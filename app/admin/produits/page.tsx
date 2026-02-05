// app/admin/produits/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = {
  title: "Produits | Admin ZIDA SOLAIRE",
  description: "Gestion des produits ZIDA SOLAIRE.",
};

export default async function AdminProduitsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: { name: true },
      },
    },
    take: 100,
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produits</h1>
          <p className="mt-1 text-sm text-slate-600">
            Gestion des produits ({products.length} total).
          </p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Nouveau produit
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun produit pour le moment.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold text-slate-600">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const images = product.images as string[];
                const mainImage = images?.[0];

                return (
                  <tr
                    key={product.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden">
                        {mainImage ? (
                          <img
                            src={mainImage}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[9px] text-slate-400">
                            Img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500">{product.sku}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {product.category?.name || "-"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {Number(product.price).toLocaleString("fr-FR")} FCFA
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          product.stock === 0
                            ? "bg-red-100 text-red-700"
                            : product.stock <= (product.lowStockThreshold || 5)
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          product.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {product.isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/produits/${product.id}`}
                          className="text-xs font-semibold text-orange-600 hover:underline"
                        >
                          Modifier
                        </Link>
                        <Link
                          href={`/produits/${product.slug}`}
                          target="_blank"
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Voir
                        </Link>
                      </div>
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
