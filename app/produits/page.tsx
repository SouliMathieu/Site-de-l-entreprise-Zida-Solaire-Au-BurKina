// app/produits/page.tsx
import { prisma } from "@/lib/prisma";
import { toProduct } from "@/lib/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilterClient";

export const metadata = {
  title: "Nos Produits | ZIDA SOLAIRE",
  description: "Découvrez notre gamme complète de produits solaires.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    categorie?: string;
    stock?: string;
    prixMin?: string;
    prixMax?: string;
    tri?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // IMPORTANT : Await searchParams (Next.js 16+)
  const params = await searchParams;

  // Récupérer les catégories
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, slug: true, name: true },
    orderBy: { name: "asc" },
  });

  // Construire les conditions de filtrage
  const whereClause: any = { isActive: true };

  if (params.categorie) {
    whereClause.category = { slug: params.categorie };
  }

  if (params.stock === "disponible") {
    whereClause.stock = { gt: 0 };
  }

  if (params.prixMin || params.prixMax) {
    whereClause.price = {};
    if (params.prixMin) {
      whereClause.price.gte = Number(params.prixMin);
    }
    if (params.prixMax) {
      whereClause.price.lte = Number(params.prixMax);
    }
  }

  // Déterminer l'ordre de tri
  let orderBy: any = { createdAt: "desc" };
  
  switch (params.tri) {
    case "prix-asc":
      orderBy = { price: "asc" };
      break;
    case "prix-desc":
      orderBy = { price: "desc" };
      break;
    case "nouveautes":
      orderBy = { createdAt: "desc" };
      break;
    case "populaires":
      orderBy = { viewCount: "desc" };
      break;
    case "meilleures-ventes":
      orderBy = { salesCount: "desc" };
      break;
  }

  // Récupérer les produits
  const prismaProducts = await prisma.product.findMany({
    where: whereClause,
    include: { category: true },
    orderBy,
  });

  const products = prismaProducts.map(toProduct);

  // Calculer les prix min/max pour le filtre
  const allProducts = await prisma.product.findMany({
    where: { isActive: true },
    select: { price: true },
  });
  
  const prices = allProducts.map(p => Number(p.price));
  const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
  const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000000;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Nos Produits
            </h1>
            <p className="text-gray-600">
              {products.length} produit{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Filtres */}
          <div className="mb-6">
            <ProductFilters
              categories={categories}
              minPrice={minPrice}
              maxPrice={maxPrice}
              initialFilters={{
                categorie: params.categorie,
                stock: params.stock,
                prixMin: params.prixMin,
                prixMax: params.prixMax,
                tri: params.tri,
              }}
            />
          </div>

          {/* Grille de produits */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-500 mb-4">
                Essayez de modifier vos filtres pour voir plus de résultats
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
