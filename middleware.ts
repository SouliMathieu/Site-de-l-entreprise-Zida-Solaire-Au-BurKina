import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "your-secret-key-change-this"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protéger les routes /admin
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth-token")?.value;

    console.log("🔍 Middleware check:");
    console.log("   Pathname:", pathname);
    console.log("   Token existe:", !!token);

    if (!token) {
      console.log("   ❌ PAS DE TOKEN - Redirection /auth/signin");
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      console.log("   ✅ TOKEN VALIDE");
      return NextResponse.next();
    } catch (error) {
      console.log("   ❌ TOKEN INVALIDE -", error);
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
