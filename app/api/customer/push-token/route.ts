import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUnauthorized, requireCustomerAuth } from "@/lib/customer-auth";

const EXPO_TOKEN_PATTERN = /^(Expo|Exponent)PushToken\[[^\]]+\]$/;

export async function POST(req: NextRequest) {
  try {
    const auth = await requireCustomerAuth(req);
    const { token, platform, deviceId } = (await req.json()) as {
      token?: string;
      platform?: string;
      deviceId?: string;
    };

    if (!token || !EXPO_TOKEN_PATTERN.test(token)) {
      return NextResponse.json({ error: "Token Expo invalide" }, { status: 400 });
    }
    if (!platform || !["android", "ios"].includes(platform)) {
      return NextResponse.json({ error: "Plateforme invalide" }, { status: 400 });
    }

    const record = await prisma.customerPushToken.upsert({
      where: { token },
      update: {
        customerId: auth.id,
        platform,
        deviceId: deviceId || null,
        active: true,
        revokedAt: null,
        lastSeenAt: new Date(),
      },
      create: {
        customerId: auth.id,
        token,
        platform,
        deviceId: deviceId || null,
      },
    });

    await prisma.customerNotificationPreference.upsert({
      where: { customerId: auth.id },
      update: { pushEnabled: true },
      create: { customerId: auth.id, pushEnabled: true },
    });

    return NextResponse.json({ registered: true, id: record.id });
  } catch (error) {
    if (isUnauthorized(error)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Push token registration error:", error);
    return NextResponse.json({ error: "Impossible d'enregistrer cet appareil" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireCustomerAuth(req);
    const { token } = (await req.json()) as { token?: string };

    if (!token) {
      return NextResponse.json({ error: "Token requis" }, { status: 400 });
    }

    await prisma.customerPushToken.updateMany({
      where: { customerId: auth.id, token },
      data: { active: false, revokedAt: new Date(), lastSeenAt: new Date() },
    });

    const activeCount = await prisma.customerPushToken.count({
      where: { customerId: auth.id, active: true },
    });
    if (activeCount === 0) {
      await prisma.customerNotificationPreference.upsert({
        where: { customerId: auth.id },
        update: { pushEnabled: false },
        create: { customerId: auth.id, pushEnabled: false },
      });
    }

    return NextResponse.json({ revoked: true });
  } catch (error) {
    if (isUnauthorized(error)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Push token revoke error:", error);
    return NextResponse.json({ error: "Impossible de désactiver cet appareil" }, { status: 500 });
  }
}
