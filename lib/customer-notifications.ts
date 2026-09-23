import { prisma } from "@/lib/prisma";
import { phoneLookupCandidates } from "@/lib/customer-otp";

export type CustomerNotificationType = "order" | "installation" | "sav" | "system";

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

  return prisma.customerNotification.create({
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
