// components/products/ProductFilterClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, SlidersHorizontal, ChevronDown, Filter, TrendingUp, DollarSign, Package } from "lucide-react";

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface ProductFiltersProps {
  categories: Category[];
  minPrice: number;
  maxPrice: number;
  initialFilters?: {
    categorie?: string;
    stock?: string;
    prixMin?: string;
    prixMax?: string;
    tri?: string;
  };
}

export function ProductFilters({ 
  categories, 
  minPrice, 
  maxPrice,
  initialFilters = {}
}: ProductFiltersProps) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [priceRange, setPriceRange] = useState({
    min: Number(initialFilters.prixMin) || minPrice,
    max: Number(initialFilters.prixMax) || maxPrice,
  });

  const currentCategory = initialFilters.categorie || "";
  const currentStock = initialFilters.stock || "";
  const currentSort = initialFilters.tri || "";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function buildUrl(updates: Record<string, string>) {
    const params = new URLSearchParams();
    
    if (currentCategory) params.set("categorie", currentCategory);
    if (currentStock) params.set("stock", currentStock);
    if (currentSort) params.set("tri", currentSort);
    if (priceRange.min !== minPrice) params.set("prixMin", priceRange.min.toString());
    if (priceRange.max !== maxPrice) params.set("prixMax", priceRange.max.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    const queryString = params.toString();
    return queryString ? `/produits?${queryString}` : "/produits";
  }

  function applyFilters() {
    const url = buildUrl({
      prixMin: priceRange.min !== minPrice ? priceRange.min.toString() : "",
      prixMax: priceRange.max !== maxPrice ? priceRange.max.toString() : "",
    });
    router.push(url);
  }

  function resetFilters() {
    setPriceRange({ min: minPrice, max: maxPrice });
    router.push("/produits");
  }

  const activeFiltersCount = [
    currentCategory,
    currentStock,
    priceRange.min !== minPrice || priceRange.max !== maxPrice,
  ].filter(Boolean).length;

  if (!isMounted) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-xl"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-white to-orange-50/30 rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm">
      {/* Header avec dégradé */}
      <div className="bg-gradient-to-r from-primary/5 via-orange-50/50 to-primary/5 p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Section gauche - Filtres button */}
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-gradient-to-br from-primary to-orange-600 p-2.5 rounded-xl shadow-lg shadow-primary/20">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Filtrer & Trier</h3>
              <p className="text-sm text-gray-600">Trouvez le produit idéal</p>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-between gap-3 px-5 py-3 bg-white rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md group"
          >
            <span className="font-semibold text-gray-700 group-hover:text-primary transition-colors">
              {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
            </span>
            {activeFiltersCount > 0 && (
              <span className="bg-gradient-to-r from-primary to-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} />
          </button>

          {/* Section droite - Tri */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">Trier:</span>
            </div>
            <select
              value={currentSort}
              onChange={(e) => router.push(buildUrl({ tri: e.target.value }))}
              className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 cursor-pointer hover:border-primary/40 shadow-sm"
            >
              <option value="">✨ Pertinence</option>
              <option value="prix-asc">💰 Prix croissant</option>
              <option value="prix-desc">💎 Prix décroissant</option>
              <option value="nouveautes">🆕 Nouveautés</option>
              <option value="populaires">🔥 Plus populaires</option>
              <option value="meilleures-ventes">⭐ Meilleures ventes</option>
            </select>

            {/* Reset Button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 group"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline">Réinitialiser</span>
              </button>
            )}
          </div>
        </div>

        {/* Filtres actifs - Chips stylés */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200/50">
            {currentCategory && (
              <span className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-orange-600 text-white rounded-full text-sm font-medium shadow-lg shadow-primary/30 hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
                <span>📁 {categories.find(c => c.slug === currentCategory)?.name}</span>
                <button
                  onClick={() => router.push(buildUrl({ categorie: "" }))}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {currentStock && (
              <span className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-medium shadow-lg shadow-green-500/30 hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
                <span>✅ En stock</span>
                <button
                  onClick={() => router.push(buildUrl({ stock: "" }))}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {(priceRange.min !== minPrice || priceRange.max !== maxPrice) && (
              <span className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
                <span>💵 {priceRange.min.toLocaleString()} - {priceRange.max.toLocaleString()} FCFA</span>
                <button
                  onClick={() => {
                    setPriceRange({ min: minPrice, max: maxPrice });
                    router.push(buildUrl({ prixMin: "", prixMax: "" }));
                  }}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Panneau de filtres détaillés */}
      <div 
        className={`transition-all duration-500 ease-in-out ${
          showFilters ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 lg:max-h-[600px] lg:opacity-100"
        } overflow-hidden`}
      >
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Catégorie */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-1.5 rounded-lg">
                  <Package className="w-4 h-4 text-purple-600" />
                </div>
                Catégorie
              </label>
              <div className="relative">
                <select
                  value={currentCategory}
                  onChange={(e) => router.push(buildUrl({ categorie: e.target.value }))}
                  className="w-full pl-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 cursor-pointer hover:border-purple-300 shadow-sm appearance-none group-hover:shadow-md"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 pointer-events-none" />
              </div>
            </div>

            {/* Disponibilité */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <div className="bg-gradient-to-br from-green-100 to-emerald-200 p-1.5 rounded-lg">
                  <Package className="w-4 h-4 text-green-600" />
                </div>
                Disponibilité
              </label>
              <div className="relative">
                <select
                  value={currentStock}
                  onChange={(e) => router.push(buildUrl({ stock: e.target.value }))}
                  className="w-full pl-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 cursor-pointer hover:border-green-300 shadow-sm appearance-none group-hover:shadow-md"
                >
                  <option value="">Tous les produits</option>
                  <option value="disponible">✅ En stock uniquement</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
              </div>
            </div>

            {/* Prix minimum */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-1.5 rounded-lg">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                Prix minimum
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={minPrice}
                  max={priceRange.max}
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  onBlur={applyFilters}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 shadow-sm group-hover:shadow-md"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">FCFA</span>
              </div>
              <div className="mt-1.5 text-xs text-gray-500 font-medium">
                Min: {minPrice.toLocaleString()} FCFA
              </div>
            </div>

            {/* Prix maximum */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-1.5 rounded-lg">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                </div>
                Prix maximum
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={priceRange.min}
                  max={maxPrice}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  onBlur={applyFilters}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 hover:border-orange-300 shadow-sm group-hover:shadow-md"
                  placeholder="1000000"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">FCFA</span>
              </div>
              <div className="mt-1.5 text-xs text-gray-500 font-medium">
                Max: {maxPrice.toLocaleString()} FCFA
              </div>
            </div>
          </div>

          {/* Barre de progression du prix (optionnel mais joli) */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-600 mb-2">
              <span>Fourchette de prix</span>
              <span className="text-primary">{priceRange.min.toLocaleString()} - {priceRange.max.toLocaleString()} FCFA</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary via-orange-500 to-orange-600 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((priceRange.max - priceRange.min) / (maxPrice - minPrice)) * 100}%`,
                  marginLeft: `${((priceRange.min - minPrice) / (maxPrice - minPrice)) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
