import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/customer-otp";
import { createCustomerNotification } from "@/lib/customer-notifications";

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      phone,
      address,
      installationType,
      problemDescription,
      urgency,
      installedByZida,
    } = await req.json();

    if (!name || !phone || !problemDescription) {
      return NextResponse.json(
        { error: "Nom, téléphone et description du problème requis" },
        { status: 400 }
      );
    }

    let normalizedPhone: string;
    try {
      normalizedPhone = normalizePhone(phone);
    } catch {
      return NextResponse.json({ error: "Numéro de téléphone invalide" }, { status: 400 });
    }

    const repairRequest = await prisma.repairRequest.create({
      data: {
        name,
        phone: normalizedPhone,
        address: address || "",
        installationType: installationType || "",
        problemDescription,
        urgency: urgency || "normal",
        installedByZida: installedByZida === "yes",
        status: "pending",
      },
    });

    try {
      await createCustomerNotification({
        phone: normalizedPhone,
        type: "sav",
        title: "Ticket SAV reçu",
        message: `Votre demande SAV ${repairRequest.id} a bien été reçue par ZIDA SOLAIRE.`,
        entityType: "repair",
        entityId: repairRequest.id,
        route: "RepairTickets",
      });
    } catch (notificationError) {
      console.error("Repair notification error:", notificationError);
    }

    return NextResponse.json(
      {
        message: "Demande de dépannage créée avec succès",
        repairRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Repair request creation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la demande" },
      { status: 500 }
    );
  }
}
