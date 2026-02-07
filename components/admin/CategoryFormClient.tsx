// components/admin/CategoryFormClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Category } from "@prisma/client";
import { Loader2 } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  category?: Category | null;
}

export function CategoryFormClient({ category }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!category;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const formData = new FormData(event.currentTarget);

    const payload = {
      name: (formData.get("name") as string)?.trim(),
      slug: (formData.get("slug") as string)?.trim(),
      description: (formData.get("description") as string) || "",
      order: Number(formData.get("order")) || 0,
      isActive: formData.get("isActive") === "on",
    };

    try {
      const url = isEdit
        ? `/api/admin/categories/${category!.id}`
        : "/api/admin/categories";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Erreur serveur");
      }

      setStatus("success");
      setTimeout(() => {
        router.push("/admin/categories");
        router.refresh();
      }, 1200);
    } catch (e: any) {
      console.error(e);
      setError(
        e instanceof Error
          ? e.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-6 text-center shadow-sm">
        <h3 className="text-lg font-semibold mb-2">
          {isEdit ? "Catégorie modifiée" : "Catégorie créée"} avec succès ✅
        </h3>
        <p className="text-sm text-green-700">
          Redirection vers la liste des catégories...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
    >
      {/* Titre */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Les catégories sont affichées selon l’ordre (du plus petit au plus grand).
          </p>
        </div>
        <Link
          href="/admin/categories"
          className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
        >
          ← Retour aux catégories
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Nom de la catégorie <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            defaultValue={category?.name ?? ""}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm"
            placeholder="Ex : Panneaux Solaires"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Slug (URL) <span className="text-red-500">*</span>
          </label>
          <input
            name="slug"
            type="text"
            required
            defaultValue={category?.slug ?? ""}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm"
            placeholder="Ex : panneaux-solaires"
          />
          <p className="text-xs text-gray-500">
            Utilisé dans l’URL : <code>/produits?categorie=slug</code>
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={category?.description ?? ""}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm resize-none"
          placeholder="Courte description de la catégorie..."
        />
      </div>

      {/* Ordre + actif */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Ordre d’affichage <span className="text-red-500">*</span>
          </label>
          <input
            name="order"
            type="number"
            required
            min={0}
            defaultValue={category?.order ?? 0}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm"
          />
          <p className="text-xs text-gray-500">
            Les catégories sont triées du plus petit au plus grand ordre.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-6 md:mt-8">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            defaultChecked={category?.isActive ?? true}
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
            Catégorie active
          </label>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Boutons */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/admin/categories"
          className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-md hover:shadow-lg hover:bg-orange-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "submitting" && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          {status === "submitting"
            ? "Enregistrement..."
            : isEdit
            ? "Enregistrer les modifications"
            : "Créer la catégorie"}
        </button>
      </div>
    </form>
  );
}
