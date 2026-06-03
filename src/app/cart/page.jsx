"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Loader2, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Toaster, toast } from "sonner";

import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { cartService } from "@/services/cart.service";
import { formatPrice } from "@/lib/format-price";
import { openWompiWidget, loadWompiScript } from "@/lib/wompi";

export default function CartPage() {
  const router = useRouter();
  
  // Cart state
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Interactive UI states
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  
  // Delete item dialog state
  const [itemToDelete, setItemToDelete] = useState(null);

  // Load cart data
  async function fetchCart() {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error("Error loading cart:", err);
      setError(err.message || "No se pudo cargar el carrito de compras.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
    
    // Preload Wompi script in the background
    loadWompiScript().catch((err) => {
      console.warn("Wompi script preload warning (will retry on checkout click):", err);
    });
  }, []);

  // Update item quantity
  const handleUpdateQuantity = async (productId, currentQty, delta) => {
    console.log("productId:", productId);
    console.log("currentQty:", currentQty);
    const newQty = currentQty + delta;
    if (newQty < 1) return; // Prevent less than 1 quantity via controls (use trash icon instead)

    // Add to updating items set
    setUpdatingItems((prev) => {
      const next = new Set(prev);
      next.add(productId);
      return next;
    });

    try {
      // Optimistic state update for immediate user feedback
      setCart((prevCart) => {
        if (!prevCart) return prevCart;
        const updatedProducts = prevCart.productos.map((item) => {
          if (item.producto_id === productId) {
            return { ...item, cantidad: newQty };
          }
          return item;
        });
        
        // Recalculate subtotal locally
        const newSubtotal = updatedProducts.reduce((sum, item) => {
          return sum + (parseFloat(item.producto_precio) * item.cantidad);
        }, 0);

        return {
          ...prevCart,
          productos: updatedProducts,
          subtotal_carrito: newSubtotal.toFixed(2)
        };
      });

      // Call API
      await cartService.updateCartItem(productId, newQty);
      await fetchCart();
      toast.success("Cantidad actualizada correctamente");
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error(err.message || "Error al actualizar la cantidad del producto");
      
      // Revert optimistic update by reloading cart
      await fetchCart();
    } finally {
      // Remove from updating items
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  // Remove item from cart
  const handleRemoveItem = async () => {
    if (!itemToDelete) return;
    const productId = itemToDelete.producto_id;
    const productName = itemToDelete.producto_nombre;

    setUpdatingItems((prev) => {
      const next = new Set(prev);
      next.add(productId);
      return next;
    });
    setItemToDelete(null);

    try {
      await cartService.removeCartItem(productId);
      toast.success(`"${productName}" eliminado del carrito`);
      
      // Refresh cart data
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error(err.message || "No se pudo eliminar el producto del carrito");
      await fetchCart();
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  // Checkout and Wompi integration process
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // 1. Ejecutar el checkout actual y recibir la respuesta del backend
      const response = await cartService.checkout();
      console.log("Checkout response data:", response);

      if (!response) {
        throw new Error("Respuesta de checkout inválida del servidor.");
      }

      // 2. Validar que listo_para_pago sea true
      if (response.listo_para_pago !== true) {
        throw new Error("El pedido no se encuentra listo para procesar el pago.");
      }

      // 3. Validar datos de Wompi recibidos
      const wompiData = response.wompi;
      if (!wompiData) {
        throw new Error("Datos incompletos de Wompi en la respuesta del servidor.");
      }

      const { public_key, currency, amount_in_cents, reference, integrity } = wompiData;
      if (!public_key || !amount_in_cents || !reference) {
        throw new Error("Datos de transacción incompletos recibidos de la pasarela.");
      }

      // Guardar los datos en el estado local
      setCheckoutData(response);

      // 4. Abrir inmediatamente el Widget Oficial de Wompi y esperar a que termine
      let transaction = null;
      try {
        transaction = await openWompiWidget({
          publicKey: public_key,
          currency: currency || "COP",
          amountInCents: amount_in_cents,
          reference: reference,
          integrity: integrity
        });
        console.log("Resultado transacción Wompi:", transaction);
      } catch (widgetErr) {
        console.error("Error opening Wompi widget:", widgetErr);
        toast.error("Ocurrió un error al cargar o abrir la pasarela de pagos.");
      }

      // 5. Mostrar toast correspondiente según el resultado
      if (!transaction) {
        toast.info("Pago cancelado o cerrado por el usuario.");
      } else {
        const status = transaction.status;
        if (status === "APPROVED") {
          toast.success("¡Pago aprobado! Tu pedido ha sido procesado.");
          setCart(null); // Limpiar carrito localmente
        } else if (status === "DECLINED") {
          toast.error("El pago fue declinado. Intenta con otro medio de pago.");
        } else if (status === "ERROR") {
          toast.error("Ocurrió un error procesando el pago en Wompi.");
        } else if (status === "PENDING") {
          toast.info("Tu pago está pendiente de confirmación.");
          setCart(null);
        } else {
          toast.info(`Transacción finalizada con estado: ${status}`);
        }
      }

      // 6. Redirigir al usuario a /pedidos al terminar el proceso o cerrar el widget
      router.push("/pedidos");

    } catch (err) {
      console.error("Error during checkout integration workflow:", err);

      const message = err.message || "";

      if (
        message.toLowerCase().includes("pendiente") ||
        message.toLowerCase().includes("pedido pendiente")
      ) {
        toast.error("Ya tienes un pedido pendiente. Serás redirigido a Mis Pedidos.");

        setTimeout(() => {
          router.push("/pedidos");
        }, 3000);

        return;
      }

      toast.error(message || "Error al procesar el checkout");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Render Skeletons during initial load
  if (loading && !cart) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full flex-1 flex flex-col justify-center">
        <Skeleton className="h-10 w-48 mb-8 bg-zinc-200" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-32 w-full rounded-xl bg-zinc-200" />
            <Skeleton className="h-32 w-full rounded-xl bg-zinc-200" />
            <Skeleton className="h-32 w-full rounded-xl bg-zinc-200" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl bg-zinc-200" />
          </div>
        </div>
      </div>
    );
  }

  // Render Error state if loading failed
  if (error && !cart) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 w-full flex-1 flex flex-col items-center justify-center text-center">
        <Alert variant="destructive" className="max-w-md rounded-2xl border-red-200 bg-red-50 p-6 flex flex-col items-center gap-4">
          <AlertCircle className="h-10 w-10 text-red-600 animate-bounce" />
          <AlertTitle className="text-lg font-bold text-red-900">Error de carga</AlertTitle>
          <AlertDescription className="text-sm text-red-800 leading-relaxed">
            {error}
          </AlertDescription>
          <Button 
            onClick={fetchCart} 
            className="mt-2 bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-2 cursor-pointer"
          >
            Reintentar
          </Button>
        </Alert>
      </div>
    );
  }

  // Extract products
  const products = cart?.productos || [];
  const isEmpty = products.length === 0;

  return (
    <>
      <Toaster position="top-right" richColors closeButton expand={false} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full flex-1 flex flex-col justify-start">
        <h1 className="text-3xl font-bold text-zinc-800 mb-8 border-b border-zinc-100 pb-4">
          Carrito de compras
        </h1>

        {isEmpty ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
            <div className="bg-emerald-50 p-6 rounded-full mb-6">
              <ShoppingBag className="w-16 h-16 text-emerald-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-800 mb-2">Tu carrito está vacío</h2>
            <p className="text-zinc-500 max-w-sm mb-8 text-sm leading-relaxed">
              Parece que aún no has agregado ningún producto a tu carrito de compras. ¡Explora nuestro catálogo para encontrar el alimento ideal!
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
          // Cart Content Layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Products List (Left 2 Columns) */}
            <div className="lg:col-span-2 space-y-4">
              {products.map((item) => {
                const price = parseFloat(item.producto_precio);
                const subtotal = price * item.cantidad;
                const isItemUpdating = updatingItems.has(item.producto_id);

                return (
                  <Card key={item.id} className="overflow-hidden border-zinc-100 shadow-xs hover:shadow-sm transition-shadow duration-200">
                    <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      {/* Product Details */}
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg text-zinc-800">{item.producto_nombre}</h3>
                        <p className="text-sm text-zinc-500 font-medium">
                          Precio unitario: <span className="text-zinc-700">{formatPrice(price)}</span>
                        </p>
                      </div>

                      {/* Quantity Controls & Prices */}
                      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50/50 p-1">
                          <Button
                            variant="ghost"
                            onClick={() => handleUpdateQuantity(item.producto_id, item.cantidad, -1)}
                            disabled={item.cantidad <= 1 || isItemUpdating}
                            className="h-8 w-8 p-0 rounded-lg hover:bg-white text-zinc-600 disabled:opacity-50 cursor-pointer"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="w-10 text-center font-bold text-sm text-zinc-800">
                            {isItemUpdating ? (
                              <Loader2 className="w-4 h-4 animate-spin mx-auto text-emerald-600" />
                            ) : (
                              item.cantidad
                            )}
                          </span>

                          <Button
                            variant="ghost"
                            onClick={() => handleUpdateQuantity(item.producto_id, item.cantidad, 1)}
                            disabled={isItemUpdating}
                            className="h-8 w-8 p-0 rounded-lg hover:bg-white text-zinc-600 disabled:opacity-50 cursor-pointer"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Individual Item Subtotal */}
                        <div className="text-right min-w-[100px]">
                          <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Subtotal</p>
                          <p className="font-bold text-zinc-800 text-lg">
                            {formatPrice(subtotal)}
                          </p>
                        </div>

                        {/* Trash Button */}
                        <Button
                          variant="ghost"
                          onClick={() => setItemToDelete(item)}
                          disabled={isItemUpdating}
                          className="text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl h-10 w-10 p-0 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary Side panel (Right Column) */}
            <div className="lg:sticky lg:top-24 space-y-6">
              <Card className="border-zinc-100 shadow-xs bg-zinc-50/30">
                <CardHeader className="p-6 pb-4">
                  <h2 className="text-xl font-bold text-zinc-850">Resumen de compra</h2>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium text-zinc-500">
                    <span>Subtotal</span>
                    <span className="text-zinc-800 font-semibold">
                      {formatPrice(parseFloat(cart?.subtotal_carrito || "0"))}
                    </span>
                  </div>
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-bold text-red-700 mb-2">
                        Importante sobre la entrega
                    </p>

                    <p className="text-sm text-red-600 leading-relaxed">
                        Athletic Barf no realiza envíos ni domicilios.
                        El transporte de los productos corre completamente por cuenta del cliente.
                    </p>

                    <p className="text-sm text-red-600 leading-relaxed mt-2">
                        Puedes:
                    </p>

                    <ul className="mt-2 space-y-1 text-sm text-red-700 list-disc list-inside">
                        <li>Recoger tu pedido personalmente en la sucursal.</li>
                        <li>Enviar un domiciliario o transportador de tu confianza.</li>
                    </ul>
                </div>
                  <Separator className="bg-zinc-100" />
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-base font-bold text-zinc-850 font-heading">Total</p>
                      <p className="text-[10px] text-zinc-400 font-medium">IVA incluido</p>
                    </div>
                    <span className="text-2xl font-extrabold text-emerald-600">
                      {formatPrice(parseFloat(cart?.subtotal_carrito || "0"))}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-2">
                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || updatingItems.size > 0}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3.5 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        Proceder al pago
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Checkout details display for Wompi integration confirmation */}
              {checkoutData && (
                <Card className="border-emerald-100 bg-emerald-50/20 overflow-hidden shadow-xs animate-in fade-in slide-in-from-top-4 duration-200">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span>Checkout generado</span>
                    </div>
                    <p className="text-xs text-emerald-850/80 leading-relaxed">
                      El checkout se ha generado exitosamente en el servidor. El Widget flotante de Wompi ha sido inicializado.
                    </p>
                    <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100 text-[10px] font-mono text-zinc-700 break-all select-all">
                      {JSON.stringify(checkoutData)}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Confirmation Dialog for Deleting Cart Item */}
      <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent className="max-w-xs sm:max-w-sm rounded-2xl p-6 bg-white border border-zinc-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-800">
              ¿Eliminar producto?
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 mt-2 leading-relaxed">
              ¿Estás seguro de que deseas eliminar "{itemToDelete?.producto_nombre}" de tu carrito de compras?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex flex-row gap-3 justify-end bg-transparent border-t-0 p-0">
            <Button
              variant="outline"
              onClick={() => setItemToDelete(null)}
              className="rounded-xl border-zinc-200 text-zinc-700 font-medium px-4 py-2 hover:bg-gray-50 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRemoveItem}
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 cursor-pointer shadow-md shadow-orange-500/10"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
