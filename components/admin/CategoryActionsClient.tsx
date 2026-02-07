// components/admin/CategoryActionsClient.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";

interface Props {
  categoryId: string;
  categoryName: string;
  productCount: number;
}

export function CategoryActionsClient({
  categoryId,
  categoryName,
  productCount,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (
      !confirm(
        productCount > 0
          ? `Impossible de supprimer directement : ${productCount} produit(s) utilisent cette catégorie.`
          : `Supprimer définitivement la catégorie "${categoryName}" ?`
      )
    ) {
      return;
    }

    if (productCount > 0) {
      // On ne tente pas la suppression, on laisse le message d'alerte
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la suppression.");
      }

      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/categories/${categoryId}`}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-semibold hover:bg-orange-100 transition-colors"
      >
        <Pencil className="w-3 h-3" />
        Modifier
      </Link>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Trash2 className="w-3 h-3" />
        )}
        Supprimer
      </button>
      {error && (
        <p className="text-xs text-red-500 mt-1 text-right max-w-xs">{error}</p>
      )}
    </div>
  );
}
