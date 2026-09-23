// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizePhone, phoneLookupCandidates } from "@/lib/customer-otp";
import { createCustomerNotification } from "@/lib/customer-notifications";

function generateOrderNumber() {
  const now = new Date();
  return `ZIDA-${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now
    .getDate()
    .toString()
    .padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { customer, items, subtotal, deliveryFee, total } = body as {
      customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        city: string;
        address: string;
        notes: string;
      };
      items: {
        id: string;
        name: string;
        price: number;
        slug: string;
        image: string;
        quantity: number;
      }[];
      subtotal: number;
      deliveryFee: number;
      total: number;
    };

    if (!customer || !customer.phone || !items || items.length === 0) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    let normalizedPhone: string;
    try {
      normalizedPhone = normalizePhone(customer.phone);
    } catch {
      return NextResponse.json({ error: "Numéro de téléphone invalide" }, { status: 400 });
    }

    const existingCustomer = await prisma.customer.findFirst({
      where: { phone: { in: phoneLookupCandidates(customer.phone) } },
      orderBy: { createdAt: "asc" },
    });

    const customerRecord =
      existingCustomer ??
      (await prisma.customer.create({
        data: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email || null,
          phone: normalizedPhone,
          address: customer.address,
          city: customer.city || "Ouagadougou",
        },
      }));

    const orderNumber = generateOrderNumber();
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customerRecord.id,
        status: OrderStatus.PENDING,
        paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
        paymentStatus: PaymentStatus.PENDING,
        subtotal,
        deliveryFee,
        total,
        deliveryAddress: customer.address,
        deliveryCity: customer.city || "Ouagadougou",
        customerPhone: normalizedPhone,
        customerEmail: customer.email || null,
        customerNotes: customer.notes || null,
        items: {
          create: items.map((item) => ({
            productId: item.id,
            productName: item.name,
            productImage: item.image || null,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
    });

    try {
      await createCustomerNotification({
        customerId: customerRecord.id,
        phone: normalizedPhone,
        type: "order",
        title: "Commande reçue",
        message: `Votre commande ${order.orderNumber} a bien été reçue par ZIDA SOLAIRE.`,
        entityType: "order",
        entityId: order.id,
        route: "OrdersArea",
      });
    } catch (notificationError) {
      console.error("Order notification error:", notificationError);
    }

    return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
  } catch (error) {
    console.error("Erreur API checkout", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
