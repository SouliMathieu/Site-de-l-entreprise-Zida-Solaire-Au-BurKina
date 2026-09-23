import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signCustomerToken } from "@/lib/customer-auth";
import {
  otpErrorResponseMessage,
  phoneLookupCandidates,
  verifyOtpChallenge,
} from "@/lib/customer-otp";

export async function POST(req: NextRequest) {
  try {
    const { challengeId, phone, code } = await req.json();
    if (!challengeId || !phone || !code) {
      return NextResponse.json({ error: "Challenge, téléphone et code requis" }, { status: 400 });
    }

    await verifyOtpChallenge({ challengeId, rawPhone: phone, code, purpose: "login" });

    const customer = await prisma.customer.findFirst({
      where: { phone: { in: phoneLookupCandidates(phone) } },
    });
    if (!customer) {
      return NextResponse.json({ error: "Compte client introuvable" }, { status: 404 });
    }

    const token = await signCustomerToken(customer);
    return NextResponse.json({
      user: {
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`.trim(),
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
      },
      token,
    });
  } catch (error) {
    const response = otpErrorResponseMessage(error);
    console.error("Customer login OTP verify error:", error);
    return NextResponse.json(response, { status: response.status });
  }
}
