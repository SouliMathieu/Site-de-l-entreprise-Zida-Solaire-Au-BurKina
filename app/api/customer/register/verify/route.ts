import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signCustomerToken } from "@/lib/customer-auth";
import {
  normalizePhone,
  otpErrorResponseMessage,
  phoneLookupCandidates,
  verifyOtpChallenge,
} from "@/lib/customer-otp";

export async function POST(req: NextRequest) {
  try {
    const {
      challengeId,
      phone,
      code,
      firstName,
      lastName,
      email,
      address,
      city,
    } = await req.json();

    if (!challengeId || !phone || !code || !firstName) {
      return NextResponse.json(
        { error: "Challenge, téléphone, code et prénom requis" },
        { status: 400 }
      );
    }

    await verifyOtpChallenge({ challengeId, rawPhone: phone, code, purpose: "register" });

    const existingCustomer = await prisma.customer.findFirst({
      where: { phone: { in: phoneLookupCandidates(phone) } },
    });
    if (existingCustomer) {
      return NextResponse.json({ error: "Un compte existe déjà avec ce numéro" }, { status: 409 });
    }

    const customer = await prisma.customer.create({
      data: {
        firstName: String(firstName).trim(),
        lastName: String(lastName || "").trim(),
        email: email ? String(email).trim() : null,
        phone: normalizePhone(phone),
        address: address ? String(address).trim() : "",
        city: city ? String(city).trim() : "Ouagadougou",
      },
    });

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
    }, { status: 201 });
  } catch (error) {
    const response = otpErrorResponseMessage(error);
    console.error("Customer registration OTP verify error:", error);
    return NextResponse.json(response, { status: response.status });
  }
}
