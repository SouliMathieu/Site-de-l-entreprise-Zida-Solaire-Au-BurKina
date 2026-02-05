// components/products/ProductDetailClient.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Check, Package, Shield, Truck, Minus, Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stock: number;
  warranty: string | null;
  weight: number | null;
  images: string[];
  specifications: Record<string, any> | null;
  category: { id: string; name: string } | null;
}

interface Props {
  product: Product;
}

function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function ProductDetailClient({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const validImages = Array.isArray(product.images)
    ? product.images.filter(isValidUrl)
    : [];

  const productImages =
    validImages.length > 0
      ? validImages
      : ["https://via.placeholder.com/800x800?text=Pas+d%27image"];

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : 0;

  function handleAddToCart() {
    if (product.stock <= 0) return;
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImages[0],
      slug: product.slug,
      quantity,
    });
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 shadow-xl">
            {discount > 0 && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white shadow-lg">
                -{discount}%
              </span>
            )}
            <Image
              src={productImages[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {productImages.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === idx
                      ? "border-emerald-500 ring-2 ring-emerald-200"
                      : "border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="flex flex-col">
          {product.category && (
            <span className="mb-3 inline-block w-fit rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
              {product.category.name}
            </span>
          )}

          <h1 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            {product.name}
          </h1>

          {product.shortDescription && (
            <p className="mb-6 text-lg text-slate-600">
              {product.shortDescription}
            </p>
          )}

          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-orange-600">
              {product.price.toLocaleString()} FCFA
            </span>
            {product.compareAtPrice && (
              <span className="text-xl text-slate-400 line-through">
                {product.compareAtPrice.toLocaleString()} FCFA
              </span>
            )}
          </div>

          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Stock :</span>
            {product.stock > 0 ? (
              <span className="flex items-center gap-1 text-sm font-semibold text-green-600">
                <Check className="h-4 w-4" />
                {product.stock} en stock
              </span>
            ) : (
              <span className="text-sm font-semibold text-red-600">
                Rupture de stock
              </span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Quantité :
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-300 bg-white text-slate-900 transition-all hover:border-emerald-400 hover:bg-emerald-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-xl font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-300 bg-white text-slate-900 transition-all hover:border-emerald-400 hover:bg-emerald-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 px-8 py-4 text-lg font-bold text-slate-900 shadow-lg transition-all hover:scale-105 hover:bg-emerald-500 disabled:opacity-50"
              >
                <ShoppingCart className="h-5 w-5" />
                {isAdding ? "Ajouté au panier !" : "Ajouter au panier"}
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-center">
              <Truck className="mx-auto mb-2 h-6 w-6 text-blue-600" />
              <p className="text-xs font-semibold text-slate-700">
                Livraison disponible
              </p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto mb-2 h-6 w-6 text-green-600" />
              <p className="text-xs font-semibold text-slate-700">
                Garantie constructeur
              </p>
            </div>
            <div className="text-center">
              <Package className="mx-auto mb-2 h-6 w-6 text-orange-600" />
              <p className="text-xs font-semibold text-slate-700">
                Installation possible
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-12 space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Description</h2>
          <p className="whitespace-pre-wrap text-slate-600">{product.description}</p>
        </div>

        {product.specifications && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Spécifications techniques
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <span className="font-semibold text-slate-700">{key} :</span>
                  <span className="text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {product.warranty && (
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-green-50 to-white p-6 shadow-lg">
            <h2 className="mb-3 text-2xl font-bold text-slate-900">Garantie</h2>
            <p className="text-slate-700">{product.warranty}</p>
          </div>
        )}
      </div>
    </div>
  );
}
