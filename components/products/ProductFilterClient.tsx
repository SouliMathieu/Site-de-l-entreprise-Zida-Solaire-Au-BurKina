// components/products/ProductFilterClient.tsx
"use client";

interface ProductFilterClientProps {
  currentCategorie?: string;
  categories: { id: string; slug: string; name: string }[];
}

export function ProductFilterClient({
  currentCategorie,
  categories,
}: ProductFilterClientProps) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const url = value ? `/produits?categorie=${value}` : "/produits";
    window.location.href = url;
  }

  return (
    <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
      <label
        htmlFor="category-filter"
        className="mb-3 block text-sm font-semibold text-slate-700"
      >
        Filtrer par catégorie
      </label>
      <select
        id="category-filter"
        value={currentCategorie || ""}
        onChange={handleChange}
        className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-900 shadow-sm transition-all hover:border-emerald-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      >
        <option value="">Toutes les catégories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
