import {
  randomUUID,
} from "crypto";
import {
  NextRequest,
  NextResponse,
} from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createEmailChallenge,
  normalizeEmail,
  phoneLookupCandidates,
  pinAuthErrorResponse,
} from "@/lib/customer-pin-auth";

export async function POST(
  req: NextRequest
) {
  try {
    const { identifier } =
      await req.json();

    if (
      !identifier ||
      !String(identifier).trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Téléphone ou email requis",
        },
        { status: 400 }
      );
    }

    const value =
      String(identifier).trim();

    let customer = null;

    if (value.includes("@")) {
      try {
        const email =
          normalizeEmail(value);

        customer =
          await prisma.customer.findFirst({
            where: {
              email: {
                equals: email,
                mode: "insensitive",
              },
            },
          });
      } catch {
        customer = null;
      }
    } else {
      try {
        customer =
          await prisma.customer.findFirst({
            where: {
              phone: {
                in: phoneLookupCandidates(
                  value
                ),
              },
            },
          });
      } catch {
        customer = null;
      }
    }

    // Toujours répondre de façon similaire
    // pour ne pas révéler l'existence
    // d'un compte.
    if (
      !customer ||
      !customer.email
    ) {
      return NextResponse.json({
        message:
          "Si un compte correspond à ces informations, un code a été envoyé à l'adresse email enregistrée.",
        resetId: randomUUID(),
        expiresIn: 600,
      });
    }

    const challenge =
      await createEmailChallenge({
        email: customer.email,
        phone: customer.phone,
        purpose: "reset_pin",
        payload: {
          customerId:
            customer.id,
        },
      });

    return NextResponse.json({
      message:
        "Si un compte correspond à ces informations, un code a été envoyé à l'adresse email enregistrée.",
      resetId:
        challenge.challengeId,
      expiresIn: 600,
      ...(challenge.devCode
        ? {
            devCode:
              challenge.devCode,
          }
        : {}),
    });
  } catch (error) {
    const response =
      pinAuthErrorResponse(error);

    console.error(
      "PIN reset request error:",
      error
    );

    return NextResponse.json(
      {
        error: response.error,
        ...("retryAfter" in response
          ? {
              retryAfter:
                response.retryAfter,
            }
          : {}),
      },
      {
        status: response.status,
      }
    );
  }
}
