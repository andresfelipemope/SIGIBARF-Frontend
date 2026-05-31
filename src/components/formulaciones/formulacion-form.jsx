"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";

export default function FormulacionForm({
  open,
  productos,
  ingredientes,
  editData,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    id_producto: "",
    id_ingrediente: "",
    cantidad_ingrediente: "",
    porcentaje_ingrediente: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open) {
      if (editData) {
        setFormData({
          id_producto: editData.id_producto,
          id_ingrediente: editData.id_ingrediente,
          cantidad_ingrediente: editData.cantidad_ingrediente,
          porcentaje_ingrediente: editData.porcentaje_ingrediente,
        });
      } else {
        setFormData({
          id_producto: "",
          id_ingrediente: "",
          cantidad_ingrediente: "",
          porcentaje_ingrediente: "",
        });
      }
      setErrors({});
      setTouched({});
    }
  }, [open, editData]);

  const validate = () => {
    const newErrors = {};

    if (!formData.id_producto) {
      newErrors.id_producto = "El producto es requerido";
    }
    if (!formData.id_ingrediente) {
      newErrors.id_ingrediente = "El ingrediente es requerido";
    }
    if (!formData.cantidad_ingrediente || parseFloat(formData.cantidad_ingrediente) <= 0) {
      newErrors.cantidad_ingrediente = "La cantidad debe ser mayor a 0";
    }
    if (!formData.porcentaje_ingrediente) {
      newErrors.porcentaje_ingrediente = "El porcentaje es requerido";
    } else {
      const pct = parseFloat(formData.porcentaje_ingrediente);
      if (pct <= 0) {
        newErrors.porcentaje_ingrediente = "El porcentaje debe ser mayor a 0";
      } else if (pct > 100) {
        newErrors.porcentaje_ingrediente = "El porcentaje no puede exceder 100%";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    let error = null;

    switch (name) {
      case "id_producto":
        if (!value) error = "El producto es requerido";
        break;
      case "id_ingrediente":
        if (!value) error = "El ingrediente es requerido";
        break;
      case "cantidad_ingrediente":
        if (!value || parseFloat(value) <= 0) {
          error = "La cantidad debe ser mayor a 0";
        }
        break;
      case "porcentaje_ingrediente":
        if (!value) {
          error = "El porcentaje es requerido";
        } else {
          const pct = parseFloat(value);
          if (pct <= 0) error = "Debe ser mayor a 0";
          else if (pct > 100) error = "No puede exceder 100%";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({
      id_producto: true,
      id_ingrediente: true,
      cantidad_ingrediente: true,
      porcentaje_ingrediente: true,
    });

    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await onSave(formData);
      if (result?.success) {
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg transform rounded-2xl bg-white p-6 shadow-2xl transition-all">
          {}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {editData ? "Editar Formulación" : "Nueva Formulación"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {editData 
                  ? "Modifica los valores de esta relación producto-ingrediente"
                  : "Define los ingredientes y cantidades para un producto"}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={submitting}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
            >
              <X className="size-5" />
            </button>
          </div>

          {}
          <form onSubmit={handleSubmit} className="space-y-5">
            {}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Producto <span className="text-red-500">*</span>
              </label>
              <select
                name="id_producto"
                value={formData.id_producto}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={submitting || !!editData}
                className={`w-full rounded-xl border px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  errors.id_producto && touched.id_producto
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <option value="">Seleccionar producto...</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
              {errors.id_producto && touched.id_producto && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="size-3" />
                  {errors.id_producto}
                </p>
              )}
            </div>

            {}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ingrediente <span className="text-red-500">*</span>
              </label>
              <select
                name="id_ingrediente"
                value={formData.id_ingrediente}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={submitting}
                className={`w-full rounded-xl border px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  errors.id_ingrediente && touched.id_ingrediente
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <option value="">Seleccionar ingrediente...</option>
                {ingredientes.map((ing) => (
                  <option key={ing.id} value={ing.id}>
                    {ing.nombre} ({ing.unidad_medida})
                  </option>
                ))}
              </select>
              {errors.id_ingrediente && touched.id_ingrediente && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="size-3" />
                  {errors.id_ingrediente}
                </p>
              )}
            </div>

            {}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cantidad <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="cantidad_ingrediente"
                  step="0.01"
                  min="0.01"
                  value={formData.cantidad_ingrediente}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={submitting}
                  placeholder="0.00"
                  className={`w-full rounded-xl border px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.cantidad_ingrediente && touched.cantidad_ingrediente
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                {errors.cantidad_ingrediente && touched.cantidad_ingrediente && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="size-3" />
                    {errors.cantidad_ingrediente}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Porcentaje (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="porcentaje_ingrediente"
                  step="0.01"
                  min="0.01"
                  max="100"
                  value={formData.porcentaje_ingrediente}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={submitting}
                  placeholder="0.00"
                  className={`w-full rounded-xl border px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.porcentaje_ingrediente && touched.porcentaje_ingrediente
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                {errors.porcentaje_ingrediente && touched.porcentaje_ingrediente && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="size-3" />
                    {errors.porcentaje_ingrediente}
                  </p>
                )}
              </div>
            </div>

            {}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  editData ? "Actualizar" : "Crear Formulación"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}