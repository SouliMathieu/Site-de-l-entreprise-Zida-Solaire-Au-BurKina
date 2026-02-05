// components/admin/ImageUploader.tsx
"use client";

import { useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";

interface Props {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function ImageUploader({ images, onImagesChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    console.log("📁 Fichiers sélectionnés:", files.length);
    setUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        console.log("📤 Upload de:", file.name);
        
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        console.log("📡 Réponse pour", file.name, ":", res.status);

        if (!res.ok) {
          const errorData = await res.json();
          console.error("❌ Erreur:", errorData);
          throw new Error(errorData.error || "Upload failed");
        }

        const data = await res.json();
        console.log("✅ URL:", data.url);
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      console.log("✅ Tous les uploads terminés:", uploadedUrls);
      onImagesChange([...images, ...uploadedUrls]);
    } catch (err) {
      console.error("❌ Erreur upload:", err);
      setError((err as Error).message || "Erreur lors de l'upload. Veuillez réessayer.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }

  return (
    <div className="space-y-4">
      {/* Zone d'upload */}
      <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition-all hover:border-orange-500 hover:bg-orange-50">
        <label className="flex cursor-pointer flex-col items-center gap-2">
          {uploading ? (
            <div className="flex items-center gap-2 text-orange-600">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="font-medium">Upload en cours...</span>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-slate-400" />
              <div className="text-center">
                <p className="font-semibold text-slate-700">
                  Cliquez pour uploader des images
                </p>
                <p className="text-sm text-slate-500">
                  PNG, JPG, WEBP jusqu'à 5MB
                </p>
              </div>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Preview des images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((url, index) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-slate-300 bg-slate-100 shadow-md transition-all hover:shadow-xl"
            >
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 shadow-lg transition-opacity hover:bg-red-600 group-hover:opacity-100"
                aria-label="Supprimer"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-orange-500 py-1 text-center text-xs font-bold text-white">
                  Principale
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      {images.length > 0 && (
        <p className="text-center text-sm text-slate-600">
          Glissez-déposez les images pour changer l'ordre (prochainement). La
          première image est l'image principale.
        </p>
      )}
    </div>
  );
}
