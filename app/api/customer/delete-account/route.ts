import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { Prisma } from "@prisma/client";
import { deleteCustomerAccount } from "@/lib/customer-account-deletion";
import { getJwtSecret } from "@/lib/jwt-secret";

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Session absente. Déconnectez-vous puis reconnectez-vous." },
        { status: 401 }
      );
    }

    const token = authHeader.slice("Bearer ".length).trim();

    let payload: Awaited<ReturnType<typeof jwtVerify>>["payload"];

    try {
      ({ payload } = await jwtVerify(
        token,
        new TextEncoder().encode(getJwtSecret())
      ));
    } catch (error) {
      console.error("Delete account auth error:", error);
      return NextResponse.json(
        {
          error:
            "Votre session n'est plus valide. Déconnectez-vous, reconnectez-vous, puis réessayez la suppression.",
        },
        { status: 401 }
      );
    }

    if (payload.type !== "customer" || !payload.id) {
      return NextResponse.json(
        {
          error:
            "Votre session doit être renouvelée. Déconnectez-vous puis reconnectez-vous.",
        },
        { status: 401 }
      );
    }

    const result = await deleteCustomerAccount(String(payload.id));

    return NextResponse.json({
      message: "Votre compte et vos données personnelles ont été supprimés.",
      ...result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CUSTOMER_NOT_FOUND") {
      return NextResponse.json(
        { error: "Ce compte n'existe plus ou a déjà été supprimé." },
        { status: 404 }
      );
    }

    console.error("Delete customer account error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          {
            error:
              "Suppression bloquée par une donnée encore liée au compte (code ZIDA-DEL-P2003).",
          },
          { status: 409 }
        );
      }

      if (error.code === "P2021" || error.code === "P2022") {
        return NextResponse.json(
          {
            error:
              `La base de données doit être mise à jour avant la suppression (code ZIDA-DEL-${error.code}).`,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          error: `Erreur de suppression des données (code ZIDA-DEL-${error.code}).`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Impossible de supprimer le compte pour le moment (code ZIDA-DEL-500).",
      },
      { status: 500 }
    );
  }
}
