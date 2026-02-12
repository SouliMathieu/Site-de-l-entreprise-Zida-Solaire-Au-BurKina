import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "your-secret-key-change-this"
);

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Numéro de téléphone requis" },
        { status: 400 }
      );
    }

    // Chercher le customer par téléphone
    const customer = await prisma.customer.findFirst({
      where: { phone },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Aucun compte trouvé avec ce numéro" },
        { status: 404 }
      );
    }

    // Créer un JWT
    const token = await new SignJWT({
      id: customer.id,
      phone: customer.phone,
      type: "customer",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(JWT_SECRET);

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
    return NextResponse.json(
      { error: "Erreur de connexion" },
      { status: 500 }
    );
  }
}