"use client";

import { Search, Filter, X } from "lucide-react";

export default function FormulacionFilters({
  searchTerm,
  setSearchTerm,
  selectedProductFilter,
  setSelectedProductFilter,
  productos,
  selectedIngredientFilter,
  setSelectedIngredientFilter,
  ingredientes,
  onReset,
}) {
  const hasActiveFilters = searchTerm || selectedProductFilter !== "todos" || selectedIngredientFilter !== "todos";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Búsqueda */}
        <div className="flex-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Producto, ingrediente o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
        </div>

        {}
        <div className="w-full md:w-48">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Producto
          </label>
          <select
            value={selectedProductFilter}
            onChange={(e) => setSelectedProductFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
          >
            <option value="todos">Todos</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {}
        <div className="w-full md:w-48">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Ingrediente
          </label>
          <select
            value={selectedIngredientFilter}
            onChange={(e) => setSelectedIngredientFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
          >
            <option value="todos">Todos</option>
            {ingredientes.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.nombre}
              </option>
            ))}
          </select>
        </div>

        {}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="size-3.5" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}