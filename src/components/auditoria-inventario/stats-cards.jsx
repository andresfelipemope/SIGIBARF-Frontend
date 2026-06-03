import * as React from "react";
import { 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sliders 
} from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsCards({ stats, loading }) {
  const metrics = [
    {
      label: "Total Movimientos",
      value: stats.total,
      icon: Activity,
      color: "text-green-700 bg-green-50 border-green-100",
    },
    {
      label: "Entradas",
      value: stats.entradas,
      icon: ArrowUpRight,
      color: "text-emerald-700 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Salidas",
      value: stats.salidas,
      icon: ArrowDownRight,
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      label: "Ajustes Manuales",
      value: stats.ajustes,
      icon: Sliders,
      color: "text-amber-700 bg-amber-50 border-amber-100",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.label}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {m.label}
              </span>
              <div className={cn("flex size-10 items-center justify-center rounded-xl border", m.color)}>
                <Icon className="size-5 shrink-0" />
              </div>
            </div>
            
            <div className="mt-4">
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded-md bg-gray-200" />
              ) : (
                <h3 className="text-2xl font-extrabold text-black">
                  {m.value}
                </h3>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
