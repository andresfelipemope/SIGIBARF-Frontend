"use client";

import { useState } from "react";
import { Plus, RotateCcw, ClipboardCheck } from "lucide-react";
import { useMovimientosProducto } from "@/hooks/useMovimientosProducto";
import { useProductos } from "@/hooks/useProductos";

import { StatsCards } from "@/components/auditoria-inventario/stats-cards";
import { FiltrosMovimientos } from "@/components/auditoria-inventario/filtros-movimientos";
import { MovimientosTable } from "@/components/auditoria-inventario/movimientos-table";
import { LoadingTable } from "@/components/auditoria-inventario/loading-table";
import { MovimientoDetails } from "@/components/auditoria-inventario/movimiento-details";
import { MovimientoForm } from "@/components/auditoria-inventario/movimiento-form";

export default function AuditoriaInventarioPage() {
  const {
    filteredMovimientos,
    loading,
    error,
    creating,
    createMovimiento,
    refetchMovimientos,
    searchTerm,
    setSearchTerm,
    tipoFilter,
    setTipoFilter,
    productoFilter,
    setProductoFilter,
    fechaFilter,
    setFechaFilter,
    clearFilters,
    stats,
  } = useMovimientosProducto();

  const { productos, refetchProductos } = useProductos();

  const [selectedMovimiento, setSelectedMovimiento] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateMovement = async (payload) => {
    const result = await createMovimiento(payload);
    if (result.success) {
      refetchProductos();
    }
    return result;
  };

  return (
    <div className="space-y-8 animate-fade-in text-black relative">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight flex items-center gap-2.5">
            <ClipboardCheck className="size-8 text-green-600 shrink-0" />
            Auditoría de Inventario
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Historial de auditoría, entradas, salidas y ajustes manuales del
            stock final de Athletic Barf.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              refetchMovimientos();
              refetchProductos();
            }}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-black transition-all"
            title="Sincronizar Datos"
            aria-label="Sincronizar inventario y movimientos"
          >
            <RotateCcw className="size-4 shrink-0" />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all duration-200 cursor-pointer"
          >
            <Plus className="size-4 shrink-0" />
            Registrar Operación
          </button>
        </div>
      </div>

      <StatsCards stats={stats} loading={loading} />

      <FiltrosMovimientos
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        tipoFilter={tipoFilter}
        setTipoFilter={setTipoFilter}
        productoFilter={productoFilter}
        setProductoFilter={setProductoFilter}
        fechaFilter={fechaFilter}
        setFechaFilter={setFechaFilter}
        clearFilters={clearFilters}
        productos={productos}
      />

      {loading ? (
        <LoadingTable />
      ) : (
        <MovimientosTable
          movimientos={filteredMovimientos}
          productos={productos}
          onViewDetails={setSelectedMovimiento}
          error={error}
          onRetry={() => {
            refetchMovimientos();
            refetchProductos();
          }}
        />
      )}

      <MovimientoForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMovement}
        productos={productos}
        creating={creating}
      />

      {selectedMovimiento && (
        <MovimientoDetails
          movimiento={selectedMovimiento}
          onClose={() => setSelectedMovimiento(null)}
        />
      )}
    </div>
  );
}
