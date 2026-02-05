// lib/types.ts
import type { Product as PrismaProduct } from "@prisma/client";

// Type Product avec Decimal convertis en number
export type Product = Omit<
  PrismaProduct,
  "price" | "compareAtPrice" | "costPrice" | "weight"
> & {
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  weight: number | null;
};

// Fonction pour convertir un produit Prisma en Product
export function toProduct(prismaProduct: PrismaProduct): Product {
  return {
    ...prismaProduct,
    price: Number(prismaProduct.price),
    compareAtPrice: prismaProduct.compareAtPrice
      ? Number(prismaProduct.compareAtPrice)
      : null,
    costPrice: prismaProduct.costPrice ? Number(prismaProduct.costPrice) : null,
    weight: prismaProduct.weight ? Number(prismaProduct.weight) : null,
  };
}
