import {
  Eye,
  CheckCircle,
  XCircle,
  CreditCard,
  Inbox,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/format-price";
import { PedidoEstadoBadge } from "./pedido-estado-badge";

function formatFecha(fechaString) {
  if (!fechaString) return "—";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(fechaString));
  } catch {
    return fechaString;
  }
}

function isPendiente(estado) {
  const s = (estado || "").toLowerCase();
  return s === "pendiente" || s === "pending";
}

export function PedidosAdminTable({
  pedidos,
  loading,
  error,
  onRetry,
  onView,
  onConfirmarPago,
  onCancelar,
  actionLoading,
}) {
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center space-y-4">
        <AlertTriangle className="size-10 text-red-600 mx-auto" />
        <p className="text-sm font-semibold text-red-800">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white cursor-pointer"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (!loading && (!pedidos || pedidos.length === 0)) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
        <Inbox className="size-10 text-gray-300 mx-auto mb-3" />
        <h3 className="font-bold text-black">No hay pedidos</h3>
        <p className="text-xs text-gray-500 mt-1">
          Los pedidos del sistema aparecerán aquí.
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
              <th className="py-4 px-4">Nº Pedido</th>
              <th className="py-4 px-4">Cliente</th>
              <th className="py-4 px-4">Correo</th>
              <th className="py-4 px-4">Fecha</th>
              <th className="py-4 px-4 text-center">Estado</th>
              <th className="py-4 px-4 text-right">Total</th>
              <th className="py-4 px-4">Pago</th>
              <th className="py-4 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pedidos.map((pedido) => {
              const id = pedido.id;
              const numero = pedido.numero_pedido ?? id;
              const correo = pedido.usuario_email || "—";
              const cliente =
                correo !== "—" ? correo.split("@")[0] : "Cliente presencial";
              const fecha = pedido.fecha_creacion || pedido.created_at;
              const estado = pedido.estado_pago || pedido.estado;
              const total = parseFloat(
                pedido.precio_total || pedido.total || 0,
              );
              const tipoPago = pedido.tipo_pago || "—";
              const creditoId = pedido.credito_id || pedido.credito;
              const pendiente = isPendiente(estado);

              return (
                <tr key={id} className="hover:bg-green-50/10 transition-colors">
                  <td className="py-4 px-4 text-sm font-bold text-green-700">
                    #{numero}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-black">
                    {cliente}
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-600">{correo}</td>
                  <td className="py-4 px-4 text-xs text-gray-600">
                    {formatFecha(fecha)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <PedidoEstadoBadge estado={estado} />
                  </td>
                  <td className="py-4 px-4 text-right text-sm font-bold text-black">
                    {formatPrice(total)}
                  </td>
                  <td className="py-4 px-4 text-xs font-bold capitalize text-gray-700">
                    {tipoPago}
                    {creditoId && (
                      <Link
                        href={`/gestion/creditos/${creditoId}`}
                        className="ml-1 inline-flex items-center text-green-600 hover:text-green-700"
                        title="Ver crédito"
                      >
                        <CreditCard className="size-3.5" />
                      </Link>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onView(pedido)}
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100 cursor-pointer"
                        title="Ver detalle"
                      >
                        <Eye className="size-4" />
                      </button>
                      {pendiente && (
                        <>
                          <button
                            onClick={() => onConfirmarPago(id)}
                            disabled={actionLoading}
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-green-100 bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer disabled:opacity-50"
                            title="Confirmar pago"
                          >
                            <CheckCircle className="size-4" />
                          </button>
                          <button
                            onClick={() => onCancelar(id)}
                            disabled={actionLoading}
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer disabled:opacity-50"
                            title="Cancelar pedido"
                          >
                            <XCircle className="size-4" />
                          </button>
                        </>
                      )}
                    </div>
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
