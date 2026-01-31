// app/services/page.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Services d’installation | ZIDA SOLAIRE",
  description:
    "Installations solaires, installations électriques et maintenance au Burkina Faso avec ZIDA SOLAIRE.",
};

export default function ServicesPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <p className="text-sm font-semibold text-orange-500 uppercase tracking-wide">
          Nos services
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Solutions solaires et électriques clés en main
        </h1>
        <p className="max-w-2xl mx-auto text-slate-600">
          ZIDA SOLAIRE accompagne les particuliers et les entreprises pour tous
          leurs projets solaires et électriques, de l’étude jusqu’à la mise en
          service.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/demande-installation"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
          >
            Demander une installation
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-orange-500 px-6 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </section>

      {/* Grille des services */}
      <section className="grid gap-8 md:grid-cols-3">
        {/* Installation solaire */}
        <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Installation de systèmes solaires
          </h2>
          <p className="text-sm text-orange-500 font-medium mb-4">
            Production d&apos;énergie propre et fiable
          </p>
          <p className="text-sm text-slate-600 mb-4">
            Nous dimensionnons et installons des systèmes solaires adaptés au
            climat du Burkina Faso et à vos besoins énergétiques. Notre équipe
            vous conseille sur le choix des panneaux, batteries et onduleurs
            pour garantir une production fiable et un excellent retour sur
            investissement.
          </p>
          <ul className="mt-auto space-y-2 text-sm text-slate-700">
            <li>• Kits solaires pour maisons et villas.</li>
            <li>• Solutions solaires pour boutiques, bureaux et PME.</li>
            <li>• Autonomie pour sites isolés (forages, fermes, dépôts).</li>
          </ul>
        </article>

        {/* Installation électrique */}
        <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Installation électrique bâtiment
          </h2>
          <p className="text-sm text-orange-500 font-medium mb-4">
            Réseaux sûrs pour maisons et entreprises
          </p>
          <p className="text-sm text-slate-600 mb-4">
            ZIDA SOLAIRE réalise des installations électriques complètes et
            conformes aux normes pour les constructions neuves et les
            rénovations. Du tableau général aux points lumineux, nous sécurisons
            votre installation et optimisons la répartition des circuits pour
            limiter les pannes et les risques.
          </p>
          <ul className="mt-auto space-y-2 text-sm text-slate-700">
            <li>• Étude et conception de schémas électriques.</li>
            <li>• Installation, rénovation et mise aux normes.</li>
            <li>
              • Protection, mise à la terre et sécurité des personnes.
            </li>
          </ul>
        </article>

        {/* Maintenance & dépannage */}
        <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Maintenance & dépannage
          </h2>
          <p className="text-sm text-orange-500 font-medium mb-4">
            Suivi de vos installations dans la durée
          </p>
          <p className="text-sm text-slate-600 mb-4">
            Nous assurons la maintenance préventive et corrective de vos
            installations solaires et électriques pour prolonger leur durée de
            vie. En cas de panne, nos techniciens interviennent rapidement pour
            diagnostiquer le problème et remettre votre système en service.
          </p>
          <ul className="mt-auto space-y-2 text-sm text-slate-700">
            <li>• Contrôle et nettoyage des panneaux solaires.</li>
            <li>• Vérification des batteries, câblages et protections.</li>
            <li>
              • Dépannage sur site en cas de coupure ou dysfonctionnement.
            </li>
          </ul>
        </article>
      </section>

      {/* Bandeau final */}
      <section className="rounded-2xl bg-slate-900 px-6 py-10 text-center text-white md:px-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">
          Un projet d’installation solaire ou électrique ?
        </h2>
        <p className="max-w-2xl mx-auto text-slate-200 mb-6">
          Décrivez votre besoin en quelques clics. Nous vous rappelons pour
          vous proposer une étude personnalisée et un devis adapté à votre
          budget.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/demande-installation"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
          >
            Demander une installation
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-500 px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800 transition-colors"
          >
            Retour à l’accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
