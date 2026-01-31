// app/admin/produits/nouveau/page.tsx
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NewProductFormClient } from "@/components/admin/NewProductFormClient";


export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container-zida flex-1 py-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Nouveau produit
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Ajoutez un nouveau produit au catalogue.
        </p>

        <div className="mt-6 max-w-2xl rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <NewProductFormClient
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
