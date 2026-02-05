// app/a-propos/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { Award, Users, Target, Zap } from "lucide-react";

export const metadata = {
  title: "À propos | ZIDA SOLAIRE",
  description:
    "Découvrez ZIDA SOLAIRE, votre partenaire de confiance pour l'énergie solaire au Burkina Faso.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-16">
          <div className="container-zida">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">À propos de ZIDA SOLAIRE</h1>
              <p className="text-lg text-orange-50">
                Votre partenaire de confiance pour l'énergie solaire au Burkina
                Faso. Nous accompagnons particuliers et entreprises vers
                l'autonomie énergétique.
              </p>
            </div>
          </div>
        </section>

        {/* Notre Histoire */}
        <section className="py-16 bg-white">
          <div className="container-zida">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Notre histoire
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Fondée en 2020, ZIDA SOLAIRE est née de la conviction que
                  l'énergie solaire représente l'avenir du Burkina Faso. Face aux
                  défis énergétiques du pays, nous avons décidé d'apporter notre
                  contribution en rendant l'énergie solaire accessible à tous.
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Aujourd'hui, nous sommes fiers d'avoir installé plus de 500
                  systèmes solaires dans tout le pays, permettant à des milliers
                  de Burkinabè de bénéficier d'une énergie propre, fiable et
                  économique.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Notre équipe d'experts certifiés travaille avec passion pour
                  vous offrir des solutions énergétiques de qualité, adaptées à
                  vos besoins spécifiques.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Nos Valeurs */}
        <section className="py-16 bg-slate-50">
          <div className="container-zida">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              Nos valeurs
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Qualité
                </h3>
                <p className="text-sm text-slate-600">
                  Nous ne travaillons qu'avec des équipements de marques
                  reconnues pour leur fiabilité et leur durabilité.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Proximité
                </h3>
                <p className="text-sm text-slate-600">
                  Une équipe locale à votre écoute, disponible avant, pendant et
                  après votre installation.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Excellence
                </h3>
                <p className="text-sm text-slate-600">
                  Des installations réalisées dans les règles de l'art par des
                  techniciens certifiés et expérimentés.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Innovation
                </h3>
                <p className="text-sm text-slate-600">
                  Nous restons à la pointe de la technologie solaire pour vous
                  offrir les meilleures solutions du marché.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistiques */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container-zida">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div>
                <div className="text-4xl font-bold text-orange-400 mb-2">
                  500+
                </div>
                <div className="text-sm text-slate-300">
                  Installations réalisées
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-400 mb-2">
                  5 ans
                </div>
                <div className="text-sm text-slate-300">D'expérience</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-400 mb-2">
                  98%
                </div>
                <div className="text-sm text-slate-300">Clients satisfaits</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-400 mb-2">
                  24/7
                </div>
                <div className="text-sm text-slate-300">Support technique</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white">
          <div className="container-zida text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Prêt à passer à l'énergie solaire ?
            </h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Contactez-nous dès aujourd'hui pour une étude personnalisée et
              gratuite de votre projet.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="/devis"
                className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Demander un devis gratuit
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
