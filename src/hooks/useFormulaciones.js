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

  const productosMap = useMemo(() => {
    return productos.reduce((acc, prod) => {
      acc[prod.id] = prod;
      return acc;
    }, {});
  }, [productos]);

  const ingredientesMap = useMemo(() => {
    return ingredientes.reduce((acc, ing) => {
      acc[ing.id] = ing;
      return acc;
    }, {});
  }, [ingredientes]);

  const handleApiResponse = (response, operationName) => {
    return response;
  };

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [formulacionesData, productosData, ingredientesData] = await Promise.all([
        FormulacionesService.getFormulaciones(),
        FormulacionesService.getProductos(),
        FormulacionesService.getIngredientes(),
      ]);
      
      setFormulaciones(handleApiResponse(formulacionesData, 'getFormulaciones'));
      setProductos(handleApiResponse(productosData, 'getProductos'));
      setIngredientes(handleApiResponse(ingredientesData, 'getIngredientes'));
      
    } catch (err) {
      console.error("❌ Error cargando formulaciones:", err);
      const errorMsg = err?.detail || err?.message || err?.error || "Error al cargar los datos";
      setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createFormulacion = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const nueva = await FormulacionesService.createFormulacion(formData);
      const data = handleApiResponse(nueva, 'createFormulacion');
      
      setFormulaciones((prev) => [...prev, data]);
      setSuccess("Formulación creada correctamente");
      return { success: true, data };
      
    } catch (err) {
      console.error("❌ Error creando formulación:", err);
      const errorMsg = err?.detail || err?.message || err?.error || "Error al crear la formulación";
      const finalError = typeof errorMsg === 'object' 
        ? Object.values(errorMsg)[0] || JSON.stringify(errorMsg) 
        : errorMsg;
      setError(finalError);
      return { success: false, error: finalError };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFormulacion = useCallback(async (id, formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const actualizada = await FormulacionesService.patchFormulacion(id, formData);
      const data = handleApiResponse(actualizada, 'patchFormulacion');
      
      setFormulaciones((prev) =>
        prev.map((f) => (f.id === id ? data : f))
      );
      setSuccess("Formulación actualizada correctamente");
      return { success: true, data };
      
    } catch (err) {
      console.error("❌ Error actualizando formulación:", err);
      const errorMsg = err?.detail || err?.message || err?.error || "Error al actualizar";
      const finalError = typeof errorMsg === 'object' 
        ? Object.values(errorMsg)[0] || JSON.stringify(errorMsg) 
        : errorMsg;
      setError(finalError);
      return { success: false, error: finalError };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFormulacion = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await FormulacionesService.deleteFormulacion(id);
      setFormulaciones((prev) => prev.filter((f) => f.id !== id));
      setSuccess("Formulación eliminada correctamente");
      return { success: true };
      
    } catch (err) {
      console.error("❌ Error eliminando formulación:", err);
      const errorMsg = err?.detail || err?.message || err?.error || "Error al eliminar";
      const finalError = typeof errorMsg === 'object' 
        ? Object.values(errorMsg)[0] || JSON.stringify(errorMsg) 
        : errorMsg;
      setError(finalError);
      return { success: false, error: finalError };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
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
  };
}