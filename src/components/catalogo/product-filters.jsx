"use client";

import { Search, X } from "lucide-react";
import { CATEGORIES } from "@/data/products";

/**
 * ProductFilters — Barra de búsqueda + filtros por categoría.
 * @param {string} searchQuery - Texto de búsqueda actual
 * @param {function} onSearchChange - Callback cuando cambia la búsqueda
 * @param {string} activeCategory - Categoría activa actual
 * @param {function} onCategoryChange - Callback cuando cambia la categoría
 */
export default function ProductFilters({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Barra de búsqueda */}
      <div className="relative max-w-xl mx-auto w-full">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          id="search-products"
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-10 py-3 rounded-full border border-gray-200 bg-white shadow-sm text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Limpiar búsqueda"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filtros por categoría */}
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => onCategoryChange(cat.value)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
              activeCategory === cat.value
                ? "bg-green-600 text-white border-green-600 shadow-sm shadow-green-200"
                : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
