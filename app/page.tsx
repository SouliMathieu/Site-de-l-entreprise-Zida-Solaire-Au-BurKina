// app/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { prisma } from "@/lib/prisma";
import { toProduct } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import { CheckCircle, Zap, Wrench } from "lucide-react";

export const metadata = {
  title: "ZIDA SOLAIRE | Énergie Solaire au Burkina Faso",
  description:
    "Installation, vente et maintenance de systèmes solaires photovoltaïques",
};

export default async function HomePage() {
  // Gestion des erreurs de connexion DB
  let featuredProducts: any[] = [];
  
  try {
    const prismaProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    });
    featuredProducts = prismaProducts.map(toProduct);
  } catch (error) {
    console.error("Erreur de connexion DB:", error);
    // Continue sans produits
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section avec Carousel */}
        <HeroCarousel />

        {/* Section Pourquoi nous choisir */}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Pourquoi choisir ZIDA SOLAIRE ?
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Votre partenaire de confiance pour l'énergie solaire
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card 1 */}
              <div className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-orange-50 to-white p-8 shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  Installation Professionnelle
                </h3>
                <p className="text-slate-600">
                  Nos techniciens certifiés garantissent une installation
                  conforme aux normes internationales.
                </p>
              </div>

              {/* Card 2 */}
              <div className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-8 shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  Garantie Étendue
                </h3>
                <p className="text-slate-600">
                  Tous nos produits sont garantis jusqu'à 25 ans pour les
                  panneaux solaires.
                </p>
              </div>

              {/* Card 3 */}
              <div className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-green-50 to-white p-8 shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
                  <Wrench className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  Maintenance & SAV
                </h3>
                <p className="text-slate-600">
                  Un service après-vente réactif disponible 24/7 pour votre
                  tranquillité.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Produits en vedette */}
        {featuredProducts.length > 0 && (
          <section className="bg-slate-50 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                  Produits en vedette
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                  Découvrez notre sélection de produits populaires
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* BOUTON VERT CLAIR - Texte NOIR */}
              <div className="mt-12 text-center">
                <Link
                  href="/produits"
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-400 px-8 py-4 text-lg font-bold text-slate-900 shadow-lg transition-all hover:scale-105 hover:bg-emerald-500 hover:shadow-xl"
                >
                  Voir tous nos produits →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action - BLEU CLAIR */}
        <section className="bg-gradient-to-br from-blue-400 to-blue-500 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Prêt à passer à l'énergie solaire ?
            </h2>
            <p className="mt-4 text-lg text-white/95">
              Contactez-nous pour une étude gratuite et personnalisée de votre
              projet.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-white px-8 py-4 text-lg font-semibold text-blue-500 shadow-xl transition-all hover:scale-105 hover:bg-blue-50"
              >
                Demander un devis gratuit
              </Link>
              <a
                href="tel:+22674339977"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                📞 Appelez-nous maintenant
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
