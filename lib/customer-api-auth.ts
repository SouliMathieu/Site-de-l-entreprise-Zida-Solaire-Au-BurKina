import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export async function getAuthenticatedCustomer(
  request: Request
) {
  const authHeader =
    request.headers.get("authorization");

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return null;
  }

  const secret =
    process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error(
      "NEXTAUTH_SECRET_NOT_CONFIGURED"
    );
  }

  try {
    const token =
      authHeader.slice("Bearer ".length);

    const { payload } =
      await jwtVerify(
        token,
        new TextEncoder().encode(secret)
      );

    if (
      payload.type !== "customer" ||
      typeof payload.id !== "string"
    ) {
      return null;
    }

    return prisma.customer.findUnique({
      where: {
        id: payload.id,
      },
    });
  } catch {
    return null;
  }
}
