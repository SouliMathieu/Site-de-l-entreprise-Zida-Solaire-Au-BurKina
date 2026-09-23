import { createHash, randomInt, randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_DELAY_MS = 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

function getSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not configured");
  return secret;
}

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) throw new Error("INVALID_PHONE");

  if (digits.startsWith("226") && digits.length === 11) return `+${digits}`;
  if (digits.length === 8) return `+226${digits}`;
  if (value.trim().startsWith("+") && digits.length >= 8 && digits.length <= 15) return `+${digits}`;

  throw new Error("INVALID_PHONE");
}

function hashCode(challengeId: string, phone: string, code: string) {
  return createHash("sha256")
    .update(`${challengeId}:${phone}:${code}:${getSecret()}`)
    .digest("hex");
}

async function sendOtpSms(phone: string, code: string) {
  const message = `ZIDA SOLAIRE : votre code de vérification est ${code}. Il expire dans 5 minutes.`;
  const webhookUrl = process.env.SMS_OTP_WEBHOOK_URL;

  if (!webhookUrl) {
    if (process.env.NODE_ENV !== "production") {
      return { delivered: false, devCode: code };
    }
    throw new Error("OTP_PROVIDER_NOT_CONFIGURED");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.SMS_OTP_WEBHOOK_TOKEN
        ? { Authorization: `Bearer ${process.env.SMS_OTP_WEBHOOK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({ phone, message, code }),
  });

  if (!response.ok) throw new Error("OTP_DELIVERY_FAILED");
  return { delivered: true };
}

export async function createOtpChallenge(rawPhone: string, purpose: "login" | "register") {
  const phone = normalizePhone(rawPhone);
  const recent = await prisma.customerOtpChallenge.findFirst({
    where: { phone, purpose, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (recent && Date.now() - recent.createdAt.getTime() < OTP_RESEND_DELAY_MS) {
    const retryAfter = Math.ceil((OTP_RESEND_DELAY_MS - (Date.now() - recent.createdAt.getTime())) / 1000);
    throw new Error(`OTP_RATE_LIMIT:${retryAfter}`);
  }

  const id = randomUUID();
  const code = String(randomInt(100000, 1000000));
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.customerOtpChallenge.create({
    data: {
      id,
      phone,
      purpose,
      codeHash: hashCode(id, phone, code),
      expiresAt,
    },
  });

  try {
    const delivery = await sendOtpSms(phone, code);
    return {
      challengeId: id,
      phone,
      expiresIn: Math.floor(OTP_TTL_MS / 1000),
      ...(delivery.devCode ? { devCode: delivery.devCode } : {}),
    };
  } catch (error) {
    await prisma.customerOtpChallenge.delete({ where: { id } }).catch(() => undefined);
    throw error;
  }
}

export async function verifyOtpChallenge(params: {
  challengeId: string;
  rawPhone: string;
  code: string;
  purpose: "login" | "register";
}) {
  const phone = normalizePhone(params.rawPhone);
  const challenge = await prisma.customerOtpChallenge.findUnique({ where: { id: params.challengeId } });

  if (!challenge || challenge.phone !== phone || challenge.purpose !== params.purpose || challenge.consumedAt) {
    throw new Error("OTP_INVALID");
  }
  if (challenge.expiresAt.getTime() < Date.now()) throw new Error("OTP_EXPIRED");
  if (challenge.attempts >= OTP_MAX_ATTEMPTS) throw new Error("OTP_TOO_MANY_ATTEMPTS");

  const expected = hashCode(challenge.id, phone, params.code.trim());
  if (expected !== challenge.codeHash) {
    await prisma.customerOtpChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });
    throw new Error("OTP_INVALID");
  }

  await prisma.customerOtpChallenge.update({
    where: { id: challenge.id },
    data: { consumedAt: new Date() },
  });

  return { phone };
}

export function otpErrorResponseMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message === "INVALID_PHONE") return { status: 400, error: "Numéro de téléphone invalide" };
  if (message.startsWith("OTP_RATE_LIMIT:")) return { status: 429, error: "Veuillez patienter avant de demander un nouveau code", retryAfter: Number(message.split(":")[1]) || 60 };
  if (message === "OTP_INVALID") return { status: 400, error: "Code de vérification incorrect" };
  if (message === "OTP_EXPIRED") return { status: 400, error: "Code expiré. Demandez un nouveau code." };
  if (message === "OTP_TOO_MANY_ATTEMPTS") return { status: 429, error: "Trop de tentatives. Demandez un nouveau code." };
  if (message === "OTP_PROVIDER_NOT_CONFIGURED") return { status: 503, error: "Service SMS non configuré" };
  if (message === "OTP_DELIVERY_FAILED") return { status: 502, error: "Impossible d'envoyer le SMS pour le moment" };
  return { status: 500, error: "Erreur du service de vérification" };
}
