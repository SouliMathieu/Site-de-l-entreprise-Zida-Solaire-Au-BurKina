// app/api/admin/installation-requests/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

// Récupérer une demande précise (admin)
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const requestData = await prisma.installationRequest.findUnique({
      where: { id },
    });

    if (!requestData) {
      return NextResponse.json(
        { error: "Demande introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(requestData);
  } catch (error) {
    console.error("Error fetching installation request:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la demande" },
      { status: 500 }
    );
  }
}

// Supprimer définitivement une demande
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const existing = await prisma.installationRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Demande introuvable" },
        { status: 404 }
      );
    }

    await prisma.installationRequest.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Demande de devis supprimée définitivement",
    });
  } catch (error) {
    console.error("Error deleting installation request:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la demande" },
      { status: 500 }
    );
  }
}
