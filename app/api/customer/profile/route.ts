import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUnauthorized, requireCustomerAuth } from "@/lib/customer-auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireCustomerAuth(req);
    const customer = await prisma.customer.findUnique({ where: { id: auth.id } });

    if (!customer) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    return NextResponse.json({
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
    });
  } catch (error) {
    if (isUnauthorized(error)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Erreur lors du chargement du profil" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireCustomerAuth(req);
    const { firstName, lastName, email, phone, address, city } = await req.json();

    const customer = await prisma.customer.update({
      where: { id: auth.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(email !== undefined && { email: email || null }),
        ...(phone && { phone }),
        ...(address !== undefined && { address }),
        ...(city && { city }),
      },
    });

    return NextResponse.json({
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
    });
  } catch (error) {
    if (isUnauthorized(error)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  }
}
