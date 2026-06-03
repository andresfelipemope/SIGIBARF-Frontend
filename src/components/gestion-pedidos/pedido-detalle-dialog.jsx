import { X, Calendar, User, Mail, CreditCard, Package, ExternalLink } from "lucide-react";
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

export function PedidoDetalleDialog({ pedido, onClose }) {
  if (!pedido) return null;

  const numero = pedido.numero_pedido ?? pedido.id;
  const cliente = pedido.cliente_nombre || pedido.usuario_nombre || pedido.cliente?.nombre || "—";
  const correo = pedido.cliente_correo || pedido.usuario_correo || pedido.cliente?.correo || "—";
  const fecha = pedido.fecha_creacion || pedido.created_at || pedido.fecha;
  const estado = pedido.estado_pago || pedido.estado;
  const total = parseFloat(pedido.precio_total || pedido.total || 0);
  const tipoPago = pedido.tipo_pago || "—";
  const items = pedido.items || pedido.productos || [];
  const creditoId = pedido.credito_id || pedido.credito;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-500">
              Detalle de pedido
            </span>
            <h2 className="text-lg font-extrabold text-black">Pedido #{numero}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer">
            <X className="size-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="flex items-center justify-between">
            <PedidoEstadoBadge estado={estado} />
            <span className="text-lg font-extrabold text-green-700">{formatPrice(total)}</span>
          </div>

          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="size-4 text-gray-400" />
              <span className="font-semibold">{cliente}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="size-4 text-gray-400" />
              <span>{correo}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="size-4 text-gray-400" />
              <span>{formatFecha(fecha)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CreditCard className="size-4 text-orange-500" />
              <span className="font-bold capitalize">{tipoPago}</span>
            </div>
          </div>

          {creditoId && (
            <Link
              href={`/gestion/creditos/${creditoId}`}
              className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-xs font-bold text-green-700 hover:bg-green-100/70"
            >
              <ExternalLink className="size-3.5" />
              Ver crédito asociado
            </Link>
          )}

          {items.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
                <Package className="size-3.5" /> Productos
              </h3>
              <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100">
                {items.map((item, idx) => (
                  <li key={item.id || idx} className="flex justify-between px-4 py-3 text-sm">
                    <span className="font-semibold text-black">
                      {item.producto_nombre || item.nombre || `Producto #${item.producto_id}`}
                      <span className="text-gray-400 font-medium"> × {item.cantidad}</span>
                    </span>
                    <span className="font-bold text-gray-700">
                      {formatPrice(parseFloat(item.subtotal || item.precio_unitario * item.cantidad || 0))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
