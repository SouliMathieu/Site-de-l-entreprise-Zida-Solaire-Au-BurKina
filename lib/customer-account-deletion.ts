import { prisma } from "@/lib/prisma";

const ARCHIVE_CUSTOMER_ID = "deleted-account-archive";
const ARCHIVE_CUSTOMER_PHONE = "deleted-account-archive";

export async function deleteCustomerAccount(customerId: string) {
  return prisma.$transaction(async (tx) => {
    const tableExists = async (tableName: string) => {
      const rows = await tx.$queryRaw<Array<{ name: string | null }>>`
        SELECT to_regclass(${`public.${tableName}`})::text AS "name"
      `;
      return Boolean(rows[0]?.name);
    };

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

    let anonymizedInstallations = 0;
    if (await tableExists("installation_requests")) {
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
      anonymizedInstallations = installations.count;
    }

    let anonymizedRepairs = 0;
    if (await tableExists("repair_requests")) {
      const repairs = await tx.repairRequest.updateMany({
        where: { phone: customer.phone },
        data: {
          name: "Compte supprimé",
          phone: "supprimé",
          address: null,
        },
      });
      anonymizedRepairs = repairs.count;
    }

    let deletedContactMessages = 0;
    if (await tableExists("contact_messages")) {
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
      deletedContactMessages = contacts.count;
    }

    // Certaines installations de production peuvent avoir été créées avant
    // l'ajout des tables de notifications. On vérifie leur existence avant
    // toute requête afin d'éviter une erreur Prisma P2021.
    if (await tableExists("customer_push_tokens")) {
      await tx.customerPushToken.deleteMany({
        where: { customerId: customer.id },
      });
    }

    if (await tableExists("customer_notification_reads")) {
      await tx.customerNotificationRead.deleteMany({
        where: { customerId: customer.id },
      });
    }

    if (await tableExists("customer_notification_preferences")) {
      await tx.customerNotificationPreference.deleteMany({
        where: { customerId: customer.id },
      });
    }

    if (await tableExists("customer_email_challenges")) {
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
    }

    if (await tableExists("customer_otp_challenges")) {
      await tx.customerOtpChallenge.deleteMany({
        where: { phone: customer.phone },
      });
    }

    await tx.customer.delete({
      where: { id: customer.id },
    });

    return {
      deleted: true,
      anonymizedOrders: orders.count,
      anonymizedInstallations,
      anonymizedRepairs,
      deletedContactMessages,
    };
  });
}
