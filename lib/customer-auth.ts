import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export type CustomerAuth = {
  id: string;
  phone: string;
  type: "customer";
};

function getJwtSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export async function requireCustomerAuth(req: NextRequest): Promise<CustomerAuth> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const { payload } = await jwtVerify(token, getJwtSecret());
  if (payload.type !== "customer" || typeof payload.id !== "string" || typeof payload.phone !== "string") {
    throw new Error("UNAUTHORIZED");
  }

  return {
    id: payload.id,
    phone: payload.phone,
    type: "customer",
  };
}

export function isUnauthorized(error: unknown) {
  return error instanceof Error && error.message === "UNAUTHORIZED";
}
