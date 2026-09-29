import { createHmac, randomInt, randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { SignJWT } from "jose";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const PIN_MAX_ATTEMPTS = 5;
const PIN_LOCK_MINUTES = 15;

const EMAIL_CODE_TTL_MS = 10 * 60 * 1000;
const EMAIL_RESEND_DELAY_MS = 60 * 1000;
const EMAIL_CODE_MAX_ATTEMPTS = 5;

export type EmailChallengePurpose = "register" | "reset_pin";

const FORBIDDEN_PINS = new Set([
  "0000",
  "1111",
  "1234",
  "4321",
]);

function getSecret() {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("NEXTAUTH_SECRET_NOT_CONFIGURED");
  }

  return secret;
}

export function normalizePhone(value: string) {
  const digits = String(value || "").replace(/\D/g, "");

  if (!digits) {
    throw new Error("INVALID_PHONE");
  }

  if (digits.startsWith("226") && digits.length === 11) {
    return `+${digits}`;
  }

  if (digits.length === 8) {
    return `+226${digits}`;
  }

  if (
    String(value).trim().startsWith("+") &&
    digits.length >= 8 &&
    digits.length <= 15
  ) {
    return `+${digits}`;
  }

  throw new Error("INVALID_PHONE");
}

export function phoneLookupCandidates(value: string) {
  const normalized = normalizePhone(value);
  const digits = normalized.replace(/\D/g, "");
  const local = digits.startsWith("226") ? digits.slice(3) : digits;

  return Array.from(
    new Set([
      String(value).trim(),
      normalized,
      digits,
      local,
    ])
  );
}

