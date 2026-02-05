// app/api/orders/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmation";
import { NewOrderAdminEmail } from "@/emails/NewOrderAdmin";
import { createElement } from "react";

type CheckoutItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type CheckoutPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: CheckoutItem[];
  totals: {
    subtotal: number;
    deliveryFee: number;
    total: number;
  };
};

// Génération d'un numéro de commande lisible
function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `ZIDA-${y}${m}${d}-${rand}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutPayload;

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "Le panier est vide." },
        { status: 400 }
      );
    }

    // Création du customer
    const customer = await prisma.customer.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city || "Ouagadougou",
      },
    });

    const orderNumber = generateOrderNumber();

    // Création de la commande
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        status: "PENDING",
        paymentMethod: "CASH_ON_DELIVERY",
        paymentStatus: "PENDING",
        subtotal: body.totals.subtotal,
        deliveryFee: body.totals.deliveryFee,
        total: body.totals.total,
        deliveryAddress: body.address,
        deliveryCity: body.city || "Ouagadougou",
        customerPhone: body.phone,
        customerEmail: body.email,
        customerNotes: body.notes || "",
        items: {
          create: body.items.map((item) => ({
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 🎯 ENVOI D'EMAIL DE CONFIRMATION AU CLIENT
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: body.email,
        subject: `Confirmation de commande #${orderNumber} - ZIDA SOLAIRE`,
        react: createElement(OrderConfirmationEmail, {
          orderNumber,
          customerName: `${body.firstName} ${body.lastName}`,
          items: body.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: body.totals.total,
          deliveryAddress: `${body.address}, ${body.city}`,
        }),
      });

      console.log("✅ Email de confirmation envoyé au client:", body.email);
    } catch (emailError) {
      console.error("❌ Erreur envoi email client:", emailError);
      // On ne bloque pas la commande si l'email échoue
    }

    // 🎯 ENVOI D'EMAIL À L'ADMIN
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: process.env.ADMIN_EMAIL || "mathieusouli35@gmail.com",
        subject: `🆕 Nouvelle commande #${orderNumber} - ZIDA SOLAIRE`,
        react: createElement(NewOrderAdminEmail, {
          orderNumber,
          customerName: `${body.firstName} ${body.lastName}`,
          customerEmail: body.email,
          customerPhone: body.phone,
          items: body.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: body.totals.total,
          deliveryAddress: `${body.address}, ${body.city}`,
          adminUrl: `${process.env.ADMIN_PANEL_URL || "http://localhost:3000/admin"}/commandes`,
        }),
      });

      console.log("✅ Email admin envoyé à:", process.env.ADMIN_EMAIL || "mathieusouli35@gmail.com");
    } catch (emailError) {
      console.error("❌ Erreur envoi email admin:", emailError);
      // On ne bloque pas la commande si l'email échoue
    }

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande." },
      { status: 500 }
    );
  }
}
