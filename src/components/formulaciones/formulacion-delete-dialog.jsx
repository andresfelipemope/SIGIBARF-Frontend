"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";


export default function FormulacionDeleteDialog({
  open,
  item,
  productosMap,
  ingredientesMap,
  onClose,
  onConfirm,
}) {
  if (!open || !item) return null;

  const producto = productosMap[item.id_producto];
  const ingrediente = ingredientesMap[item.id_ingrediente];

  const handleConfirm = async () => {
    await onConfirm(item.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl">
          {/* Icono de advertencia */}
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="size-6 text-red-600" />
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">¿Eliminar formulación?</h3>
            <p className="text-sm text-gray-500 mt-2">
              Esta acción no se puede deshacer. Se eliminará la relación entre el producto y el ingrediente.
            </p>
          </div>

          {/* Resumen del item */}
          <div className="mb-6 rounded-xl bg-gray-50 p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-400 uppercase">Producto</span>
                <span className="text-sm font-medium text-gray-900">
                  {producto?.nombre || `#${item.id_producto}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-400 uppercase">Ingrediente</span>
                <span className="text-sm font-medium text-gray-900">
                  {ingrediente?.nombre || `#${item.id_ingrediente}`}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-xs font-semibold text-gray-400 uppercase">Cantidad</span>
                <span className="text-sm font-medium text-gray-900">
                  {parseFloat(item.cantidad_ingrediente).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-400 uppercase">Porcentaje</span>
                <span className="text-sm font-medium text-orange-600">
                  {parseFloat(item.porcentaje_ingrediente).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={false}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-red-500/20 hover:bg-red-600 transition-all cursor-pointer"
            >
              <AlertTriangle className="size-4" />
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}