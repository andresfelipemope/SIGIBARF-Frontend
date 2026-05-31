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
      console.error("❌ Error cargando datos de formulaciones:", err);
      const errorMsg = err?.detail || err?.message || err?.error || "Error al cargar los datos";
      setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  /** 
   * @param {Object} formData 
   * @returns {Promise<{ success: boolean, data?: Object, error?: string }>}
   */
  const createFormulacion = useCallback(async (formData) => {
    
    try {
      const nueva = await FormulacionesService.createFormulacion(formData);
      setFormulaciones((prev) => [...prev, nueva]);
      return { success: true, data: nueva };
      
    } catch (err) {
      console.error("❌ Error creando formulación:", err);
      const errorMsg = err?.detail 
        ? (typeof err.detail === 'object' ? Object.values(err.detail)[0] : err.detail)
        : err?.message || "Error al crear la formulación";
      return { success: false, error: errorMsg };
    }
  }, []);

  /**
   * @param {number|string} id 
   * @param {Object} formData
   * @returns {Promise<{ success: boolean, data?: Object, error?: string }>}
   */
  const updateFormulacion = useCallback(async (id, formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const actualizada = await FormulacionesService.patchFormulacion(id, formData);
      setFormulaciones((prev) =>
        prev.map((f) => (f.id === id ? actualizada : f))
      );
      setSuccess("Formulación actualizada correctamente");
      return { success: true, data: actualizada };
      
    } catch (err) {
      console.error("❌ Error actualizando formulación:", err);
      const errorMsg = err?.detail 
        ? (typeof err.detail === 'object' ? Object.values(err.detail)[0] : err.detail)
        : err?.message || "Error al actualizar";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * @param {number|string} id - ID de la formulación
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  const deleteFormulacion = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await FormulacionesService.deleteFormulacion(id);
      setFormulaciones((prev) => prev.filter((f) => f.id !== id));
      setSuccess("Formulación eliminada correctamente");
      return { success: true };
      
    } catch (err) {
      console.error("❌ Error eliminando formulación:", err);
      const errorMsg = err?.detail 
        ? (typeof err.detail === 'object' ? Object.values(err.detail)[0] : err.detail)
        : err?.message || "Error al eliminar";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  /**
   * @param {Array} lista 
   * @returns {Object} 
   */
  const getFormulacionesPorProducto = useCallback((lista) => {
    const source = lista || formulaciones;
    return source.reduce((acc, f) => {
      if (!acc[f.id_producto]) acc[f.id_producto] = [];
      acc[f.id_producto].push(f);
      return acc;
    }, {});
  }, [formulaciones]);

  /**
   * @param {Array} ingredientes - Array de formulaciones (producto-ingrediente)
   * @returns {number} Suma de porcentajes
   */
  const calcularTotalPorcentaje = useCallback((ingredientes) => {
    return ingredientes.reduce((sum, ing) => sum + parseFloat(ing.porcentaje_ingrediente || 0), 0);
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
    
    getFormulacionesPorProducto,  
    calcularTotalPorcentaje,      
  };
}