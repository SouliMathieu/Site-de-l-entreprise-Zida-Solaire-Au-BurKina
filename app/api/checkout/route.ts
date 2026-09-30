import { NextResponse } from "next/server";
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  findCustomerByPhone,
  normalizePhone,
} from "@/lib/customer-pin-auth";
import {
  OrderPricingError,
  priceOrderItems,
} from "@/lib/order-pricing";

function generateOrderNumber() {
  const now = new Date();

  return `ZIDA-${now
    .getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now
    .getDate()
    .toString()
    .padStart(2, "0")}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
}

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const customer = body?.customer;
    const items = body?.items;

    if (
      !customer ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    const priced =
      await priceOrderItems(
        items.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
        }))
      );

    const normalizedPhone =
      normalizePhone(customer.phone);

    const existingCustomer =
      await findCustomerByPhone(
        normalizedPhone
      );

    const customerRecord =
      existingCustomer ??
      (await prisma.customer.create({
        data: {
          firstName:
            customer.firstName,
          lastName:
            customer.lastName,
          email:
            customer.email || null,
          phone: normalizedPhone,
          address:
            customer.address,
          city:
            customer.city ||
            "Ouagadougou",
        },
      }));

    const orderNumber =
      generateOrderNumber();

    const order =
      await prisma.order.create({
        data: {
          orderNumber,
          customerId:
            customerRecord.id,
          status:
            OrderStatus.PENDING,
          paymentMethod:
            PaymentMethod.CASH_ON_DELIVERY,
          paymentStatus:
            PaymentStatus.PENDING,

          subtotal: priced.subtotal,
          deliveryFee:
            priced.deliveryFee,
          total: priced.total,

          deliveryAddress:
            customer.address,
          deliveryCity:
            customer.city ||
            "Ouagadougou",
          customerPhone:
            normalizedPhone,
          customerEmail:
            customer.email || null,
          customerNotes:
            customer.notes || null,

          items: {
            create:
              priced.items.map(
                (item) => ({
                  productId:
                    item.productId,
                  productName:
                    item.productName,
                  productImage:
                    item.productImage,
                  quantity:
                    item.quantity,
                  price: item.price,
                  subtotal:
                    item.subtotal,
                })
              ),
          },
        },
        include: {
          items: true,
        },
      });

    return NextResponse.json(
      {
        orderNumber:
          order.orderNumber,

        order: {
          id: order.id,
          orderNumber:
            order.orderNumber,
          status: order.status,

          subtotal:
            Number(order.subtotal),
          deliveryFee:
            Number(
              order.deliveryFee
            ),
          total:
            Number(order.total),

          deliveryAddress:
            order.deliveryAddress,
          deliveryCity:
            order.deliveryCity,
          customerPhone:
            order.customerPhone,
          customerEmail:
            order.customerEmail,
          customerNotes:
            order.customerNotes,

          createdAt:
            order.createdAt,
          updatedAt:
            order.updatedAt,

          items:
            order.items.map(
              (item) => ({
                id: item.id,
                productId:
                  item.productId,
                productName:
                  item.productName,
                productImage:
                  item.productImage,
                quantity:
                  item.quantity,
                price:
                  Number(item.price),
                subtotal:
                  Number(
                    item.subtotal
                  ),
              })
            ),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof
      OrderPricingError
    ) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: 400 }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "INVALID_PHONE"
    ) {
      return NextResponse.json(
        {
          error:
            "Numéro de téléphone invalide",
        },
        { status: 400 }
      );
    }

    console.error(
      "Erreur API checkout",
      error
    );

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
