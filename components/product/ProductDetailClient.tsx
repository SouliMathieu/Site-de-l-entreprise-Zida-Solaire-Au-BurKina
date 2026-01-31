// components/product/ProductDetailClient.tsx
"use client";

import { useState } from "react";
import { useCartStore } from "@/app/store/cart-store";

interface ProductDetailClientProps {
  id: string;
  name: string;
  price: number;
  slug: string;
  image?: string | null;
  stock: number;
  lowStockThreshold: number;
}

export function ProductDetailClient(props: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "added">("idle");
  const addItem = useCartStore((s) => s.addItem);

  const isLowStock =
    props.stock <= props.lowStockThreshold && props.stock > 0;
  const isOutOfStock = props.stock <= 0;

  function handleAddToCart() {
    if (isOutOfStock) return;
    addItem(
      {
        productId: props.id,
        name: props.name,
        price: props.price,
        slug: props.slug,
        image: props.image ?? null,
      },
      quantity
    );
    setStatus("added");
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Infos stock */}
      <div className="text-xs text-slate-600">
        {isOutOfStock && (
          <span className="text-red-600 font-medium">
            Rupture de stock pour le moment.
          </span>
        )}
        {isLowStock && !isOutOfStock && (
          <span className="text-amber-600 font-medium">
            Stock limité, ne tardez pas à commander.
          </span>
        )}
        {!isLowStock && !isOutOfStock && (
          <span className="text-emerald-600 font-medium">En stock.</span>
        )}
      </div>

      {/* Quantité + bouton */}
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border border-slate-300">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-sm text-slate-700"
          >
            -
          </button>
          <span className="px-4 text-sm font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() =>
              setQuantity((q) => Math.min(props.stock || 99, q + 1))
            }
            className="px-3 py-2 text-sm text-slate-700"
          >
            +
          </button>
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "added" ? "Ajouté au panier" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}
