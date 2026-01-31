// components/product/ProductCard.tsx
import Link from "next/link";

type ProductWithCategory = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  lowStockThreshold: number;
  images: unknown;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
  };
};

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage =
    (Array.isArray(product.images) && (product.images as string[])[0]) || "";

  const isLowStock =
    product.stock <= product.lowStockThreshold && product.stock > 0;

  return (
    <Link
      href={`/produits/${product.slug}`}
      className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-40 w-full bg-slate-100">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            Image à venir
          </div>
        )}

        {product.isFeatured && (
          <span className="absolute left-2 top-2 rounded-full bg-[#FF6B35] px-2 py-1 text-[10px] font-semibold uppercase text-white">
            Vedette
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {product.category.name}
        </p>

        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
          {product.name}
        </h3>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-bold text-slate-900">
            {product.price.toLocaleString("fr-FR")} FCFA
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-slate-400 line-through">
              {product.compareAtPrice.toLocaleString("fr-FR")} FCFA
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Stock: {product.stock}
          </span>
          <StockBadge stock={product.stock} isLowStock={isLowStock} />
        </div>
      </div>
    </Link>
  );
}

function StockBadge({
  stock,
  isLowStock,
}: {
  stock: number;
  isLowStock: boolean;
}) {
  if (stock <= 0) {
    return (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
        Rupture de stock
      </span>
    );
  }

  if (isLowStock) {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
        Stock limité
      </span>
    );
  }

  return (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
      En stock
    </span>
  );
}
