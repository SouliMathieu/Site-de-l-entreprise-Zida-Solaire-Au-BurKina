// app/page.tsx
import { PrismaClient } from "@prisma/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";

const prisma = new PrismaClient();

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8">
        {/* Hero */}
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
              ZIDA SOLAIRE
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Solutions solaires complètes pour les foyers et entreprises du
              Burkina Faso.
            </h1>
            <p className="mt-4 text-sm text-slate-600 sm:text-base">
              Vente d&apos;équipements solaires et électroniques, installation
              clé en main, et service après-vente professionnel pour assurer une
              énergie fiable au quotidien.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/produits"
                className="rounded-lg bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#e85f2f] transition"
              >
                Voir les produits
              </a>
              <a
                href="/services"
                className="rounded-lg border border-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition"
              >
                Demander une installation
              </a>
            </div>
            <ul className="mt-6 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <li>• Paiement à la livraison</li>
              <li>• Installation professionnelle</li>
              <li>• Produits certifiés</li>
              <li>• Conseil et dimensionnement</li>
            </ul>
          </div>

          <div className="h-56 rounded-xl bg-gradient-to-br from-[#FF6B35] via-amber-400 to-yellow-300 shadow-lg md:h-72" />
        </section>

        {/* Catégories principales */}
        <section className="mt-12">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Catégories principales
            </h2>
            <a
              href="/produits"
              className="text-xs font-medium text-[#FF6B35] hover:underline"
            >
              Voir tous les produits
            </a>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/produits?categorie=${cat.slug}`}
                className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#FF6B35] hover:shadow-md"
              >
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#FF6B35]">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="mt-2 text-xs text-slate-500">
                    {cat.description}
                  </p>
                )}
              </a>
            ))}
          </div>
        </section>

        {/* Services d’installation */}
        <section className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">
              Installation solaire
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Dimensionnement, fourniture et pose de systèmes solaires complets
              pour maisons, boutiques et entreprises.
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">
              Installation électrique
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Installations électriques conformes et sécurisées pour bâtiments
              neufs ou rénovations.
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">
              Pompage & forage
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Solutions de pompage solaire pour forages, châteaux d&apos;eau et
              exploitation agricole.
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
