import * as React from "react";
import { useState } from "react";
import { X, Loader2, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function MovimientoForm({
  isOpen,
  onClose,
  onSubmit,
  productos,
  creating,
}) {
  const [formData, setFormData] = useState({
    id_producto: "",
    tipo_movimiento: "AJUSTE",
    cantidad: "",
    comentarios: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    // Validaciones Locales
    const errors = {};
    if (!formData.id_producto) {
      errors.id_producto = "Debes seleccionar un producto";
    }
    if (!formData.cantidad || parseFloat(formData.cantidad) <= 0 || isNaN(Number(formData.cantidad))) {
      errors.cantidad = "La cantidad debe ser un número mayor a 0";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Enviar al hook padre
    const result = await onSubmit({
      id_producto: formData.id_producto,
      tipo_movimiento: "AJUSTE",
      cantidad: formData.cantidad,
      comentarios: formData.comentarios,
    });

    if (result.success) {
      // Limpiar formulario y cerrar
      setFormData({
        id_producto: "",
        tipo_movimiento: "AJUSTE",
        cantidad: "",
        comentarios: "",
      });
      onClose();
    } else {
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      } else {
        setFormError(result.error || "Ocurrió un error inesperado al registrar el movimiento.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">Gestión de Inventario</span>
            <h2 className="text-lg font-extrabold text-black">Registrar Operación de Inventario</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer"
            disabled={creating}
          >
            <X className="size-5 shrink-0" />
          </button>
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden">
          
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            
            {/* Error General */}
            {formError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 flex items-start gap-3.5">
                <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
                <span className="text-xs font-semibold leading-relaxed">{formError}</span>
              </div>
            )}

            {/* Selección de Producto */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                Producto <span className="text-red-500">*</span>
              </label>
              <select
                name="id_producto"
                value={formData.id_producto}
                onChange={handleInputChange}
                className={cn(
                  "w-full rounded-xl border bg-gray-50/50 px-4 py-2.5 text-sm text-black focus:bg-white focus:outline-hidden transition-all duration-200 cursor-pointer",
                  fieldErrors.id_producto ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-green-600"
                )}
                disabled={creating}
              >
                <option value="">Selecciona un producto...</option>
                {productos.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.nombre} — Stock: {prod.stock_actual ?? 0}
                  </option>
                ))}
              </select>
              {fieldErrors.id_producto && (
                <p className="text-red-500 text-xs mt-1.5 font-bold">
                  {Array.isArray(fieldErrors.id_producto) ? fieldErrors.id_producto[0] : fieldErrors.id_producto}
                </p>
              )}
            </div>

            {/* Fila: Tipo de Operación & Cantidad */}
            <div>

              {/* Cantidad */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Cantidad <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className={cn(
                    "w-full rounded-xl border bg-gray-50/50 px-4 py-2.5 text-sm text-black focus:bg-white focus:outline-hidden transition-all duration-200",
                    fieldErrors.cantidad ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-green-600"
                  )}
                  disabled={creating}
                  required
                />
                {fieldErrors.cantidad && (
                  <p className="text-red-500 text-xs mt-1.5 font-bold">
                    {Array.isArray(fieldErrors.cantidad) ? fieldErrors.cantidad[0] : fieldErrors.cantidad}
                  </p>
                )}
              </div>

              <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/50 p-3 text-xs font-medium text-blue-700 flex items-start gap-2">
                <Info className="size-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  La auditoría ajustará el inventario al stock físico real contado durante la validación.
                </span>
              </div>

            </div>

            {/* Comentarios */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                Comentarios / Observaciones
              </label>
              <textarea
                name="comentarios"
                value={formData.comentarios}
                onChange={handleInputChange}
                rows="3"
                placeholder="Indique el motivo del ajuste (ej. auditoría física mensual, diferencia encontrada en conteo, corrección de inventario...)"                
                className={cn(
                  "w-full rounded-xl border bg-gray-50/50 px-4 py-2.5 text-sm text-black focus:bg-white focus:outline-hidden transition-all duration-200 resize-none font-medium placeholder-gray-400",
                  fieldErrors.comentarios ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-green-600"
                )}
                disabled={creating}
              />
              {fieldErrors.comentarios && (
                <p className="text-red-500 text-xs mt-1.5 font-bold">
                  {Array.isArray(fieldErrors.comentarios) ? fieldErrors.comentarios[0] : fieldErrors.comentarios}
                </p>
              )}
            </div>
          </div>

          {/* Footer del Formulario */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              disabled={creating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 text-xs font-bold shadow-md hover:shadow-green-700/20 transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              {creating ? (
                <>
                  <Loader2 className="size-4 animate-spin shrink-0" />
                  Registrando...
                </>
              ) : (
                "Registrar Operación"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
