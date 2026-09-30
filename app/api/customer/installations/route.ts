import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  phoneLookupCandidates,
} from "@/lib/customer-pin-auth";
import {
  getAuthenticatedCustomer,
} from "@/lib/customer-api-auth";

export async function GET(
  request: Request
) {
  try {
    const customer =
      await getAuthenticatedCustomer(
        request
      );

    if (!customer) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const phones =
      phoneLookupCandidates(
        customer.phone
      );

    const installations =
      await prisma.installationRequest.findMany({
        where: {
          customerPhone: {
            in: phones,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json({
      installations:
        installations.map(
          (installation) => ({
            ...installation,
            estimatedCost:
              installation.estimatedCost ===
              null
                ? null
                : Number(
                    installation.estimatedCost
                  ),
          })
        ),
    });
  } catch (error) {
    console.error(
      "Customer installations error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de charger les installations",
      },
      { status: 500 }
    );
  }
}
