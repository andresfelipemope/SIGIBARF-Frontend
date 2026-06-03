import * as React from "react";
import {
  X,
  Calendar,
  User,
  FileText,
  ClipboardList,
  TrendingDown,
} from "lucide-react";
import { TipoBadge } from "./tipo-badge";

export function MovimientoDetails({ movimiento, onClose }) {
  if (!movimiento) return null;

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

  const prodName =
    movimiento.producto_nombre ||
    movimiento.producto?.nombre ||
    "Producto Desconocido";
  const prodId = movimiento.id_producto || movimiento.producto?.id || "-";
  const stockAnt =
    movimiento.stock_anterior !== null &&
    movimiento.stock_anterior !== undefined
      ? movimiento.stock_anterior
      : "-";
  const stockPost =
    movimiento.stock_posterior !== null &&
    movimiento.stock_posterior !== undefined
      ? movimiento.stock_posterior
      : "-";

  // Calcular la diferencia si aplica
  const delta =
    movimiento.stock_posterior !== null && movimiento.stock_anterior !== null
      ? (movimiento.stock_posterior - movimiento.stock_anterior).toFixed(1)
      : null;

  const isPositiveDelta = delta !== null ? parseFloat(delta) >= 0 : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 animate-scale-in">
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-500">
              Auditoría de Stock
            </span>
            <h2 className="text-lg font-extrabold text-black">
              Detalles de Movimiento
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer"
            aria-label="Cerrar detalles"
          >
            <X className="size-5 shrink-0" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Card Principal de Resumen */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
                Código de Auditoría: #{movimiento.id}
              </span>
              <h3 className="text-base font-bold text-black leading-tight">
                {prodName}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                ID Producto: {prodId}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <TipoBadge tipo={movimiento.tipo_movimiento} />
              <span className="text-lg font-black text-black">
                {movimiento.tipo_movimiento?.toUpperCase() === "ENTRADA"
                  ? "+"
                  : ""}
                {movimiento.cantidad} u
              </span>
            </div>
          </div>

          {/* Grilla de Cambios de Stock */}
          <div className="grid grid-cols-3 gap-4 border border-gray-100 rounded-2xl p-5 bg-white shadow-xs">
            <div className="text-center space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Stock Anterior
              </span>
              <span className="text-xl font-extrabold text-gray-700">
                {stockAnt}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-gray-300 font-black uppercase mb-1">
                  Impacto
                </span>
                {delta !== null ? (
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      isPositiveDelta
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}
                  >
                    {isPositiveDelta ? `+${delta}` : delta}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-gray-400">
                    N/A
                  </span>
                )}
              </div>
            </div>
            <div className="text-center space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Stock Posterior
              </span>
              <span
                className={`text-xl font-black ${
                  movimiento.tipo_movimiento?.toUpperCase() === "ENTRADA"
                    ? "text-emerald-600"
                    : movimiento.tipo_movimiento?.toUpperCase() === "SALIDA"
                      ? "text-rose-600"
                      : "text-amber-600"
                }`}
              >
                {stockPost}
              </span>
            </div>
          </div>

          {/* Detalles Desglosados */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">
              Información de Registro
            </h4>

            <div className="grid gap-3.5 text-sm">
              {/* Fecha */}
              <div className="flex items-center gap-3">
                <Calendar className="size-4.5 text-gray-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">
                    Fecha y Hora
                  </span>
                  <span className="text-xs font-semibold text-gray-700 mt-1">
                    {formatFecha(
                      movimiento.fecha_registro || movimiento.created_at,
                    )}
                  </span>
                </div>
              </div>

              {/* Responsable */}
              <div className="flex items-center gap-3">
                <User className="size-4.5 text-gray-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">
                    Autor / Creador
                  </span>
                  <span className="text-xs font-semibold text-gray-700 mt-1">
                    {movimiento.usuario_nombre ||
                      movimiento.usuario?.nombre ||
                      "Sistema (Automático)"}
                  </span>
                </div>
              </div>

              {/* Comentarios */}
              <div className="flex items-start gap-3">
                <FileText className="size-4.5 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">
                    Comentarios u Observaciones
                  </span>
                  <p className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-100 rounded-xl p-3 mt-1.5 italic leading-relaxed whitespace-pre-wrap">
                    {movimiento.comentarios ||
                      "Sin comentarios adicionales registrados."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
