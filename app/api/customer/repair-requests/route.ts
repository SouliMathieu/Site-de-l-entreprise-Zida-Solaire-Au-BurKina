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

    const repairs =
      await prisma.repairRequest.findMany({
        where: {
          phone: {
            in: phoneLookupCandidates(
              customer.phone
            ),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json({
      repairs,
    });
  } catch (error) {
    console.error(
      "Customer repair requests error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de charger les dépannages",
      },
      { status: 500 }
    );
  }
}
