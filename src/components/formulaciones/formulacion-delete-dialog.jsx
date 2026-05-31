// components/formulaciones/formulacion-delete-dialog.jsx
"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

/**
 * Diálogo de confirmación para eliminar una o múltiples formulaciones
 */
export default function FormulacionDeleteDialog({
  open,
  item,
  productosMap,
  ingredientesMap,
  onClose,
  onConfirm,
}) {
  if (!open || !item) return null;

  // Normalizar a array
  const items = Array.isArray(item) ? item : [item];
  const firstItem = items[0];
  const producto = productosMap[firstItem.id_producto];
  const esEliminacionMultiple = items.length > 1;

  const handleConfirm = async () => {
    // Si es múltiple, eliminar todos; si no, solo uno
    if (esEliminacionMultiple) {
      const promises = items.map(f => onConfirm(f.id));
      await Promise.all(promises);
    } else {
      await onConfirm(firstItem.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl">
          {/* Icono de advertencia */}
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="size-6 text-red-600" />
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              {esEliminacionMultiple ? "¿Eliminar formulación completa?" : "¿Eliminar ingrediente?"}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              {esEliminacionMultiple 
                ? `Se eliminarán ${items.length} ingredientes de "${producto?.nombre}". Esta acción no se puede deshacer.`
                : "Esta acción no se puede deshacer."}
            </p>
          </div>

          {/* Resumen */}
          <div className="mb-6 rounded-xl bg-gray-50 p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-400 uppercase">Producto</span>
                <span className="text-sm font-medium text-gray-900">
                  {producto?.nombre || `#${firstItem.id_producto}`}
                </span>
              </div>
              
              {esEliminacionMultiple ? (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Ingredientes a eliminar:</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {items.map((ing, idx) => {
                      const ingredienteData = ingredientesMap[ing.id_ingrediente];
                      return (
                        <div key={ing.id} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white">
                          <span className="text-gray-700">{idx + 1}. {ingredienteData?.nombre || `#${ing.id_ingrediente}`}</span>
                          <span className="text-gray-500">{parseFloat(ing.porcentaje_ingrediente).toFixed(1)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400 uppercase">Ingrediente</span>
                    <span className="text-sm font-medium text-gray-900">
                      {ingredientesMap[firstItem.id_ingrediente]?.nombre || `#${firstItem.id_ingrediente}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-xs font-semibold text-gray-400 uppercase">Cantidad</span>
                    <span className="text-sm font-medium text-gray-900">
                      {parseFloat(firstItem.cantidad_ingrediente).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400 uppercase">Porcentaje</span>
                    <span className="text-sm font-medium text-orange-600">
                      {parseFloat(firstItem.porcentaje_ingrediente).toFixed(2)}%
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-red-500/20 hover:bg-red-600 transition-all cursor-pointer"
            >
              <AlertTriangle className="size-4" />
              Sí, eliminar{esEliminacionMultiple ? " todo" : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}