import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container-zida flex-1 py-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Finaliser votre commande
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Renseignez vos informations pour la livraison. Paiement à la
          livraison comme prévu dans le cahier des charges.
        </p>

        <CheckoutClient />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
