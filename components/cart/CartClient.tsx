"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/useCart";
import Link from "next/link";

export function CartClient() {
  const { items, hydrate, updateQuantity, removeItem, clear } = useCart();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // règles de livraison simples pour MVP (conformes au cahier des charges)
  const deliveryFee =
    subtotal === 0
      ? 0
      : subtotal >= 50000
      ? 0
      : 2000; // 0 FCFA si >= 50 000, sinon 2000 à Ouaga [file:50]

  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
        Votre panier est vide.
        <Link href="/produits" className="ml-1 text-[#FF6B35] underline">
          Voir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
      {/* Liste des articles */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-lg border border-slate-200 bg-white p-3"
          >
            <div className="h-20 w-24 overflow-hidden rounded-md bg-slate-100">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                  Image
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between gap-2">
              <div>
                <Link
                  href={`/produits/${item.slug}`}
                  className="text-sm font-semibold text-slate-900 hover:underline"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-slate-500">
                  Prix unitaire: {item.price.toLocaleString("fr-FR")} FCFA
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-md border border-slate-300 bg-white">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm text-slate-700 disabled:opacity-40"
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="px-3 py-1 text-sm text-slate-700"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <span className="text-sm font-semibold text-slate-900">
                  {(item.price * item.quantity).toLocaleString("fr-FR")} FCFA
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Récapitulatif */}
      <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
        <h2 className="text-sm font-semibold text-slate-900">
          Récapitulatif
        </h2>

        <div className="mt-3 space-y-1">
          <div className="flex justify-between">
            <span>Sous-total</span>
            <span>{subtotal.toLocaleString("fr-FR")} FCFA</span>
          </div>
          <div className="flex justify-between">
            <span>Livraison (Ouagadougou)</span>
            <span>
              {deliveryFee === 0
                ? "Gratuite"
                : `${deliveryFee.toLocaleString("fr-FR")} FCFA`}
            </span>
          </div>
        </div>

        <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-sm font-semibold">
          <span>Total</span>
          <span>{total.toLocaleString("fr-FR")} FCFA</span>
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-md bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#e85f2f]"
          onClick={() => {
            window.location.href = "/checkout";
          }}
        >
          Passer la commande
        </button>

        <button
          type="button"
          className="mt-2 w-full rounded-md border border-slate-300 px-4 py-2 text-xs text-slate-600 hover:bg-slate-100"
          onClick={clear}
        >
          Vider le panier
        </button>
      </aside>
    </div>
  );
}
