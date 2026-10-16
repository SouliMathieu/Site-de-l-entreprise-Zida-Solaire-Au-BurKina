// app/api/admin/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteOrderWithInventory, OrderInventoryTransitionError } from "@/lib/order-inventory";

interface Params {
  params: Promise<{ id: string }>;
}

// (optionnel) Récupérer une commande précise
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la commande" },
      { status: 500 }
    );
  }
}

// DELETE – suppression complète (commande + items)
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    await deleteOrderWithInventory(id);

    return NextResponse.json({
      success: true,
      message: "Commande supprimée définitivement",
    });
  } catch (error) {
    if (error instanceof OrderInventoryTransitionError) {
      return NextResponse.json({ error: "Commande déjà modifiée. Réessayez après actualisation." }, { status: 409 });
    }
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la commande" },
      { status: 500 }
    );
  }
}
