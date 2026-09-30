import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    const orders =
      await prisma.order.findMany({
        where: {
          customerId: customer.id,
        },
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json({
      orders,
    });
  } catch (error) {
    console.error(
      "Customer orders error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de charger les commandes",
      },
      { status: 500 }
    );
  }
}
