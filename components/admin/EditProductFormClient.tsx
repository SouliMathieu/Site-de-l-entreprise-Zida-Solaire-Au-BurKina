// components/admin/EditProductFormClient.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Product, Category } from "@prisma/client";
import { ImageUploader } from "./ImageUploader";

interface Props {
  product: Product & {
    category: { id: string; name: string } | null;
  };
  categories: Category[];
}

type Status = "idle" | "submitting" | "success" | "error";

export function EditProductFormClient({ product, categories }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(
    (product.images as string[]) || []
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const formData = new FormData(event.currentTarget);

    const payload = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      categoryId: formData.get("categoryId") as string,
      description: formData.get("description") as string,
      shortDescription: formData.get("shortDescription") as string,
      price: parseFloat(formData.get("price") as string),
      compareAtPrice: formData.get("compareAtPrice")
        ? parseFloat(formData.get("compareAtPrice") as string)
        : null,
      sku: formData.get("sku") as string,
      stock: parseInt(formData.get("stock") as string),
      lowStockThreshold: parseInt(formData.get("lowStockThreshold") as string),
      warranty: formData.get("warranty") as string,
      weight: formData.get("weight")
        ? parseFloat(formData.get("weight") as string)
        : null,
      isActive: formData.get("isActive") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      images: images,
    };

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Erreur serveur");
      }

      setStatus("success");
      setTimeout(() => {
        router.push("/admin/produits");
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
          Produit modifié avec succès !
        </h2>
        <p className="mt-2 text-green-700">Redirection vers la liste...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Informations de base */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Informations de base
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Nom du produit *
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={product.name}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Slug (URL) *
            </label>
            <input
              type="text"
              name="slug"
              required
              defaultValue={product.slug}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Catégorie *
            </label>
            <select
              name="categoryId"
              required
              defaultValue={product.categoryId || ""}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Description courte
            </label>
            <textarea
              name="shortDescription"
              rows={2}
              defaultValue={product.shortDescription || ""}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Description complète *
            </label>
            <textarea
              name="description"
              rows={6}
              required
              defaultValue={product.description || ""}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
        </div>
      </div>

      {/* Prix et stock */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Prix et stock
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Prix (FCFA) *
            </label>
            <input
              type="number"
              name="price"
              required
              step="0.01"
              defaultValue={product.price.toString()}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Prix barré (FCFA)
            </label>
            <input
              type="number"
              name="compareAtPrice"
              step="0.01"
              defaultValue={product.compareAtPrice?.toString() || ""}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              SKU *
            </label>
            <input
              type="text"
              name="sku"
              required
              defaultValue={product.sku || ""}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              required
              defaultValue={product.stock}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Seuil stock faible
            </label>
            <input
              type="number"
              name="lowStockThreshold"
              defaultValue={product.lowStockThreshold || 10}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
        </div>
      </div>

      {/* Détails produit */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Détails</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Garantie
            </label>
            <input
              type="text"
              name="warranty"
              defaultValue={product.warranty || ""}
              placeholder="Ex: 2 ans"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Poids (kg)
            </label>
            <input
              type="number"
              name="weight"
              step="0.01"
              defaultValue={product.weight?.toString() || ""}
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Images du produit
        </h2>
        <ImageUploader 
  images={images} 
  onImagesChange={setImages} 
/>

      </div>

      {/* Options */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Options</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              defaultChecked={product.isActive}
              className="h-4 w-4 rounded border-slate-300 text-orange-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
              Produit actif
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              id="isFeatured"
              defaultChecked={product.isFeatured}
              className="h-4 w-4 rounded border-slate-300 text-orange-500"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700">
              Produit en vedette
            </label>
          </div>
        </div>
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
          href="/admin/produits"
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
            : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}
