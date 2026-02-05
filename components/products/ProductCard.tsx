// components/products/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

// Fonction pour valider une URL
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0;

  // Gérer les images
  const images = product.images as string[] | null;
  const validImages = Array.isArray(images) ? images.filter(isValidUrl) : [];
  const mainImage =
    validImages.length > 0
      ? validImages[0]
      : "https://via.placeholder.com/400x400?text=Pas+d%27image";

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) return;

    setIsAdding(true);

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
      slug: product.slug,
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
      <Link href={`/produits/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative h-64 w-full overflow-hidden bg-slate-100">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Badge réduction */}
          {hasDiscount && (
            <div className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white shadow-lg">
              -{discountPercent}%
            </div>
          )}

          {/* Badge stock faible */}
          {product.stock <= (product.lowStockThreshold || 10) &&
            product.stock > 0 && (
              <div className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                Stock limité
              </div>
            )}

          {/* Badge rupture */}
          {product.stock === 0 && (
            <div className="absolute left-3 top-3 rounded-full bg-slate-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              Rupture de stock
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-5">
          <h3 className="mb-2 text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-orange-500">
            {product.name}
          </h3>

          {product.shortDescription && (
            <p className="mb-3 text-sm text-slate-600 line-clamp-2">
              {product.shortDescription}
            </p>
          )}

          {/* Prix */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-orange-500">
              {product.price.toLocaleString()} FCFA
            </span>
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through">
                {product.compareAtPrice!.toLocaleString()} FCFA
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mt-3 text-xs text-slate-500">
            {product.stock > 0 ? (
              <span className="text-green-600">
                ✓ En stock ({product.stock})
              </span>
            ) : (
              <span className="text-red-600">✗ Rupture de stock</span>
            )}
          </div>
        </div>
      </Link>

      {/* Bouton Ajouter au panier */}
      <div className="p-5 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white transition-all ${
            product.stock === 0
              ? "cursor-not-allowed bg-slate-300"
              : isAdding
              ? "bg-green-500"
              : "bg-orange-500 hover:bg-orange-600 hover:scale-105 shadow-lg"
          }`}
        >
          {isAdding ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Ajouté !
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              {product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
