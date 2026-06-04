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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined" || loading || !pedidos.length) return;
    const verId = new URLSearchParams(window.location.search).get("ver");
    if (!verId) return;
    const found = pedidos.find((p) => String(p.id) === String(verId));
    if (found) setSelectedPedido(found);
  }, [pedidos, loading]);

  const handleConfirmar = (id) => {
    setSelectedPedidoId(id);
    setDialogAction("confirmar");
    setDialogOpen(true);
  };

  const handleCancelar = (id) => {
    setSelectedPedidoId(id);
    setDialogAction("cancelar");
    setDialogOpen(true);
  };

  const executeAction = async () => {
    if (!selectedPedidoId) return;

    if (dialogAction === "confirmar") {
      await confirmarPago(selectedPedidoId);
    }

    if (dialogAction === "cancelar") {
      await cancelarPedido(selectedPedidoId);
    }

    setDialogOpen(false);
    setSelectedPedidoId(null);
    setDialogAction(null);
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
              Administra pedidos del sistema, registra pedidos manuales y
              confirma pagos.
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
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (actionLoading) return;

          if (!open) {
            setDialogOpen(false);
            setSelectedPedidoId(null);
            setDialogAction(null);
            return;
          }

          setDialogOpen(true);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "confirmar"
                ? "Confirmar pago"
                : "Cancelar pedido"}
            </DialogTitle>

            <DialogDescription>
              {dialogAction === "confirmar"
                ? "¿Deseas confirmar el pago de este pedido?"
                : "¿Deseas cancelar este pedido? Quedará rechazado."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={actionLoading}
              onClick={() => setDialogOpen(false)}
            >
              Cerrar
            </Button>

            <Button
              disabled={actionLoading}
              variant={dialogAction === "confirmar" ? "default" : "destructive"}
              onClick={executeAction}
            >
              {actionLoading
                ? "Procesando..."
                : dialogAction === "confirmar"
                  ? "Confirmar pago"
                  : "Cancelar pedido"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
