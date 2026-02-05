import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmation";
import { createElement } from "react";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderNumber, customerEmail, customerName, items, total, deliveryAddress } = body;

    // Validation
    if (!orderNumber || !customerEmail || !customerName || !items || !total) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    // Envoyer l'email avec createElement pour créer un ReactElement
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: customerEmail,
      subject: `Confirmation de commande #${orderNumber} - ZIDA SOLAIRE`,
      react: createElement(OrderConfirmationEmail, {
        orderNumber,
        customerName,
        items,
        total,
        deliveryAddress,
      }),
    });

    if (error) {
      console.error("Erreur Resend:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Email envoyé:", data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
