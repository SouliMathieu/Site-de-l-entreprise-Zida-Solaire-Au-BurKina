// app/admin/produits/nouveau/page.tsx
import { prisma } from "@/lib/prisma";
import { NewProductFormClient } from "@/components/admin/NewProductFormClient";
import Link from "next/link";

export const metadata = {
  title: "Nouveau produit | Admin ZIDA SOLAIRE",
  description: "Ajouter un nouveau produit ZIDA SOLAIRE.",
};

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      <Link
        href="/admin/produits"
        className="text-xs text-orange-600 hover:underline"
      >
        ← Retour aux produits
      </Link>
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nouveau produit</h1>
        <p className="mt-1 text-sm text-slate-600">
          Ajoutez un nouveau produit au catalogue.
        </p>
      </div>

      <NewProductFormClient categories={categories} />
    </main>
  );
}
