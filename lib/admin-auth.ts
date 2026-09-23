import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export type AdminAuth = {
  id: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "TECHNICIAN";
};

function getJwtSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export async function requireAdminAuth(req: NextRequest): Promise<AdminAuth> {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) throw new Error("UNAUTHORIZED");

  const { payload } = await jwtVerify(token, getJwtSecret());
  if (
    typeof payload.id !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.role !== "string" ||
    !["ADMIN", "MANAGER", "TECHNICIAN"].includes(payload.role)
  ) {
    throw new Error("UNAUTHORIZED");
  }

  return {
    id: payload.id,
    email: payload.email,
    role: payload.role as AdminAuth["role"],
  };
}

export function isAdminUnauthorized(error: unknown) {
  return error instanceof Error && error.message === "UNAUTHORIZED";
}
