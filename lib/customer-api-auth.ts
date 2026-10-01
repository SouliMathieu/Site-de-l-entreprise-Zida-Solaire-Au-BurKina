import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { getJwtSecret } from "@/lib/jwt-secret";

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
    new TextEncoder().encode(
      getJwtSecret()
    );

  try {
    const token =
      authHeader.slice("Bearer ".length);

    const { payload } =
      await jwtVerify(
        token,
        secret
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
