import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUnauthorized, requireCustomerAuth } from "@/lib/customer-auth";

const DEFAULTS = {
  orderUpdates: true,
  installationUpdates: true,
  savUpdates: true,
  promotions: false,
  solarTips: true,
  pushEnabled: false,
};

export async function GET(req: NextRequest) {
  try {
    const auth = await requireCustomerAuth(req);
    const preferences = await prisma.customerNotificationPreference.upsert({
      where: { customerId: auth.id },
      create: { customerId: auth.id, ...DEFAULTS },
      update: {},
    });
    return NextResponse.json(preferences);
  } catch (error) {
    if (isUnauthorized(error)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    console.error("Notification preferences error:", error);
    return NextResponse.json({ error: "Erreur lors du chargement des préférences" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireCustomerAuth(req);
    const body = await req.json();
    const allowed = ["orderUpdates", "installationUpdates", "savUpdates", "promotions", "solarTips", "pushEnabled"] as const;
    const data: Record<string, boolean> = {};
    for (const key of allowed) {
      if (typeof body?.[key] === "boolean") data[key] = body[key];
    }

    const preferences = await prisma.customerNotificationPreference.upsert({
      where: { customerId: auth.id },
      create: { customerId: auth.id, ...DEFAULTS, ...data },
      update: data,
    });
    return NextResponse.json(preferences);
  } catch (error) {
    if (isUnauthorized(error)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    console.error("Notification preferences update error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour des préférences" }, { status: 500 });
  }
}
