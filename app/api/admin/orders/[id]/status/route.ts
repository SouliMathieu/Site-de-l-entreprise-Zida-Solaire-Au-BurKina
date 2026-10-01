// app/api/admin/orders/[id]/status/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCustomerOrderPush } from "@/lib/customer-push";

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
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await req.json()) as { status: OrderStatus };

    if (!ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { error: "Statut invalide." },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        customerId: true,
        status: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Commande introuvable." },
        { status: 404 }
      );
    }

    const statusChanged =
      existingOrder.status !== body.status;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
      },
    });

    if (statusChanged) {
      const messages: Record<string, string> = {
        PENDING: `Votre commande ${order.orderNumber} a été reçue et est en attente de traitement.`,
        CONFIRMED: `Votre commande ${order.orderNumber} a été confirmée.`,
        PREPARING: `Votre commande ${order.orderNumber} est en préparation.`,
        SHIPPED: `Votre commande ${order.orderNumber} a été expédiée.`,
        DELIVERED: `Votre commande ${order.orderNumber} a été livrée.`,
        CANCELLED: `Votre commande ${order.orderNumber} a été annulée.`,
      };

      try {
        const pushResult = await sendCustomerOrderPush({
          customerId: existingOrder.customerId,
          orderNumber: order.orderNumber,
          status: order.status,
          message:
            messages[order.status] ??
            `Le statut de votre commande ${order.orderNumber} a été mis à jour.`,
          orderId: order.id,
        });

        console.log(
          "Customer order push result:",
          pushResult
        );
      } catch (pushError) {
        console.error(
          "Order status updated but push notification failed:",
          pushError
        );
      }
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut." },
      { status: 500 }
    );
  }
}
