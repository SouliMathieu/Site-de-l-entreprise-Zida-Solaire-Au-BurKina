import {
  NextRequest,
  NextResponse,
} from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPin,
  pinAuthErrorResponse,
  validatePin,
  verifyEmailChallenge,
} from "@/lib/customer-pin-auth";

type ResetPayload = {
  customerId: string;
};

export async function POST(
  req: NextRequest
) {
  try {
    const {
      resetId,
      code,
      newPin,
      confirmPin,
    } = await req.json();

    if (
      !resetId ||
      !code ||
      !newPin
    ) {
      return NextResponse.json(
        {
          error:
            "Code et nouveau PIN requis",
        },
        { status: 400 }
      );
    }

    if (
      confirmPin !== undefined &&
      newPin !== confirmPin
    ) {
      return NextResponse.json(
        {
          error:
            "Les deux PIN ne correspondent pas",
        },
        { status: 400 }
      );
    }

    validatePin(newPin);

    const challenge =
      await verifyEmailChallenge({
        challengeId: resetId,
        code,
        purpose: "reset_pin",
      });

    const payload =
      challenge.payload as
        | ResetPayload
        | null;

    if (!payload?.customerId) {
      return NextResponse.json(
        {
          error:
            "Demande de réinitialisation invalide",
        },
        { status: 400 }
      );
    }

    const pinHash =
      await hashPin(newPin);

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

        await tx.customer.update({
          where: {
            id:
              payload.customerId,
          },
          data: {
            pinHash,
            pinFailedAttempts: 0,
            pinLockedUntil: null,
            emailVerifiedAt:
              new Date(),
          },
        });
      }
    );

    return NextResponse.json({
      message:
        "Votre nouveau PIN a bien été enregistré. Vous pouvez maintenant vous connecter.",
    });
  } catch (error) {
    const response =
      pinAuthErrorResponse(error);

    console.error(
      "PIN reset confirm error:",
      error
    );

    return NextResponse.json(
      { error: response.error },
      { status: response.status }
    );
  }
}
