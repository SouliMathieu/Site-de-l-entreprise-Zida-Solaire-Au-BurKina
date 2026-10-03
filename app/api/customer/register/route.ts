import {
  NextRequest,
  NextResponse,
} from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createEmailChallenge,
  hashPin,
  normalizeEmail,
  normalizePhone,
  phoneLookupCandidates,
  pinAuthErrorResponse,
  validatePin,
} from "@/lib/customer-pin-auth";

export async function POST(
  req: NextRequest
) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      pin,
      confirmPin,
    } = await req.json();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !pin
    ) {
      return NextResponse.json(
        {
          error:
            "Prénom, nom, téléphone, email et PIN requis",
        },
        { status: 400 }
      );
    }

    if (
      confirmPin !== undefined &&
      pin !== confirmPin
    ) {
      return NextResponse.json(
        {
          error:
            "Les deux PIN ne correspondent pas",
        },
        { status: 400 }
      );
    }

    const normalizedPhone =
      normalizePhone(phone);

    const normalizedEmail =
      normalizeEmail(email);

    validatePin(pin);

    const existing =
      await prisma.customer.findFirst({
        where: {
          OR: [
            {
              phone: {
                in: phoneLookupCandidates(
                  phone
                ),
              },
            },
            {
              email: {
                equals:
                  normalizedEmail,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

    let existingCustomerId:
      | string
      | undefined;

    if (existing) {
      const hasActiveAccount =
        Boolean(existing.pinHash) ||
        Boolean(existing.emailVerifiedAt);

      const samePhone =
        phoneLookupCandidates(phone).includes(
          existing.phone
        ) ||
        existing.phone === normalizedPhone;

      const sameEmail =
        Boolean(existing.email) &&
        existing.email!.trim().toLowerCase() ===
          normalizedEmail;

      if (hasActiveAccount) {
        return NextResponse.json(
          {
            error:
              "Un compte existe déjà avec ce téléphone ou cet email",
          },
          { status: 409 }
        );
      }

      // Une fiche client peut avoir été créée lors d'une commande passée
      // sans compte. On ne la réactive que si le téléphone ET l'email
      // correspondent, puis l'email sera vérifié avant activation.
      if (!samePhone || !sameEmail) {
        return NextResponse.json(
          {
            error:
              "Un compte ou une fiche client utilise déjà ce téléphone ou cet email",
          },
          { status: 409 }
        );
      }

      existingCustomerId =
        existing.id;
    }

    const pinHash =
      await hashPin(pin);

    const challenge =
      await createEmailChallenge({
        email: normalizedEmail,
        phone: normalizedPhone,
        purpose: "register",
        payload: {
          firstName:
            String(firstName).trim(),
          lastName:
            String(lastName).trim(),
          email: normalizedEmail,
          phone: normalizedPhone,
          address: address
            ? String(address).trim()
            : "",
          city: city
            ? String(city).trim()
            : "Ouagadougou",
          pinHash,
          ...(existingCustomerId
            ? { existingCustomerId }
            : {}),
        },
      });

    return NextResponse.json({
      message:
        "Un code de vérification a été envoyé à votre adresse email.",
      challengeId:
        challenge.challengeId,
      email: challenge.maskedEmail,
      expiresIn: challenge.expiresIn,
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
      "Customer registration request error:",
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
