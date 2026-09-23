// app/api/admin/orders/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminUnauthorized, requireAdminAuth } from "@/lib/admin-auth";
import { createCustomerNotification, ORDER_STATUS_COPY } from "@/lib/customer-notifications";

const ALLOWED_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type OrderStatus = (typeof ALLOWED_STATUSES)[number];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth(req);
    const { id } = await params;
    const body = (await req.json()) as { status: OrderStatus };

    if (!ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }

    const current = await prisma.order.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
        ...(body.status === "DELIVERED" && { deliveredAt: new Date() }),
      },
    });

    if (current.status !== body.status) {
      const copy = ORDER_STATUS_COPY[body.status];
      if (copy) {
        await createCustomerNotification({
          customerId: order.customerId,
          phone: order.customerPhone,
          type: "order",
          title: copy.title,
          message: copy.message(order.orderNumber),
          entityType: "order",
          entityId: order.id,
          route: "OrdersArea",
        });
      }
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    if (isAdminUnauthorized(error)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour du statut." }, { status: 500 });
  }
}
