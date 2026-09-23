import { prisma } from "@/lib/prisma";
import { phoneLookupCandidates } from "@/lib/customer-otp";

export type CustomerNotificationType = "order" | "installation" | "sav" | "system";

type PushTarget = {
  id: string;
  token: string;
};

async function sendExpoPush(params: {
  customerId: string;
  title: string;
  message: string;
  route?: string;
  entityType?: string;
  entityId?: string;
}) {
  const tokens: PushTarget[] = await prisma.customerPushToken.findMany({
    where: { customerId: params.customerId, active: true },
    select: { id: true, token: true },
  });

  if (tokens.length === 0) return;

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate",
      },
      body: JSON.stringify(
        tokens.map((item) => ({
          to: item.token,
          sound: "default",
          title: params.title,
          body: params.message,
          channelId: "zida-updates",
          data: {
            route: params.route,
            entityType: params.entityType,
            entityId: params.entityId,
          },
        }))
      ),
    });

    if (!response.ok) {
      console.error("Expo push request failed:", response.status, await response.text());
      return;
    }

    const payload = (await response.json()) as {
      data?: Array<{ status?: string; details?: { error?: string } }>;
    };

    const invalidIds = tokens
      .filter((_, index) => payload.data?.[index]?.details?.error === "DeviceNotRegistered")
      .map((item) => item.id);

    if (invalidIds.length > 0) {
      await prisma.customerPushToken.updateMany({
        where: { id: { in: invalidIds } },
        data: { active: false, revokedAt: new Date() },
      });
    }
  } catch (error) {
    console.error("Expo push delivery error:", error);
  }
}

export async function createCustomerNotification(input: {
  customerId?: string | null;
  phone: string;
  type: CustomerNotificationType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  route?: string;
}) {
  const customer = input.customerId
    ? await prisma.customer.findUnique({ where: { id: input.customerId } })
    : await prisma.customer.findFirst({ where: { phone: { in: phoneLookupCandidates(input.phone) } } });

  const preferences = customer
    ? await prisma.customerNotificationPreference.findUnique({ where: { customerId: customer.id } })
    : null;

  if (input.type === "order" && preferences?.orderUpdates === false) return null;
  if (input.type === "installation" && preferences?.installationUpdates === false) return null;
  if (input.type === "sav" && preferences?.savUpdates === false) return null;

  const notification = await prisma.customerNotification.create({
    data: {
      customerId: customer?.id ?? input.customerId ?? null,
      phone: customer?.phone ?? input.phone,
      type: input.type,
      title: input.title,
      message: input.message,
      entityType: input.entityType,
      entityId: input.entityId,
      route: input.route,
    },
  });

  if (customer && preferences?.pushEnabled === true) {
    await sendExpoPush({
      customerId: customer.id,
      title: input.title,
      message: input.message,
      route: input.route,
      entityType: input.entityType,
      entityId: input.entityId,
    });
  }

  return notification;
}

export const ORDER_STATUS_COPY: Record<string, { title: string; message: (ref: string) => string }> = {
  CONFIRMED: { title: "Commande confirmée", message: (ref) => `Votre commande ${ref} a été confirmée par ZIDA SOLAIRE.` },
  PREPARING: { title: "Commande en préparation", message: (ref) => `Votre commande ${ref} est en cours de préparation.` },
  SHIPPED: { title: "Commande expédiée", message: (ref) => `Votre commande ${ref} est en cours d’acheminement.` },
  DELIVERED: { title: "Commande livrée", message: (ref) => `Votre commande ${ref} a été livrée. Merci pour votre confiance.` },
  CANCELLED: { title: "Commande annulée", message: (ref) => `Votre commande ${ref} a été annulée.` },
};

export const INSTALLATION_STATUS_COPY: Record<string, { title: string; message: (ref: string) => string }> = {
  CONTACTED: { title: "Demande prise en charge", message: (ref) => `Votre demande ${ref} a été prise en charge par notre équipe.` },
  QUOTED: { title: "Devis prêt", message: (ref) => `Le devis lié à votre demande ${ref} est prêt.` },
  ACCEPTED: { title: "Devis accepté", message: (ref) => `Votre projet ${ref} passe à l’étape de planification.` },
  SCHEDULED: { title: "Installation planifiée", message: (ref) => `Votre installation ${ref} a été planifiée.` },
  COMPLETED: { title: "Installation terminée", message: (ref) => `Votre installation ${ref} est terminée.` },
  CANCELLED: { title: "Projet annulé", message: (ref) => `Votre demande ${ref} a été annulée.` },
};

export const SAV_STATUS_COPY: Record<string, { title: string; message: (ref: string) => string }> = {
  in_progress: { title: "SAV en cours", message: (ref) => `Votre ticket SAV ${ref} est en cours de traitement.` },
  completed: { title: "Intervention SAV terminée", message: (ref) => `Votre ticket SAV ${ref} a été clôturé.` },
  cancelled: { title: "Ticket SAV annulé", message: (ref) => `Votre ticket SAV ${ref} a été annulé.` },
};
