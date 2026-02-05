// app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
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
      isActive: boolean;
      isFeatured: boolean;
    };

    if (!name || !categoryId || !description || !sku) {
      return NextResponse.json(
        { error: "Nom, catégorie, description et SKU sont obligatoires." },
        { status: 400 }
      );
    }

    const cleanSlug =
      slug && slug.trim().length > 0
        ? slug
        : name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

    await prisma.product.update({
      where: { id },
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
        isActive,
        isFeatured,
      },
    });

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Erreur mise à jour produit", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ status: "deleted" }, { status: 200 });
  } catch (error) {
    console.error("Erreur suppression produit", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
