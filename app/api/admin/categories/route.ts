// app/api/admin/categories/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const UNIQUE_CONSTRAINT_ERROR = "P2002";

export async function POST(request: Request) {
  try {
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

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug.toLowerCase().trim(),
        description: description?.trim() || "",
        order: Number.isFinite(order) ? (order as number) : 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    if (error.code === UNIQUE_CONSTRAINT_ERROR) {
      return NextResponse.json(
        { error: "Ce slug existe déjà" },
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
