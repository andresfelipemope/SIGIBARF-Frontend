import { Bell, BellOff, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/format-price";

function CuotaEstadoBadge({ estado }) {
  const s = (estado || "").toLowerCase();
  let cls = "bg-gray-50 text-gray-700 border-gray-200";
  if (["pagada", "pagado"].includes(s)) cls = "bg-green-50 text-green-700 border-green-200";
  else if (["pendiente", "parcial"].includes(s)) cls = "bg-orange-50 text-orange-700 border-orange-200";
  else if (["vencida", "mora"].includes(s)) cls = "bg-red-50 text-red-700 border-red-200";

  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${cls}`}>
      {estado || "—"}
    </span>
  );
}

function formatFecha(f) {
  if (!f) return "—";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(f));
  } catch {
    return f;
  }
}

export function CuotasTable({ cuotas, loading, onToggleNotificaciones, togglingId }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!cuotas?.length) {
    return (
      <p className="text-sm text-gray-500 text-center py-8 font-medium">
        No hay cuotas registradas para este crédito.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs font-bold uppercase text-gray-400 bg-gray-50/50">
            <th className="py-3 px-4">Nº</th>
            <th className="py-3 px-4">Vencimiento</th>
            <th className="py-3 px-4 text-right">Valor</th>
            <th className="py-3 px-4 text-right">Pagado</th>
            <th className="py-3 px-4 text-right">Saldo</th>
            <th className="py-3 px-4 text-center">Estado</th>
            <th className="py-3 px-4 text-center">Notif.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {cuotas.map((cuota) => {
            const activas = cuota.notificaciones_activas !== false;
            return (
              <tr key={cuota.id} className="hover:bg-green-50/10">
                <td className="py-3 px-4 font-bold">{cuota.numero_cuota ?? cuota.numero ?? cuota.id}</td>
                <td className="py-3 px-4 text-gray-600">
                  {formatFecha(cuota.fecha_vencimiento || cuota.vencimiento)}
                </td>
                <td className="py-3 px-4 text-right font-semibold">
                  {formatPrice(parseFloat(cuota.valor || cuota.monto || 0))}
                </td>
                <td className="py-3 px-4 text-right text-green-700 font-semibold">
                  {formatPrice(parseFloat(cuota.pagado || cuota.monto_pagado || 0))}
                </td>
                <td className="py-3 px-4 text-right font-bold">
                  {formatPrice(parseFloat(cuota.saldo || 0))}
                </td>
                <td className="py-3 px-4 text-center">
                  <CuotaEstadoBadge estado={cuota.estado} />
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onToggleNotificaciones(cuota.id, !activas)}
                    disabled={togglingId === cuota.id}
                    className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold border cursor-pointer ${
                      activas
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-gray-200 bg-gray-50 text-gray-500"
                    }`}
                    title={activas ? "Desactivar notificaciones" : "Activar notificaciones"}
                  >
                    {togglingId === cuota.id ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : activas ? (
                      <Bell className="size-3" />
                    ) : (
                      <BellOff className="size-3" />
                    )}
                    {activas ? "On" : "Off"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
