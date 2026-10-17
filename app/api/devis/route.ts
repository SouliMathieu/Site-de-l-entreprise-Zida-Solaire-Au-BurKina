import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomInt } from "node:crypto";

const TYPES: Record<string, "SOLAR" | "ELECTRICAL" | "PLUMBING" | "OTHER"> = {
  residential: "SOLAR", commercial: "SOLAR", industrial: "SOLAR",
  pumping: "SOLAR", other: "OTHER",
};

const PROJECT_LABELS: Record<string, string> = {
  residential: "Installation résidentielle",
  commercial: "Installation commerciale",
  industrial: "Installation industrielle",
  pumping: "Système de pompage solaire",
  other: "Autre projet",
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const name = String(data?.name || "").trim();
    const phone = String(data?.phone || "").trim();
    const address = String(data?.address || "").trim();
    const email = String(data?.email || "").trim();
    const systemType = String(data?.systemType || "");
    const type = TYPES[systemType];
    if (!name || !phone || !address || !type) {
      return NextResponse.json({ error: "Nom, téléphone, adresse et type de projet requis." }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
    }
    const description = [
      "Type de projet : " + PROJECT_LABELS[systemType],
      data.estimatedBudget ? "Budget estimé : " + String(data.estimatedBudget) : null,
      data.message ? "Précisions : " + String(data.message) : null,
    ].filter(Boolean).join("\n");
    const now = new Date();
    const requestNumber = "INST-" + now.toISOString().slice(0, 10).replace(/-/g, "") + "-" + randomInt(10000, 99999);
    const result = await prisma.installationRequest.create({
      data: {
        requestNumber, customerName: name, customerPhone: phone,
        customerEmail: email || null, customerAddress: address,
        installationType: type, description,
        status: "NEW",
      },
    });
    return NextResponse.json({ requestId: result.id, requestNumber: result.requestNumber }, { status: 201 });
  } catch (error) {
    console.error("Devis request failed", error);
    return NextResponse.json({ error: "Impossible d'enregistrer le devis pour le moment." }, { status: 500 });
  }
}
