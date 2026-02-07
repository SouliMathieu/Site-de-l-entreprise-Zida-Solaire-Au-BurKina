// app/api/admin/categories/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, order, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Nom et slug sont obligatoires" },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        slug: slug.toLowerCase().trim(),
        description: description?.trim() || "",
        order: Number.isFinite(order) ? order : 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Catégorie introuvable" },
        { status: 404 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ce slug existe déjà. Merci d'en choisir un autre." },
        { status: 400 }
      );
    }

    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification de la catégorie" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const count = await prisma.product.count({
      where: { categoryId: id },
    });

    if (count > 0) {
      return NextResponse.json(
        {
          error: `Impossible de supprimer: ${count} produit(s) utilisent cette catégorie.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Catégorie introuvable" },
        { status: 404 }
      );
    }

    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la catégorie" },
      { status: 500 }
    );
  }
}
