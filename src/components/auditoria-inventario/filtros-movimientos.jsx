import * as React from "react";
import { Search, Filter, RotateCcw, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export function FiltrosMovimientos({
  searchTerm,
  setSearchTerm,
  tipoFilter,
  setTipoFilter,
  productoFilter,
  setProductoFilter,
  fechaFilter,
  setFechaFilter,
  clearFilters,
  productos,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Input de Búsqueda Semántica */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID, producto o comentarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-black placeholder-gray-400 focus:border-green-600 focus:bg-white focus:outline-hidden transition-all duration-200"
          />
        </div>

        {/* Filtros Dropdown / Fecha */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Tipo de Movimiento */}
          <div className="flex items-center gap-1.5 min-w-[140px]">
            <Filter className="size-3.5 text-gray-400 shrink-0" />
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-green-50/20 transition-colors focus:outline-hidden cursor-pointer"
            >
              <option value="todos">Todos los Tipos</option>
              <option value="ENTRADA">Entradas</option>
              <option value="SALIDA">Salidas</option>
              <option value="AJUSTE">Ajustes</option>
            </select>
          </div>

          {/* Producto */}
          <div className="flex items-center gap-1.5 min-w-[160px]">
            <select
              value={productoFilter}
              onChange={(e) => setProductoFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-green-50/20 transition-colors focus:outline-hidden cursor-pointer max-w-[200px]"
            >
              <option value="todos">Todos los Productos</option>
              {productos.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="flex items-center gap-1.5 min-w-[150px]">
            <Calendar className="size-3.5 text-gray-400 shrink-0" />
            <input
              type="date"
              value={fechaFilter}
              onChange={(e) => setFechaFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-bold text-gray-700 focus:outline-hidden hover:bg-green-50/20 transition-all cursor-pointer"
            />
          </div>

          {/* Botón de Reseteo */}
          {(searchTerm || tipoFilter !== "todos" || productoFilter !== "todos" || fechaFilter) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100/70 transition-all duration-200"
              title="Limpiar filtros"
            >
              <RotateCcw className="size-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
