"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormData {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  stock: number;
  imageUrl: string;
  shortDescription: string;
  isActive: boolean;
  isFeatured: boolean;
}

interface EditProductFormClientProps {
  product: ProductFormData;
  categories: CategoryOption[];
}

export function EditProductFormClient({
  product,
  categories,
}: EditProductFormClientProps) {
  const router = useRouter();

  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [price, setPrice] = useState<string>(String(product.price));
  const [stock, setStock] = useState<string>(String(product.stock));
  const [imageUrl, setImageUrl] = useState(product.imageUrl);
  const [shortDescription, setShortDescription] = useState(
    product.shortDescription
  );
  const [isActive, setIsActive] = useState(product.isActive);
  const [isFeatured, setIsFeatured] = useState(product.isFeatured);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setName(value);
    // on ne touche pas au slug automatiquement pour l'édition
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
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
        throw new Error(data?.error || "Erreur lors de la mise à jour.");
      }

      setMessage("Produit mis à jour.");
      setTimeout(() => {
        router.push("/admin/produits");
      }, 800);
    } catch (err: any) {
      setMessage(err?.message || "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer ce produit ? Cette action est définitive.")) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Erreur lors de la suppression.");
      }

      router.push("/admin/produits");
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
          Utilisé dans l’URL: /produits/{slug || "mon-produit"}.
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

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="rounded-md border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Supprimer le produit
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#e85f2f] disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}
