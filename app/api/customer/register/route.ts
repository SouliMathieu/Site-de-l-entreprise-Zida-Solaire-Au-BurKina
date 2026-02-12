import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "your-secret-key-change-this"
);

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, address, city } = await req.json();

    if (!firstName || !phone) {
      return NextResponse.json(
        { error: "Nom et téléphone requis" },
        { status: 400 }
      );
    }

    // Vérifier si le customer existe déjà
    const existingCustomer = await prisma.customer.findFirst({
      where: { phone },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec ce numéro" },
        { status: 409 }
      );
    }

    // Créer le customer
    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName: lastName || "",
        email: email || null,
        phone,
        address: address || "",
        city: city || "Ouagadougou",
      },
    });

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
    }, { status: 201 });
  } catch (error) {
    console.error("Customer register error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}