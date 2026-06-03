"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft,
  AlertCircle,
  Calendar,
  CreditCard,
  Loader2,
  CheckCircle2,
  Package,
  Clock,
  ExternalLink
} from "lucide-react";
import { Toaster, toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { pedidosService } from "@/services/pedidos.service";
import { openWompiWidget } from "@/lib/wompi";
import { formatPrice, formatDate } from "@/lib/format-price";

export default function PedidoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReattempting, setIsReattempting] = useState(false);

  // Cargar detalle del pedido
  async function fetchPedidoDetalle() {
    try {
      setLoading(true);
      setError(null);
      const data = await pedidosService.getPedidoDetalle(id);
      setPedido(data);
    } catch (err) {
      console.error("Error loading order details:", err);
      setError(err.message || "No se pudo cargar el detalle del pedido.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchPedidoDetalle();
    }
  }, [id]);

  // Reintentar pago con Wompi
  const handleReintentarPago = async () => {
    setIsReattempting(true);
    try {
      // 1. Obtener datos de pago del backend para este pedido
      const response = await pedidosService.pagarPedido(id);
      console.log("Pagar pedido response:", response);

      if (!response) {
        throw new Error("Respuesta inválida del servidor al solicitar reintento de pago.");
      }

      // 2. Validar datos de Wompi recibidos
      const wompiData = response.wompi;
      if (!wompiData) {
        throw new Error("El servidor no retornó la información de pago de Wompi.");
      }

      const { public_key, currency, amount_in_cents, reference, integrity } = wompiData;
      if (!public_key || !amount_in_cents || !reference) {
        throw new Error("Faltan campos obligatorios para iniciar la pasarela de pagos.");
      }

      // 3. Abrir el Widget de Wompi utilizando el helper compartido
      let transaction = null;
      try {
        transaction = await openWompiWidget({
          publicKey: public_key,
          currency: currency || "COP",
          amountInCents: amount_in_cents,
          reference: reference,
          integrity: integrity
        });
        console.log("Reintento pago Wompi transacción:", transaction);
      } catch (widgetErr) {
        console.error("Error opening Wompi widget on retry:", widgetErr);
        toast.error("Ocurrió un error al cargar o abrir la pasarela de pagos.");
      }

      // 4. Mostrar feedback correspondiente y refrescar
      if (!transaction) {
        toast.info("Pago cancelado o cerrado por el usuario.");
      } else {
        const status = transaction.status;
        if (status === "APPROVED") {
          toast.success("¡Pago aprobado con éxito!");
        } else if (status === "DECLINED") {
          toast.error("El pago fue declinado. Intenta con otro medio de pago.");
        } else if (status === "ERROR") {
          toast.error("Ocurrió un error procesando el pago en Wompi.");
        } else if (status === "PENDING") {
          toast.info("El pago está pendiente de confirmación.");
        } else {
          toast.info(`Transacción finalizada con estado: ${status}`);
        }
      }

      // Refrescar el detalle del pedido para actualizar el estado de pago
      await fetchPedidoDetalle();

    } catch (err) {
      console.error("Error reattempting payment:", err);
      toast.error(err.message || "Error al iniciar el proceso de pago.");
    } finally {
      setIsReattempting(false);
    }
  };

  // Determinar color de badge según estado
  const getStatusBadgeClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "approved" || s === "aprobado" || s === "pagado" || s === "exitoso") {
      return "bg-green-50 text-green-700 border-green-200";
    }
    if (s === "pending" || s === "pendiente" || s === "espera") {
      return "bg-orange-50 text-orange-700 border-orange-200";
    }
    return "bg-red-50 text-red-700 border-red-200";
  };

  const getStatusText = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "approved" || s === "aprobado" || s === "pagado" || s === "exitoso") return "Aprobado";
    if (s === "pending" || s === "pendiente" || s === "espera") return "Pendiente";
    if (s === "declined" || s === "declinado" || s === "rechazado") return "Declinado";
    if (s === "error") return "Error";
    return status || "Desconocido";
  };

  // Render Skeletons during loading
  if (loading && !pedido) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full flex-1 flex flex-col justify-center">
        <Skeleton className="h-6 w-32 mb-6 bg-zinc-200" />
        <Skeleton className="h-10 w-64 mb-8 bg-zinc-200" />
        <div className="space-y-6">
          <Skeleton className="h-44 w-full rounded-xl bg-zinc-200" />
          <Skeleton className="h-64 w-full rounded-xl bg-zinc-200" />
        </div>
      </div>
    );
  }

  // Render Error state
  if (error && !pedido) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 w-full flex-1 flex flex-col items-center justify-center text-center">
        <Alert variant="destructive" className="rounded-2xl border-red-200 bg-red-50 p-6 flex flex-col items-center gap-4">
          <AlertCircle className="h-10 w-10 text-red-600 animate-bounce" />
          <AlertTitle className="text-lg font-bold text-red-900">Error de carga</AlertTitle>
          <AlertDescription className="text-sm text-red-800 leading-relaxed">
            {error}
          </AlertDescription>
          <Button 
            onClick={fetchPedidoDetalle} 
            className="mt-2 bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-2 cursor-pointer"
          >
            Reintentar
          </Button>
        </Alert>
      </div>
    );
  }

  const numeroPedido = pedido.numero_pedido || pedido.id;
  const fecha = pedido.created_at || pedido.fecha;
  const status = pedido.estado_pago || pedido.estado;
  const total = parseFloat(pedido.precio_total || pedido.total || "0");
  const productos = pedido.productos || pedido.items || [];
  const isPendiente = (status || "").toLowerCase() === "pendiente" || (status || "").toLowerCase() === "pending";

  return (
    <>
      <Toaster position="top-right" richColors closeButton expand={false} />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full flex-1 flex flex-col justify-start">
        
        {/* Botón Volver */}
        <Button
          onClick={() => router.push("/pedidos")}
          variant="ghost"
          className="text-zinc-600 hover:text-zinc-950 flex items-center gap-2 p-0 h-auto hover:bg-transparent cursor-pointer mb-6 self-start font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a pedidos
        </Button>

        {/* Encabezado Pedido */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-800 font-heading">
              Pedido #{numeroPedido}
            </h1>
            <p className="text-sm text-zinc-500 font-medium mt-1 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-zinc-400" />
              Realizado el {formatDate(fecha)}
            </p>
          </div>
          <span className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold self-start sm:self-center ${getStatusBadgeClass(status)}`}>
            {getStatusText(status)}
          </span>
        </div>

        <div className="space-y-6">
          
          {/* Card Resumen Pago */}
          <Card className="border-zinc-100 shadow-xs">
            <CardHeader className="p-6 pb-4">
              <h2 className="text-lg font-bold text-zinc-850 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Resumen de pago
              </h2>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 font-medium">Subtotal</span>
                <span className="text-zinc-800 font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 font-medium">Envío / Entrega</span>
                <span className="text-zinc-500 font-medium text-xs">Por cuenta del cliente</span>
              </div>
              <Separator className="bg-zinc-100" />
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-zinc-850 font-heading">Total del pedido</span>
                <span className="text-2xl font-extrabold text-emerald-600">{formatPrice(total)}</span>
              </div>

              {/* Caja de alerta sobre entrega */}
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 mt-4">
                <p className="text-xs font-bold text-red-700 mb-1">
                  Nota sobre la recogida
                </p>
                <p className="text-xs text-red-600 leading-relaxed">
                  Recuerda que debes retirar tu pedido en sucursal o coordinar con un transportador externo de confianza.
                </p>
              </div>
            </CardContent>

            {/* Footer con Reintento de Pago */}
            {isPendiente && (
              <CardFooter className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-2.5 text-orange-600 text-xs font-semibold">
                  <Clock className="w-5 h-5 shrink-0 animate-pulse" />
                  <span>Tu pago está pendiente de procesamiento</span>
                </div>
                <Button
                  onClick={handleReintentarPago}
                  disabled={isReattempting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-2.5 px-6 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                >
                  {isReattempting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Reintentar pago
                      <ExternalLink className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>

          {/* Card Detalle de Productos */}
          <Card className="border-zinc-100 shadow-xs">
            <CardHeader className="p-6 pb-4">
              <h2 className="text-lg font-bold text-zinc-850 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                Productos del pedido
              </h2>
            </CardHeader>
            <CardContent className="p-6 pt-0 divide-y divide-zinc-100">
              {productos.map((item, idx) => {
                const nombre = item.producto_nombre || item.nombre || "Producto";
                const precio = parseFloat(item.producto_precio || item.precio || "0");
                const cantidad = item.cantidad || item.cantidad_productos || 1;
                const subtotal = precio * cantidad;

                return (
                  <div key={item.id || idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-zinc-800 text-sm sm:text-base">{nombre}</h3>
                      <p className="text-xs text-zinc-500 font-medium">
                        {cantidad} x {formatPrice(precio)}
                      </p>
                    </div>
                    <span className="font-bold text-zinc-700 text-sm sm:text-base shrink-0">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  );
}
