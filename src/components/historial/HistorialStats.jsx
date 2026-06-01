"use client";

import { 
  Beef, 
  ShoppingBag, 
  ArrowDownLeft, 
  ArrowUpRight 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistorialStats({ data = [], loading = false }) {
  // Compute metrics in frontend
  const totalIngredientes = data.filter(item => item.registroTipo === "Ingrediente").length;
  const totalProductos = data.filter(item => item.registroTipo === "Producto").length;
  const totalEntradas = data.filter(item => item.tipo_movimiento === "ENTRADA").length;
  const totalSalidas = data.filter(item => item.tipo_movimiento === "SALIDA").length;

  const stats = [
    {
      label: "Movimientos Ingredientes",
      value: totalIngredientes,
      icon: Beef,
      color: "text-green-700 bg-green-50 border-green-100",
    },
    {
      label: "Movimientos Productos",
      value: totalProductos,
      icon: ShoppingBag,
      color: "text-orange-600 bg-orange-50 border-orange-100",
    },
    {
      label: "Total Entradas",
      value: totalEntradas,
      icon: ArrowDownLeft,
      color: "text-green-700 bg-green-50 border-green-100",
    },
    {
      label: "Total Salidas",
      value: totalSalidas,
      icon: ArrowUpRight,
      color: "text-orange-600 bg-orange-50 border-orange-100",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-green-100"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {stat.label}
            </span>
            <div className={`flex size-9 items-center justify-center rounded-xl border ${stat.color}`}>
              <stat.icon className="size-4.5" />
            </div>
          </div>
          <div className="mt-3">
            {loading ? (
              <Skeleton className="h-8 w-16 rounded-lg bg-gray-100" />
            ) : (
              <p className="text-2xl font-extrabold text-black tracking-tight">
                {stat.value.toLocaleString("es-ES")}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
