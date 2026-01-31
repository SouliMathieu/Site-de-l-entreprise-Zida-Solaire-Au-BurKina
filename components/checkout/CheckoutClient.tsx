// components/checkout/CheckoutClient.tsx
"use client";

import { useState } from "react";
import { useCartStore } from "@/app/store/cart-store";
import Link from "next/link";

type Status = "idle" | "submitting" | "success" | "error";

export function CheckoutClient() {
  const { items, totalAmount, clear } = useCartStore();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const deliveryFee = totalAmount >= 50000 ? 0 : 2000;
  const grandTotal = totalAmount + deliveryFee;
  const hasItems = items.length > 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasItems) return;

    setStatus("submitting");
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      address: formData.get("address") as string,
      notes: (formData.get("notes") as string) ?? "",
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      totals: {
        subtotal: totalAmount,
        deliveryFee,
        total: grandTotal,
      },
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Erreur serveur");
      }

      setStatus("success");
      clear(); // on vide le panier, mais on ne touche plus au formulaire
    } catch (e) {
      console.error(e);
      setError("Une erreur est survenue. Veuillez réessayer.");
      setStatus("error");
    }
  }

  if (!hasItems) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
        <p>Votre panier est vide. Ajoutez des produits avant de commander.</p>
        <Link
          href="/produits"
          className="mt-4 inline-flex rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600"
        >
          Voir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-[2fr,1.3fr] items-start">
      {/* Formulaire client */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Informations client
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-slate-800"
            >
              Prénom
            </label>
            <input
              id="firstName"
              name="firstName"
              required
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-slate-800"
            >
              Nom
            </label>
            <input
              id="lastName"
              name="lastName"
              required
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-800"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-slate-800"
            >
              Téléphone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-slate-800"
            >
              Ville
            </label>
            <input
              id="city"
              name="city"
              required
              defaultValue="Ouagadougou"
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-slate-800"
            >
              Adresse de livraison
            </label>
            <input
              id="address"
              name="address"
              required
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-slate-800"
          >
            Notes de livraison (optionnel)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {status === "success" && (
          <p className="text-sm text-emerald-600">
            Merci, votre commande a bien été enregistrée. Nous vous
            contacterons pour la confirmation.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-2 inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "submitting"
            ? "Traitement en cours..."
            : "Confirmer la commande"}
        </button>
      </form>

      {/* Récapitulatif */}
      <aside className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3 text-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Récapitulatif
        </h2>

        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex justify-between text-xs text-slate-700"
            >
              <span>
                {item.quantity} × {item.name}
              </span>
              <span>
                {(item.price * item.quantity).toLocaleString("fr-FR")} FCFA
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t border-slate-200 pt-3 space-y-2">
          <div className="flex justify-between text-sm">
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
          <div className="flex justify-between pt-2">
            <span className="font-semibold text-slate-900">Total TTC</span>
            <span className="text-lg font-bold text-slate-900">
              {grandTotal.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
        </div>

        <p className="mt-2 text-[11px] text-slate-500">
          Paiement à la livraison, comme prévu dans le cahier des charges.
        </p>
      </aside>
    </div>
  );
}
