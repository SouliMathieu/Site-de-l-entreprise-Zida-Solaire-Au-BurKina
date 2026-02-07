// app/api/admin/categories/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const NOT_FOUND_ERROR = "P2025";
const UNIQUE_CONSTRAINT_ERROR = "P2002";

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
      description,
      order,
      isActive,
    }: {
      name?: string;
      slug?: string;
      description?: string;
      order?: number;
      isActive?: boolean;
    } = body;

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
        order: Number.isFinite(order) ? (order as number) : 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === NOT_FOUND_ERROR) {
      return NextResponse.json(
        { error: "Catégorie introuvable" },
        { status: 404 }
      );
    }

    if (error.code === UNIQUE_CONSTRAINT_ERROR) {
      return NextResponse.json(
        { error: "Ce slug existe déjà" },
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
          error: `Impossible de supprimer: ${count} produit(s) utilisent cette catégorie`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === NOT_FOUND_ERROR) {
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
