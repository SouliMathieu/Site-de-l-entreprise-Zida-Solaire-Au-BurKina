import {
  NextRequest,
  NextResponse,
} from "next/server";
import { prisma } from "@/lib/prisma";
import {
  customerPublicData,
  phoneLookupCandidates,
  PIN_SECURITY,
  pinAuthErrorResponse,
  signCustomerToken,
  validatePin,
  verifyPin,
} from "@/lib/customer-pin-auth";

export async function POST(
  req: NextRequest
) {
  try {
    const { phone, pin } =
      await req.json();

    if (!phone || !pin) {
      return NextResponse.json(
        {
          error:
            "Téléphone et PIN requis",
        },
        { status: 400 }
      );
    }

    const validPin = validatePin(pin);

    const customer =
      await prisma.customer.findFirst({
        where: {
          phone: {
            in: phoneLookupCandidates(
              phone
            ),
          },
        },
      });

    // Réponse volontairement générique.
    if (!customer) {
      return NextResponse.json(
        {
          error:
            "Numéro ou PIN incorrect",
        },
        { status: 401 }
      );
    }

    if (!customer.pinHash) {
      return NextResponse.json(
        {
          error:
            "Aucun PIN n'est encore activé pour ce compte",
          code: "PIN_NOT_SET",
        },
        { status: 409 }
      );
    }

    if (
      customer.pinLockedUntil &&
      customer.pinLockedUntil >
        new Date()
    ) {
      const seconds = Math.ceil(
        (customer.pinLockedUntil.getTime() -
          Date.now()) /
          1000
      );

      return NextResponse.json(
        {
          error:
            "Trop de tentatives. Réessayez plus tard.",
          retryAfter: seconds,
        },
        { status: 429 }
      );
    }

    const valid =
      await verifyPin(
        validPin,
        customer.pinHash
      );

    if (!valid) {
      const attempts =
        customer.pinFailedAttempts + 1;

      const shouldLock =
        attempts >=
        PIN_SECURITY.maxAttempts;

      await prisma.customer.update({
        where: {
          id: customer.id,
        },
        data: {
          pinFailedAttempts: attempts,
          pinLockedUntil: shouldLock
            ? new Date(
                Date.now() +
                  PIN_SECURITY.lockMinutes *
                    60 *
                    1000
              )
            : null,
        },
      });

      if (shouldLock) {
        return NextResponse.json(
          {
            error:
              "Trop de tentatives. Réessayez dans 15 minutes.",
            retryAfter:
              PIN_SECURITY.lockMinutes *
              60,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error:
            "Numéro ou PIN incorrect",
        },
        { status: 401 }
      );
    }

    if (
      customer.pinFailedAttempts !== 0 ||
      customer.pinLockedUntil
    ) {
      await prisma.customer.update({
        where: {
          id: customer.id,
        },
        data: {
          pinFailedAttempts: 0,
          pinLockedUntil: null,
        },
      });
    }

    const token =
      await signCustomerToken(
        customer
      );

    return NextResponse.json({
      user: customerPublicData(customer),
      token,
    });
  } catch (error) {
    const response =
      pinAuthErrorResponse(error);

    console.error(
      "Customer PIN login error:",
      error
    );

    return NextResponse.json(
      { error: response.error },
      { status: response.status }
    );
  }
}
