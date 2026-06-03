"use client";

import { useState } from "react";
import { X, AlertTriangle, Loader2, Factory, Info } from "lucide-react";
import { produccionesService } from "@/services/producciones.service";

export default function ProduccionForm({ productos, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    id_producto: "",
    cantidad_producida: "",
    fecha_vencimiento: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Solo mostrar productos activos en el form
  const productosActivos = productos.filter((p) => !p.inhabilitado);

  // Selected product to show current stock info
  const selectedProduct = productosActivos.find(
    (p) => p.id.toString() === formData.id_producto,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Frontend validations
    if (!formData.id_producto) {
      setError("Por favor, selecciona un producto.");
      return;
    }

    const cantidad = parseInt(formData.cantidad_producida, 10);
    if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
      setError("La cantidad producida debe ser un número entero mayor a cero.");
      return;
    }

    if (!formData.fecha_vencimiento) {
      setError("Por favor, selecciona una fecha de vencimiento.");
      return;
    }

    try {
      setLoading(true);
      await produccionesService.createProduccion({
        id_producto: parseInt(formData.id_producto, 10),
        cantidad_producida: cantidad,
        fecha_vencimiento: formData.fecha_vencimiento,
      });

      onSuccess("Producción registrada con éxito. Inventario actualizado.");
    } catch (err) {
      // Mostrar exactamente el error que viene del backend en `detail` o `message`
      setError(
        err.message ||
          "Error al registrar la producción. Verifica el stock de ingredientes.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 border border-orange-200">
              <Factory className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-black">
                Registrar Producción
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Convierte ingredientes en producto final
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-2 animate-slide-in-right">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Producto a Fabricar <span className="text-red-500">*</span>
              </label>
              <select
                name="id_producto"
                value={formData.id_producto}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    id_producto: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-semibold text-black focus:border-orange-500 focus:bg-white focus:outline-hidden transition-all"
                disabled={loading}
              >
                <option value="">Selecciona un producto...</option>
                {productosActivos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                <Info className="size-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900">
                    Stock Actual del Producto
                  </h4>
                  <p className="text-xs text-blue-800 mt-1">
                    Actualmente tienes{" "}
                    <strong className="font-extrabold">
                      {selectedProduct.stock_actual} unidades
                    </strong>{" "}
                    en inventario. El registro de esta producción incrementará
                    este valor.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Cantidad Producida <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="cantidad_producida"
                  value={formData.cantidad_producida}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cantidad_producida: e.target.value,
                    }))
                  }
                  min="1"
                  step="1"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-black font-semibold focus:border-orange-500 focus:bg-white focus:outline-hidden transition-all"
                  placeholder="Ej. 100"
                  disabled={loading}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs uppercase">
                  Unidades
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-2">
                Se descontarán automáticamente los ingredientes de tu inventario
                según la fórmula registrada.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Fecha de Vencimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fecha_vencimiento"
                value={formData.fecha_vencimiento}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fecha_vencimiento: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-black font-semibold focus:border-orange-500 focus:bg-white focus:outline-hidden transition-all"
                disabled={loading}
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-orange-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar Producción"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
