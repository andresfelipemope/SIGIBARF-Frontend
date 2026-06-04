"use client";

import {
  Beef,
  ShoppingBag,
  ArrowDownLeft,
  ArrowUpRight,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistorialTable({ data = [], loading = false }) {
  // Format Date in standard es-ES format (DD/MM/YYYY HH:MM)
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;

      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();

      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return dateStr;
    }
  };

  // Render Skeleton rows for loading state
  const renderSkeletons = () => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <tr key={idx} className="border-b border-gray-100">
        <td className="py-4 px-3">
          <Skeleton className="h-4 w-28 rounded-lg bg-gray-100" />
        </td>
        <td className="py-4 px-3">
          <Skeleton className="h-5 w-24 rounded-full bg-gray-100" />
        </td>
        <td className="py-4 px-3">
          <Skeleton className="h-4 w-40 rounded-lg bg-gray-100" />
        </td>
        <td className="py-4 px-3">
          <Skeleton className="h-5 w-20 rounded-full bg-gray-100" />
        </td>
        <td className="py-4 px-3 text-right">
          <Skeleton className="h-4 w-12 rounded-lg bg-gray-100 ml-auto" />
        </td>
        <td className="py-4 px-3 text-right">
          <Skeleton className="h-4 w-12 rounded-lg bg-gray-100 ml-auto" />
        </td>
        <td className="py-4 px-3 text-right">
          <Skeleton className="h-4 w-12 rounded-lg bg-gray-100 ml-auto" />
        </td>
        <td className="py-4 px-3">
          <Skeleton className="h-4 w-32 rounded-lg bg-gray-100" />
        </td>
      </tr>
    ));
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all duration-200 hover:border-green-100">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
              <th className="py-4 px-3">Fecha</th>
              <th className="py-4 px-3">Tipo Registro</th>
              <th className="py-4 px-3">Nombre</th>
              <th className="py-4 px-3">Movimiento</th>
              <th className="py-4 px-3 text-right">Cantidad</th>
              <th className="py-4 px-3 text-right">Stock Anterior</th>
              <th className="py-4 px-3 text-right">Stock Posterior</th>
              <th className="py-4 px-3">Comentarios</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              renderSkeletons()
            ) : data.length > 0 ? (
              data.map((item) => {
                // Determine registry badge styling
                const isIngrediente = item.registroTipo === "Ingrediente";
                const registryBadge = isIngrediente ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-bold text-green-700 border border-green-100">
                    <Beef className="size-2.5" /> Ingrediente
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-100">
                    <ShoppingBag className="size-2.5" /> Producto
                  </span>
                );

                // Determine movement badge styling
                let movementBadge;
                if (item.tipo_movimiento === "ENTRADA") {
                  movementBadge = (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100/70 px-2.5 py-0.5 text-[10px] font-extrabold text-green-800 border border-green-200">
                      <ArrowDownLeft className="size-2.5" /> ENTRADA
                    </span>
                  );
                } else if (item.tipo_movimiento === "SALIDA") {
                  movementBadge = (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100/70 px-2.5 py-0.5 text-[10px] font-extrabold text-orange-800 border border-orange-200">
                      <ArrowUpRight className="size-2.5" /> SALIDA
                    </span>
                  );
                } else {
                  movementBadge = (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-extrabold text-gray-700 border border-gray-200">
                      <HelpCircle className="size-2.5" /> AJUSTE
                    </span>
                  );
                }

                // Format numbers elegantly
                const fmtQty = Number(item.cantidad).toLocaleString("es-ES");
                const fmtStockAnt = Number(item.stock_anterior).toLocaleString(
                  "es-ES",
                );
                const fmtStockPos = Number(item.stock_posterior).toLocaleString(
                  "es-ES",
                );

                return (
                  <tr
                    key={item.uniqueId}
                    className="hover:bg-green-50/10 transition-colors group"
                  >
                    {/* Fecha */}
                    <td className="py-4 px-3 text-sm font-semibold text-gray-600 group-hover:text-black transition-colors">
                      {formatDate(item.fecha)}
                    </td>

                    {/* Tipo Registro */}
                    <td className="py-4 px-3">{registryBadge}</td>

                    {/* Nombre */}
                    <td className="py-4 px-3 text-sm font-bold text-black">
                      {item.nombre}
                    </td>

                    {/* Tipo Movimiento */}
                    <td className="py-4 px-3">{movementBadge}</td>

                    {/* Cantidad */}
                    <td className="py-4 px-3 text-right text-sm font-bold text-black">
                      {fmtQty}
                    </td>

                    {/* Stock Anterior */}
                    <td className="py-4 px-3 text-right text-xs font-semibold text-gray-400">
                      {fmtStockAnt}
                    </td>

                    {/* Stock Posterior */}
                    <td className="py-4 px-3 text-right text-sm font-bold text-gray-700">
                      {fmtStockPos}
                    </td>

                    {/* Comentarios */}
                    <td
                      className="py-4 px-3 text-xs text-gray-500 max-w-xs truncate"
                      title={item.comentarios}
                    >
                      {item.comentarios || (
                        <span className="text-gray-300 italic">
                          Sin comentarios
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="py-12 text-center text-sm font-medium text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertTriangle className="size-6 text-orange-400" />
                    <span>
                      No hay movimientos registrados para los filtros
                      seleccionados.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
