import * as React from "react";
import { ArrowUpRight, ArrowDownRight, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

export function TipoBadge({ tipo, className }) {
  const tipoUpper = tipo?.toUpperCase();

  if (tipoUpper === "ENTRADA") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 border border-emerald-200 transition-all hover:bg-emerald-100/70",
          className
        )}
      >
        <ArrowUpRight className="size-3 text-emerald-600 shrink-0" />
        Entrada
      </span>
    );
  }

  if (tipoUpper === "SALIDA") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-rose-700 border border-rose-200 transition-all hover:bg-rose-100/70",
          className
        )}
      >
        <ArrowDownRight className="size-3 text-rose-600 shrink-0" />
        Salida
      </span>
    );
  }

  // AJUSTE o cualquier otro tipo
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 border border-amber-200 transition-all hover:bg-amber-100/70",
        className
      )}
    >
      <Sliders className="size-3 text-amber-600 shrink-0" />
      Ajuste
    </span>
  );
}
