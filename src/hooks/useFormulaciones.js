// hooks/useFormulaciones.js
"use client";

import { useState, useCallback, useMemo } from "react";
import { FormulacionesService } from "@/services/formulaciones.service";

export function useFormulaciones() {
  const [formulaciones, setFormulaciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const productosMap = useMemo(() => 
    productos.reduce((acc, prod) => ({ ...acc, [prod.id]: prod }), {}), 
    [productos]
  );

  const ingredientesMap = useMemo(() => 
    ingredientes.reduce((acc, ing) => ({ ...acc, [ing.id]: ing }), {}), 
    [ingredientes]
  );

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [formulacionesData, productosData, ingredientesData] = await Promise.all([
        FormulacionesService.getFormulaciones(),
        FormulacionesService.getProductos(),
        FormulacionesService.getIngredientes(),
      ]);
      
      setFormulaciones(formulacionesData || []);
      setProductos(productosData || []);
      setIngredientes(ingredientesData || []);
      
    } catch (err) {
      console.error("❌ Error cargando datos:", err);
      setError(err?.detail || err?.message || err?.error || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, []);

  const createFormulacion = useCallback(async (formData) => {
    try {
      const nueva = await FormulacionesService.createFormulacion(formData);
      setFormulaciones((prev) => [...prev, nueva]);
      return { success: true, data: nueva };
    } catch (err) {
      console.error("❌ Error creando:", err);
      const errorMsg = err?.detail ? (typeof err.detail === 'object' ? Object.values(err.detail)[0] : err.detail) : err?.message || "Error al crear";
      return { success: false, error: errorMsg };
    }
  }, []);

  const updateFormulacion = useCallback(async (id, formData) => {
    try {
      const actualizada = await FormulacionesService.patchFormulacion(id, formData);
      setFormulaciones((prev) => prev.map((f) => (f.id === id ? actualizada : f)));
      return { success: true, data: actualizada };
    } catch (err) {
      console.error("❌ Error actualizando:", err);
      const errorMsg = err?.detail ? (typeof err.detail === 'object' ? Object.values(err.detail)[0] : err.detail) : err?.message || "Error al actualizar";
      return { success: false, error: errorMsg };
    }
  }, []);

  const deleteFormulacion = useCallback(async (id) => {
    try {
      await FormulacionesService.deleteFormulacion(id);
      setFormulaciones((prev) => prev.filter((f) => f.id !== id));
      return { success: true };
    } catch (err) {
      console.error("❌ Error eliminando:", err);
      const errorMsg = err?.detail ? (typeof err.detail === 'object' ? Object.values(err.detail)[0] : err.detail) : err?.message || "Error al eliminar";
      return { success: false, error: errorMsg };
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  // ⭐ NUEVO: Permite disparar mensajes de éxito explícitos
  const showSuccess = useCallback((message) => {
    setError(null);
    setSuccess(message);
  }, []);

  return {
    formulaciones,
    productos,
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
    showSuccess, // ⭐ Exportado
  };
}