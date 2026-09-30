import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedCustomer } from "@/lib/customer-api-auth";

const preferenceFields = [
  "orderUpdates",
  "installationUpdates",
  "savUpdates",
  "promotions",
  "solarTips",
  "pushEnabled",
] as const;

function publicPreferences(preferences: {
  orderUpdates: boolean;
  installationUpdates: boolean;
  savUpdates: boolean;
  promotions: boolean;
  solarTips: boolean;
  pushEnabled: boolean;
}) {
  return {
    orderUpdates:
      preferences.orderUpdates,
    installationUpdates:
      preferences.installationUpdates,
    savUpdates:
      preferences.savUpdates,
    promotions:
      preferences.promotions,
    solarTips:
      preferences.solarTips,
    pushEnabled:
      preferences.pushEnabled,
  };
}

export async function GET(request: Request) {
  try {
    const customer =
      await getAuthenticatedCustomer(request);

    if (!customer) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const preferences =
      await prisma.customerNotificationPreference.upsert({
        where: {
          customerId: customer.id,
        },
        update: {},
        create: {
          customerId: customer.id,
        },
      });

    return NextResponse.json(
      publicPreferences(preferences)
    );
  } catch (error) {
    console.error(
      "Notification preferences error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de charger les préférences",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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

    const data: Record<string, boolean> = {};

    for (const field of preferenceFields) {
      if (typeof body?.[field] === "boolean") {
        data[field] = body[field];
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        {
          error:
            "Aucune préférence valide",
        },
        { status: 400 }
      );
    }

    const preferences =
      await prisma.customerNotificationPreference.upsert({
        where: {
          customerId: customer.id,
        },
        update: data,
        create: {
          customerId: customer.id,
          ...data,
        },
      });

    return NextResponse.json(
      publicPreferences(preferences)
    );
  } catch (error) {
    console.error(
      "Update notification preferences error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de modifier les préférences",
      },
      { status: 500 }
    );
  }
}
