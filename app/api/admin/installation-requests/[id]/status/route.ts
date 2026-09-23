// app/api/admin/installation-requests/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminUnauthorized, requireAdminAuth } from "@/lib/admin-auth";
import { createCustomerNotification, INSTALLATION_STATUS_COPY } from "@/lib/customer-notifications";

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

    const current = await prisma.installationRequest.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });

    const request = await prisma.installationRequest.update({
      where: { id },
      data: {
        status: body.status,
        ...(body.status === "COMPLETED" && { completedAt: new Date() }),
      },
    });

    if (current.status !== body.status) {
      const copy = INSTALLATION_STATUS_COPY[body.status];
      if (copy) {
        await createCustomerNotification({
          phone: request.customerPhone,
          type: "installation",
          title: copy.title,
          message: copy.message(request.requestNumber),
          entityType: "installation",
          entityId: request.id,
          route: "Installations",
        });
      }
    }

    return NextResponse.json(request, { status: 200 });
  } catch (error) {
    if (isAdminUnauthorized(error)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Error updating request status:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour du statut." }, { status: 500 });
  }
}
