// app/produits/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Convertir les Decimal en number
  const productForClient = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    sku: product.sku,
    stock: product.stock,
    warranty: product.warranty,
    weight: product.weight ? Number(product.weight) : null,
    images: product.images as string[],
    specifications: product.specifications as Record<string, string> | null,
    category: product.category
      ? { id: product.category.id, name: product.category.name }
      : null,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-slate-50">
        <ProductDetailClient product={productForClient} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
