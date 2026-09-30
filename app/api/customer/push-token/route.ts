import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedCustomer } from "@/lib/customer-api-auth";

export async function POST(request: Request) {
  try {
    const customer =
      await getAuthenticatedCustomer(request);

    if (!customer) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const token =
      typeof body?.token === "string"
        ? body.token.trim()
        : "";

    const platform =
      body?.platform === "android" ||
      body?.platform === "ios"
        ? body.platform
        : null;

    const deviceId =
      typeof body?.deviceId === "string"
        ? body.deviceId.trim() || null
        : null;

    if (!token || !platform) {
      return NextResponse.json(
        {
          error:
            "Token push ou plateforme invalide",
        },
        { status: 400 }
      );
    }

    await prisma.customerPushToken.upsert({
      where: {
        token,
      },
      update: {
        customerId: customer.id,
        platform,
        deviceId,
      },
      create: {
        customerId: customer.id,
        token,
        platform,
        deviceId,
      },
    });

    await prisma.customerNotificationPreference.upsert({
      where: {
        customerId: customer.id,
      },
      update: {
        pushEnabled: true,
      },
      create: {
        customerId: customer.id,
        pushEnabled: true,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Register customer push token error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible d'enregistrer les notifications push",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const customer =
      await getAuthenticatedCustomer(request);

    if (!customer) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const token =
      typeof body?.token === "string"
        ? body.token.trim()
        : "";

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Token push invalide",
        },
        { status: 400 }
      );
    }

    await prisma.customerPushToken.deleteMany({
      where: {
        customerId: customer.id,
        token,
      },
    });

    const remaining =
      await prisma.customerPushToken.count({
        where: {
          customerId: customer.id,
        },
      });

    if (remaining === 0) {
      await prisma.customerNotificationPreference.upsert({
        where: {
          customerId: customer.id,
        },
        update: {
          pushEnabled: false,
        },
        create: {
          customerId: customer.id,
          pushEnabled: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete customer push token error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de désactiver les notifications push",
      },
      { status: 500 }
    );
  }
}
