import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { deleteCustomerAccount } from "@/lib/customer-account-deletion";
import { getJwtSecret } from "@/lib/jwt-secret";

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const token = authHeader.slice("Bearer ".length).trim();
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecret())
    );

    if (payload.type !== "customer" || !payload.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const result = await deleteCustomerAccount(String(payload.id));

    return NextResponse.json({
      message: "Votre compte et vos données personnelles ont été supprimés.",
      ...result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CUSTOMER_NOT_FOUND") {
      return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });
    }

    console.error("Delete customer account error:", error);
    return NextResponse.json(
      { error: "Impossible de supprimer le compte pour le moment" },
      { status: 500 }
    );
  }
}
