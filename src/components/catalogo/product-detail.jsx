"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Weight,
  CalendarClock,
  CalendarCheck2,
  Hash,
  ImageOff,
  CheckCircle2,
  AlertCircle,
  Leaf,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/format-price";
import QuantitySelector from "@/components/catalogo/quantity-selector";

/* ─────────────────────────── constantes ─────────────────────────── */

const CATEGORY_COLORS = {
  "Dieta Tradicional": {
    badge: "bg-amber-100 text-amber-700 border border-amber-200",
    accent: "text-amber-600",
    ring: "ring-amber-200",
  },
  "Dieta Premium": {
    badge: "bg-purple-100 text-purple-700 border border-purple-200",
    accent: "text-purple-600",
    ring: "ring-purple-200",
  },
  "Dieta Gatos": {
    badge: "bg-blue-100 text-blue-700 border border-blue-200",
    accent: "text-blue-600",
    ring: "ring-blue-200",
  },
  Snacks: {
    badge: "bg-orange-100 text-orange-700 border border-orange-200",
    accent: "text-orange-600",
    ring: "ring-orange-200",
  },
};

const CATEGORY_FALLBACK = {
  badge: "bg-green-100 text-green-700 border border-green-200",
  accent: "text-green-600",
  ring: "ring-green-200",
};

/* ─────────────────────────── sub-componentes ─────────────────────── */

function Breadcrumb({ productName }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
      <Link href="/home" className="hover:text-green-600 transition-colors">Inicio</Link>
      <ChevronRight size={12} />
      <Link href="/catalogo" className="hover:text-green-600 transition-colors">Catálogo</Link>
      <ChevronRight size={12} />
      <span className="text-gray-600 font-medium truncate max-w-[200px]">{productName}</span>
    </nav>
  );
}


function ImagePlaceholder({ category }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 gap-4">
      <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center">
        <ImageOff size={36} strokeWidth={1.2} className="text-gray-300" />
      </div>
      <span className="text-xs text-gray-400 font-medium">{category}</span>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-green-50 text-green-600 shrink-0">
        <Icon size={14} />
      </div>
      <span className="text-sm text-gray-500 flex-1 leading-tight">{label}</span>
      <span className="text-sm font-semibold text-gray-800 text-right">{value}</span>
    </div>
  );
}

function TrustBadge({ text }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <BadgeCheck size={14} className="text-green-500 shrink-0" />
      <span>{text}</span>
    </div>
  );
}

/* ─────────────────────────── componente principal ─────────────────── */

/**
 * ProductDetail — Vista detallada de un producto.
 *
 * @param {object}   product     - Producto completo (ver /data/products.js)
 * @param {function} onAddToCart - Callback al agregar al carrito: ({ product, quantity }) => void
 */
export default function ProductDetail({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [cartState, setCartState] = useState("idle"); // "idle" | "added"

  const colors = CATEGORY_COLORS[product.categoria] ?? CATEGORY_FALLBACK;
  const inStock = product.stock_actual > 0;
  const lowStock = product.stock_actual > 0 && product.stock_actual <= 10;

  const handleAddToCart = () => {
    if (!inStock) return;
    if (onAddToCart) onAddToCart({ product, quantity });
    // TODO: dispatch al store/contexto del carrito
    setCartState("added");
    setTimeout(() => setCartState("idle"), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Breadcrumb + Volver ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <Breadcrumb productName={product.nombre} />
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition-colors duration-200 mb-6 sm:mb-0 group"
          >
            <ArrowLeft
              size={15}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            Volver al catálogo
          </Link>
        </div>

        {/* ── Layout principal ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">

          {/* ══ COLUMNA IZQUIERDA — Imagen ══ */}
          <div className="flex flex-col gap-4">

            {/* Imagen principal */}
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm aspect-square">
              {!imgError ? (
                <img
                  src={product.image || "/images/products/placeholder.png"}
                  alt={product.nombre}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImagePlaceholder category={product.categoria || "Producto"} />
              )}

              {/* Badges flotantes sobre la imagen */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.badge}`}>
                  {product.categoria || "General"}
                </span>
                {lowStock && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-600 border border-red-200">
                    ¡Últimas unidades!
                  </span>
                )}
              </div>
            </div>

            {/* Tarjeta de confianza / garantías */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 grid grid-cols-2 gap-3">
              <TrustBadge text="100% Natural" />
              <TrustBadge text="Sin conservantes" />
              <TrustBadge text="Grado humano" />
              <TrustBadge text="Cadena de frío" />
            </div>
          </div>

          {/* ══ COLUMNA DERECHA — Info + acciones ══ */}
          <div className="flex flex-col gap-6">

            {/* Nombre */}
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl xl:text-4xl font-bold text-gray-800 leading-tight">
                {product.nombre}
              </h1>
            </div>

            {/* Precio + peso */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">
                  Precio por unidad
                </p>
                <p className="text-4xl font-bold text-green-600">
                  {formatPrice(parseFloat(product.precio || 0))}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Presentación: <span className="font-semibold text-gray-600">{product.unidad_medida || "1 unidad"}</span>
                </p>
              </div>

              {/* Indicador de stock */}
              <div className="text-right">
                {inStock ? (
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-semibold text-green-600">Disponible</span>
                    </div>
                    <span className="text-xs text-gray-400">{product.stock_actual} en stock</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="text-sm font-semibold text-red-500">Sin stock</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <h2 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Leaf size={14} className="text-green-500" />
                Descripción
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.Descripción || "Sin descripción detallada disponible."}
              </p>
            </div>


            {/* Composición del producto */}
            {product.composicion && product.composicion.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/80">
                  <h2 className="text-sm font-bold text-gray-700">
                    Composición del producto
                  </h2>
                </div>
                <div className="px-5 py-4">
                  <ul className="space-y-2">
                    {product.composicion.map((item, index) => (
                      <li key={index} className="flex items-center justify-between text-sm text-gray-600 border-b border-dashed border-gray-200 pb-2 last:border-0 last:pb-0">
                        <span>{item.ingrediente_nombre}</span>
                        <span className="font-semibold text-gray-800">{parseFloat(item.porcentaje_ingrediente)}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Selector cantidad + botón carrito */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Cantidad</span>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={product.stock_actual || 1}
                />
              </div>

              {/* Subtotal dinámico */}
              <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-3">
                <span className="text-gray-500">Subtotal estimado</span>
                <span className="font-bold text-gray-800 text-base">
                  {formatPrice(parseFloat(product.precio || 0) * quantity)}
                </span>
              </div>

              {/* Botón principal */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`
                  w-full flex items-center justify-center gap-3 py-4 rounded-2xl
                  text-white font-bold text-base tracking-wide
                  transition-all duration-300 select-none
                  ${cartState === "added"
                    ? "bg-green-500 scale-[0.99]"
                    : "bg-green-600 hover:bg-green-700 active:scale-[0.98]"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {cartState === "added" ? (
                  <>
                    <CheckCircle2 size={20} />
                    ¡Agregado al carrito!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    AGREGAR AL CARRITO
                  </>
                )}
              </button>

              {!inStock && (
                <p className="text-center text-xs text-red-400 -mt-1 flex items-center justify-center gap-1">
                  <AlertCircle size={12} />
                  Producto sin stock disponible
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
