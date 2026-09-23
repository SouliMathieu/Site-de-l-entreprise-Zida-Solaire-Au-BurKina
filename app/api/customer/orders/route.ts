import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUnauthorized, requireCustomerAuth } from "@/lib/customer-auth";
import { phoneLookupCandidates } from "@/lib/customer-otp";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireCustomerAuth(req);
    const phones = phoneLookupCandidates(auth.phone);

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { customerId: auth.id },
          { customerPhone: { in: phones } },
          { customer: { phone: { in: phones } } },
        ],
      },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        subtotal: Number(order.subtotal),
        deliveryFee: Number(order.deliveryFee),
        total: Number(order.total),
        deliveryAddress: order.deliveryAddress,
        deliveryCity: order.deliveryCity,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        customerNotes: order.customerNotes,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        deliveredAt: order.deliveredAt,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          quantity: item.quantity,
          price: Number(item.price),
          subtotal: Number(item.subtotal),
        })),
      })),
    });
  } catch (error) {
    if (isUnauthorized(error)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Customer orders error:", error);
    return NextResponse.json({ error: "Erreur lors du chargement des commandes" }, { status: 500 });
  }
}
