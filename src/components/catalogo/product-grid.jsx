"use client";

import ProductCard from "@/components/catalogo/product-card";
import { PackageSearch } from "lucide-react";

/**
 * ProductGrid — Grid responsive de tarjetas de producto.
 *
 * @param {Array} products - Lista de productos a mostrar
 * @param {boolean} isLoading - Muestra skeleton mientras carga
 * @param {function} onAddToCart - Callback al agregar producto al carrito
 * @param {function} onUpdateQuantity - Callback para actualizar cantidad en carrito
 * @param {Object} cartMap - Mapa de cantidades por producto
 * @param {Object} updatingItems - Elementos en estado de actualización
 */
export default function ProductGrid({
  products,
  isLoading = false,
  onAddToCart,
  onUpdateQuantity,
  cartMap = {},
  updatingItems = {},
}) {
  // Estado de carga — skeleton cards
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse"
          >
            <div className="h-52 bg-gray-100" />
            <div className="p-4 flex flex-col gap-3">
              <div className="h-3 w-20 bg-gray-100 rounded-full" />
              <div className="h-4 w-3/4 bg-gray-100 rounded-full" />
              <div className="h-3 w-full bg-gray-100 rounded-full" />
              <div className="h-3 w-5/6 bg-gray-100 rounded-full" />
              <div className="h-6 w-1/3 bg-gray-100 rounded-full mt-2" />
              <div className="h-10 w-full bg-gray-100 rounded-xl mt-1" />
              <div className="h-10 w-full bg-gray-100 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Estado vacío
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <PackageSearch size={28} className="text-gray-400" />
        </div>
        <div>
          <p className="text-gray-700 font-semibold text-lg">
            No encontramos productos
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Intenta con otra búsqueda o categoría
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          cartQuantity={cartMap[product.id]}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
          isUpdating={Boolean(updatingItems[product.id])}
        />
      ))}
    </div>
  );
}
