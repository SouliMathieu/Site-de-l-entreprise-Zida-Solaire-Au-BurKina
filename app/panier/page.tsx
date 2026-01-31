// app/panier/page.tsx
"use client";

import Link from "next/link";
import { useCartStore } from "../store/cart-store";

export default function CartPage() {
  const { items, totalAmount, updateQuantity, removeItem, clear } =
    useCartStore();

  const deliveryFee = totalAmount >= 50000 ? 0 : 2000;
  const grandTotal = totalAmount + deliveryFee;
  const hasItems = items.length > 0;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Panier</h1>
      <p className="text-sm text-slate-600">
        Vérifiez vos produits avant de confirmer votre commande.
      </p>

      {!hasItems ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
          <p>Votre panier est vide pour le moment.</p>
          <Link
            href="/produits"
            className="mt-4 inline-flex rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600"
          >
            Voir les produits
          </Link>
        </div>
      ) : (
        <>
          {/* Liste des articles */}
          <section className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-slate-100 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                      Image
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <Link
                    href={`/produits/${item.slug}`}
                    className="text-sm font-semibold text-slate-900 hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-slate-500">
                    Prix unitaire : {item.price.toLocaleString("fr-FR")} FCFA
                  </p>
                  <p className="text-xs text-slate-500">
                    Sous-total :{" "}
                    {(item.price * item.quantity).toLocaleString("fr-FR")} FCFA
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center rounded-lg border border-slate-300">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="px-2 py-1 text-xs text-slate-700"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="px-2 py-1 text-xs text-slate-700"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-[11px] font-medium text-red-600 hover:underline"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Résumé */}
          <section className="grid gap-6 md:grid-cols-[2fr,1fr] items-start">
            <button
              type="button"
              onClick={clear}
              className="text-sm text-red-600 hover:underline justify-self-start"
            >
              Vider le panier
            </button>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Sous-total</span>
                <span className="font-semibold text-slate-900">
                  {totalAmount.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">
                  Livraison Ouagadougou (gratuite dès 50 000 FCFA)
                </span>
                <span className="font-medium text-slate-800">
                  {deliveryFee === 0
                    ? "Gratuite"
                    : `${deliveryFee.toLocaleString("fr-FR")} FCFA`}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="font-semibold text-slate-900">Total TTC</span>
                <span className="text-lg font-bold text-slate-900">
                  {grandTotal.toLocaleString("fr-FR")} FCFA
                </span>
              </div>

              <Link
                href="/commande"
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Passer la commande
              </Link>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
