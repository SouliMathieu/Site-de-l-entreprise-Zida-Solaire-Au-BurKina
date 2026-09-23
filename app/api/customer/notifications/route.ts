import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUnauthorized, requireCustomerAuth } from "@/lib/customer-auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireCustomerAuth(req);
    const notifications = await prisma.customerNotification.findMany({
      where: { customerId: auth.id },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    const unreadCount = await prisma.customerNotification.count({
      where: { customerId: auth.id, readAt: null },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    if (isUnauthorized(error)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    console.error("Customer notifications error:", error);
    return NextResponse.json({ error: "Erreur lors du chargement des notifications" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireCustomerAuth(req);
    const body = await req.json();

    if (body?.all === true) {
      await prisma.customerNotification.updateMany({
        where: { customerId: auth.id, readAt: null },
        data: { readAt: new Date() },
      });
      return NextResponse.json({ success: true });
    }

    if (!body?.id) return NextResponse.json({ error: "Identifiant requis" }, { status: 400 });

    const notification = await prisma.customerNotification.findFirst({
      where: { id: body.id, customerId: auth.id },
    });
    if (!notification) return NextResponse.json({ error: "Notification introuvable" }, { status: 404 });

    await prisma.customerNotification.update({
      where: { id: body.id },
      data: { readAt: notification.readAt ?? new Date() },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isUnauthorized(error)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    console.error("Customer notification update error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
