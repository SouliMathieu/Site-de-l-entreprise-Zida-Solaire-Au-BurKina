// components/product/ProductFilterClient.tsx
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
    <form className="flex items-center gap-2 text-sm">
      <label htmlFor="categorie" className="text-slate-700">
        Catégorie
      </label>
      <select
        id="categorie"
        name="categorie"
        value={currentCategorie ?? ""}
        onChange={handleChange}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
      >
        <option value="">Toutes</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
    </form>
  );
}
