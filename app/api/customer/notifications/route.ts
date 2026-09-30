import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedCustomer } from "@/lib/customer-api-auth";
import { buildCustomerNotifications } from "@/lib/customer-notifications";

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

    const notifications =
      await buildCustomerNotifications(customer);

    const reads =
      notifications.length > 0
        ? await prisma.customerNotificationRead.findMany({
            where: {
              customerId: customer.id,
              notificationId: {
                in: notifications.map(
                  (notification) =>
                    notification.id
                ),
              },
            },
            select: {
              notificationId: true,
              readAt: true,
            },
          })
        : [];

    const readMap = new Map(
      reads.map((read) => [
        read.notificationId,
        read.readAt,
      ])
    );

    const result = notifications.map(
      (notification) => ({
        ...notification,
        readAt:
          readMap.get(notification.id) ??
          null,
      })
    );

    return NextResponse.json({
      notifications: result,
      unreadCount: result.filter(
        (notification) =>
          !notification.readAt
      ).length,
    });
  } catch (error) {
    console.error(
      "Customer notifications error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de charger les notifications",
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
    const notifications =
      await buildCustomerNotifications(customer);

    if (body?.all === true) {
      await prisma.$transaction(
        notifications.map((notification) =>
          prisma.customerNotificationRead.upsert({
            where: {
              customerId_notificationId: {
                customerId: customer.id,
                notificationId:
                  notification.id,
              },
            },
            update: {
              readAt: new Date(),
            },
            create: {
              customerId: customer.id,
              notificationId:
                notification.id,
            },
          })
        )
      );

      return NextResponse.json({
        success: true,
      });
    }

    const id =
      typeof body?.id === "string"
        ? body.id
        : "";

    if (
      !id ||
      !notifications.some(
        (notification) =>
          notification.id === id
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Notification invalide",
        },
        { status: 400 }
      );
    }

    await prisma.customerNotificationRead.upsert({
      where: {
        customerId_notificationId: {
          customerId: customer.id,
          notificationId: id,
        },
      },
      update: {
        readAt: new Date(),
      },
      create: {
        customerId: customer.id,
        notificationId: id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Update customer notification error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de mettre à jour la notification",
      },
      { status: 500 }
    );
  }
}
