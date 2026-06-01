"use client";

import { 
  Search, 
  Filter, 
  Calendar, 
  RefreshCw 
} from "lucide-react";

export default function HistorialFilters({ filters, setFilters, onReset }) {
  
  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-black placeholder-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none transition-all font-medium h-10";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all duration-200 hover:border-green-100">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5 items-end">
        
        {/* Buscar por Nombre */}
        <div className="sm:col-span-2 md:col-span-1">
          <label className={labelClass}>Buscar por Nombre</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Ej. Pollo, Balanceado..." 
              value={filters.nombre} 
              onChange={e => handleInputChange("nombre", e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Filtrar por Tipo de Registro */}
        <div>
          <label className={labelClass}>Tipo de Registro</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select 
              value={filters.tipo} 
              onChange={e => handleInputChange("tipo", e.target.value)}
              className={`${inputClass} pl-10 appearance-none`}
            >
              <option value="Todos">Todos los tipos</option>
              <option value="Ingrediente">Ingrediente</option>
              <option value="Producto">Producto</option>
            </select>
          </div>
        </div>

        {/* Filtrar por Tipo de Movimiento */}
        <div>
          <label className={labelClass}>Tipo de Movimiento</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select 
              value={filters.movimiento} 
              onChange={e => handleInputChange("movimiento", e.target.value)}
              className={`${inputClass} pl-10 appearance-none`}
            >
              <option value="Todos">Todos los movimientos</option>
              <option value="ENTRADA">ENTRADA</option>
              <option value="SALIDA">SALIDA</option>
              <option value="AJUSTE">AJUSTE</option>
            </select>
          </div>
        </div>

        {/* Filtrar por Rango de Fechas */}
        <div className="sm:col-span-2 md:col-span-2 grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>Fecha Inicio</label>
            <div className="relative">
              <input 
                type="date" 
                value={filters.fechaInicio} 
                onChange={e => handleInputChange("fechaInicio", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Fecha Fin</label>
            <div className="relative">
              <input 
                type="date" 
                value={filters.fechaFin} 
                onChange={e => handleInputChange("fechaFin", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Botón de limpiar filtros en caso de que haya filtros activos */}
      {(filters.nombre || filters.tipo !== "Todos" || filters.movimiento !== "Todos" || filters.fechaInicio || filters.fechaFin) && (
        <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
          <button 
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition active:scale-[0.98]"
          >
            <RefreshCw className="size-3.5" /> Limpiar Filtros
          </button>
        </div>
      )}
    </div>
  );
}
