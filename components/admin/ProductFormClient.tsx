// components/admin/ProductFormClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, Category } from "@prisma/client";

interface Props {
  categories: Category[];
  product?: Product | null;
}

type Status = "idle" | "submitting" | "success" | "error";

export function ProductFormClient({ categories, product }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!product;

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
      images: (formData.get("images") as string)
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
    };

    try {
      const url = isEdit
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
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
        router.push("/admin/produits");
      }, 1500);
    } catch (e) {
      console.error(e);
      setError("Une erreur est survenue. Veuillez réessayer.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-lg font-semibold text-emerald-800">
          {isEdit ? "Produit modifié" : "Produit créé"} avec succès !
        </p>
        <p className="mt-2 text-sm text-emerald-700">
          Redirection vers la liste...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {/* Informations de base */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Informations de base
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-800"
            >
              Nom du produit <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={product?.name}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-slate-800"
            >
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              name="slug"
              required
              defaultValue={product?.slug}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-slate-800"
          >
            Catégorie <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={product?.categoryId}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="shortDescription"
            className="block text-sm font-medium text-slate-800"
          >
            Description courte
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            rows={2}
            defaultValue={product?.shortDescription || ""}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-800"
          >
            Description complète <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            defaultValue={product?.description}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
          />
        </div>
      </div>

      {/* Prix et stock */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <h2 className="text-lg font-semibold text-slate-900">Prix et stock</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-slate-800"
            >
              Prix (FCFA) <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              required
              defaultValue={product?.price ? Number(product.price) : ""}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="compareAtPrice"
              className="block text-sm font-medium text-slate-800"
            >
              Prix barré (FCFA)
            </label>
            <input
              id="compareAtPrice"
              name="compareAtPrice"
              type="number"
              step="0.01"
              defaultValue={
                product?.compareAtPrice ? Number(product.compareAtPrice) : ""
              }
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="sku"
              className="block text-sm font-medium text-slate-800"
            >
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              id="sku"
              name="sku"
              required
              defaultValue={product?.sku}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-slate-800"
            >
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              required
              defaultValue={product?.stock ?? 0}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="lowStockThreshold"
              className="block text-sm font-medium text-slate-800"
            >
              Seuil stock faible
            </label>
            <input
              id="lowStockThreshold"
              name="lowStockThreshold"
              type="number"
              defaultValue={product?.lowStockThreshold ?? 5}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Détails produit */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <h2 className="text-lg font-semibold text-slate-900">Détails</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label
              htmlFor="warranty"
              className="block text-sm font-medium text-slate-800"
            >
              Garantie
            </label>
            <input
              id="warranty"
              name="warranty"
              defaultValue={product?.warranty || ""}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-slate-800"
            >
              Poids (kg)
            </label>
            <input
              id="weight"
              name="weight"
              type="number"
              step="0.01"
              defaultValue={product?.weight ? Number(product.weight) : ""}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="images"
            className="block text-sm font-medium text-slate-800"
          >
            URLs des images (une par ligne)
          </label>
          <textarea
            id="images"
            name="images"
            rows={4}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            defaultValue={
              product?.images
                ? (product.images as string[]).join("\n")
                : ""
            }
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
          />
          <p className="text-xs text-slate-500">
            URLs Cloudinary ou autre CDN, une par ligne
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <h2 className="text-lg font-semibold text-slate-900">Options</h2>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={product?.isActive ?? true}
              className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-slate-700">
              Produit actif
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={product?.isFeatured ?? false}
              className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-slate-700">
              Produit en vedette
            </span>
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "submitting"
            ? "Enregistrement..."
            : isEdit
            ? "Enregistrer les modifications"
            : "Créer le produit"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/produits")}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
