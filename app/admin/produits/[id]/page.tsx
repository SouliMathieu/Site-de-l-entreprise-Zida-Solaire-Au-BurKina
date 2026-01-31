// app/admin/produits/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EditProductFormClient } from "@/components/admin/EditProductFormClient";


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
        category: { select: { id: true, name: true } },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
  ]);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container-zida flex-1 py-8">
          <p className="text-sm text-slate-600">
            Produit introuvable.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const imageUrl =
    Array.isArray(product.images) && (product.images as string[])[0]
      ? (product.images as string[])[0]
      : "";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container-zida flex-1 py-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Modifier le produit
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Mettez à jour les informations du produit.
        </p>

        <div className="mt-6 max-w-2xl rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <EditProductFormClient
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              categoryId: product.categoryId,
              price: Number(product.price),
              stock: product.stock,
              imageUrl,
              shortDescription: product.shortDescription ?? "",
              isActive: product.isActive,
              isFeatured: product.isFeatured,
            }}
            categories={categories.map((c) => ({
              id: c.id,
              name: c.name,
            }))}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
