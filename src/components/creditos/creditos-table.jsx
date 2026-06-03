import Link from "next/link";
import { Eye, Inbox, AlertTriangle } from "lucide-react";
import { formatPrice } from "@/lib/format-price";

function CreditoEstadoBadge({ estado }) {
  const s = (estado || "").toLowerCase();
  let cls = "bg-gray-50 text-gray-700 border-gray-200";
  let label = estado || "—";

  if (["activo", "vigente", "en_curso"].includes(s)) {
    cls = "bg-green-50 text-green-700 border-green-200";
    label = "Activo";
  } else if (["pagado", "cancelado", "finalizado"].includes(s)) {
    cls = "bg-orange-50 text-orange-700 border-orange-200";
    label = estado;
  } else if (["vencido", "mora"].includes(s)) {
    cls = "bg-red-50 text-red-700 border-red-200";
    label = "Vencido";
  }

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${cls}`}>
      {label}
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

export function CreditosTable({ creditos, error, onRetry }) {
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

  if (!creditos?.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
        <Inbox className="size-10 text-gray-300 mx-auto mb-3" />
        <h3 className="font-bold text-black">No hay créditos registrados</h3>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50/30">
              <th className="py-4 px-4">Pedido</th>
              <th className="py-4 px-4">Cliente</th>
              <th className="py-4 px-4 text-right">Total</th>
              <th className="py-4 px-4 text-center">Cuotas</th>
              <th className="py-4 px-4 text-right">Valor cuota</th>
              <th className="py-4 px-4 text-center">Estado</th>
              <th className="py-4 px-4">Inicio</th>
              <th className="py-4 px-4">Fin</th>
              <th className="py-4 px-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {creditos.map((c) => {
              const id = c.id;
              const pedidoNum = c.pedido_numero ?? c.numero_pedido ?? c.pedido_id ?? "—";
              const pedidoId = c.pedido_id ?? c.pedido;
              const cliente = c.usuario || c.usuario_nombre || "—";
              const total = parseFloat(
                c.valor_total ??
                c.total ??
                c.monto_total ??
                0
              );
              const cuotas = c.cantidad_cuotas ?? c.cuotas_totales ?? "—";
              const valorCuota = parseFloat(c.valor_cuota || 0);

              return (
                <tr key={id} className="hover:bg-green-50/10 transition-colors">
                  <td className="py-4 px-4 text-sm font-bold text-green-700">
                    #{pedidoNum}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold">{cliente}</td>
                  <td className="py-4 px-4 text-right font-bold">{formatPrice(total)}</td>
                  <td className="py-4 px-4 text-center text-sm">{cuotas}</td>
                  <td className="py-4 px-4 text-right text-sm font-semibold">
                    {valorCuota ? formatPrice(valorCuota) : "—"}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <CreditoEstadoBadge estado={c.estado} />
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-600">
                    {formatFecha(c.fecha_inicio)}
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-600">
                    {formatFecha(c.fecha_fin)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Link
                      href={`/gestion/creditos/${id}`}
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-700"
                      title="Ver detalle"
                    >
                      <Eye className="size-4" />
                    </Link>
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
