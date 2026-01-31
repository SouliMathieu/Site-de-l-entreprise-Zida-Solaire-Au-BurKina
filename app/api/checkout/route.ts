// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

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

    if (!customer || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    const existingCustomer = await prisma.customer.findFirst({
      where: { phone: customer.phone },
    });

    const customerRecord =
      existingCustomer ??
      (await prisma.customer.create({
        data: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email || null,
          phone: customer.phone,
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
        customerPhone: customer.phone,
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

    return NextResponse.json(
      { orderNumber: order.orderNumber },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur API checkout", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
