// app/devis/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { DevisFormClient } from "@/components/devis/DevisFormClient";

export const metadata = {
  title: "Demande de devis | ZIDA SOLAIRE",
  description:
    "Demandez un devis gratuit pour votre installation solaire, électrique ou autre chez ZIDA SOLAIRE.",
};

export default function DevisPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container-zida flex-1 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Demande de devis gratuit
            </h1>
            <p className="mt-3 text-slate-600">
              Remplissez le formulaire ci-dessous et notre équipe vous
              contactera dans les plus brefs délais pour établir votre devis
              personnalisé.
            </p>
          </div>

          <DevisFormClient />
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
