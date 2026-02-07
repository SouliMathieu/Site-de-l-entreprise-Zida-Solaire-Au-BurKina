// app/api/admin/categories/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, order, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Nom et slug sont obligatoires" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug.toLowerCase().trim(),
        description: description?.trim() || "",
        order: Number.isFinite(order) ? order : 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      // Contrainte d’unicité (slug)
      return NextResponse.json(
        { error: "Ce slug existe déjà. Merci d'en choisir un autre." },
        { status: 400 }
      );
    }

    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la catégorie" },
      { status: 500 }
    );
  }
}
