import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  findCustomerByPhone,
  normalizePhone,
} from "@/lib/customer-pin-auth";
import {
  OrderPricingError,
  priceOrderItems,
} from "@/lib/order-pricing";
import { resend } from "@/lib/resend";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmation";
import { NewOrderAdminEmail } from "@/emails/NewOrderAdmin";
import { createElement } from "react";

type CheckoutItem = {
  productId: string;
  quantity: number;
};

type CheckoutPayload = {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  city?: string;
  address: string;
  notes?: string;
  items: CheckoutItem[];
};

function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(
    now.getMonth() + 1
  ).padStart(2, "0");
  const d = String(
    now.getDate()
  ).padStart(2, "0");

  const rand =
    Math.floor(Math.random() * 9000) +
    1000;

  return `ZIDA-${y}${m}${d}-${rand}`;
}

export async function POST(
  req: Request
) {
  try {
    const body =
      (await req.json()) as CheckoutPayload;

    if (
      !body.firstName ||
      !body.phone ||
      !body.address ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Données de commande invalides.",
        },
        { status: 400 }
      );
    }

    const priced =
      await priceOrderItems(
        body.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      );

    const normalizedPhone =
      normalizePhone(body.phone);

    const existingCustomer =
      await findCustomerByPhone(
        normalizedPhone
      );

    const customer =
      existingCustomer ??
      (await prisma.customer.create({
        data: {
          firstName: body.firstName,
          lastName:
            body.lastName || "",
          email:
            body.email || null,
          phone: normalizedPhone,
          address: body.address,
          city:
            body.city ||
            "Ouagadougou",
        },
      }));

    const orderNumber =
      generateOrderNumber();

    const order =
      await prisma.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          status: "PENDING",
          paymentMethod:
            "CASH_ON_DELIVERY",
          paymentStatus: "PENDING",

          subtotal: priced.subtotal,
          deliveryFee:
            priced.deliveryFee,
          total: priced.total,

          deliveryAddress:
            body.address,
          deliveryCity:
            body.city ||
            "Ouagadougou",
          customerPhone:
            normalizedPhone,
          customerEmail:
            body.email || null,
          customerNotes:
            body.notes || "",

          items: {
            create:
              priced.items.map(
                (item) => ({
                  productId:
                    item.productId,
                  productName:
                    item.productName,
                  quantity:
                    item.quantity,
                  price:
                    item.price,
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

    const officialItems =
      order.items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        price: Number(item.price),
      }));

    const officialTotal =
      Number(order.total);

    if (body.email) {
      try {
        await resend.emails.send({
          from:
            process.env
              .RESEND_FROM_EMAIL ||
            "onboarding@resend.dev",
          to: body.email,
          subject:
            `Confirmation de commande #${orderNumber} - ZIDA SOLAIRE`,
          react: createElement(
            OrderConfirmationEmail,
            {
              orderNumber,
              customerName:
                `${body.firstName} ${body.lastName || ""}`.trim(),
              items:
                officialItems,
              total:
                officialTotal,
              deliveryAddress:
                `${body.address}, ${body.city || "Ouagadougou"}`,
            }
          ),
        });

        console.log(
          "✅ Email de confirmation envoyé au client:",
          body.email
        );
      } catch (emailError) {
        console.error(
          "❌ Erreur envoi email client:",
          emailError
        );
      }
    }

    try {
      await resend.emails.send({
        from:
          process.env
            .RESEND_FROM_EMAIL ||
          "onboarding@resend.dev",
        to:
          process.env.ADMIN_EMAIL ||
          "mathieusouli35@gmail.com",
        subject:
          `🆕 Nouvelle commande #${orderNumber} - ZIDA SOLAIRE`,
        react: createElement(
          NewOrderAdminEmail,
          {
            orderNumber,
            customerName:
              `${body.firstName} ${body.lastName || ""}`.trim(),
            customerEmail:
              body.email || "",
            customerPhone:
              normalizedPhone,
            items: officialItems,
            total: officialTotal,
            deliveryAddress:
              `${body.address}, ${body.city || "Ouagadougou"}`,
            adminUrl:
              `${process.env.ADMIN_PANEL_URL || "http://localhost:3000/admin"}/commandes`,
          }
        ),
      });

      console.log(
        "✅ Email admin envoyé à:",
        process.env.ADMIN_EMAIL ||
          "mathieusouli35@gmail.com"
      );
    } catch (emailError) {
      console.error(
        "❌ Erreur envoi email admin:",
        emailError
      );
    }

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
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
      "Error creating order:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erreur lors de la création de la commande.",
      },
      { status: 500 }
    );
  }
}
