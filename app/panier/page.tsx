// app/panier/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { CartClient } from "@/components/cart/CartClient";

export const metadata = {
  title: "Panier | ZIDA SOLAIRE",
  description: "Votre panier d'achat.",
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-slate-900 sm:text-4xl">
            Mon panier
          </h1>
          <CartClient />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
