import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Créer la demande de dépannage
    const repairRequest = await prisma.repairRequest.create({
      data: {
        name,
        phone,
        address: address || "",
        installationType: installationType || "",
        problemDescription,
        urgency: urgency || "normal",
        installedByZida: installedByZida === "yes",
        status: "pending",
      },
    });

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

// GET - Récupérer toutes les demandes de dépannage (pour admin)
export async function GET(req: NextRequest) {
  try {
    const repairRequests = await prisma.repairRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(repairRequests);
  } catch (error) {
    console.error("Get repair requests error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des demandes" },
      { status: 500 }
    );
  }
}