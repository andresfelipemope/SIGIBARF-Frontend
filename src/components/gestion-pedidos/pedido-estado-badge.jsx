import { cn } from "@/lib/utils";

export function PedidoEstadoBadge({ estado }) {
  const s = (estado || "").toLowerCase();

  let className = "bg-gray-50 text-gray-700 border-gray-200";
  let label = estado || "Desconocido";

  if (["approved", "aprobado", "pagado", "exitoso"].includes(s)) {
    className = "bg-green-50 text-green-700 border-green-200";
    label = "Aprobado";
  } else if (["pending", "pendiente", "espera"].includes(s)) {
    className = "bg-orange-50 text-orange-700 border-orange-200";
    label = "Pendiente";
  } else if (["declined", "declinado", "rechazado", "cancelado"].includes(s)) {
    className = "bg-red-50 text-red-700 border-red-200";
    label = s === "cancelado" ? "Cancelado" : "Rechazado";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        className
      )}
    >
      {label}
    </span>
  );
}
