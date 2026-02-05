// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    console.log("📤 Upload API appelée");

    // Récupérer le FormData
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("❌ Aucun fichier fourni");
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    console.log("📁 Fichier reçu:", {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    });

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      console.error("❌ Type de fichier invalide:", file.type);
      return NextResponse.json(
        { error: "Le fichier doit être une image" },
        { status: 400 }
      );
    }

    // Vérifier la taille (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error("❌ Fichier trop volumineux:", file.size);
      return NextResponse.json(
        { error: "Le fichier dépasse 5MB" },
        { status: 400 }
      );
    }

    // Récupérer les variables d'environnement
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error("❌ Configuration Cloudinary manquante");
      console.error("CLOUD_NAME:", cloudName ? "✓" : "✗");
      console.error("UPLOAD_PRESET:", uploadPreset ? "✓" : "✗");
      return NextResponse.json(
        { error: "Configuration Cloudinary manquante" },
        { status: 500 }
      );
    }

    console.log("☁️ Cloud Name:", cloudName);
    console.log("🔑 Upload Preset:", uploadPreset);

    // Préparer les données pour Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("upload_preset", uploadPreset);
    cloudinaryFormData.append("folder", "zida-solaire/products");

    // URL Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log("🚀 Envoi vers:", cloudinaryUrl);

    // Envoyer à Cloudinary
    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: cloudinaryFormData,
    });

    console.log("📡 Status Cloudinary:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur Cloudinary:", errorText);
      
      // Parser l'erreur si c'est du JSON
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(
          { error: `Cloudinary: ${errorJson.error?.message || errorText}` },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { error: `Cloudinary: ${errorText}` },
          { status: response.status }
        );
      }
    }

    const data = (await response.json()) as CloudinaryResponse;
    console.log("✅ Upload réussi:", data.secure_url);

    return NextResponse.json({
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
    });
  } catch (error) {
    console.error("❌ Erreur serveur:", error);
    return NextResponse.json(
      { error: `Erreur serveur: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
