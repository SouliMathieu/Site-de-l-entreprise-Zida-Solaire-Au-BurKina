// app/api/products/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    // Convertir Decimal en number
    return NextResponse.json({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice
        ? Number(product.compareAtPrice)
        : null,
      sku: product.sku,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      warranty: product.warranty,
      weight: product.weight ? Number(product.weight) : null,
      images: product.images,
      specifications: product.specifications,
      category: product.category
        ? { id: product.category.id, name: product.category.name }
        : null,
      isFeatured: product.isFeatured,
      viewCount: product.viewCount,
      salesCount: product.salesCount,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du produit" },
      { status: 500 }
    );
  }
}