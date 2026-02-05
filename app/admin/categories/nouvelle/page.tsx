// app/admin/categories/nouvelle/page.tsx
import Link from "next/link";
import { CategoryFormClient } from "@/components/admin/CategoryFormClient";

export const metadata = {
  title: "Nouvelle catégorie | Admin ZIDA SOLAIRE",
  description: "Ajouter une nouvelle catégorie.",
};

export default function NewCategoryPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <Link
        href="/admin/categories"
        className="text-xs text-orange-600 hover:underline"
      >
        ← Retour aux catégories
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nouvelle catégorie</h1>
        <p className="mt-1 text-sm text-slate-600">
          Ajoutez une nouvelle catégorie de produits.
        </p>
      </div>

      <CategoryFormClient />
    </main>
  );
}
