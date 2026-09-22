import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUnauthorized, requireCustomerAuth } from "@/lib/customer-auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireCustomerAuth(req);

    const installations = await prisma.installationRequest.findMany({
      where: { customerPhone: auth.phone },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      installations: installations.map((item) => ({
        id: item.id,
        requestNumber: item.requestNumber,
        customerName: item.customerName,
        customerPhone: item.customerPhone,
        customerEmail: item.customerEmail,
        customerAddress: item.customerAddress,
        installationType: item.installationType,
        description: item.description,
        preferredDate: item.preferredDate,
        preferredTime: item.preferredTime,
        status: item.status,
        estimatedCost: item.estimatedCost ? Number(item.estimatedCost) : null,
        technicianNotes: item.technicianNotes,
        appointmentDate: item.appointmentDate,
        completedAt: item.completedAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    });
  } catch (error) {
    if (isUnauthorized(error)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Customer installations error:", error);
    return NextResponse.json({ error: "Erreur lors du chargement des installations" }, { status: 500 });
  }
}
