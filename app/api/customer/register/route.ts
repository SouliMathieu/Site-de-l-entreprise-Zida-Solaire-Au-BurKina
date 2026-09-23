import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createOtpChallenge,
  normalizePhone,
  otpErrorResponseMessage,
  phoneLookupCandidates,
} from "@/lib/customer-otp";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, address, city } = await req.json();

    if (!firstName || !phone) {
      return NextResponse.json({ error: "Nom et téléphone requis" }, { status: 400 });
    }

    const existingCustomer = await prisma.customer.findFirst({
      where: { phone: { in: phoneLookupCandidates(phone) } },
    });
    if (existingCustomer) {
      return NextResponse.json({ error: "Un compte existe déjà avec ce numéro" }, { status: 409 });
    }

    const challenge = await createOtpChallenge(phone, "register");
    return NextResponse.json({
      challengeId: challenge.challengeId,
      phone: normalizePhone(phone),
      expiresIn: challenge.expiresIn,
      pendingProfile: {
        firstName: String(firstName).trim(),
        lastName: String(lastName || "").trim(),
        email: email ? String(email).trim() : "",
        address: address ? String(address).trim() : "",
        city: city ? String(city).trim() : "Ouagadougou",
      },
      ...(challenge.devCode ? { devCode: challenge.devCode } : {}),
    });
  } catch (error) {
    const response = otpErrorResponseMessage(error);
    console.error("Customer registration OTP request error:", error);
    return NextResponse.json(response, { status: response.status });
  }
}
