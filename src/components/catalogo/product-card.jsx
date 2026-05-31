"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Eye, ImageOff } from "lucide-react";
import { formatPrice } from "@/lib/format-price";
import QuantitySelector from "@/components/catalogo/quantity-selector";

/**
 * Mapa de colores por categoría para el badge.
 */
const CATEGORY_COLORS = {
  "Dieta Tradicional": "bg-amber-100 text-amber-700",
  "Dieta Premium":     "bg-purple-100 text-purple-700",
  "Dieta Gatos":       "bg-blue-100 text-blue-700",
  Snacks:              "bg-orange-100 text-orange-700",
};


/**
 * Placeholder elegante cuando no hay imagen disponible.
 */
function ImagePlaceholder({ category }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300 gap-2">
      <ImageOff size={40} strokeWidth={1.5} />
      <span className="text-xs text-gray-400">{category}</span>
    </div>
  );
}

/**
 * ProductCard — Tarjeta de producto reutilizable.
 *
 * @param {object} product - Objeto producto (ver /data/products.js para estructura completa)
 * @param {function} onAddToCart - Callback al agregar al carrito. Recibe { product, quantity }
 */
export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  const badgeClass =
    CATEGORY_COLORS[product.category] ?? "bg-green-100 text-green-700";

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ product, quantity });
    }
    // TODO: conectar con store/carrito
  };

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden">

      {/* Imagen */}
      <div className="relative h-52 bg-gray-50 overflow-hidden">
        {!imgError ? (
          <img
            src={product.image || "/images/products/placeholder.png"}
            alt={product.nombre}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ImagePlaceholder category={product.categoria || "Producto"} />
        )}

        {/* Badge categoría */}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeClass}`}
        >
          {product.categoria || "General"}
        </span>

        {/* Badge stock bajo */}
        {product.stock_actual <= 10 && product.stock_actual > 0 && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
            ¡Últimas unidades!
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Nombre */}
        <h3 className="font-bold text-gray-800 text-base leading-snug line-clamp-2 group-hover:text-green-700 transition-colors duration-200">
          {product.nombre}
        </h3>

        {/* Descripción corta */}
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 flex-1">
          {product.Descripción || "Sin descripción"}
        </p>

        {/* Precio y peso */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-green-600 text-xl font-bold">
              {formatPrice(parseFloat(product.precio || 0))}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">{product.unidad_medida || "1 unidad"}</p>
          </div>
          {product.stock_actual > 0 ? (
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
              Disponible
            </span>
          ) : (
            <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded-full">
              Sin stock
            </span>
          )}
        </div>

        {/* Separador */}
        <div className="border-t border-gray-100" />

        {/* Botón ver detalles */}
        <Link
          href={`/catalogo/${product.id}`}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-green-600 text-green-600 text-sm font-medium hover:bg-green-600 hover:text-white transition-all duration-200"
        >
          <Eye size={15} />
          Ver detalles completos
        </Link>

        {/* Selector de cantidad + Botón carrito */}
        <div className="flex items-center justify-between gap-2">
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={product.stock_actual || 1}
          />
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock_actual === 0}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ShoppingCart size={15} />
            AL CARRITO
          </button>
        </div>
      </div>
    </article>
  );
}
