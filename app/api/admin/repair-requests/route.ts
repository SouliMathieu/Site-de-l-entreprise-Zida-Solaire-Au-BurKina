import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminUnauthorized, requireAdminAuth } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdminAuth(req);

    const tickets = await prisma.repairRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    if (isAdminUnauthorized(error)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Admin repair requests error:", error);
    return NextResponse.json({ error: "Erreur lors du chargement du SAV" }, { status: 500 });
  }
}
