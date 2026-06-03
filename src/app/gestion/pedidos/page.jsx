"use client";

import { useState, useEffect } from "react";
import { Plus, ShoppingBag, RotateCcw } from "lucide-react";
import { Toaster } from "sonner";
import { useAdminPedidos } from "@/hooks/useAdminPedidos";
import { useProductos } from "@/hooks/useProductos";
import { PedidosAdminFilters } from "@/components/gestion-pedidos/pedidos-admin-filters";
import { PedidosAdminTable } from "@/components/gestion-pedidos/pedidos-admin-table";
import { PedidosLoading } from "@/components/gestion-pedidos/pedidos-loading";
import { PedidoDetalleDialog } from "@/components/gestion-pedidos/pedido-detalle-dialog";
import { PedidoManualFormDialog } from "@/components/gestion-pedidos/pedido-manual-form-dialog";

export default function GestionPedidosAdminPage() {
  const {
    pedidos,
    count,
    loading,
    actionLoading,
    error,
    filters,
    updateFilter,
    clearFilters,
    fetchPedidos,
    crearPedidoManual,
    confirmarPago,
    cancelarPedido,
  } = useAdminPedidos();

  const { productos, refetchProductos } = useProductos();

  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || loading || !pedidos.length) return;
    const verId = new URLSearchParams(window.location.search).get("ver");
    if (!verId) return;
    const found = pedidos.find((p) => String(p.id) === String(verId));
    if (found) setSelectedPedido(found);
  }, [pedidos, loading]);

  const handleConfirmar = async (id) => {
    if (!window.confirm("¿Confirmar el pago de este pedido?")) return;
    await confirmarPago(id);
  };

  const handleCancelar = async (id) => {
    if (!window.confirm("¿Cancelar este pedido? Quedará en estado rechazado.")) return;
    await cancelarPedido(id);
  };

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="space-y-8 animate-fade-in text-black">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight flex items-center gap-2.5">
              <ShoppingBag className="size-8 text-orange-500 shrink-0" />
              Gestión de Pedidos
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Administra pedidos del sistema, registra pedidos manuales y confirma pagos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchPedidos(1)}
              className="inline-flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 cursor-pointer"
              title="Actualizar listado"
            >
              <RotateCcw className="size-4" />
            </button>
            <button
              onClick={() => {
                refetchProductos();
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 cursor-pointer"
            >
              <Plus className="size-4" />
              Pedido manual
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Total registrados
          </span>
          <p className="text-2xl font-extrabold text-green-700 mt-1">{count}</p>
        </div>

        <PedidosAdminFilters
          filters={filters}
          updateFilter={updateFilter}
          clearFilters={clearFilters}
          onRefresh={() => fetchPedidos(1)}
        />

        {loading ? (
          <PedidosLoading />
        ) : (
          <PedidosAdminTable
            pedidos={pedidos}
            loading={loading}
            error={error}
            onRetry={() => fetchPedidos(1)}
            onView={setSelectedPedido}
            onConfirmarPago={handleConfirmar}
            onCancelar={handleCancelar}
            actionLoading={actionLoading}
          />
        )}

        <PedidoDetalleDialog
          pedido={selectedPedido}
          onClose={() => setSelectedPedido(null)}
        />

        <PedidoManualFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={crearPedidoManual}
          productos={productos}
          creating={actionLoading}
        />
      </div>
    </>
  );
}
