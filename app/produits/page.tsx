// app/produits/page.tsx
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilterClient } from "@/components/product/ProductFilterClient";

export const metadata = {
  title: "Tous les produits | ZIDA SOLAIRE",
  description:
    "Équipements solaires, électriques et accessoires disponibles chez ZIDA SOLAIRE.",
};

interface ProduitsPageProps {
  searchParams: Promise<{ categorie?: string }>;
}

export default async function ProduitsPage({ searchParams }: ProduitsPageProps) {
  const { categorie = "" } = await searchParams;

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: categorie ? { slug: categorie } : undefined,
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const productsForCard = products.map((p) => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container-zida flex-1 py-8">
        {/* Titre + filtre */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Tous les produits
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Équipements solaires, électriques et accessoires disponibles chez
              ZIDA SOLAIRE.
            </p>
          </div>

          <ProductFilterClient
            currentCategorie={categorie}
            categories={categories.map((c) => ({
              id: c.id,
              slug: c.slug,
              name: c.name,
            }))}
          />
        </section>

        {/* Liste produits */}
        <section className="mt-6">
          {productsForCard.length === 0 ? (
            <p className="text-sm text-slate-500">
              Aucun produit trouvé pour cette sélection.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {productsForCard.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
