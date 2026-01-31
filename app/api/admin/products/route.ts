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
      price,
      stock,
      imageUrl,
      shortDescription,
      isActive,
      isFeatured,
    } = body as {
      name: string;
      slug: string;
      categoryId: string;
      price: number;
      stock: number;
      imageUrl: string | null;
      shortDescription: string;
      isActive: boolean;
      isFeatured: boolean;
    };

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "Nom et catégorie sont obligatoires." },
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

    // SKU simple auto-généré (ex: PROD-20260130-1234)
    const now = new Date();
    const autoSku = `PROD-${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now
      .getDate()
      .toString()
      .padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug: cleanSlug,
        categoryId,
        price,
        stock,
        images: imageUrl ? [imageUrl] : [],
        shortDescription: shortDescription || "",
        description: shortDescription || "Description à compléter.",
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        lowStockThreshold: 5,
        sku: autoSku,
      },
    });

    return NextResponse.json({ id: product.id }, { status: 201 });
  } catch (error) {
    console.error("Erreur création produit", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
