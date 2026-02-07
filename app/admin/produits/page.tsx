// app/admin/produits/page.tsx
import { prisma } from "@/lib/prisma";
import { ProductActionsClient } from "@/components/admin/ProductActionsClient";
import { ProductsFilterTabs } from "@/components/admin/ProductsFilterTabs";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Gestion des produits | Admin ZIDA SOLAIRE",
  description: "Gérez les produits ZIDA SOLAIRE.",
};

interface AdminProductsPageProps {
  searchParams: Promise<{
    statut?: "actif" | "inactif" | "tous";
  }>;
}

// Fonction utilitaire pour valider les URLs
function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return url.startsWith('/');
  }
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = await searchParams;
  const statut = params.statut || "actif";

  // Construire le filtre selon le statut
  const whereClause: any = {};
  if (statut === "actif") {
    whereClause.isActive = true;
  } else if (statut === "inactif") {
    whereClause.isActive = false;
  }
  // Si "tous", pas de filtre

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: {
        select: { id: true, name: true },
      },
      _count: {
        select: {
          orderItems: true, // Compter les commandes
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Statistiques
  const stats = {
    total: await prisma.product.count(),
    actifs: await prisma.product.count({ where: { isActive: true } }),
    inactifs: await prisma.product.count({ where: { isActive: false } }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec design moderne */}
        <div className="bg-gradient-to-r from-primary via-orange-500 to-orange-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Gestion des Produits</h1>
                <p className="text-orange-100">
                  {stats.total} produit{stats.total > 1 ? "s" : ""} au total ({stats.actifs} actif{stats.actifs > 1 ? "s" : ""}, {stats.inactifs} inactif{stats.inactifs > 1 ? "s" : ""})
                </p>
              </div>
            </div>
            <Link
              href="/admin/produits/nouveau"
              className="flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Nouveau produit
            </Link>
          </div>
        </div>

        {/* Onglets de filtrage */}
        <ProductsFilterTabs currentStatut={statut} stats={stats} />

        {/* Contenu */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Aucun produit {statut === "actif" ? "actif" : statut === "inactif" ? "inactif" : ""}
            </h3>
            <p className="text-gray-600 mb-6">
              {statut === "inactif" 
                ? "Tous vos produits sont actifs !" 
                : "Commencez par ajouter votre premier produit"}
            </p>
            {statut === "actif" && (
              <Link
                href="/admin/produits/nouveau"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Ajouter un produit
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => {
                    let mainImage: string | null = null;
                    
                    if (product.images) {
                      const images = Array.isArray(product.images) 
                        ? (product.images as string[])
                        : [];
                      mainImage = images.find(img => isValidImageUrl(img)) || null;
                    }

                    const hasOrders = product._count.orderItems > 0;

                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-transparent transition-all duration-200 ${!product.isActive ? 'bg-gray-50/50' : ''}`}
                      >
                        {/* Image */}
                        <td className="px-6 py-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md border-2 border-white relative">
                            {mainImage ? (
                              <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                                unoptimized={mainImage.includes('placeholder')}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Produit */}
                        <td className="px-6 py-4">
                          <div>
                            <div className={`font-semibold mb-1 ${product.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                              {product.name}
                              {hasOrders && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full" title={`${product._count.orderItems} commande(s)`}>
                                  📦 {product._count.orderItems}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                              {product.sku}
                            </div>
                          </div>
                        </td>

                        {/* Catégorie */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {product.category?.name || "-"}
                          </span>
                        </td>

                        {/* Prix */}
                        <td className="px-6 py-4">
                          <div className={`font-bold ${product.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                            {Number(product.price).toLocaleString("fr-FR")}{" "}
                            <span className="text-sm text-gray-600">FCFA</span>
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                product.stock > product.lowStockThreshold
                                  ? "bg-green-500"
                                  : product.stock > 0
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <span className={`font-semibold ${product.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                              {product.stock}
                            </span>
                          </div>
                        </td>

                        {/* Statut */}
                        <td className="px-6 py-4">
                          {product.isActive ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md">
                              ✓ Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-400 text-white shadow-md">
                              Inactif
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <ProductActionsClient
                            productId={product.id}
                            productName={product.name}
                            isActive={product.isActive}
                            hasOrders={hasOrders}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
