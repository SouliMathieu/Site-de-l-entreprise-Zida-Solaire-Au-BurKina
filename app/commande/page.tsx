// app/commande/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata = {
  title: "Passer commande | ZIDA SOLAIRE",
  description: "Finalisez votre commande.",
};

export default function CommandePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-slate-50">
        <CheckoutClient />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}