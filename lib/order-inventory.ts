import { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { OrderPricingError, RequestedOrderItem } from "@/lib/order-pricing";

function aggregateItems(items: RequestedOrderItem[]) {
  const quantities = new Map<string, number>();
  for (const item of items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }
  return [...quantities.entries()].sort(([a], [b]) => a.localeCompare(b));
}

/**
 * A transactionally guarded stock decrement and order insert.
 * All stock mutations roll back when any item or the order insert fails.
 * Orders created before the stockReservedAt migration are not considered reserved.
 */
export async function createOrderWithReservedStock(
  orderData: Prisma.OrderUncheckedCreateInput,
  requestedItems: RequestedOrderItem[]
) {
  return prisma.$transaction(async (tx) => {
    for (const [productId, quantity] of aggregateItems(requestedItems)) {
      const result = await tx.product.updateMany({
        where: { id: productId, isActive: true, stock: { gte: quantity } },
        data: { stock: { decrement: quantity } },
      });
      if (result.count !== 1) {
        throw new OrderPricingError(
          "INSUFFICIENT_STOCK",
          "Un produit vient de devenir indisponible. Actualisez le panier avant de réessayer."
        );
      }
    }
    return tx.order.create({
      data: { ...orderData, stockReservedAt: new Date() },
      include: { items: true },
    });
  });
}

class OrderInventoryTransitionError extends Error {
  constructor(public reason: "NOT_FOUND" | "CONFLICT" | "INVALID_TRANSITION") {
    super(reason);
  }
}

export { OrderInventoryTransitionError };

export async function transitionOrderWithInventory(
  orderId: string,
  nextStatus: OrderStatus
) {
  return prisma.$transaction(async (tx) => {
    const previous = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!previous) throw new OrderInventoryTransitionError("NOT_FOUND");

    if (nextStatus === "READY_FOR_PICKUP" && previous.fulfillmentMethod !== "PICKUP") {
      throw new OrderInventoryTransitionError("INVALID_TRANSITION");
    }
    if (nextStatus === "SHIPPED" && previous.fulfillmentMethod === "PICKUP") {
      throw new OrderInventoryTransitionError("INVALID_TRANSITION");
    }
    const changed = previous.status !== nextStatus;
    if (!changed) return { order: previous, changed: false, guestCheckout: previous.guestCheckout };
    if (previous.status === "CANCELLED" || previous.status === "DELIVERED") {
      throw new OrderInventoryTransitionError("INVALID_TRANSITION");
    }

    // Compare the prior status in the WHERE to reject overlapping admin updates.
    const result = await tx.order.updateMany({
      where: { id: orderId, status: previous.status },
      data: {
        status: nextStatus,
        deliveredAt: nextStatus === "DELIVERED" ? new Date() : null,
        ...(nextStatus === "CANCELLED" ? { stockReservedAt: null } : {}),
      },
    });
    if (result.count !== 1) throw new OrderInventoryTransitionError("CONFLICT");

    // Only new reserved orders restore inventory. Legacy orders were not debited.
    if (nextStatus === "CANCELLED" && previous.stockReservedAt) {
      for (const [productId, quantity] of aggregateItems(previous.items)) {
        await tx.product.update({ where: { id: productId }, data: { stock: { increment: quantity } } });
      }
    }

    const order = await tx.order.findUniqueOrThrow({ where: { id: orderId } });
    return { order, changed: true, guestCheckout: previous.guestCheckout };
  });
}

export async function deleteOrderWithInventory(orderId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new OrderInventoryTransitionError("NOT_FOUND");

    // Deleting the order must be conditional on the current status, just like cancellation.
    await tx.orderItem.deleteMany({ where: { orderId } });
    const result = await tx.order.deleteMany({ where: { id: orderId, status: order.status } });
    if (result.count !== 1) throw new OrderInventoryTransitionError("CONFLICT");

    if (order.stockReservedAt && order.status !== "CANCELLED" && order.status !== "DELIVERED") {
      for (const [productId, quantity] of aggregateItems(order.items)) {
        await tx.product.update({ where: { id: productId }, data: { stock: { increment: quantity } } });
      }
    }
  });
}
