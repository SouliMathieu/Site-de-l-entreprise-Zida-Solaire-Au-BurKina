import { prisma } from "@/lib/prisma";

const ARCHIVE_CUSTOMER_ID = "deleted-account-archive";
const ARCHIVE_CUSTOMER_PHONE = "deleted-account-archive";

export async function deleteCustomerAccount(customerId: string) {
  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new Error("CUSTOMER_NOT_FOUND");
    }

    // Les commandes doivent rester disponibles pour les obligations
    // commerciales/comptables, mais sans rester liées à l'identité supprimée.
    const archiveCustomer = await tx.customer.upsert({
      where: { id: ARCHIVE_CUSTOMER_ID },
      update: {},
      create: {
        id: ARCHIVE_CUSTOMER_ID,
        firstName: "Compte",
        lastName: "Supprimé",
        email: null,
        phone: ARCHIVE_CUSTOMER_PHONE,
        pinHash: null,
        address: null,
        city: "Archives",
        emailVerifiedAt: null,
        pinFailedAttempts: 0,
        pinLockedUntil: null,
      },
    });

    const orders = await tx.order.updateMany({
      where: { customerId: customer.id },
      data: {
        customerId: archiveCustomer.id,
        deliveryAddress: "Adresse supprimée",
        deliveryCity: "Supprimé",
        customerPhone: "supprimé",
        customerEmail: null,
        customerNotes: null,
      },
    });

    const installationWhere = customer.email
      ? {
          OR: [
            { customerPhone: customer.phone },
            {
              customerEmail: {
                equals: customer.email,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : { customerPhone: customer.phone };

    const installations = await tx.installationRequest.updateMany({
      where: installationWhere,
      data: {
        customerName: "Compte supprimé",
        customerPhone: "supprimé",
        customerEmail: null,
        customerAddress: "Adresse supprimée",
      },
    });

    const repairs = await tx.repairRequest.updateMany({
      where: { phone: customer.phone },
      data: {
        name: "Compte supprimé",
        phone: "supprimé",
        address: null,
      },
    });

    const contactWhere = customer.email
      ? {
          OR: [
            { phone: customer.phone },
            {
              email: {
                equals: customer.email,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : { phone: customer.phone };

    const contacts = await tx.contactMessage.deleteMany({
      where: contactWhere,
    });

    // Nettoyage explicite des données d'authentification et de notification.
    // Ne pas dépendre uniquement des contraintes ON DELETE CASCADE de la DB,
    // qui peuvent différer entre un ancien schéma de production et Prisma.
    await tx.customerPushToken.deleteMany({
      where: { customerId: customer.id },
    });

    await tx.customerNotificationRead.deleteMany({
      where: { customerId: customer.id },
    });

    await tx.customerNotificationPreference.deleteMany({
      where: { customerId: customer.id },
    });

    if (customer.email) {
      await tx.customerEmailChallenge.deleteMany({
        where: {
          OR: [
            { email: customer.email },
            { phone: customer.phone },
          ],
        },
      });
    } else {
      await tx.customerEmailChallenge.deleteMany({
        where: { phone: customer.phone },
      });
    }

    await tx.customerOtpChallenge.deleteMany({
      where: { phone: customer.phone },
    });

    await tx.customer.delete({
      where: { id: customer.id },
    });

    return {
      deleted: true,
      anonymizedOrders: orders.count,
      anonymizedInstallations: installations.count,
      anonymizedRepairs: repairs.count,
      deletedContactMessages: contacts.count,
    };
  });
}
