// app/contact/page.tsx
export const metadata = {
    title: "Contact | ZIDA SOLAIRE",
    description:
      "Contactez ZIDA SOLAIRE pour vos projets solaires et électriques au Burkina Faso.",
  };
  
  export default function ContactPage() {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Hero */}
        <section className="space-y-4">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-wide">
            Contact
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Entrer en contact avec ZIDA SOLAIRE
          </h1>
          <p className="max-w-3xl text-slate-600">
            Une question sur un produit, un projet d’installation solaire ou
            électrique, ou besoin d’un dépannage ? Remplissez le formulaire ou
            contactez-nous directement par téléphone ou WhatsApp.
          </p>
        </section>
  
        {/* Coordonnées + formulaire */}
        <section className="grid gap-10 md:grid-cols-2">
          {/* Coordonnées */}
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Coordonnées
              </h2>
              <dl className="space-y-3 text-sm text-slate-700">
                <div>
                  <dt className="font-medium text-slate-900">Adresse</dt>
                  <dd>Ouagadougou, Burkina Faso (siège ZIDA SOLAIRE).</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Téléphone</dt>
                  <dd>
                    <a
                      href="tel:+22600000000"
                      className="text-orange-600 hover:underline"
                    >
                      +226 XX XX XX XX
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">WhatsApp</dt>
                  <dd>
                    <a
                      href="https://wa.me/22600000000"
                      className="text-orange-600 hover:underline"
                    >
                      +226 XX XX XX XX
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Email</dt>
                  <dd>
                    <a
                      href="mailto:contact@zidasolaire.com"
                      className="text-orange-600 hover:underline"
                    >
                      contact@zidasolaire.com
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Horaires</dt>
                  <dd>
                    Lundi – Samedi : 8h00 – 18h00  
                    Dimanche : sur rendez-vous.
                  </dd>
                </div>
              </dl>
            </div>
  
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Besoin d’un devis détaillé ?
              </h3>
              <p>
                Pour les projets d’installation solaire ou électrique, utilisez de
                préférence le formulaire dédié afin de nous fournir toutes les
                informations nécessaires.
              </p>
              <a
                href="/demande-installation"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
              >
                Demander une installation
              </a>
            </div>
          </div>
  
          {/* Formulaire de contact (sans logique client) */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Envoyer un message
            </h2>
            <form className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-800"
                >
                  Nom complet
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
  
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-800"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-800"
                  >
                    Téléphone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
  
              <div className="space-y-1">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-slate-800"
                >
                  Sujet
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
  
              <div className="space-y-1">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-800"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                />
              </div>
  
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
              >
                Envoyer le message
              </button>
            </form>
          </div>
        </section>
  
        {/* Carte placeholder */}
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Nous trouver
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Intégrez ici une carte Google Maps pointant vers votre siège à
            Ouagadougou dès que vous disposerez de l’adresse exacte.
          </p>
          <div className="h-64 w-full rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
            Carte Google Maps (à intégrer)
          </div>
        </section>
      </main>
    );
  }
  