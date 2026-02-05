// components/cart/CartClient.tsx
"use client";

import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export function CartClient() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } =
    useCart();

  const totalPrice = getTotalPrice();

  // Handlers extraits (pas inline)
  const handleIncrement = (id: string, currentQty: number) => {
    updateQuantity(id, currentQty + 1);
  };

  const handleDecrement = (id: string, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  };

  const handleRemove = (id: string) => {
    removeItem(id);
  };

  const handleClearCart = () => {
    if (confirm("Voulez-vous vraiment vider le panier ?")) {
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-slate-300" />
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">
          Votre panier est vide
        </h2>
        <p className="mt-2 text-slate-600">
          Découvrez nos produits et ajoutez-en à votre panier
        </p>
        <Link
          href="/produits"
          className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 text-white hover:bg-orange-600"
        >
          Voir nos produits
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Mon Panier</h1>
        <button
          onClick={handleClearCart}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Vider le panier
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-lg bg-white p-4 shadow"
            >
              <Image
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                width={120}
                height={120}
                className="rounded object-cover"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-lg font-bold text-orange-500">
                      {item.price.toLocaleString()} FCFA
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => handleDecrement(item.id, item.quantity)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleIncrement(item.id, item.quantity)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-2 text-right">
                  <span className="font-semibold text-slate-900">Total</span>
                  <p className="text-lg font-bold text-slate-900">
                    {(item.price * item.quantity).toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé */}
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-slate-900">Résumé</h2>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Sous-total</span>
                <span className="font-semibold">
                  {totalPrice.toLocaleString()} FCFA
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Livraison</span>
                <span className="text-sm text-slate-500">
                  Calculée à l'étape suivante
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-orange-500">
                    {totalPrice.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Livraison et taxes calculées à l'étape suivante
            </p>
            <Link
              href="/commande"
              className="mt-6 block w-full rounded-lg bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-600"
            >
              Passer la commande
            </Link>
            <Link
              href="/produits"
              className="mt-3 block w-full rounded-lg border border-slate-300 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
