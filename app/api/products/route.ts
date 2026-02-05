// app/api/products/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "20");

    // Construire le filtre
    const where: any = {
      isActive: true,
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    // Requête
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    // Convertir Decimal en number
    const productsForResponse = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      images: p.images,
      shortDescription: p.shortDescription,
      stock: p.stock,
      category: p.category
        ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
        : null,
    }));

    return NextResponse.json({
      products: productsForResponse,
      total,
      pages: Math.ceil(total / take),
      currentPage: Math.floor(skip / take) + 1,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}