// app/a-propos/page.tsx
import Link from "next/link";

export const metadata = {
  title: "À propos de ZIDA SOLAIRE",
  description:
    "Découvrez l’histoire, la mission et les valeurs de ZIDA SOLAIRE, spécialiste des solutions solaires et électriques au Burkina Faso.",
};

export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
      {/* Hero */}
      <section className="space-y-6">
        <p className="text-sm font-semibold text-orange-500 uppercase tracking-wide">
          À propos
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          ZIDA SOLAIRE, votre partenaire énergie au Burkina Faso
        </h1>
        <p className="max-w-3xl text-slate-600">
          ZIDA SOLAIRE est une entreprise burkinabè spécialisée dans la vente
          d’équipements solaires et électroniques, l’installation de systèmes
          solaires et les installations électriques pour particuliers et
          entreprises, basée à Ouagadougou.[file:50]
        </p>
      </section>

      {/* Mission & vision */}
      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            Notre mission
          </h2>
          <p className="text-slate-600 text-sm">
            Rendre l’énergie solaire et les installations électriques fiables
            accessibles au plus grand nombre, en proposant des solutions
            adaptées au contexte local, performantes et durables.[file:50]
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            Notre vision
          </h2>
          <p className="text-slate-600 text-sm">
            Devenir une référence en Afrique de l’Ouest pour les solutions
            solaires et électriques, en combinant expertise technique, qualité
            de service et accompagnement de proximité.[file:50]
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          Nos valeurs
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Proximité
            </h3>
            <p className="text-sm text-slate-600">
              Une équipe disponible sur place, à l’écoute des besoins des
              particuliers, PME et structures locales pour proposer des
              solutions adaptées.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Qualité & fiabilité
            </h3>
            <p className="text-sm text-slate-600">
              Sélection rigoureuse des équipements, installations soignées et
              respect des bonnes pratiques pour assurer la performance dans la
              durée.[file:50]
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Transparence
            </h3>
            <p className="text-sm text-slate-600">
              Devis clairs, explications simples et accompagnement avant, pendant
              et après l’installation pour bâtir une relation de confiance.[file:50]
            </p>
          </div>
        </div>
      </section>

      {/* Chiffres clés / engagement */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          Notre engagement au quotidien
        </h2>
        <p className="max-w-3xl text-sm text-slate-600">
          À travers chaque projet, ZIDA SOLAIRE vise à améliorer le confort
          des foyers et la performance des entreprises, tout en réduisant la
          facture énergétique et la dépendance au réseau.[file:50]
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-slate-900 text-white p-5">
            <p className="text-3xl font-bold mb-1">25+</p>
            <p className="text-xs uppercase tracking-wide text-slate-300">
              années de performance garanties sur les panneaux (garanties
              constructeurs typiques).[file:50]
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-3xl font-bold text-slate-900 mb-1">10 ans</p>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              de garantie produit typique sur les équipements clés.[file:50]
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-3xl font-bold text-slate-900 mb-1">
              + de projets
            </p>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Des installations résidentielles et professionnelles en
              croissance continue au Burkina Faso.
            </p>
          </div>
        </div>
      </section>

      {/* Appel à l’action */}
      <section className="rounded-2xl bg-slate-50 px-6 py-10 md:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
            Discutons de votre projet
          </h2>
          <p className="text-sm text-slate-600 max-w-xl">
            Que vous souhaitiez équiper votre maison, moderniser l’installation
            électrique de vos locaux ou sécuriser votre alimentation en
            énergie, notre équipe est disponible pour vous conseiller.[file:50]
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/demande-installation"
            className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
          >
            Demander une installation
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </main>
  );
}
