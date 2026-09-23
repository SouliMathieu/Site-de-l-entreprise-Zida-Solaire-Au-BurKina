import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createOtpChallenge,
  otpErrorResponseMessage,
  phoneLookupCandidates,
} from "@/lib/customer-otp";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: "Numéro de téléphone requis" }, { status: 400 });
    }

    const customer = await prisma.customer.findFirst({
      where: { phone: { in: phoneLookupCandidates(phone) } },
    });
    if (!customer) {
      return NextResponse.json({ error: "Aucun compte trouvé avec ce numéro" }, { status: 404 });
    }

    const challenge = await createOtpChallenge(phone, "login");
    return NextResponse.json({
      challengeId: challenge.challengeId,
      phone: challenge.phone,
      expiresIn: challenge.expiresIn,
      ...(challenge.devCode ? { devCode: challenge.devCode } : {}),
    });
  } catch (error) {
    const response = otpErrorResponseMessage(error);
    console.error("Customer login OTP request error:", error);
    return NextResponse.json(response, { status: response.status });
  }
}
