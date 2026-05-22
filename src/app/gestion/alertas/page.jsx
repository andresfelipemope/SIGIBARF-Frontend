"use client";

import { 
  AlertTriangle, 
  Bell, 
  Check, 
  ArrowUpRight, 
  Trash2,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function AlertasPage() {
  const alerts = [
    {
      id: "ALT-01",
      title: "Insumo Agotado: Calcio de Hueso Micro-molido",
      description: "El inventario de Calcio de Hueso cayó a 0 Kg. Es una materia prima crítica para la receta de Puppy.",
      time: "Hace 10 min",
      type: "critico",
      category: "Inventario",
      icon: AlertCircle,
      iconBg: "bg-rose-50 text-rose-700 border-rose-100"
    },
    {
      id: "ALT-02",
      title: "Stock Mínimo Superado: Hígado de Pollo",
      description: "El inventario de Hígado de Pollo es de 15 Kg. El límite de seguridad recomendado es de 30 Kg.",
      time: "Hace 2 horas",
      type: "critico",
      category: "Inventario",
      icon: AlertCircle,
      iconBg: "bg-rose-50 text-rose-700 border-rose-100"
    },
    {
      id: "ALT-03",
      title: "Lote Cercano a Expirar: LOT-192 (Athletic Dog Adulto)",
      description: "Quedan 35 Kg en bodega del lote LOT-192 que expira en 5 días (26 de Mayo, 2026).",
      time: "Hace 1 día",
      type: "advertencia",
      category: "Producción",
      icon: AlertTriangle,
      iconBg: "bg-orange-50 text-orange-700 border-orange-100"
    },
    {
      id: "ALT-04",
      title: "Vencimiento de Deuda Próximo: Frigorífico Central",
      description: "La factura FAC-4089 por $1,250 USD vence el día de mañana (23 de Mayo, 2026).",
      time: "Hace 1 día",
      type: "info",
      category: "Deudas",
      icon: Calendar,
      iconBg: "bg-green-50 text-green-700 border-green-100"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-black">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Gestión de Alertas
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Notificaciones críticas del sistema que requieren atención inmediata o programación logística.
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-orange-50 px-3 py-1.5 border border-orange-100 text-xs font-bold text-orange-700">
          <Bell className="size-4 animate-bounce" />
          <span>3 Alertas Pendientes</span>
        </div>
      </div>

      {/* Alerts Logs Container */}
      <div className="space-y-4">
        {alerts.map((alt) => (
          <div 
            key={alt.id} 
            className={`rounded-2xl border bg-white p-5 shadow-xs transition-all duration-300 hover:shadow-md flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${
              alt.type === "critico" 
                ? "border-rose-100" 
                : alt.type === "advertencia" 
                ? "border-orange-100" 
                : "border-gray-200"
            }`}
          >
            {/* Left side details */}
            <div className="flex items-start gap-4">
              <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border ${alt.iconBg}`}>
                <alt.icon className="size-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border uppercase tracking-wider ${
                    alt.type === "critico" 
                      ? "bg-rose-50 text-rose-700 border-rose-100" 
                      : alt.type === "advertencia" 
                      ? "bg-orange-50 text-orange-750 border-orange-100" 
                      : "bg-green-50 text-green-700 border-green-100"
                  }`}>
                    {alt.type}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    {alt.category} • {alt.id}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-black leading-snug">
                  {alt.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-2xl">
                  {alt.description}
                </p>
                <span className="text-[10px] text-gray-400 font-medium block pt-1">
                  {alt.time}
                </span>
              </div>
            </div>

            {/* Actions button columns */}
            <div className="flex items-center gap-2 justify-end self-end md:self-center shrink-0">
              {alt.category === "Inventario" && (
                <button className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-600 transition-all">
                  <ArrowUpRight className="size-3.5" />
                  <span>Abastecer</span>
                </button>
              )}
              <button className="inline-flex size-9 items-center justify-center rounded-xl border border-gray-250 bg-white text-gray-400 hover:bg-green-50 hover:text-green-700 hover:border-green-100 transition-colors" title="Marcar como atendido">
                <Check className="size-4.5" />
              </button>
              <button className="inline-flex size-9 items-center justify-center rounded-xl border border-gray-250 bg-white text-gray-400 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-100 transition-colors" title="Ignorar">
                <Trash2 className="size-4.5" />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
