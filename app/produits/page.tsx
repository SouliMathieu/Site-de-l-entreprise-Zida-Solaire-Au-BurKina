// app/produits/page.tsx
import { prisma } from "@/lib/prisma";
import { toProduct } from "@/lib/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { ProductCard } from "@/components/products/ProductCard";

export const metadata = {
  title: "Nos Produits | ZIDA SOLAIRE",
  description: "Découvrez notre gamme complète de produits solaires.",
};

export default async function ProductsPage() {
  const prismaProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  // Convertir les produits Prisma (Decimal → number)
  const products = prismaProducts.map(toProduct);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
              Nos Produits
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Découvrez notre sélection de produits solaires de qualité
            </p>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-lg">
              <div className="mx-auto max-w-md">
                <svg
                  className="mx-auto h-16 w-16 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  Aucun produit disponible
                </h3>
                <p className="mt-2 text-slate-600">
                  Notre catalogue sera bientôt disponible. Revenez plus tard !
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
