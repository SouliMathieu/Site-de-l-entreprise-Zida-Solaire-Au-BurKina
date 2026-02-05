// components/admin/CategoryFormClient.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Category } from "@prisma/client";

interface Props {
  category?: Category | null;
}

type Status = "idle" | "submitting" | "success" | "error";

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
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      order: parseInt(formData.get("order") as string),
      isActive: formData.get("isActive") === "on",
    };

    try {
      const url = isEdit
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Erreur serveur");
      }

      setStatus("success");
      setTimeout(() => {
        router.push("/admin/categories");
        router.refresh();
      }, 1500);
    } catch (e) {
      console.error(e);
      setError("Une erreur est survenue. Veuillez réessayer.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-green-50 p-8 text-center">
        <h2 className="text-2xl font-semibold text-green-900">
          {isEdit ? "Catégorie modifiée" : "Catégorie créée"} avec succès !
        </h2>
        <p className="mt-2 text-green-700">Redirection vers la liste...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nom */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Nom de la catégorie *
        </label>
        <input
          type="text"
          name="name"
          required
          defaultValue={category?.name || ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Slug (URL)
        </label>
        <input
          type="text"
          name="slug"
          defaultValue={category?.slug || ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={category?.description || ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>

      {/* Ordre */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Ordre d'affichage *
        </label>
        <input
          type="number"
          name="order"
          required
          defaultValue={category?.order || 0}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
        />
        <p className="mt-1 text-sm text-slate-500">
          Les catégories seront affichées du plus petit au plus grand ordre
        </p>
      </div>

      {/* Active */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          defaultChecked={category?.isActive ?? true}
          className="h-4 w-4 rounded border-slate-300 text-orange-500"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
          Catégorie active
        </label>
      </div>

      {/* Erreur */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Boutons */}
      <div className="flex justify-end gap-3">
        <Link
          href="/admin/categories"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:bg-slate-300"
        >
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
