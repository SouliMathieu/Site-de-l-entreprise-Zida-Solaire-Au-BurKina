// app/admin/produits/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";


export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container-zida flex-1 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Produits (Admin)
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Gestion basique des produits pour le MVP (ajout, modification, activation).
            </p>
          </div>

          <Link
            href="/admin/produits/nouveau"
            className="rounded-md bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#e85f2f]"
          >
            Ajouter un produit
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Produit</th>
                <th className="px-3 py-2">Catégorie</th>
                <th className="px-3 py-2">Prix</th>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2">Actif</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 overflow-hidden rounded bg-slate-100">
                        {Array.isArray(product.images) &&
                        (product.images as string[])[0] ? (
                          <img
                            src={(product.images as string[])[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                            Img
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {product.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {product.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {product.category?.name ?? "-"}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {Number(product.price).toLocaleString("fr-FR")} FCFA
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {product.stock}{" "}
                    {product.stock <= product.lowStockThreshold && product.stock > 0
                      ? "(stock bas)"
                      : product.stock <= 0
                      ? "(rupture)"
                      : ""}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {product.isActive ? "Oui" : "Non"}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    <Link
                      href={`/admin/produits/${product.id}`}
                      className="text-[#FF6B35] hover:underline"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-4 text-center text-sm text-slate-500"
                  >
                    Aucun produit pour l’instant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
