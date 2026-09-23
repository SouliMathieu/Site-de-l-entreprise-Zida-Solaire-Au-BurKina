import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUnauthorized, requireCustomerAuth } from "@/lib/customer-auth";
import {
  createOtpChallenge,
  normalizePhone,
  otpErrorResponseMessage,
  phoneLookupCandidates,
} from "@/lib/customer-otp";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireCustomerAuth(req);
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Nouveau numéro requis" }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(phone);
    if (normalizedPhone === normalizePhone(auth.phone)) {
      return NextResponse.json({ error: "Ce numéro est déjà associé à votre compte" }, { status: 409 });
    }

    const existing = await prisma.customer.findFirst({
      where: {
        id: { not: auth.id },
        phone: { in: phoneLookupCandidates(phone) },
      },
    });
    if (existing) {
      return NextResponse.json({ error: "Ce numéro est déjà utilisé par un autre compte" }, { status: 409 });
    }

    const challenge = await createOtpChallenge(phone, "phone_change");
    return NextResponse.json({
      challengeId: challenge.challengeId,
      phone: challenge.phone,
      expiresIn: challenge.expiresIn,
      ...(challenge.devCode ? { devCode: challenge.devCode } : {}),
    });
  } catch (error) {
    if (isUnauthorized(error)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const response = otpErrorResponseMessage(error);
    console.error("Phone change OTP request error:", error);
    return NextResponse.json(response, { status: response.status });
  }
}
