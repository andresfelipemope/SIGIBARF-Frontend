"use client";

import { useState } from "react";
import { 
  Boxes, 
  AlertTriangle, 
  TrendingDown, 
  Coins, 
  Search, 
  Filter,
  Plus
} from "lucide-react";

export default function InventarioPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todos");

  const metrics = [
    { label: "Existencias Totales", value: "1,240.5 Kg", icon: Boxes, color: "text-green-700 bg-green-50 border-green-100" },
    { label: "Insumos en Alerta", value: "3 Ítems", icon: AlertTriangle, color: "text-rose-600 bg-rose-50 border-rose-100" },
    { label: "Mermas (Este Mes)", value: "18.4 Kg", icon: TrendingDown, color: "text-orange-600 bg-orange-50 border-orange-100" },
    { label: "Valor del Inventario", value: "$4,850 USD", icon: Coins, color: "text-emerald-700 bg-emerald-50 border-emerald-100" }
  ];

  const inventoryItems = [
    { id: "INS-001", name: "Carne de Res Premium (Lomo)", category: "Proteínas", stock: 350, minStock: 100, status: "suficiente" },
    { id: "INS-002", name: "Hígado de Pollo Fresco", category: "Vísceras", stock: 15, minStock: 30, status: "bajo" },
    { id: "INS-003", name: "Zanahoria Orgánica Rallada", category: "Vegetales", stock: 120, minStock: 40, status: "suficiente" },
    { id: "INS-004", name: "Corazón de Cerdo Selección", category: "Proteínas", stock: 210, minStock: 75, status: "suficiente" },
    { id: "INS-005", name: "Manzana Verde Sin Semilla", category: "Frutas", stock: 45, minStock: 20, status: "suficiente" },
    { id: "INS-006", name: "Aceite de Salmón Silvestre", category: "Suplementos", stock: 8, minStock: 15, status: "bajo" },
    { id: "INS-007", name: "Vísceras de Res Mezcladas", category: "Vísceras", stock: 290, minStock: 80, status: "suficiente" },
    { id: "INS-008", name: "Calcio de Hueso Micro-molido", category: "Suplementos", stock: 0, minStock: 10, status: "agotado" },
  ];

  // Filtering Logic
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "todos" || item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in text-black">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Inventario de Insumos
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Control de materias primas para formulaciones y preparación de lotes BARF.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all duration-200">
          <Plus className="size-4" />
          Registrar Insumo
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {m.label}
              </span>
              <div className={`flex size-10 items-center justify-center rounded-xl border ${m.color}`}>
                <m.icon className="size-5" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-black mt-4">
              {m.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Table Filters & Actions */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar insumo por nombre o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-black placeholder-gray-400 focus:border-green-600 focus:bg-white focus:outline-hidden transition-all duration-200"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-500">Filtro:</span>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-green-50/20 transition-colors focus:outline-hidden"
            >
              <option value="todos">Todos los Grupos</option>
              <option value="proteínas">Proteínas</option>
              <option value="vísceras">Vísceras</option>
              <option value="vegetales">Vegetales</option>
              <option value="frutas">Frutas</option>
              <option value="suplementos">Suplementos</option>
            </select>
          </div>
        </div>

        {/* Inventory List Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-3">Código</th>
                <th className="py-4 px-3">Insumo</th>
                <th className="py-4 px-3">Categoría</th>
                <th className="py-4 px-3 text-right">Cant. Disponible</th>
                <th className="py-4 px-3 text-right">Mínimo Crítico</th>
                <th className="py-4 px-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-green-50/10 transition-colors group">
                    <td className="py-4 px-3 text-xs font-bold text-green-700">
                      {item.id}
                    </td>
                    <td className="py-4 px-3 text-sm font-semibold text-black">
                      {item.name}
                    </td>
                    <td className="py-4 px-3">
                      <span className="inline-flex items-center rounded-lg bg-green-50/30 px-2.5 py-0.5 text-xs font-bold text-green-700 border border-green-100">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right text-sm font-bold text-black">
                      {item.stock} Kg
                    </td>
                    <td className="py-4 px-3 text-right text-xs font-semibold text-gray-400">
                      {item.minStock} Kg
                    </td>
                    <td className="py-4 px-3 text-center">
                      {item.status === "suficiente" && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                          Suficiente
                        </span>
                      )}
                      {item.status === "bajo" && (
                        <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-100 animate-pulse">
                          Stock Bajo
                        </span>
                      )}
                      {item.status === "agotado" && (
                        <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-100">
                          Agotado
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs font-medium text-gray-500">
                    No se encontraron insumos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
