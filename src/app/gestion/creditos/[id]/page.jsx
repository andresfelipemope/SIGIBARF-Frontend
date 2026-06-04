"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  DollarSign,
  Trash2,
  Save,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { Toaster } from "sonner";
import { useCreditoDetalle } from "@/hooks/useCreditoDetalle";
import { useCuotas } from "@/hooks/useCuotas";
import { CuotasTable } from "@/components/creditos/cuotas-table";
import { formatPrice } from "@/lib/format-price";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreditoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const {
    credito,
    loading,
    actionLoading,
    error,
    guardarObservaciones,
    eliminarCredito,
    registrarPago,
  } = useCreditoDetalle(id);

  const {
    cuotas,
    loading: loadingCuotas,
    toggleNotificaciones,
    refetch: refetchCuotas,
  } = useCuotas(id);

  const [observaciones, setObservaciones] = useState("");
  const [montoPago, setMontoPago] = useState("");
  const [showPagoForm, setShowPagoForm] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [ultimoPago, setUltimoPago] = useState(null);
  const [pagoError, setPagoError] = useState(null);

  useEffect(() => {
    if (credito) {
      setObservaciones(credito.observaciones || "");
    }
  }, [credito]);

  const pedidoId = credito?.pedido_id ?? credito?.pedido;
  const pedidoNum = credito?.pedido_numero ?? credito?.numero_pedido;
  const saldo = parseFloat(credito?.saldo ?? credito?.saldo_restante ?? 0);
  const total = parseFloat(
    credito?.valor_total ??
    credito?.total ??
    credito?.monto_total ??
    0
  );
  const handleGuardarObs = async () => {
    await guardarObservaciones(observaciones);
  };

  const handleEliminar = async () => {
    if (!window.confirm("¿Eliminar este crédito? Esta acción puede no estar disponible si expiró el plazo.")) {
      return;
    }
    const result = await eliminarCredito();
    if (result.success) {
      router.push("/gestion/creditos");
    }
  };

  const handlePago = async (e) => {
    e.preventDefault();

    setPagoError(null);

    const monto = parseFloat(montoPago);

    if (!monto || monto <= 0) {
      setPagoError("Debes ingresar un monto válido.");
      return;
    }

    const result = await registrarPago(monto);

    if (result.success) {
      setUltimoPago(result.data);

      await refetchCuotas();

      setMontoPago("");
      setShowPagoForm(false);
      setPagoError(null);
    } else {
      setPagoError(
        result.error ||
        result.message ||
        "No fue posible registrar el pago."
      );
    }
  };

  const handleToggleNotif = async (cuotaId, activas) => {
    setTogglingId(cuotaId);
    await toggleNotificaciones(cuotaId, activas);
    setTogglingId(null);
  };

  if (loading && !credito) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 bg-gray-200" />
        <Skeleton className="h-64 w-full rounded-2xl bg-gray-200" />
      </div>
    );
  }

  if (error && !credito) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertTriangle className="size-10 text-red-600 mx-auto mb-3" />
        <p className="text-sm font-semibold text-red-800">{error}</p>
        <Link
          href="/gestion/creditos"
          className="inline-block mt-4 text-xs font-bold text-green-700 hover:underline"
        >
          Volver a créditos
        </Link>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="space-y-8 animate-fade-in text-black">
        <Link
          href="/gestion/creditos"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-green-700"
        >
          <ArrowLeft className="size-4" />
          Volver a créditos
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-black">
              Crédito #{id}
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              {credito?.usuario || credito?.usuario_nombre || "Cliente"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {pedidoId && (
              <Link
                href={`/gestion/pedidos?ver=${pedidoId}`}
                className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-xs font-bold text-green-700 hover:bg-green-100/70"
              >
                <ExternalLink className="size-3.5" />
                Ver pedido #{pedidoNum ?? pedidoId}
              </Link>
            )}
            <button
              onClick={() => {
                setPagoError(null);
                setShowPagoForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 cursor-pointer"
            >
              <DollarSign className="size-4" />
              Registrar pago
            </button>
            <button
              onClick={handleEliminar}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="size-4" />
              Eliminar
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-gray-400">Total</span>
            <p className="text-xl font-extrabold text-black mt-1">{formatPrice(total)}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-gray-400">Saldo restante</span>
            <p className="text-xl font-extrabold text-orange-600 mt-1">{formatPrice(saldo)}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-gray-400">Cuotas</span>
            <p className="text-xl font-extrabold text-black mt-1">
              {credito?.cantidad_cuotas ?? "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-gray-400">Estado</span>
            <p className="text-lg font-extrabold text-green-700 mt-1 capitalize">
              {credito?.estado || "—"}
            </p>
          </div>
        </div>

        {ultimoPago && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 space-y-2">
            <h3 className="text-sm font-bold text-green-800">Último pago registrado</h3>
            {ultimoPago.cuotas_afectadas && (
              <p className="text-xs text-green-700">
                Cuotas afectadas: {JSON.stringify(ultimoPago.cuotas_afectadas)}
              </p>
            )}
            {ultimoPago.saldo_restante != null && (
              <p className="text-xs font-bold text-green-800">
                Saldo restante: {formatPrice(parseFloat(ultimoPago.saldo_restante))}
              </p>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
            Observaciones
          </h2>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:border-green-600 focus:outline-hidden"
          />
          <button
            onClick={handleGuardarObs}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-50 cursor-pointer"
          >
            {actionLoading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Guardar observaciones
          </button>
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-black mb-4">Cuotas</h2>
          <CuotasTable
            cuotas={cuotas}
            loading={loadingCuotas}
            onToggleNotificaciones={handleToggleNotif}
            togglingId={togglingId}
          />
        </div>

        {showPagoForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <form
              onSubmit={handlePago}
              className="bg-white rounded-2xl p-6 w-full max-w-sm border border-gray-100 shadow-xl space-y-4"
            >
              <h3 className="font-extrabold text-black">Registrar pago</h3>
              {pagoError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2">
                  <AlertTriangle className="size-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-red-700">
                    {pagoError}
                  </p>
                </div>
              )}
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={montoPago}
                onChange={(e) => setMontoPago(e.target.value)}
                placeholder="Monto"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                onClick={() => {
                  setPagoError(null);
                  setShowPagoForm(false);
                }}
                  className="text-xs font-bold text-gray-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? "Procesando..." : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
