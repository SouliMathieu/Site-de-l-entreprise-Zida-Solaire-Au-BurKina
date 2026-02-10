// app/contact/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact | ZIDA SOLAIRE",
  description:
    "Contactez ZIDA SOLAIRE pour vos projets d'installation solaire et électrique au Burkina Faso.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section - VERSION AMÉLIORÉE */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 sm:py-28">
          {/* Effet de motif en arrière-plan */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
          
          <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
              </span>
              <span className="text-sm font-semibold text-orange-300">
                Disponible 7j/7
              </span>
            </div>

            {/* Titre */}
            <h1 className="mb-6 bg-gradient-to-r from-white via-blue-100 to-orange-200 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl lg:text-6xl">
              Entrer en contact avec
              <span className="block text-orange-400">ZIDA SOLAIRE</span>
            </h1>

            {/* Sous-titre */}
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-200 sm:text-xl">
              Une question sur un produit, un projet d'installation solaire ou
              électrique, ou besoin d'un dépannage ? Remplissez le formulaire ou
              contactez-nous directement par téléphone ou WhatsApp.
            </p>

            {/* Boutons d'action rapide */}
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="tel:+22674339977"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-orange-600 sm:px-8 sm:py-4"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Appeler maintenant
              </a>
              <a
                href="https://wa.me/22674339977?text=Bonjour%20ZIDA%20SOLAIRE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20 sm:px-8 sm:py-4"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Contenu Principal */}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-5">
              {/* Coordonnées - 2 colonnes */}
              <div className="space-y-8 lg:col-span-2">
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-slate-900">
                    Coordonnées
                  </h2>

                  {/* Adresse */}
                  <div className="mb-6 flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <MapPin className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-slate-900">
                        Adresse
                      </h3>
                      <p className="text-slate-600">
                        Ouagadougou, Burkina Faso
                      </p>
                      <p className="text-sm text-slate-500">
                        (siège ZIDA SOLAIRE)
                      </p>
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="mb-6 flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-slate-900">
                        Téléphone
                      </h3>
                      <a
                        href="tel:+22674339977"
                        className="block text-orange-600 transition-colors hover:text-orange-700"
                      >
                        +226 74 33 99 77
                      </a>
                      <a
                        href="tel:+22655220303"
                        className="block text-orange-600 transition-colors hover:text-orange-700"
                      >
                        +226 55 22 03 03
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-6 flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-slate-900">
                        Email
                      </h3>
                      <a
                        href="mailto:Boubacarzida71@gmail.com"
                        className="text-orange-600 transition-colors hover:text-orange-700"
                      >
                        Boubacarzida71@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Horaires */}
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-slate-900">
                        Horaires
                      </h3>
                      <p className="text-slate-600">
                        Lundi – Samedi : 8h00 – 21h00
                      </p>
                      <p className="text-slate-600">Dimanche : sur rendez-vous</p>
                    </div>
                  </div>
                </div>

                {/* CTA Installation */}
                <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-6 shadow-lg">
                  <h3 className="mb-3 text-lg font-bold text-slate-900">
                    Besoin d'un devis détaillé ?
                  </h3>
                  <p className="mb-4 text-sm text-slate-600">
                    Pour les projets d'installation solaire ou électrique,
                    utilisez de préférence le formulaire dédié afin de nous
                    fournir toutes les informations nécessaires.
                  </p>
                  <Link
                    href="/demande-installation"
                    className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-400 px-6 py-3 text-center font-semibold text-slate-900 shadow-lg transition-all hover:scale-105 hover:bg-emerald-500"
                  >
                    Demander une installation →
                  </Link>
                </div>
              </div>

              {/* Formulaire - 3 colonnes */}
              <div className="lg:col-span-3">
                <h2 className="mb-6 text-2xl font-bold text-slate-900">
                  Envoyer un message
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* Carte Google Maps */}
        <section className="bg-slate-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">
              Nous trouver
            </h2>
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.1234567890123!2d-1.4375322!3d12.3889946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe2ebf5abcb61719%3A0xed9767ccdad993e!2sZida%20solaire%20international!5e0!3m2!1sfr!2sbf!4v1234567890123!5m2!1sfr!2sbf"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
            <p className="mt-4 text-center text-sm text-slate-600">
              📍 Zida Solaire International - Ouagadougou, Burkina Faso
            </p>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Besoin d'une réponse immédiate ?
            </h2>
            <p className="mb-8 text-lg text-white/95">
              Appelez-nous ou envoyez-nous un message WhatsApp !
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="tel:+22674339977"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-bold text-blue-600 shadow-xl transition-all hover:scale-105 hover:bg-blue-50"
              >
                📞 Appeler maintenant
              </a>
              <a
                href="https://wa.me/22674339977?text=Bonjour%20ZIDA%20SOLAIRE,%20j'ai%20une%20question%20concernant..."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-green-500 px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:bg-green-600"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
