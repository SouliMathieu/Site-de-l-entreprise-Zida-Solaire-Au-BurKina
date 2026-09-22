import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUnauthorized, requireCustomerAuth } from "@/lib/customer-auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireCustomerAuth(req);

    const repairs = await prisma.repairRequest.findMany({
      where: { phone: auth.phone },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      repairs: repairs.map((item) => ({
        id: item.id,
        name: item.name,
        phone: item.phone,
        address: item.address,
        installationType: item.installationType,
        problemDescription: item.problemDescription,
        urgency: item.urgency,
        installedByZida: item.installedByZida,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    });
  } catch (error) {
    if (isUnauthorized(error)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Customer repair requests error:", error);
    return NextResponse.json({ error: "Erreur lors du chargement des demandes SAV" }, { status: 500 });
  }
}
