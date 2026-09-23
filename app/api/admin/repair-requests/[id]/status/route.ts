import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminUnauthorized, requireAdminAuth } from "@/lib/admin-auth";

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

    const ticket = await prisma.repairRequest.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    if (isAdminUnauthorized(error)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Repair status update error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour du ticket SAV." }, { status: 500 });
  }
}
