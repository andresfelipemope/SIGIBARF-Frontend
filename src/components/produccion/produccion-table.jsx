"use client";

import { useState } from "react";
import { Search, Loader2, Factory, Calendar } from "lucide-react";

export default function ProduccionTable({ producciones, productos, loading }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Create a product map for easy lookup
  const productosMap = productos.reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {});

  const filteredItems = producciones.filter(item => {
    const p = productosMap[item.id_producto];
    const matchNombre = p?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchId = item.id.toString().includes(searchTerm);
    return matchNombre || matchId;
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-extrabold text-black flex items-center gap-2">
          <Factory className="size-5 text-green-600" />
          Historial de Producciones
        </h2>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID o producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-black placeholder-gray-400 focus:border-green-600 focus:bg-white focus:outline-hidden transition-all duration-200"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
              <th className="py-4 px-3">ID Prod.</th>
              <th className="py-4 px-3">Producto Final</th>
              <th className="py-4 px-3 text-right">Cantidad</th>
              <th className="py-4 px-3">Fecha de Producción</th>
              <th className="py-4 px-3">Fecha de Vencimiento</th>
              <th className="py-4 px-3 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <Loader2 className="size-8 animate-spin text-green-600 mx-auto" />
                  <p className="text-sm text-gray-500 mt-2 font-medium">Cargando historial...</p>
                </td>
              </tr>
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const producto = productosMap[item.id_producto];
                // Formatear la fecha de creación
                let formattedDate = "N/A";
                if (item.fecha_creacion) {
                  try {
                    const date = new Date(item.fecha_creacion);
                    if (!isNaN(date.getTime())) {
                      formattedDate = new Intl.DateTimeFormat('es-ES', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      }).format(date);
                    } else {
                      formattedDate = item.fecha_creacion;
                    }
                  } catch (e) {
                    formattedDate = item.fecha_creacion;
                  }
                }

                // Formatear la fecha de vencimiento
                let formattedVencimiento = "N/A";
                if (item.fecha_vencimiento) {
                  try {
                    const date = new Date(item.fecha_vencimiento);
                    if (!isNaN(date.getTime())) {
                      formattedVencimiento = new Intl.DateTimeFormat('es-ES', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      }).format(date);
                    } else {
                      formattedVencimiento = item.fecha_vencimiento;
                    }
                  } catch (e) {
                    formattedVencimiento = item.fecha_vencimiento;
                  }
                }

                return (
                  <tr key={item.id} className="transition-colors hover:bg-green-50/10">
                    <td className="py-4 px-3 text-xs font-bold text-gray-500">
                      #{item.id}
                    </td>
                    <td className="py-4 px-3 text-sm font-semibold text-black">
                      {producto ? producto.nombre : `Desconocido (ID: ${item.id_producto})`}
                    </td>
                    <td className="py-4 px-3 text-right text-sm font-extrabold text-green-700">
                      +{item.cantidad_producida}
                    </td>
                    <td className="py-4 px-3 text-sm font-medium text-gray-600 flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-gray-400" />
                      {formattedDate}
                    </td>
                    <td className="py-4 px-3 text-sm font-medium text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-gray-400" />
                        {formattedVencimiento}
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                        Completado
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <Factory className="size-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">No se encontraron producciones.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
