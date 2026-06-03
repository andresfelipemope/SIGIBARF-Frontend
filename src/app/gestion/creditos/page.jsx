"use client";

import { Search, Coins, RotateCcw } from "lucide-react";
import { Toaster } from "sonner";
import { useCreditos } from "@/hooks/useCreditos";
import { CreditosTable } from "@/components/creditos/creditos-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreditosPage() {
  const { creditos, count, loading, error, search, setSearch, refetch } = useCreditos();

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="space-y-8 animate-fade-in text-black">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight flex items-center gap-2.5">
              <Coins className="size-8 text-green-600 shrink-0" />
              Gestión de Créditos
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Créditos otorgados a clientes por pedidos. Seguimiento de cuotas y pagos.
            </p>
          </div>
          <button
            onClick={refetch}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-100 cursor-pointer"
            title="Actualizar"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total</span>
          <p className="text-2xl font-extrabold text-green-700 mt-1">{count}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente o número de pedido..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm focus:border-green-600 focus:outline-hidden"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : (
          <CreditosTable creditos={creditos} error={error} onRetry={refetch} />
        )}
      </div>
    </>
  );
}
