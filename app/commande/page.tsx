// app/commande/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata = {
  title: "Commande | ZIDA SOLAIRE",
  description:
    "Finalisez votre commande ZIDA SOLAIRE et renseignez vos informations de livraison.",
};

export default function CommandePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container-zida flex-1 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Finaliser la commande
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Vérifiez votre panier et renseignez vos informations pour la livraison.
        </p>

        <CheckoutClient />
      </main>

      <Footer />
    </div>
  );
}
