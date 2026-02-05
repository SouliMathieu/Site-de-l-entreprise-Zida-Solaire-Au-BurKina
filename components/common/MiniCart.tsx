// components/common/MiniCart.tsx
"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/app/store/cart-store"; // ← CHANGEMENT ICI
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";

export function MiniCart() {
  const { items, totalAmount, totalQuantity } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="relative rounded-full bg-orange-500 p-2 text-white sm:p-2.5">
        <ShoppingCart className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full bg-orange-500 p-2 text-white shadow-lg transition-all hover:scale-110 hover:bg-orange-600 sm:p-2.5"
        aria-label="Panier"
      >
        <ShoppingCart className="h-5 w-5" />
        {totalQuantity > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md">
            {totalQuantity}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
            aria-hidden="true"
          />

          <div className="absolute right-0 top-14 z-50 w-80 rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-96">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Mon panier ({totalQuantity})
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                <p className="text-slate-600">Votre panier est vide</p>
                <Link
                  href="/produits"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 inline-block rounded-lg bg-emerald-400 px-6 py-2 text-sm font-semibold text-slate-900 transition-all hover:bg-emerald-500"
                >
                  Découvrir nos produits
                </Link>
              </div>
            ) : (
              <>
                <div className="max-h-80 space-y-3 overflow-y-auto p-4">
                  {items.slice(0, 3).map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-all hover:shadow-md"
                    >
                      <div className="text-sm">
                        <p className="font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-slate-600">
                          {item.quantity} × {item.price.toLocaleString("fr-FR")}{" "}
                          FCFA
                        </p>
                        <p className="mt-1 font-semibold text-orange-600">
                          {(item.price * item.quantity).toLocaleString("fr-FR")}{" "}
                          FCFA
                        </p>
                      </div>
                    </div>
                  ))}

                  {items.length > 3 && (
                    <p className="text-center text-sm text-slate-500">
                      +{items.length - 3} autre(s) article(s)
                    </p>
                  )}
                </div>

                <div className="border-t border-slate-200 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-base font-semibold text-slate-900">
                      Total :
                    </span>
                    <span className="text-xl font-bold text-orange-600">
                      {totalAmount.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href="/panier"
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-900 transition-all hover:bg-slate-50"
                    >
                      Voir le panier
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg bg-emerald-400 px-4 py-2.5 text-center text-sm font-bold text-slate-900 shadow-lg transition-all hover:scale-105 hover:bg-emerald-500"
                    >
                      Passer commande →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
