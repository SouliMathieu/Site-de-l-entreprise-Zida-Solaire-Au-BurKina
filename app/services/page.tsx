// app/services/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import {
  Sun,
  Zap,
  Wrench,
  HeartHandshake,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

export const metadata = {
  title: "Nos Services | ZIDA SOLAIRE",
  description:
    "Découvrez nos services : installation solaire, maintenance, dépannage et conseil personnalisé.",
};

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-16">
          <div className="container-zida">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">Nos Services</h1>
              <p className="text-lg text-orange-50">
                Des solutions solaires complètes pour tous vos besoins
                énergétiques, de l'étude à la maintenance.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-white">
          <div className="container-zida">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Installation Solaire */}
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                  <Sun className="h-7 w-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Installation Solaire
                </h3>
                <p className="text-slate-600 mb-4">
                  Installation complète de systèmes solaires photovoltaïques
                  pour maisons, entreprises et industries.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Étude technique et dimensionnement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Installation par techniciens certifiés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Mise en service et formation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Garantie fabricant et installation</span>
                  </li>
                </ul>
              </div>

              {/* Installation Électrique */}
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Installation Électrique
                </h3>
                <p className="text-slate-600 mb-4">
                  Travaux électriques complets pour bâtiments résidentiels et
                  commerciaux aux normes.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Tableaux électriques et distribution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Câblage et mise aux normes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Éclairage intérieur et extérieur</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Domotique et automatismes</span>
                  </li>
                </ul>
              </div>

              {/* Maintenance */}
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                  <Wrench className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Maintenance & SAV
                </h3>
                <p className="text-slate-600 mb-4">
                  Contrats de maintenance préventive et service après-vente
                  réactif pour garantir la performance.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Visite de contrôle annuelle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Nettoyage des panneaux solaires</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Dépannage rapide sous 24h</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Pièces de rechange disponibles</span>
                  </li>
                </ul>
              </div>

              {/* Conseil */}
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                  <MessageSquare className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Conseil & Audit
                </h3>
                <p className="text-slate-600 mb-4">
                  Expertise et accompagnement personnalisé pour optimiser votre
                  projet énergétique.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Audit énergétique complet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Étude de faisabilité</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Calcul de rentabilité</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Accompagnement administratif</span>
                  </li>
                </ul>
              </div>

              {/* Financement */}
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                  <HeartHandshake className="h-7 w-7 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Solutions de Financement
                </h3>
                <p className="text-slate-600 mb-4">
                  Options de paiement flexibles pour rendre l'énergie solaire
                  accessible à tous.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Paiement échelonné sans intérêts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Partenariats avec institutions financières</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Facilités de paiement personnalisées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Devis transparent et sans surprise</span>
                  </li>
                </ul>
              </div>

              {/* Garanties */}
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mb-6">
                  <ShieldCheck className="h-7 w-7 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Garanties & Assurances
                </h3>
                <p className="text-slate-600 mb-4">
                  Votre tranquillité d'esprit avec des garanties étendues sur
                  matériel et main d'œuvre.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Garantie panneaux : 25 ans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Garantie onduleurs : 5-10 ans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Garantie installation : 2 ans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <span>Assurance décennale</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 bg-slate-50">
          <div className="container-zida">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              Notre processus en 4 étapes
            </h2>
            <div className="grid gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Contact & Étude
                </h3>
                <p className="text-sm text-slate-600">
                  Prise de contact, visite technique et étude personnalisée de
                  vos besoins
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Devis & Validation
                </h3>
                <p className="text-sm text-slate-600">
                  Proposition technique et financière détaillée, signature du
                  contrat
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Installation
                </h3>
                <p className="text-sm text-slate-600">
                  Réalisation de l'installation par nos techniciens certifiés
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Suivi & Maintenance
                </h3>
                <p className="text-sm text-slate-600">
                  Accompagnement continu et maintenance pour performance optimale
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white">
          <div className="container-zida text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Besoin d'un service ?
            </h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Contactez-nous pour discuter de votre projet ou obtenir un devis
              personnalisé.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="/devis"
                className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Demander un devis
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
