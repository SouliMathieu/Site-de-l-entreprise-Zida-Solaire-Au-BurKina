import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Suppression de compte | ZIDA SOLAIRE",
  description:
    "Demander la suppression d'un compte et des données associées dans l'application ZIDA SOLAIRE.",
};

const subject = encodeURIComponent("Demande de suppression de compte ZIDA SOLAIRE");
const body = encodeURIComponent(
  "Bonjour,\n\nJe souhaite demander la suppression de mon compte ZIDA SOLAIRE et des données personnelles associées.\n\nNom complet :\nNuméro de téléphone du compte :\nAdresse e-mail du compte :\n\nMerci."
);

export default function DeleteAccountPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 py-12 sm:py-16">
        <section className="mx-auto max-w-3xl rounded-2xl bg-white px-6 py-10 shadow-sm sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            Application ZIDA SOLAIRE
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Supprimer votre compte
          </h1>
          <p className="mt-5 leading-7 text-slate-700">
            Vous pouvez supprimer votre compte ZIDA SOLAIRE et les données personnelles associées.
            Les données qui doivent être conservées pour des obligations commerciales, comptables,
            légales, de sécurité ou de gestion de litige pourront être conservées de façon limitée ou
            anonymisée.
          </p>

          <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Méthode la plus rapide : depuis l'application
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-6 leading-7 text-slate-700">
              <li>Ouvrez l'application ZIDA SOLAIRE.</li>
              <li>Connectez-vous à votre compte.</li>
              <li>Ouvrez l'onglet « Profil ».</li>
              <li>Appuyez sur « Supprimer mon compte ».</li>
              <li>Confirmez la suppression.</li>
            </ol>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Demande depuis le Web
            </h2>
            <p className="mt-3 leading-7 text-slate-700">
              Si vous ne pouvez plus accéder à l'application, envoyez-nous une demande depuis l'adresse
              e-mail associée à votre compte. Indiquez votre nom, votre numéro de téléphone et l'adresse
              e-mail utilisés dans ZIDA SOLAIRE afin que nous puissions vérifier la demande avant toute
              suppression.
            </p>
            <a
              href={`mailto:Boubacarzida71@gmail.com?subject=${subject}&body=${body}`}
              className="mt-5 inline-flex rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Envoyer une demande de suppression
            </a>
          </div>

          <div className="mt-8 text-sm leading-6 text-slate-600">
            <p>
              Contact : Boubacarzida71@gmail.com — +226 74 33 99 77
            </p>
            <a
              href="/politique-de-confidentialite"
              className="mt-2 inline-block font-semibold text-blue-600 hover:underline"
            >
              Consulter la politique de confidentialité
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
