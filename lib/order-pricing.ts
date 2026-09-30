import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type RequestedOrderItem = {
  productId: string;
  quantity: number;
};

export class OrderPricingError extends Error {
  constructor(
    public code:
      | "INVALID_ITEMS"
      | "PRODUCT_NOT_AVAILABLE",
    message: string
  ) {
    super(message);
    this.name = "OrderPricingError";
  }
}

export async function priceOrderItems(
  items: RequestedOrderItem[]
) {
  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    throw new OrderPricingError(
      "INVALID_ITEMS",
      "Le panier est vide."
    );
  }

  const normalizedItems = items.map(
    (item) => ({
      productId:
        typeof item?.productId === "string"
          ? item.productId.trim()
          : "",
      quantity: Number(item?.quantity),
    })
  );

  const invalidItem =
    normalizedItems.some(
      (item) =>
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 100
    );

  if (invalidItem) {
    throw new OrderPricingError(
      "INVALID_ITEMS",
      "Un article du panier est invalide."
    );
  }

  const productIds = [
    ...new Set(
      normalizedItems.map(
        (item) => item.productId
      )
    ),
  ];

  const products =
    await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });

  if (
    products.length !==
    productIds.length
  ) {
    throw new OrderPricingError(
      "PRODUCT_NOT_AVAILABLE",
      "Un ou plusieurs produits ne sont plus disponibles."
    );
  }

  const productMap = new Map(
    products.map((product) => [
      product.id,
      product,
    ])
  );

  const pricedItems =
    normalizedItems.map((item) => {
      const product =
        productMap.get(item.productId);

      if (!product) {
        throw new OrderPricingError(
          "PRODUCT_NOT_AVAILABLE",
          "Produit indisponible."
        );
      }

      const price =
        new Prisma.Decimal(
          product.price
        );

      return {
        productId: product.id,
        productName: product.name,
        productImage: null,
        quantity: item.quantity,
        price,
        subtotal: price.mul(
          item.quantity
        ),
      };
    });

  const subtotal =
    pricedItems.reduce(
      (sum, item) =>
        sum.add(item.subtotal),
      new Prisma.Decimal(0)
    );

  // Livraison actuellement gratuite
  // dans le checkout public ZIDA.
  const deliveryFee =
    new Prisma.Decimal(0);

  const total =
    subtotal.add(deliveryFee);

  return {
    items: pricedItems,
    subtotal,
    deliveryFee,
    total,
  };
}
