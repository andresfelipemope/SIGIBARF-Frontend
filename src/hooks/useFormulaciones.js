"use client";

import { useState, useCallback, useMemo } from "react";
import { FormulacionesService } from "@/services/formulaciones.service";

export function useFormulaciones() {
  const [formulaciones, setFormulaciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosSinReceta, setProductosSinReceta] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const productosMap = useMemo(
    () => productos.reduce((acc, prod) => ({ ...acc, [prod.id]: prod }), {}),
    [productos],
  );

  const ingredientesMap = useMemo(
    () => ingredientes.reduce((acc, ing) => ({ ...acc, [ing.id]: ing }), {}),
    [ingredientes],
  );

  const getErrorMessage = useCallback((err) => {
    if (err?.data?.detail) {
      if (typeof err.data.detail === "object") {
        return Object.values(err.data.detail)[0];
      }
      return err.data.detail;
    }
    if (err?.detail) {
      if (typeof err.detail === "object") {
        return Object.values(err.detail)[0];
      }
      return err.detail;
    }
    return err?.message || "Error al realizar la operación";
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [formulacionesData, productosData, productosSinRecetaData, ingredientesData] =
        await Promise.all([
          FormulacionesService.getFormulaciones(),
          FormulacionesService.getProductos(),
          FormulacionesService.getProductos(true),
          FormulacionesService.getIngredientes(),
        ]);

      setFormulaciones(formulacionesData || []);
      setProductos(productosData || []);
      setProductosSinReceta(productosSinRecetaData || []);
      setIngredientes(ingredientesData || []);
    } catch (err) {
      console.error("❌ Error cargando datos:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [getErrorMessage]);

  const createFormulacion = useCallback(async (formData) => {
    try {
      const nueva = await FormulacionesService.createFormulacion(formData);
      await loadAllData();
      return { success: true, data: nueva };
    } catch (err) {
      console.error("❌ Error creando:", err);
      return { success: false, error: getErrorMessage(err) };
    }
  }, [loadAllData, getErrorMessage]);

  const updateFormulacion = useCallback(async (id, formData) => {
    try {
      // In the new backend, updates also register the entire list of ingredients in a single POST.
      // So we call createFormulacion with the new ingredient list.
      const actualizada = await FormulacionesService.createFormulacion(formData);
      await loadAllData();
      return { success: true, data: actualizada };
    } catch (err) {
      console.error("❌ Error actualizando:", err);
      return { success: false, error: getErrorMessage(err) };
    }
  }, [loadAllData, getErrorMessage]);

  const deleteFormulacion = useCallback(async (id) => {
    try {
      await FormulacionesService.deleteFormulacion(id);
      setFormulaciones((prev) => prev.filter((f) => f.id !== id));
      // Reload in case product recipes status changes
      await loadAllData();
      return { success: true };
    } catch (err) {
      console.error("❌ Error eliminando:", err);
      return { success: false, error: getErrorMessage(err) };
    }
  }, [loadAllData, getErrorMessage]);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const showSuccess = useCallback((message) => {
    setError(null);
    setSuccess(message);
  }, []);

  return {
    formulaciones,
    productos,
    productosSinReceta,
    ingredientes,
    productosMap,
    ingredientesMap,
    loading,
    error,
    success,
    loadAllData,
    createFormulacion,
    updateFormulacion,
    deleteFormulacion,
    clearMessages,
    showSuccess,
  };
}