export async function findCustomerByPhone(value: string) {
  const customers =
    await prisma.customer.findMany({
      where: {
        phone: {
          in: phoneLookupCandidates(value),
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  if (customers.length === 0) {
    return null;
  }

  // Compatibilité avec d'anciens doublons :
  // privilégier la fiche qui possède déjà un PIN,
  // puis celle dont l'email est vérifié.
  return (
    customers.find(
      (customer) => Boolean(customer.pinHash)
    ) ??
    customers.find(
      (customer) =>
        Boolean(customer.emailVerifiedAt)
    ) ??
    customers[0]
  );
}

export function normalizeEmail(value: string) {
  const email = String(value || "").trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("INVALID_EMAIL");
  }

  return email;
}

export function validatePin(pin: string) {
  const value = String(pin || "").trim();

  if (!/^\d{4}$/.test(value)) {
    throw new Error("INVALID_PIN");
  }

  if (FORBIDDEN_PINS.has(value)) {
    throw new Error("WEAK_PIN");
  }

  return value;
}

function pinValueWithPepper(pin: string) {
  return `${pin}:${getSecret()}`;
}

export async function hashPin(pin: string) {
  const validPin = validatePin(pin);

  return bcrypt.hash(
    pinValueWithPepper(validPin),
    12
  );
}

export async function verifyPin(
  pin: string,
  hash: string
) {
  try {
    const validPin = validatePin(pin);

    return bcrypt.compare(
      pinValueWithPepper(validPin),
      hash
    );
  } catch {
    return false;
  }
}

export async function signCustomerToken(customer: {
  id: string;
  phone: string;
}) {
  return new SignJWT({
    id: customer.id,
    phone: customer.phone,
    type: "customer",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(
      new TextEncoder().encode(getSecret())
    );
}

export function customerPublicData(customer: {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  address: string | null;
  city: string;
}) {
  return {
    id: customer.id,
    name: `${customer.firstName} ${customer.lastName}`.trim(),
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
  };
}

export function maskEmail(value: string) {
  const [name, domain] = value.split("@");

  if (!name || !domain) {
    return value;
  }

  const visible =
    name.length <= 2
      ? name[0]
      : name.slice(0, 2);

  return `${visible}${"*".repeat(
    Math.max(2, name.length - visible.length)
  )}@${domain}`;
}

function hashEmailCode(
  challengeId: string,
  email: string,
  purpose: EmailChallengePurpose,
  code: string
) {
  return createHmac(
    "sha256",
    getSecret()
  )
    .update(
      `${challengeId}:${email}:${purpose}:${code}`
    )
    .digest("hex");
}

async function sendEmailCode(
  email: string,
  code: string,
  purpose: EmailChallengePurpose
) {
  const apiKey =
    process.env.RESEND_API_KEY?.trim();

  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim();

  if (
    (!apiKey || !fromEmail) &&
    process.env.NODE_ENV !== "production"
  ) {
    return {
      delivered: false,
      devCode: code,
    };
  }

  if (!apiKey || !fromEmail) {
    throw new Error(
      "EMAIL_PROVIDER_NOT_CONFIGURED"
    );
  }

  const resend = new Resend(apiKey);

  const subject =
    purpose === "register"
      ? "Votre code de vérification ZIDA SOLAIRE"
      : "Réinitialisation de votre PIN ZIDA SOLAIRE";

  const title =
    purpose === "register"
      ? "Vérification de votre compte"
      : "Réinitialisation de votre PIN";

  const intro =
    purpose === "register"
      ? "Utilisez ce code pour confirmer votre adresse email et créer votre compte ZIDA SOLAIRE."
      : "Utilisez ce code pour choisir un nouveau PIN dans l'application ZIDA SOLAIRE.";

  const result = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#17324d">
        <h2 style="margin-bottom:8px">${title}</h2>

        <p style="line-height:1.6">
          ${intro}
        </p>

        <div style="
          font-size:32px;
          font-weight:800;
          letter-spacing:8px;
          padding:18px;
          margin:24px 0;
          text-align:center;
          border-radius:12px;
          background:#f4f7fa;
        ">
          ${code}
        </div>

        <p style="line-height:1.6">
          Ce code expire dans 10 minutes et ne peut être utilisé qu'une seule fois.
        </p>

        <p style="font-size:13px;color:#687887">
          Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
        </p>

        <p style="margin-top:24px">
          ZIDA SOLAIRE
        </p>
      </div>
    `,
  });

  if (result.error) {
    console.error(
      "Resend error:",
      result.error
    );

    throw new Error("EMAIL_DELIVERY_FAILED");
  }

  return {
    delivered: true,
  };
}

export async function createEmailChallenge(params: {
  email: string;
  phone?: string;
  purpose: EmailChallengePurpose;
  payload?: Record<string, unknown>;
}) {
  const email = normalizeEmail(params.email);

  const recent =
    await prisma.customerEmailChallenge.findFirst({
      where: {
        email,
        purpose: params.purpose,
        consumedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  if (
    recent &&
    Date.now() - recent.createdAt.getTime() <
      EMAIL_RESEND_DELAY_MS
  ) {
    const remaining =
      EMAIL_RESEND_DELAY_MS -
      (Date.now() -
        recent.createdAt.getTime());

    const retryAfter = Math.max(
      1,
      Math.ceil(remaining / 1000)
    );

    throw new Error(
      `EMAIL_RATE_LIMIT:${retryAfter}`
    );
  }

  const challengeId = randomUUID();
  const code = String(
    randomInt(100000, 1000000)
  );

  const expiresAt = new Date(
    Date.now() + EMAIL_CODE_TTL_MS
  );

  await prisma.customerEmailChallenge.create({
    data: {
      id: challengeId,
      purpose: params.purpose,
      email,
      phone: params.phone || null,
      codeHash: hashEmailCode(
        challengeId,
        email,
        params.purpose,
        code
      ),
      payload:
        params.payload &&
        Object.keys(params.payload).length > 0
          ? (params.payload as Prisma.InputJsonValue)
          : undefined,
      expiresAt,
    },
  });

  try {
    const delivery = await sendEmailCode(
      email,
      code,
      params.purpose
    );

    return {
      challengeId,
      email,
      maskedEmail: maskEmail(email),
      expiresIn: Math.floor(
        EMAIL_CODE_TTL_MS / 1000
      ),
      ...(delivery.devCode
        ? { devCode: delivery.devCode }
        : {}),
    };
  } catch (error) {
    await prisma.customerEmailChallenge
      .delete({
        where: {
          id: challengeId,
        },
      })
      .catch(() => undefined);

    throw error;
  }
}

export async function verifyEmailChallenge(params: {
  challengeId: string;
  code: string;
  purpose: EmailChallengePurpose;
}) {
  const challenge =
    await prisma.customerEmailChallenge.findUnique({
      where: {
        id: params.challengeId,
      },
    });

  if (
    !challenge ||
    challenge.purpose !== params.purpose ||
    challenge.consumedAt
  ) {
    throw new Error("EMAIL_CODE_INVALID");
  }

  if (
    challenge.expiresAt.getTime() <
    Date.now()
  ) {
    throw new Error("EMAIL_CODE_EXPIRED");
  }

  if (
    challenge.attempts >=
    EMAIL_CODE_MAX_ATTEMPTS
  ) {
    throw new Error(
      "EMAIL_CODE_TOO_MANY_ATTEMPTS"
    );
  }

  const expected = hashEmailCode(
    challenge.id,
    challenge.email,
    params.purpose,
    String(params.code || "").trim()
  );

  if (expected !== challenge.codeHash) {
    await prisma.customerEmailChallenge.update({
      where: {
        id: challenge.id,
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    throw new Error("EMAIL_CODE_INVALID");
  }

  return challenge;
}

export function pinAuthErrorResponse(
  error: unknown
) {
  const message =
    error instanceof Error
      ? error.message
      : "";

  if (message === "INVALID_PHONE") {
    return {
      status: 400,
      error: "Numéro de téléphone invalide",
    };
  }

  if (message === "INVALID_EMAIL") {
    return {
      status: 400,
      error: "Adresse email invalide",
    };
  }

  if (message === "INVALID_PIN") {
    return {
      status: 400,
      error:
        "Le PIN doit contenir exactement 4 chiffres",
    };
  }

  if (message === "WEAK_PIN") {
    return {
      status: 400,
      error:
        "Choisissez un PIN moins facile à deviner",
    };
  }

  if (
    message.startsWith(
      "EMAIL_RATE_LIMIT:"
    )
  ) {
    return {
      status: 429,
      error:
        "Veuillez patienter avant de demander un nouveau code",
      retryAfter:
        Number(message.split(":")[1]) ||
        60,
    };
  }

  if (
    message === "EMAIL_CODE_INVALID"
  ) {
    return {
      status: 400,
      error:
        "Code de vérification incorrect",
    };
  }

  if (
    message === "EMAIL_CODE_EXPIRED"
  ) {
    return {
      status: 400,
      error:
        "Ce code a expiré. Demandez un nouveau code.",
    };
  }

  if (
    message ===
    "EMAIL_CODE_TOO_MANY_ATTEMPTS"
  ) {
    return {
      status: 429,
      error:
        "Trop de tentatives. Demandez un nouveau code.",
    };
  }

  if (
    message ===
    "EMAIL_PROVIDER_NOT_CONFIGURED"
  ) {
    return {
      status: 503,
      error:
        "Le service email n'est pas encore configuré",
    };
  }

  if (
    message === "EMAIL_DELIVERY_FAILED"
  ) {
    return {
      status: 502,
      error:
        "Impossible d'envoyer l'email pour le moment",
    };
  }

  if (
    message ===
    "NEXTAUTH_SECRET_NOT_CONFIGURED"
  ) {
    return {
      status: 500,
      error:
        "Configuration de sécurité incomplète",
    };
  }

  return {
    status: 500,
    error:
      "Une erreur est survenue. Veuillez réessayer.",
  };
}

export const PIN_SECURITY = {
  maxAttempts: PIN_MAX_ATTEMPTS,
  lockMinutes: PIN_LOCK_MINUTES,
};
