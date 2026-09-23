// app/api/admin/installation-requests/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminUnauthorized, requireAdminAuth } from "@/lib/admin-auth";

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

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireAdminAuth(req);
    const { id } = await params;
    const body = (await req.json()) as { status: RequestStatus };

    if (!ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }

    const request = await prisma.installationRequest.update({
      where: { id },
      data: {
        status: body.status,
        ...(body.status === "COMPLETED" && { completedAt: new Date() }),
      },
    });

    return NextResponse.json(request, { status: 200 });
  } catch (error) {
    if (isAdminUnauthorized(error)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Error updating request status:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour du statut." }, { status: 500 });
  }
}
