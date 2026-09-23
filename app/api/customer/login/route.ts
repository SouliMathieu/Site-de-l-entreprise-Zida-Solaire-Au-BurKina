import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signCustomerToken } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Numéro de téléphone requis" }, { status: 400 });
    }

    const customer = await prisma.customer.findFirst({ where: { phone } });
    if (!customer) {
      return NextResponse.json({ error: "Aucun compte trouvé avec ce numéro" }, { status: 404 });
    }

    const token = await signCustomerToken(customer);

    return NextResponse.json({
      user: {
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
      },
      token,
    });
  } catch (error) {
    console.error("Customer login error:", error);
    return NextResponse.json({ error: "Erreur de connexion" }, { status: 500 });
  }
}
