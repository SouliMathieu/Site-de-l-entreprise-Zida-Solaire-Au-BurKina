// components/checkout/CheckoutClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

type DeliveryMethod = "pickup" | "delivery";
type PaymentMethod = "cash" | "mobile" | "bank";

export function CheckoutClient() {
  const { items, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  const totalPrice = getTotalPrice();
  const deliveryFee = 0;

  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      console.log("⚠️ Panier vide, redirection vers /panier");
      router.push("/panier");
    }
  }, [items.length, orderSuccess, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    console.log("🚀 FORMULAIRE SOUMIS!");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("name") as string;
    const nameParts = fullName?.trim().split(" ") || [];

    const orderData = {
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      city: deliveryMethod === "delivery" ? "Ouagadougou" : "Retrait",
      address: deliveryMethod === "delivery" ? (formData.get("address") as string) : "Retrait en magasin",
      notes: (formData.get("notes") as string) || "",
      items: items.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totals: {
        subtotal: totalPrice,
        deliveryFee: deliveryFee,
        total: totalPrice + deliveryFee,
      },
    };

    console.log("📦 Données commande:", orderData);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      console.log("📡 Réponse:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erreur lors de la commande");
      }

      const data = await res.json();
      console.log("✅ Commande créée:", data);
      setOrderNumber(data.orderNumber);
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error("❌ Erreur:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Si le panier est vide et qu'on n'a pas de commande réussie
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-600">Redirection vers le panier...</p>
      </div>
    );
  }

  // Si la commande est réussie
  if (orderSuccess) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-8 text-center shadow-xl">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mb-3 text-3xl font-bold text-slate-900">
            Commande confirmée !
          </h2>
          <p className="mb-8 text-lg text-slate-600">
            Votre commande <span className="font-bold text-orange-600">#{orderNumber}</span> a été enregistrée avec succès.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-orange-600"
            >
              Retour à l'accueil
            </Link>
            <Link
              href="/produits"
              className="inline-flex items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition-all hover:border-orange-500 hover:text-orange-600"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Afficher le formulaire de commande
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Formulaire */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Finaliser la commande
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Informations
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Livraison */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Livraison
              </h3>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-slate-200 p-4 transition-all hover:border-orange-500">
                  <input
                    type="radio"
                    name="delivery"
                    value="delivery"
                    checked={deliveryMethod === "delivery"}
                    onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">Livraison à domicile</div>
                    <div className="text-sm text-slate-600">Gratuit - Ouagadougou</div>
                  </div>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-slate-200 p-4 transition-all hover:border-orange-500">
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={deliveryMethod === "pickup"}
                    onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">Retrait en magasin</div>
                    <div className="text-sm text-slate-600">Gratuit</div>
                  </div>
                </label>
              </div>

              {deliveryMethod === "delivery" && (
                <div className="mt-4">
                  <label htmlFor="address" className="mb-1 block text-sm font-medium text-slate-700">
                    Adresse de livraison *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="mb-1 block text-sm font-medium text-slate-700">
                Notes complémentaires (optionnel)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-emerald-400 px-6 py-4 font-bold text-slate-900 shadow-lg transition-all hover:scale-105 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Traitement en cours..." : "Confirmer la commande"}
            </button>
          </form>
        </div>
      </div>

      {/* Résumé */}
      <div className="lg:col-span-1">
        <div className="sticky top-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-bold text-slate-900">
            Résumé de la commande
          </h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-medium text-slate-900">{item.name}</div>
                  <div className="text-slate-600">
                    {item.quantity} × {item.price.toLocaleString()} FCFA
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-slate-200 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Sous-total</span>
              <span className="font-semibold text-slate-900">{totalPrice.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Livraison</span>
              <span className="font-semibold text-green-600">Gratuit</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-bold">
              <span className="text-slate-900">Total</span>
              <span className="text-orange-600">{totalPrice.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
