import { prisma } from "@/lib/prisma";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const EXPO_TOKEN_PATTERN = /^ExponentPushToken\[[^\]]+\]$/;

type CustomerOrderPushInput = {
  customerId: string;
  orderNumber: string;
  status: string;
  message: string;
  orderId: string;
};

function chunks<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }

  return result;
}

export async function sendCustomerOrderPush(
  input: CustomerOrderPushInput
) {
  const preferences =
    await prisma.customerNotificationPreference.findUnique({
      where: {
        customerId: input.customerId,
      },
      select: {
        pushEnabled: true,
        orderUpdates: true,
      },
    });

  if (
    !preferences?.pushEnabled ||
    !preferences.orderUpdates
  ) {
    return {
      sent: 0,
      removed: 0,
      skipped: true,
    };
  }

  const tokenRows =
    await prisma.customerPushToken.findMany({
      where: {
        customerId: input.customerId,
      },
      select: {
        id: true,
        token: true,
      },
    });

  const validTokens = tokenRows.filter((row) =>
    EXPO_TOKEN_PATTERN.test(row.token)
  );

  if (validTokens.length === 0) {
    return {
      sent: 0,
      removed: 0,
      skipped: true,
    };
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (process.env.EXPO_ACCESS_TOKEN) {
    headers.Authorization =
      `Bearer ${process.env.EXPO_ACCESS_TOKEN}`;
  }

  let sent = 0;
  let removed = 0;

  for (const batch of chunks(validTokens, 100)) {
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(
        batch.map((row) => ({
          to: row.token,
          title: `Commande ${input.orderNumber}`,
          body: input.message,
          sound: "default",
          priority: "high",
          data: {
            route: "OrdersArea",
            entityType: "order",
            entityId: input.orderId,
            status: input.status,
          },
        }))
      ),
    });

    const payload = (await response.json()) as {
      data?: Array<{
        status?: string;
        id?: string;
        message?: string;
        details?: {
          error?: string;
        };
      }>;
      errors?: unknown;
    };

    if (!response.ok) {
      throw new Error(
        `Expo Push Service HTTP ${response.status}: ${JSON.stringify(
          payload.errors ?? payload
        )}`
      );
    }

    const tickets = Array.isArray(payload.data)
      ? payload.data
      : [];

    for (let index = 0; index < tickets.length; index += 1) {
      const ticket = tickets[index];
      const tokenRow = batch[index];

      if (ticket?.status === "ok") {
        sent += 1;
        continue;
      }

      if (
        ticket?.status === "error" &&
        ticket.details?.error === "DeviceNotRegistered" &&
        tokenRow
      ) {
        await prisma.customerPushToken.delete({
          where: {
            id: tokenRow.id,
          },
        });

        removed += 1;
        continue;
      }

      console.error(
        "Expo push ticket error:",
        ticket?.message ?? ticket
      );
    }
  }

  return {
    sent,
    removed,
    skipped: false,
  };
}
