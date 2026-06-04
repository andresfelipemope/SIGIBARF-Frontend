"use client";

import { useState } from "react";
import { Coins, RotateCcw } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useCreditos } from "@/hooks/useCreditos";
import { CreditosTable } from "@/components/creditos/creditos-table";
import CreditosFilters, { DEFAULT_FILTERS } from "@/components/creditos/CreditosFilters";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreditosPage() {
  const { creditos, count, loading, error, refetch } = useCreditos();
  
  // Filtros adicionales locales
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    toast.success("Filtros restablecidos");
  };

  // Aplicar filtros en el frontend
  const filteredCreditos = creditos.filter((credito) => {
    // 1. Búsqueda por usuario (cliente) o pedido_id
    if (filters.busqueda) {
      const search = filters.busqueda.toLowerCase();
      const usuarioMatch = credito.usuario?.toLowerCase().includes(search);
      const pedidoMatch = credito.pedido_id?.toString().includes(search);
      
      if (!usuarioMatch && !pedidoMatch) {
        return false;
      }
    }

    // 2. Filtro por estado (activo, pagado, vencido)
    if (filters.estado !== "Todos" && credito.estado !== filters.estado) {
      return false;
    }

    // 3. Filtro por fecha inicio
    if (filters.fechaInicio && credito.fecha_inicio) {
      const creditoDate = new Date(credito.fecha_inicio).toISOString().split("T")[0];
      if (creditoDate < filters.fechaInicio) {
        return false;
      }
    }

    // 4. Filtro por fecha fin
    if (filters.fechaFin && credito.fecha_inicio) {
      const creditoDate = new Date(credito.fecha_inicio).toISOString().split("T")[0];
      if (creditoDate > filters.fechaFin) {
        return false;
      }
    }

    return true;
  });

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
          <p className="text-2xl font-extrabold text-green-700 mt-1">{filteredCreditos.length}</p>
        </div>

        {/* Filtros */}
        <CreditosFilters 
          filters={filters} 
          setFilters={setFilters} 
          onReset={handleResetFilters} 
        />

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : (
          <CreditosTable creditos={filteredCreditos} error={error} onRetry={refetch} />
        )}
      </div>
    </>
  );
}