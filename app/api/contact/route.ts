// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Enregistrer le message de contact
    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        status: "NEW",
      },
    });

    // TODO: Envoyer un email de notification à l'admin
    // TODO: Envoyer un email de confirmation au client

    return NextResponse.json(
      {
        success: true,
        message: "Message envoyé avec succès",
        contactId: contact.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating contact message:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
