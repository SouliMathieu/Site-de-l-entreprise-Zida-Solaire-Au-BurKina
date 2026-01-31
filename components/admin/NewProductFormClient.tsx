"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CategoryOption {
  id: string;
  name: string;
}

interface NewProductFormClientProps {
  categories: CategoryOption[];
}

export function NewProductFormClient({ categories }: NewProductFormClientProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState(
    categories[0]?.id ?? ""
  );
  const [price, setPrice] = useState<string>("0");
  const [stock, setStock] = useState<string>("0");
  const [imageUrl, setImageUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setName(value);
    if (!slug) {
      const s = value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setSlug(s);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          categoryId,
          price: Number(price),
          stock: Number(stock),
          imageUrl: imageUrl || null,
          shortDescription,
          isActive,
          isFeatured,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Erreur lors de la création.");
      }

      setMessage("Produit créé avec succès.");
      // Retour à la liste après une petite pause
      setTimeout(() => {
        router.push("/admin/produits");
      }, 800);
    } catch (err: any) {
      setMessage(err?.message || "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      {message && (
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
          {message}
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700">
          Nom du produit *
        </label>
        <input
          type="text"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700">
          Slug (URL)
        </label>
        <input
          type="text"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <p className="mt-1 text-[11px] text-slate-500">
          Sera utilisé dans l’URL: /produits/{slug || "mon-produit"}.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700">
          Catégorie *
        </label>
        <select
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Prix (FCFA) *
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Stock *
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700">
          URL image principale
        </label>
        <input
          type="text"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
        />
        <p className="mt-1 text-[11px] text-slate-500">
          Pour le MVP, collez simplement une URL d’image (Cloudinary ou autre).
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700">
          Description courte
        </label>
        <textarea
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={3}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-4 text-xs">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span>Produit actif (visible sur le site)</span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <span>Produit en vedette</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#e85f2f] disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "Enregistrement..." : "Créer le produit"}
      </button>
    </form>
  );
}
