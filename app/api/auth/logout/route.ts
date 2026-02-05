import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Créer une réponse et supprimer le cookie dedans
  const response = NextResponse.json({ 
    success: true,
    message: "Déconnecté avec succès"
  });

  // Supprimer le cookie en passant par la réponse (plus fiable)
  response.cookies.set({
    name: "auth-token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  console.log("🔓 Logout réussi - Cookie supprimé");
  return response;
}
