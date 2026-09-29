import {
  NextRequest,
  NextResponse,
} from "next/server";
import { prisma } from "@/lib/prisma";
import {
  customerPublicData,
  pinAuthErrorResponse,
  signCustomerToken,
  verifyEmailChallenge,
} from "@/lib/customer-pin-auth";

type RegistrationPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  pinHash: string;
};

export async function POST(
  req: NextRequest
) {
  try {
    const { challengeId, code } =
      await req.json();

    if (!challengeId || !code) {
      return NextResponse.json(
        {
          error:
            "Code de vérification requis",
        },
        { status: 400 }
      );
    }

    const challenge =
      await verifyEmailChallenge({
        challengeId,
        code,
        purpose: "register",
      });

    const payload =
      challenge.payload as
        | RegistrationPayload
        | null;

    if (
      !payload?.firstName ||
      !payload?.lastName ||
      !payload?.email ||
      !payload?.phone ||
      !payload?.pinHash
    ) {
      return NextResponse.json(
        {
          error:
            "Demande d'inscription invalide",
        },
        { status: 400 }
      );
    }

    const customer =
      await prisma.$transaction(
        async (tx) => {
          const consumed =
            await tx.customerEmailChallenge.updateMany(
              {
                where: {
                  id: challenge.id,
                  consumedAt: null,
                },
                data: {
                  consumedAt:
                    new Date(),
                },
              }
            );

          if (
            consumed.count !== 1
          ) {
            throw new Error(
              "EMAIL_CODE_INVALID"
            );
          }

          const existing =
            await tx.customer.findFirst({
              where: {
                OR: [
                  {
                    phone:
                      payload.phone,
                  },
                  {
                    email: {
                      equals:
                        payload.email,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            });

          if (existing) {
            throw new Error(
              "ACCOUNT_ALREADY_EXISTS"
            );
          }

          return tx.customer.create({
            data: {
              firstName:
                payload.firstName,
              lastName:
                payload.lastName,
              email: payload.email,
              phone: payload.phone,
              address:
                payload.address ||
                "",
              city:
                payload.city ||
                "Ouagadougou",
              pinHash:
                payload.pinHash,
              emailVerifiedAt:
                new Date(),
              pinFailedAttempts: 0,
              pinLockedUntil: null,
            },
          });
        }
      );

    const token =
      await signCustomerToken(
        customer
      );

    return NextResponse.json(
      {
        message:
          "Votre compte ZIDA est prêt.",
        user:
          customerPublicData(
            customer
          ),
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "ACCOUNT_ALREADY_EXISTS"
    ) {
      return NextResponse.json(
        {
          error:
            "Un compte existe déjà avec ces informations",
        },
        { status: 409 }
      );
    }

    const response =
      pinAuthErrorResponse(error);

    console.error(
      "Customer registration verification error:",
      error
    );

    return NextResponse.json(
      { error: response.error },
      { status: response.status }
    );
  }
}
