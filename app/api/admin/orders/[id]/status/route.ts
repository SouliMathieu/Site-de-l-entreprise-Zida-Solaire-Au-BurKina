// app/api/admin/orders/[id]/status/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut." },
      { status: 500 }
    );
  }
}
