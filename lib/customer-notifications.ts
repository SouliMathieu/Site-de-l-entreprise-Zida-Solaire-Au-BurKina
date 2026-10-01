import { Customer } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { phoneLookupCandidates } from "@/lib/customer-pin-auth";

export type CustomerActivityNotification = {
  id: string;
  type: "order" | "installation" | "sav" | "system";
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  route?: string;
  createdAt: Date;
};

function orderMessage(orderNumber: string, status: string) {
  const messages: Record<string, string> = {
    PENDING: `Votre commande ${orderNumber} a été reçue et est en attente de traitement.`,
    CONFIRMED: `Votre commande ${orderNumber} a été confirmée.`,
    PREPARING: `Votre commande ${orderNumber} est en préparation.`,
    SHIPPED: `Votre commande ${orderNumber} a été expédiée.`,
    DELIVERED: `Votre commande ${orderNumber} a été livrée.`,
    CANCELLED: `Votre commande ${orderNumber} a été annulée.`,
  };

  return messages[status] ??
    `Le statut de votre commande ${orderNumber} a été mis à jour.`;
}

function installationMessage(requestNumber: string, status: string) {
  const messages: Record<string, string> = {
    NEW: `Votre demande ${requestNumber} a bien été reçue par ZIDA.`,
    CONTACTED: `L'équipe ZIDA a pris contact concernant votre demande ${requestNumber}.`,
    QUOTED: `Le devis de votre demande ${requestNumber} est prêt.`,
    ACCEPTED: `Le devis de votre demande ${requestNumber} a été accepté.`,
    SCHEDULED: `Votre installation ${requestNumber} a été planifiée.`,
    COMPLETED: `Votre installation ${requestNumber} est terminée.`,
    CANCELLED: `Votre demande ${requestNumber} a été annulée.`,
  };

  return messages[status] ??
    `Le statut de votre demande ${requestNumber} a été mis à jour.`;
}

function repairMessage(status: string) {
  const normalized = status.toLowerCase();

  const messages: Record<string, string> = {
    pending: "Votre demande d'assistance a bien été reçue.",
    contacted: "L'équipe ZIDA a pris contact concernant votre demande d'assistance.",
    in_progress: "Votre demande d'assistance est en cours de traitement.",
    resolved: "Votre demande d'assistance a été résolue.",
    completed: "Votre demande d'assistance est terminée.",
    closed: "Votre demande d'assistance est clôturée.",
    cancelled: "Votre demande d'assistance a été annulée.",
  };

  return messages[normalized] ??
    "Le statut de votre demande d'assistance a été mis à jour.";
}

export async function buildCustomerNotifications(
  customer: Pick<Customer, "id" | "phone">
): Promise<CustomerActivityNotification[]> {
  const phones = phoneLookupCandidates(customer.phone);

  const preferences =
    await prisma.customerNotificationPreference.findUnique({
      where: {
        customerId: customer.id,
      },
      select: {
        orderUpdates: true,
        installationUpdates: true,
        savUpdates: true,
      },
    });

  const showOrders =
    preferences?.orderUpdates ?? true;

  const showInstallations =
    preferences?.installationUpdates ?? true;

  const showRepairs =
    preferences?.savUpdates ?? true;

  const [orders, installations, repairs] = await Promise.all([
    showOrders
      ? prisma.order.findMany({
          where: { customerId: customer.id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
          take: 30,
        })
      : Promise.resolve([]),

    showInstallations
      ? prisma.installationRequest.findMany({
      where: {
        customerPhone: {
          in: phones,
        },
      },
      select: {
        id: true,
        requestNumber: true,
        status: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
          take: 30,
        })
      : Promise.resolve([]),

    showRepairs
      ? prisma.repairRequest.findMany({
      where: {
        phone: {
          in: phones,
        },
      },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
          take: 30,
        })
      : Promise.resolve([]),
  ]);

  const notifications: CustomerActivityNotification[] = [
    ...orders.map((order) => ({
      id: `order:${order.id}:${order.status}`,
      type: "order" as const,
      title: `Commande ${order.orderNumber}`,
      message: orderMessage(order.orderNumber, order.status),
      entityType: "order",
      entityId: order.id,
      route: "OrdersArea",
      createdAt: order.updatedAt,
    })),

    ...installations.map((installation) => ({
      id: `installation:${installation.id}:${installation.status}`,
      type: "installation" as const,
      title: `Installation ${installation.requestNumber}`,
      message: installationMessage(
        installation.requestNumber,
        installation.status
      ),
      entityType: "installation",
      entityId: installation.id,
      route: "Installations",
      createdAt: installation.updatedAt,
    })),

    ...repairs.map((repair) => ({
      id: `sav:${repair.id}:${repair.status}`,
      type: "sav" as const,
      title: "Assistance technique",
      message: repairMessage(repair.status),
      entityType: "repair",
      entityId: repair.id,
      createdAt: repair.updatedAt,
    })),
  ];

  return notifications
    .sort(
      (a, b) =>
        b.createdAt.getTime() -
        a.createdAt.getTime()
    )
    .slice(0, 50);
}
