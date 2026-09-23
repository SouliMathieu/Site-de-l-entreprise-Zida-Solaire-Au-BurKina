import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminUnauthorized, requireAdminAuth } from "@/lib/admin-auth";
import { createCustomerNotification, SAV_STATUS_COPY } from "@/lib/customer-notifications";

const ALLOWED_STATUSES = ["pending", "in_progress", "completed", "cancelled"] as const;
type RepairStatus = (typeof ALLOWED_STATUSES)[number];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth(req);
    const { id } = await params;
    const body = (await req.json()) as { status: RepairStatus };

    if (!ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }

    const current = await prisma.repairRequest.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: "Ticket SAV introuvable." }, { status: 404 });

    const ticket = await prisma.repairRequest.update({
      where: { id },
      data: { status: body.status },
    });

    if (current.status !== body.status) {
      const copy = SAV_STATUS_COPY[body.status];
      if (copy) {
        await createCustomerNotification({
          phone: ticket.phone,
          type: "sav",
          title: copy.title,
          message: copy.message(ticket.id.slice(-8).toUpperCase()),
          entityType: "sav",
          entityId: ticket.id,
          route: "RepairTickets",
        });
      }
    }

    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    if (isAdminUnauthorized(error)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Repair status update error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour du ticket SAV." }, { status: 500 });
  }
}
