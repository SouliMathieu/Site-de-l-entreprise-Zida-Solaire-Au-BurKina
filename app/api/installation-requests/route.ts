import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


function generateRequestNumber() {
  const now = new Date();
  return `INST-${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now
    .getDate()
    .toString()
    .padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      phone,
      email,
      type,
      address,
      description,
      preferredDate,
      preferredTime,
    } = body as {
      firstName: string;
      lastName: string;
      phone: string;
      email?: string;
      type: "SOLAR" | "ELECTRICAL" | "OTHER";
      address?: string;
      description: string;
      preferredDate?: string;
      preferredTime?: string;
    };

    if (!firstName || !lastName || !phone || !description) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const requestNumber = generateRequestNumber();

    const req = await prisma.installationRequest.create({
      data: {
        requestNumber,
        customerName: `${firstName} ${lastName}`,
        customerPhone: phone,
        customerEmail: email || null,
        customerAddress: address || "",
        installationType: type,
        description,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        preferredTime: preferredTime || null,
        status: "NEW",
      },
    });

    return NextResponse.json(
      { requestNumber: req.requestNumber },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur création demande installation", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
