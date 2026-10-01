import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecret } from "@/lib/jwt-secret";

const BACKOFFICE_ROLES = new Set([
  "ADMIN",
  "MANAGER",
  "TECHNICIAN",
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const isAdminApi =
    pathname === "/api/admin" ||
    pathname.startsWith("/api/admin/");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const unauthorized = () => {
    if (isAdminApi) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    return NextResponse.redirect(
      new URL("/auth/signin", request.url)
    );
  };

  const forbidden = () => {
    if (isAdminApi) {
      return NextResponse.json(
        { error: "Accès interdit" },
        { status: 403 }
      );
    }

    return NextResponse.redirect(
      new URL("/auth/signin", request.url)
    );
  };

  const token =
    request.cookies.get("auth-token")?.value;

  if (!token) {
    return unauthorized();
  }

  try {
    const secret = new TextEncoder().encode(
      getJwtSecret()
    );

    const { payload } = await jwtVerify(
      token,
      secret
    );

    if (
      typeof payload.role !== "string" ||
      !BACKOFFICE_ROLES.has(payload.role)
    ) {
      return forbidden();
    }

    return NextResponse.next();
  } catch {
    return unauthorized();
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
