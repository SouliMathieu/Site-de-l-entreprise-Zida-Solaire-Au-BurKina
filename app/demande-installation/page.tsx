import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { InstallationRequestFormClient } from "@/components/install/InstallationRequestFormClient";

export default function DemandeInstallationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container-zida flex-1 py-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Demander une installation
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Décrivez votre projet pour recevoir un devis personnalisé (installation
          solaire ou électrique).
        </p>

        <div className="mt-6 max-w-2xl rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <InstallationRequestFormClient />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
