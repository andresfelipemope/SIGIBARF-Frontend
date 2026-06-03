"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  Calendar,
  CreditCard,
  Eye,
  Loader2,
} from "lucide-react";
import { Toaster, toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { pedidosService } from "@/services/pedidos.service";
import { formatPrice, formatDate } from "@/lib/format-price";

export default function PedidosPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar pedidos
  async function fetchPedidos() {
    try {
      setLoading(true);
      setError(null);
      const data = await pedidosService.getMisPedidos();
      setPedidos(data?.results || []);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError(err.message || "No se pudieron cargar tus pedidos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPedidos();
  }, []);

  // Determinar color de badge según estado
  const getStatusBadgeClass = (status) => {
    const s = (status || "").toLowerCase();
    if (
      s === "approved" ||
      s === "aprobado" ||
      s === "pagado" ||
      s === "exitoso"
    ) {
      return "bg-green-50 text-green-700 border-green-200";
    }
    if (s === "pending" || s === "pendiente" || s === "espera") {
      return "bg-orange-50 text-orange-700 border-orange-200";
    }
    return "bg-red-50 text-red-700 border-red-200";
  };

  const getStatusText = (status) => {
    const s = (status || "").toLowerCase();
    if (
      s === "approved" ||
      s === "aprobado" ||
      s === "pagado" ||
      s === "exitoso"
    )
      return "Aprobado";
    if (s === "pending" || s === "pendiente" || s === "espera")
      return "Pendiente";
    if (s === "declined" || s === "declinado" || s === "rechazado")
      return "Declinado";
    if (s === "error") return "Error";
    return status || "Desconocido";
  };

  // Render Skeletons during initial load
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full flex-1 flex flex-col justify-start">
        <Skeleton className="h-10 w-48 mb-8 bg-zinc-200" />
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-xl bg-zinc-200" />
          <Skeleton className="h-28 w-full rounded-xl bg-zinc-200" />
          <Skeleton className="h-28 w-full rounded-xl bg-zinc-200" />
        </div>
      </div>
    );
  }

  // Render Error state
  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 w-full flex-1 flex flex-col items-center justify-center text-center">
        <Alert
          variant="destructive"
          className="rounded-2xl border-red-200 bg-red-50 p-6 flex flex-col items-center gap-4"
        >
          <AlertCircle className="h-10 w-10 text-red-600 animate-bounce" />
          <AlertTitle className="text-lg font-bold text-red-900">
            Error de carga
          </AlertTitle>
          <AlertDescription className="text-sm text-red-800 leading-relaxed">
            {error}
          </AlertDescription>
          <Button
            onClick={fetchPedidos}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-2 cursor-pointer animate-pulse"
          >
            Reintentar
          </Button>
        </Alert>
      </div>
    );
  }

  const hasPedidos = pedidos.length > 0;

  return (
    <>
      <Toaster position="top-right" richColors closeButton expand={false} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full flex-1 flex flex-col justify-start">
        <h1 className="text-3xl font-bold text-zinc-800 mb-8 border-b border-zinc-100 pb-4">
          Mis Pedidos
        </h1>

        {!hasPedidos ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
            <div className="bg-zinc-50 p-6 rounded-full mb-6">
              <ShoppingBag className="w-16 h-16 text-zinc-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-850 mb-2">
              No tienes pedidos
            </h2>
            <p className="text-zinc-500 max-w-sm mb-8 text-sm leading-relaxed">
              Aún no has registrado ninguna compra en nuestra tienda. ¡Visita el
              catálogo para realizar tu primer pedido!
            </p>
            <Button
              onClick={() => router.push("/catalogo")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold px-8 py-3.5 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              Ir al catálogo
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          // Orders List
          <div className="space-y-4">
            {pedidos.map((pedido) => {
              const pedidoId = pedido.id;
              const numeroPedido = pedido.numero_pedido || pedido.id;
              const fecha =
                pedido.fecha_creacion || pedido.created_at || pedido.fecha;
              const status = pedido.estado_pago || pedido.estado;
              const total = parseFloat(
                pedido.precio_total || pedido.total || "0",
              );

              return (
                <Card
                  key={pedidoId}
                  className="overflow-hidden border-zinc-100 shadow-xs hover:shadow-sm transition-all duration-200"
                >
                  <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Detalles Principales */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-extrabold text-lg text-zinc-850 font-heading">
                          Pedido #{numeroPedido}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(status)}`}
                        >
                          {getStatusText(status)}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-zinc-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          {formatDate(fecha)}
                        </span>
                        <span className="hidden sm:inline text-zinc-300">
                          |
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                          Total:{" "}
                          <strong className="text-zinc-700">
                            {formatPrice(total)}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Botón Ver Detalle */}
                    <div className="w-full sm:w-auto flex justify-end">
                      <Button
                        onClick={() => router.push(`/pedidos/${pedidoId}`)}
                        variant="outline"
                        className="rounded-xl border-zinc-200 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 font-semibold flex items-center gap-2 px-4 py-2 cursor-pointer w-full sm:w-auto"
                      >
                        <Eye className="w-4 h-4" />
                        Ver detalle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
