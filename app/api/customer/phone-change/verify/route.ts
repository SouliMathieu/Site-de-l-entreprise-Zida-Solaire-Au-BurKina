import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isUnauthorized, requireCustomerAuth, signCustomerToken } from "@/lib/customer-auth";
import {
  normalizePhone,
  otpErrorResponseMessage,
  phoneLookupCandidates,
  verifyOtpChallenge,
} from "@/lib/customer-otp";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireCustomerAuth(req);
    const { challengeId, phone, code } = await req.json();

    if (!challengeId || !phone || !code) {
      return NextResponse.json({ error: "Challenge, nouveau numéro et code requis" }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(phone);
    await verifyOtpChallenge({
      challengeId,
      rawPhone: normalizedPhone,
      code,
      purpose: "phone_change",
    });

    const existing = await prisma.customer.findFirst({
      where: {
        id: { not: auth.id },
        phone: { in: phoneLookupCandidates(normalizedPhone) },
      },
    });
    if (existing) {
      return NextResponse.json({ error: "Ce numéro est déjà utilisé par un autre compte" }, { status: 409 });
    }

    const current = await prisma.customer.findUnique({ where: { id: auth.id } });
    if (!current) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    const oldPhones = phoneLookupCandidates(current.phone);

    const [customer] = await prisma.$transaction([
      prisma.customer.update({
        where: { id: auth.id },
        data: { phone: normalizedPhone },
      }),
      prisma.order.updateMany({
        where: {
          customerId: auth.id,
          customerPhone: { in: oldPhones },
        },
        data: { customerPhone: normalizedPhone },
      }),
      prisma.installationRequest.updateMany({
        where: { customerPhone: { in: oldPhones } },
        data: { customerPhone: normalizedPhone },
      }),
      prisma.repairRequest.updateMany({
        where: { phone: { in: oldPhones } },
        data: { phone: normalizedPhone },
      }),
    ]);

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
    if (isUnauthorized(error)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const response = otpErrorResponseMessage(error);
    console.error("Phone change OTP verify error:", error);
    return NextResponse.json(response, { status: response.status });
  }
}
