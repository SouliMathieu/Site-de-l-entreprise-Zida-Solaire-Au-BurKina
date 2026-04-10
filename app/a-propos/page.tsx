// app/a-propos/page.tsx

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { Award, Users, Target, Zap } from "lucide-react";

export const metadata = {
  title: "À propos | ZIDA SOLAIRE",
  description:
    "Depuis 2005, ZIDA SOLAIRE accompagne les particuliers et les entreprises vers l’autonomie énergétique au Burkina Faso.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-16 md:py-20">
          <div className="container-zida">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                À propos de ZIDA SOLAIRE
              </h1>
              <p className="text-lg md:text-xl text-orange-50 mb-3">
                L’énergie solaire pour tous au Burkina Faso, depuis 2005.
              </p>
              <p className="text-sm md:text-base text-orange-100">
                Fondée par <span className="font-semibold">Zida Aboubacar</span>,
                ZIDA SOLAIRE est une référence à Ouagadougou pour la vente et
                l’installation de matériel solaire et électrique de première
                qualité, au service des particuliers, des entreprises privées et
                des institutions publiques.
              </p>
            </div>
          </div>
        </section>

        {/* NOTRE HISTOIRE */}
        <section className="py-16 bg-white">
          <div className="container-zida">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Notre histoire
              </h2>

              <p className="text-slate-700 leading-relaxed mb-4">
                ZIDA SOLAIRE est née en <span className="font-semibold">2005</span>{" "}
                de la vision de son fondateur{" "}
                <span className="font-semibold">Zida Aboubacar</span>. Face aux
                coupures d’électricité répétées et au coût élevé de l’énergie, il
                se fixe une mission claire&nbsp;:{" "}
                <span className="font-semibold">
                  apporter des solutions solaires et électriques accessibles,
                  fiables et durables
                </span>{" "}
                aux Burkinabè.
              </p>

              <p className="text-slate-700 leading-relaxed mb-4">
                L’entreprise commence par la vente de matériel solaire et quelques
                installations chez des particuliers à Ouagadougou. Année après
                année, grâce au bouche‑à‑oreille et à la qualité du service, ZIDA
                SOLAIRE se développe et gagne la confiance{" "}
                <span className="font-semibold">
                  des particuliers, des entreprises privées et des institutions
                  publiques
                </span>
                .
              </p>

              <p className="text-slate-700 leading-relaxed mb-4">
                Aujourd’hui,ZIDA SOLAIRE réalise chaque année de nombreuses
                installations solaires et électriques dans tout le pays, et
                accompagne ses clients dans des projets{" "}
                <span className="font-semibold">
                  classiques, solaires ou hybrides (solaire + réseau)
                </span>{" "}
                pour réduire les factures et sécuriser l’alimentation en énergie.
              </p>

              <p className="text-slate-700 leading-relaxed mb-4">
                L’entreprise a également réalisé des installations à
                l’international, notamment au{" "}
                <span className="font-semibold">Ghana</span> et au{" "}
                <span className="font-semibold">Mali</span>, preuve de la
                confiance accordée à son expertise au‑delà des frontières du
                Burkina Faso.
              </p>

              <p className="text-slate-700 leading-relaxed">
                ZIDA SOLAIRE continue de grandir en restant fidèle à ses
                fondamentaux&nbsp;:{" "}
                <span className="font-semibold">
                  qualité du matériel, sérieux des installations, proximité avec
                  les clients et réactivité du service après‑vente
                </span>
                .
              </p>
            </div>
          </div>
        </section>

        {/* CE QUE NOUS FAISONS */}
        <section className="py-16 bg-slate-50">
          <div className="container-zida">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
              Ce que fait ZIDA SOLAIRE pour vous
            </h2>

            <div className="max-w-4xl mx-auto text-slate-700 leading-relaxed">
              <p className="mb-4">
                ZIDA SOLAIRE est spécialisée dans la{" "}
                <span className="font-semibold">
                  vente et l’installation de matériel solaire et électrique
                </span>
                . Chaque année, nous accompagnons des particuliers, des
                entreprises et des structures publiques dans la mise en place de
                solutions complètes&nbsp;:
              </p>

              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>
                  Installations solaires complètes pour maisons, boutiques et
                  entreprises
                </li>
                <li>
                  Installations{" "}
                  <span className="font-semibold">hybrides</span> (solaire + réseau)
                  pour plus d’autonomie et moins de coupures
                </li>
                <li>
                  Installations électriques classiques ou en complément du solaire
                </li>
                <li>
                  <span className="font-semibold">Forages électriques</span> et
                  systèmes de pompage alimentés par le solaire ou le réseau
                </li>
                <li>
                  Vente d’
                  <span className="font-semibold">appareils électroménagers</span>{" "}
                  (frigos, congélateurs, ventilateurs, etc.)
                </li>
                <li>
                  Vente d’
                  <span className="font-semibold">appareils électroniques</span>{" "}
                  (téléviseurs, équipements divers)
                </li>
                <li>
                  <span className="font-semibold">Livraison de produits</span> à
                  l’intérieur de Ouagadougou et dans les autres villes du Burkina
                </li>
              </ul>

              <p>
                Chaque année, ZIDA SOLAIRE{" "}
                <span className="font-semibold">
                  importe son matériel de première qualité depuis la Chine
                </span>{" "}
                grâce à ses partenaires affiliés. Cet approvisionnement direct
                permet de proposer du matériel fiable, adapté au climat local, tout
                en restant compétitif sur les prix.
              </p>
            </div>
          </div>
        </section>

        {/* VALEURS */}
        <section className="py-16 bg-white">
          <div className="container-zida">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              Nos valeurs
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Qualité */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Qualité du matériel
                </h3>
                <p className="text-sm text-slate-600">
                  Matériel de première qualité importé directement de nos
                  partenaires en Chine, adapté aux conditions du Burkina Faso.
                </p>
              </div>

              {/* Proximité */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Proximité & service client
                </h3>
                <p className="text-sm text-slate-600">
                  Les clients sont au premier plan&nbsp;: nous restons toujours à
                  l’écoute et nos techniciens interviennent rapidement en cas de
                  problème sur une installation.
                </p>
              </div>

              {/* Autonomie */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Autonomie énergétique
                </h3>
                <p className="text-sm text-slate-600">
                  Notre objectif est de permettre au Burkina Faso d’atteindre son
                  autonomie énergétique, en réduisant la dépendance au réseau et
                  le coût des factures.
                </p>
              </div>

              {/* Innovation */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Innovation & diversification
                </h3>
                <p className="text-sm text-slate-600">
                  Forages électriques, électroménager, électronique, livraisons…
                  ZIDA SOLAIRE diversifie ses services pour répondre à tous vos
                  besoins en énergie et en équipement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* REPÈRES */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container-zida">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Quelques repères sur ZIDA SOLAIRE
            </h2>

            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-400 mb-2">
                  Depuis 2005
                </div>
                <div className="text-sm text-slate-300">
                  Plus de 20 ans d’engagement pour l’énergie solaire au Burkina
                  Faso.
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-orange-400 mb-2">
                  2 sites
                </div>
                <div className="text-sm text-slate-300">
                  Deux points de vente à Ouagadougou&nbsp;: CISSIN et SAABA.
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-orange-400 mb-2">
                  Burkina & voisins
                </div>
                <div className="text-sm text-slate-300">
                  Projets réalisés au Burkina Faso, au Ghana, au Mali et dans la
                  sous‑région.
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-orange-400 mb-2">
                  Clients fidèles
                </div>
                <div className="text-sm text-slate-300">
                  Particuliers, entreprises privées et structures publiques qui
                  renouvellent leur confiance.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL AVEC BOUTONS LISIBLES */}
        <section className="py-16 bg-gradient-to-r from-sky-400 to-blue-500">
          <div className="container-zida text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à passer à l’énergie solaire ?
            </h2>
            <p className="text-orange-100 mb-8 max-w-2xl mx-auto text-base md:text-lg">
              Contactez ZIDA SOLAIRE dès aujourd’hui pour une étude personnalisée
              et gratuite de votre projet solaire ou électrique. Ensemble,
              construisons votre autonomie énergétique.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/devis"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50 shadow-sm transition-colors"
              >
                Demander un devis gratuit
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/80 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
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
