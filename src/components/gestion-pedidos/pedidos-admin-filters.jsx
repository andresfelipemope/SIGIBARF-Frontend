import { Search, Filter, RotateCcw, CreditCard } from "lucide-react";

export function PedidosAdminFilters({
  filters,
  updateFilter,
  clearFilters,
  onRefresh,
}) {
  const hasActive =
    filters.search ||
    filters.estado !== "todos" ||
    filters.usuarioId ||
    filters.soloCredito;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número, cliente o correo..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-black placeholder-gray-400 focus:border-green-600 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 min-w-[140px]">
            <Filter className="size-3.5 text-gray-400 shrink-0" />
            <select
              value={filters.estado}
              onChange={(e) => updateFilter("estado", e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-bold text-gray-700 cursor-pointer"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>

          <input
            type="number"
            placeholder="ID usuario"
            value={filters.usuarioId}
            onChange={(e) => updateFilter("usuarioId", e.target.value)}
            className="w-28 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-bold text-gray-700"
            title="Filtrar por ID de usuario"
          />

          <select
            value={filters.ordering}
            onChange={(e) => updateFilter("ordering", e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-bold text-gray-700 cursor-pointer"
          >
            <option value="fecha_desc">Más recientes</option>
            <option value="fecha_asc">Más antiguos</option>
          </select>

          <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-bold text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.soloCredito}
              onChange={(e) => updateFilter("soloCredito", e.target.checked)}
              className="accent-orange-500"
            />
            <CreditCard className="size-3.5 text-orange-500" />
            Con crédito
          </label>

          {hasActive && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100/70"
            >
              <RotateCcw className="size-3.5" />
              Limpiar
            </button>
          )}

          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-xs font-bold text-green-700 hover:bg-green-100/70"
          >
            <RotateCcw className="size-3.5" />
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}
