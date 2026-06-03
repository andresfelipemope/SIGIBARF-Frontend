"use client";

import { X } from "lucide-react";

export default function FormulacionDetail({
  open,
  item,
  productosMap,
  ingredientesMap,
  onClose,
}) {
  if (!open || !item) return null;

  const producto = productosMap[item.id_producto];
  const ingrediente = ingredientesMap[item.id_ingrediente];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl">
          {}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Detalle de Formulación
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          {}
          <div className="space-y-5">
            {}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
              <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-orange-700">
                  {producto?.nombre?.charAt(0)?.toUpperCase() || "P"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Producto
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {producto?.nombre || `Producto #${item.id_producto}`}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  ID: {item.id_producto}
                </p>
              </div>
            </div>

            {}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
              <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-green-700">
                  {ingrediente?.nombre?.charAt(0)?.toUpperCase() || "I"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Ingrediente
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {ingrediente?.nombre || `Ingrediente #${item.id_ingrediente}`}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {ingrediente?.unidad_medida || ""} • ID: {item.id_ingrediente}
                </p>
              </div>
            </div>

            {}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Cantidad
                </p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">
                  {parseFloat(item.cantidad_ingrediente).toFixed(2)}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-gray-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Porcentaje
                </p>
                <p className="text-2xl font-extrabold text-orange-600 mt-1">
                  {parseFloat(item.porcentaje_ingrediente).toFixed(2)}%
                </p>
              </div>
            </div>

            {}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                ID de relación:{" "}
                <span className="font-mono text-gray-600">{item.id}</span>
              </p>
            </div>
          </div>

          {}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-gray-800 transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
