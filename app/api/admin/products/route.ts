// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Génère un SKU lisible et garanti unique en base, ex: PANEL-A3F9K2
async function generateUniqueSku(name: string): Promise<string> {
  const prefix =
    name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/(^-+|-+$)/g, "")
      .slice(0, 12) || "PROD";

  // Quelques tentatives pour éviter toute collision, même improbable
  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    const candidate = `${prefix}-${suffix}`;

    const existing = await prisma.product.findUnique({
      where: { sku: candidate },
      select: { id: true },
    });

    if (!existing) return candidate;
  }

  // Filet de sécurité ultime : timestamp, quasi impossible d'entrer en collision
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

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
      stock: number;
      lowStockThreshold?: number;
      warranty?: string | null;
      weight?: number | null;
      images?: string[];
      isActive?: boolean;
      isFeatured?: boolean;
    };

    if (!name || !categoryId || !description) {
      return NextResponse.json(
        { error: "Nom, catégorie et description sont obligatoires." },
        { status: 400 }
      );
    }

    const sku = await generateUniqueSku(name);

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
