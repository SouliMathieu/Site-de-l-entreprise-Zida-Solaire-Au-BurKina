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

    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug: cleanSlug,
        categoryId,
        price,
        stock,
        images: imageUrl ? [imageUrl] : [],
        shortDescription: shortDescription || "",
        description: shortDescription || "Description à compléter.",
        isActive,
        isFeatured,
      },
    });

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Erreur mise à jour produit", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
