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

    const phoneCandidates =
      phoneLookupCandidates(phone);

    const [phoneCustomer, emailCustomer] =
      await Promise.all([
        prisma.customer.findFirst({
          where: {
            phone: {
              in: phoneCandidates,
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.customer.findFirst({
          where: {
            email: {
              equals: normalizedEmail,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
      ]);

    const isActiveAccount = (customer: {
      pinHash: string | null;
      emailVerifiedAt: Date | null;
    }) =>
      Boolean(customer.pinHash) ||
      Boolean(customer.emailVerifiedAt);

    // Un véritable compte déjà activé ne doit jamais pouvoir être repris
    // depuis le flux d'inscription.
    if (
      (phoneCustomer &&
        isActiveAccount(phoneCustomer)) ||
      (emailCustomer &&
        isActiveAccount(emailCustomer))
    ) {
      return NextResponse.json(
        {
          error:
            "Un compte existe déjà avec ce téléphone ou cet email",
        },
        { status: 409 }
      );
    }

    // Si l'adresse email appartient à une autre fiche client inactive,
    // on évite de fusionner silencieusement deux historiques distincts.
    if (
      emailCustomer &&
      phoneCustomer &&
      emailCustomer.id !== phoneCustomer.id
    ) {
      return NextResponse.json(
        {
          error:
            "Cette adresse email est déjà associée à une autre fiche client",
        },
        { status: 409 }
      );
    }

    let existingCustomerId:
      | string
      | undefined;

    if (phoneCustomer) {
      // Une commande passée sans compte peut avoir créé une fiche client
      // uniquement à partir du numéro de téléphone. Cette fiche est
      // récupérable même si l'utilisateur souhaite maintenant utiliser une
      // autre adresse email. La nouvelle adresse devra être confirmée par le
      // code à 6 chiffres avant que le compte ne soit activé.
      existingCustomerId =
        phoneCustomer.id;
    } else if (emailCustomer) {
      // Cas plus rare : une fiche inactive existe seulement avec cette
      // adresse email. On ne la récupère que si elle porte déjà le même
      // numéro normalisé, afin d'éviter toute fusion inattendue.
      const samePhone =
        phoneCandidates.includes(
          emailCustomer.phone
        ) ||
        emailCustomer.phone ===
          normalizedPhone;

      if (!samePhone) {
        return NextResponse.json(
          {
            error:
              "Cette adresse email est déjà associée à une autre fiche client",
          },
          { status: 409 }
        );
      }

      existingCustomerId =
        emailCustomer.id;
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
