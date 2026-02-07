// app/admin/categories/page.tsx
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CategoryActionsClient } from "@/components/admin/CategoryActionsClient";
import { FolderTree, Plus } from "lucide-react";

export const metadata = {
  title: "Catégories | Admin ZIDA SOLAIRE",
  description: "Gestion des catégories de produits.",
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 px-8 py-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-xl">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
              <p className="text-sm text-gray-500">
                Gestion des catégories de produits ({categories.length} total).
              </p>
            </div>
          </div>
          <Link
            href="/admin/categories/nouvelle"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-md hover:shadow-lg hover:bg-orange-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Nouvelle catégorie
          </Link>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucune catégorie pour le moment.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">
                    Ordre
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">
                    Produits
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-3 text-gray-700 font-medium">
                      {category.order}
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-semibold text-gray-900">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 font-mono text-xs">
                        {category.slug}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/admin/produits?categorie=${category.slug}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        {category._count.products} produit(s)
                      </Link>
                    </td>
                    <td className="px-6 py-3">
                      {category.isActive ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-700">
                          Inactif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <CategoryActionsClient
                        categoryId={category.id}
                        categoryName={category.name}
                        productCount={category._count.products}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
