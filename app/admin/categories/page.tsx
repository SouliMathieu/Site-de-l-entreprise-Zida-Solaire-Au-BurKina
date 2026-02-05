// app/admin/categories/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = {
  title: "Catégories | Admin ZIDA SOLAIRE",
  description: "Gestion des catégories de produits.",
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Catégories</h1>
          <p className="mt-1 text-sm text-slate-600">
            Gestion des catégories de produits ({categories.length} total).
          </p>
        </div>
        <Link
          href="/admin/categories/nouvelle"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Nouvelle catégorie
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-slate-500">Aucune catégorie pour le moment.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold text-slate-600">
                <th className="px-4 py-3">Ordre</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Produits</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs">
                      {category.order}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {category.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-xs">
                    {category.slug}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {category._count.products} produit(s)
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        category.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="text-xs font-semibold text-orange-600 hover:underline"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
