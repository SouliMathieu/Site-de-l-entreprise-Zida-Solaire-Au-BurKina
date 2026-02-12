import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "your-secret-key-change-this"
);

// GET - Récupérer le profil
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const customer = await prisma.customer.findUnique({
      where: { id: payload.id as string },
    });

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
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Token invalide" }, { status: 401 });
  }
}

// PATCH - Mettre à jour le profil
export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const { firstName, lastName, email, phone, address, city } = await req.json();

    const customer = await prisma.customer.update({
      where: { id: payload.id as string },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
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
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  }
}