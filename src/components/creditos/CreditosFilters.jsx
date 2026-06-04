"use client";

import { Search, Filter, RotateCcw, Calendar, DollarSign } from "lucide-react";

const DEFAULT_FILTERS = {
  busqueda: "",
  estado: "Todos",
  fechaInicio: "",
  fechaFin: "",
};

export default function CreditosFilters({ filters, setFilters, onReset }) {
  const updateFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-green-600" />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Filtros</h3>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-green-700 transition active:scale-[0.98]"
        >
          <RotateCcw className="size-3" />
          Restablecer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
            <Search className="size-3.5" />
            Buscar
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Cliente o pedido..."
              value={filters.busqueda}
              onChange={(e) => updateFilter("busqueda", e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-4 text-sm focus:border-green-600 focus:outline-hidden"
            />
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
            <DollarSign className="size-3.5" />
            Estado
          </label>
          <select
            value={filters.estado}
            onChange={(e) => updateFilter("estado", e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm font-medium focus:border-green-600 focus:outline-hidden cursor-pointer"
          >
            <option value="Todos">Todos</option>
            <option value="activo">Activo</option>
            <option value="pagado">Pagado</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>

        {/* Fecha Inicio */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
            <Calendar className="size-3.5" />
            Fecha Inicio
          </label>
          <input
            type="date"
            value={filters.fechaInicio}
            onChange={(e) => updateFilter("fechaInicio", e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm focus:border-green-600 focus:outline-hidden"
          />
        </div>

        {/* Fecha Fin */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
            <Calendar className="size-3.5" />
            Fecha Fin
          </label>
          <input
            type="date"
            value={filters.fechaFin}
            onChange={(e) => updateFilter("fechaFin", e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm focus:border-green-600 focus:outline-hidden"
          />
        </div>
      </div>
    </div>
  );
}

export { DEFAULT_FILTERS };