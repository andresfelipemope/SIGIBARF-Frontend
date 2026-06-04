import * as React from "react";
import { Eye, Inbox, AlertTriangle } from "lucide-react";
import { TipoBadge } from "./tipo-badge";

export function MovimientosTable({
  movimientos,
  productos,
  onViewDetails,
  error,
  onRetry,
}) {
  // Helper para formatear fechas
  const formatFecha = (fechaString) => {
    if (!fechaString) return "-";
    try {
      const fecha = new Date(fechaString);
      return new Intl.DateTimeFormat("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(fecha);
    } catch (e) {
      return fechaString;
    }
  };

  // Estado de Error
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center max-w-2xl mx-auto space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle className="size-6 shrink-0" />
        </div>
        <h3 className="text-lg font-bold text-red-950">
          Error al cargar datos
        </h3>
        <p className="text-sm text-red-700 font-medium">
          {error ||
            "No pudimos comunicarnos con el servidor. Revisa tu conexión de red."}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-all cursor-pointer"
          >
            Reintentar Carga
          </button>
        )}
      </div>
    );
  }

  // Estado de Tabla Vacía (Empty State)
  if (!movimientos || movimientos.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center max-w-md mx-auto space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-gray-50 text-gray-400 border border-gray-100">
          <Inbox className="size-6 shrink-0" />
        </div>
        <h3 className="text-base font-bold text-black">
          No existen movimientos registrados
        </h3>
        <p className="text-xs text-gray-500 font-medium">
          Los movimientos creados manualmente o automáticos se verán reflejados
          en este panel histórico.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50/30">
              <th className="py-4 px-4 font-extrabold">Producto</th>
              <th className="py-4 px-4 font-extrabold text-center w-28">
                Tipo
              </th>
              <th className="py-4 px-4 font-extrabold text-right w-24">
                Cantidad
              </th>
              <th className="py-4 px-4 font-extrabold text-right w-36">
                Stock Ant/Post
              </th>
              <th className="py-4 px-4 font-extrabold w-40">Fecha</th>
              <th className="py-4 px-4 font-extrabold text-center w-16">
                Detalles
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {movimientos.map((mov) => {
              const producto = productos?.find(
                (p) => Number(p.id) === Number(mov.id_producto),
              );

              const prodName = producto?.nombre || "Producto Desconocido";

              const prodId = mov.id_producto || "-";

              return (
                <tr
                  key={mov.id}
                  className="hover:bg-green-50/10 transition-colors group cursor-pointer"
                  onClick={() => onViewDetails(mov)}
                >
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-black leading-tight">
                        {prodName}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Cod: {prodId}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <TipoBadge tipo={mov.tipo_movimiento} />
                  </td>
                  <td className="py-4 px-4 text-right text-sm font-extrabold text-black">
                    {mov.cantidad}
                  </td>
                  <td className="py-4 px-4 text-right text-xs font-semibold text-gray-500 font-mono">
                    {mov.stock_anterior !== null &&
                    mov.stock_anterior !== undefined
                      ? mov.stock_anterior
                      : "-"}
                    <span className="text-gray-300 mx-1">→</span>
                    <span
                      className={
                        mov.tipo_movimiento?.toUpperCase() === "ENTRADA"
                          ? "text-emerald-600 font-bold"
                          : mov.tipo_movimiento?.toUpperCase() === "SALIDA"
                            ? "text-rose-600 font-bold"
                            : "text-amber-600 font-bold"
                      }
                    >
                      {mov.stock_posterior !== null &&
                      mov.stock_posterior !== undefined
                        ? mov.stock_posterior
                        : "-"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-600 font-medium">
                    {formatFecha(mov.fecha)}
                  </td>
                  <td
                    className="py-4 px-4 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onViewDetails(mov)}
                      className="inline-flex size-8 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-100 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
                      aria-label="Ver detalles"
                      title="Ver detalles del movimiento"
                    >
                      <Eye className="size-4 shrink-0" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
