// app/produits/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });

  if (!product || !product.isActive) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container-zida flex-1 py-8">
          <p className="text-sm text-slate-500">
            Produit introuvable ou inactif.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const images =
    Array.isArray(product.images) && (product.images as string[]).length > 0
      ? (product.images as string[])
      : [];

  const specs =
    product.specifications && typeof product.specifications === "object"
      ? (product.specifications as Record<string, string>)
      : {};

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container-zida flex-1 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Photos produit */}
          <section>
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
              {images[0] ? (
                <img
                  src={images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                  Image à venir
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {images.slice(1, 5).map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-video overflow-hidden rounded-md bg-slate-100"
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 2}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Infos produit */}
          <section className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {product.category.name}
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                {product.name}
              </h1>
              {product.shortDescription && (
                <p className="mt-2 text-sm text-slate-600">
                  {product.shortDescription}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {Number(product.price).toLocaleString("fr-FR")} FCFA
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {Number(product.compareAtPrice).toLocaleString(
                      "fr-FR"
                    )}{" "}
                    FCFA
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                TVA incluse, paiement à la livraison.
              </p>
            </div>

            <ProductDetailClient
              id={product.id}
              name={product.name}
              price={Number(product.price)}
              slug={product.slug}
              image={images[0] ?? ""}
              stock={product.stock}
              lowStockThreshold={product.lowStockThreshold}
            />

            {product.description && (
              <div className="mt-4">
                <h2 className="text-sm font-semibold text-slate-900">
                  Description
                </h2>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                  {product.description}
                </p>
              </div>
            )}

            {Object.keys(specs).length > 0 && (
              <div className="mt-4">
                <h2 className="text-sm font-semibold text-slate-900">
                  Spécifications techniques
                </h2>
                <dl className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-600 sm:grid-cols-2">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <dt className="font-medium capitalize">{key}:</dt>
                      <dd>{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
