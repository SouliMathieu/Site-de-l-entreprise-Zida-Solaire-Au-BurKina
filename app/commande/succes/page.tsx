// app/commande/succes/page.tsx
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata = {
  title: "Commande réussie | ZIDA SOLAIRE",
  description: "Votre commande a bien été enregistrée chez ZIDA SOLAIRE.",
};

export default function CommandeSuccesPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="h-20 w-20 text-emerald-500" />
      </div>

      <h1 className="text-3xl font-bold text-slate-900">
        Commande confirmée !
      </h1>

      <p className="text-slate-600">
        Merci pour votre commande. Nous vous contacterons dans les plus brefs
        délais pour confirmer les détails de livraison.
      </p>

      <p className="text-sm text-slate-500">
        Vous recevrez également un email de confirmation à l'adresse indiquée.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        <Link
          href="/produits"
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Continuer mes achats
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
