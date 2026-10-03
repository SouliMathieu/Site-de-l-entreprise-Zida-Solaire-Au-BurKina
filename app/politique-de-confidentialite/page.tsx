import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Politique de confidentialité | ZIDA SOLAIRE",
  description:
    "Politique de confidentialité de l'application mobile ZIDA SOLAIRE.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 py-12 sm:py-16">
        <article className="mx-auto max-w-4xl rounded-2xl bg-white px-6 py-10 shadow-sm sm:px-10">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Politique de confidentialité
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Application mobile ZIDA SOLAIRE — dernière mise à jour : 3 octobre 2026
          </p>

          <div className="mt-8 space-y-8 text-slate-700">
            <section>
              <h2 className="text-xl font-semibold text-slate-900">1. Responsable du traitement</h2>
              <p className="mt-3 leading-7">
                L'application ZIDA SOLAIRE est exploitée dans le cadre des activités de ZIDA SOLAIRE,
                à Ouagadougou, Burkina Faso. Pour toute question relative à vos données personnelles,
                vous pouvez nous contacter au +226 74 33 99 77 ou à l'adresse
                Boubacarzida71@gmail.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">2. Données collectées</h2>
              <p className="mt-3 leading-7">Selon les fonctionnalités utilisées, nous pouvons traiter :</p>
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-7">
                <li>prénom, nom, téléphone, e-mail, ville et adresse ;</li>
                <li>informations liées au compte et à l'authentification ;</li>
                <li>commandes, produits, quantités, adresse de livraison et remarques ;</li>
                <li>demandes de devis, d'installation, de réparation et d'assistance ;</li>
                <li>préférences de notification et identifiant technique de notification push.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">3. Finalités</h2>
              <p className="mt-3 leading-7">
                Ces données sont utilisées pour créer et sécuriser votre compte, traiter vos commandes,
                organiser les livraisons, gérer les devis, installations et demandes d'assistance,
                suivre vos activités et vous envoyer les notifications que vous avez autorisées.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">4. Authentification et sécurité</h2>
              <p className="mt-3 leading-7">
                L'accès au compte peut utiliser un numéro de téléphone, une adresse e-mail, un PIN et des
                codes temporaires de vérification. Le PIN n'est pas destiné à être conservé en clair par
                le service. Des informations de session peuvent être conservées localement sur l'appareil
                afin de maintenir la connexion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">5. Notifications push</h2>
              <p className="mt-3 leading-7">
                Les notifications sont facultatives. Si vous les activez, un jeton technique peut être
                enregistré afin d'acheminer les mises à jour relatives notamment aux commandes,
                installations et demandes d'assistance. Vous pouvez les désactiver depuis l'application
                ou les paramètres de votre téléphone.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">6. Prestataires techniques</h2>
              <p className="mt-3 leading-7">
                Des prestataires techniques peuvent intervenir lorsque cela est nécessaire au fonctionnement
                de l'application, notamment pour l'hébergement, l'envoi d'e-mails de vérification et
                l'acheminement des notifications. Ils ne doivent traiter que les informations nécessaires
                au service concerné.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">7. Publicité</h2>
              <p className="mt-3 leading-7">
                La version actuelle de l'application ZIDA SOLAIRE n'intègre pas de système publicitaire
                destiné à afficher des annonces personnalisées. Cette politique sera mise à jour si cela
                change ultérieurement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">8. Conservation</h2>
              <p className="mt-3 leading-7">
                Les données sont conservées pendant la durée nécessaire à la fourniture des services et au
                respect des obligations applicables. Lors d'une suppression de compte, les données
                personnelles sont supprimées ou anonymisées. Certaines informations strictement nécessaires
                à des obligations commerciales, comptables, légales, de sécurité ou de gestion de litige
                peuvent être conservées sous une forme limitée ou anonymisée.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">9. Suppression du compte</h2>
              <p className="mt-3 leading-7">
                Un utilisateur connecté peut supprimer son compte directement dans l'application depuis
                Profil, puis « Supprimer mon compte ». Une demande peut également être initiée depuis notre
                page publique dédiée.
              </p>
              <a
                href="/suppression-compte"
                className="mt-4 inline-flex rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
              >
                Accéder à la page de suppression du compte
              </a>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">10. Vos droits</h2>
              <p className="mt-3 leading-7">
                Vous pouvez demander l'accès, la correction ou la suppression de vos données personnelles,
                ainsi que des informations sur leur utilisation, en nous contactant à
                Boubacarzida71@gmail.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">11. Enfants</h2>
              <p className="mt-3 leading-7">
                L'application est destinée aux personnes recherchant des produits et services énergétiques
                et n'est pas conçue spécifiquement pour collecter volontairement les données personnelles
                d'enfants.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">12. Contact</h2>
              <div className="mt-3 leading-7">
                <p>ZIDA SOLAIRE — Ouagadougou, Burkina Faso</p>
                <p>Téléphone : +226 74 33 99 77</p>
                <p>E-mail : Boubacarzida71@gmail.com</p>
                <p>Site : https://zidasolaire.it.com/</p>
              </div>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
