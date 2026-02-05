// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      slug,
      categoryId,
      description,
      shortDescription,
      price,
      compareAtPrice,
      sku,
      stock,
      lowStockThreshold,
      warranty,
      weight,
      images,
      isActive,
      isFeatured,
    } = body as {
      name: string;
      slug: string;
      categoryId: string;
      description: string;
      shortDescription?: string;
      price: number;
      compareAtPrice?: number | null;
      sku: string;
      stock: number;
      lowStockThreshold?: number;
      warranty?: string | null;
      weight?: number | null;
      images?: string[];
      isActive?: boolean;
      isFeatured?: boolean;
    };

    if (!name || !categoryId || !description || !sku) {
      return NextResponse.json(
        { error: "Nom, catégorie, description et SKU sont obligatoires." },
        { status: 400 }
      );
    }

    // Génération auto du slug si vide
    const cleanSlug =
      slug && slug.trim().length > 0
        ? slug
        : name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

    const product = await prisma.product.create({
      data: {
        name,
        slug: cleanSlug,
        categoryId,
        description,
        shortDescription: shortDescription || "",
        price,
        compareAtPrice: compareAtPrice || null,
        sku,
        stock: stock || 0,
        lowStockThreshold: lowStockThreshold || 5,
        warranty: warranty || null,
        weight: weight || null,
        images: images || [],
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
      },
    });

    return NextResponse.json({ id: product.id }, { status: 201 });
  } catch (error) {
    console.error("Erreur création produit", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
