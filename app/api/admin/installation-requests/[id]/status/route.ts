// app/api/admin/installation-requests/[id]/status/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUOTED",
  "ACCEPTED",
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
] as const;

type RequestStatus = (typeof ALLOWED_STATUSES)[number];

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = (await req.json()) as { status: RequestStatus };

    if (!ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { error: "Statut invalide." },
        { status: 400 }
      );
    }

    const request = await prisma.installationRequest.update({
      where: { id },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(request, { status: 200 });
  } catch (error) {
    console.error("Error updating request status:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut." },
      { status: 500 }
    );
  }
}
