// app/admin/produits/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { EditProductFormClient } from "@/components/admin/EditProductFormClient";
import Link from "next/link";

export const metadata = {
  title: "Modifier produit | Admin ZIDA SOLAIRE",
  description: "Modifier un produit ZIDA SOLAIRE.",
};

interface AdminProductEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductEditPage({
  params,
}: AdminProductEditPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
  ]);

  if (!product) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-red-600">Produit introuvable.</p>
        <Link
          href="/admin/produits"
          className="mt-4 inline-flex text-xs text-orange-600 hover:underline"
        >
          ← Retour aux produits
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      <Link
        href="/admin/produits"
        className="text-xs text-orange-600 hover:underline"
      >
        ← Retour aux produits
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Modifier : {product.name}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Mettez à jour les informations du produit.
        </p>
      </div>

      <EditProductFormClient product={product} categories={categories} />
    </main>
  );
}
