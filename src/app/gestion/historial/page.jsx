"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, History } from "lucide-react";
import { toast } from "sonner";

import { historialService } from "@/services/historialService";
import HistorialStats from "@/components/historial/HistorialStats";
import HistorialFilters from "@/components/historial/HistorialFilters";
import HistorialTable from "@/components/historial/HistorialTable";

const DEFAULT_FILTERS = {
  nombre: "",
  tipo: "Todos",
  movimiento: "Todos",
  fechaInicio: "",
  fechaFin: "",
};

export default function HistorialPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Base raw data fetched from API
  const [movimientos, setMovimientos] = useState([]);
  
  // Filter settings
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Fetch and unify movements and items
  const fetchHistorialData = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setLoading(true);
    }
    setError(null);

    try {
      // Fetch all 4 endpoints concurrently for maximum performance
      const [
        movIngredientes,
        movProductos,
        catIngredientes,
        catProductos
      ] = await Promise.all([
        historialService.getMovimientosIngredientes().catch(() => []),
        historialService.getMovimientosProductos().catch(() => []),
        historialService.getIngredientes().catch(() => []),
        historialService.getProductos().catch(() => [])
      ]);

      // Verify that movements are arrays
      const listIngredientes = Array.isArray(movIngredientes) ? movIngredientes : [];
      const listProductos = Array.isArray(movProductos) ? movProductos : [];
      
      // Build catalogs lookups for mapping IDs to names & measures
      const ingredientesMap = {};
      if (Array.isArray(catIngredientes)) {
        catIngredientes.forEach(ing => {
          ingredientesMap[ing.id] = {
            nombre: ing.nombre,
            unidad: ing.unidad_medida || "kg",
          };
        });
      }

      const productosMap = {};
      if (Array.isArray(catProductos)) {
        catProductos.forEach(prod => {
          productosMap[prod.id] = {
            nombre: prod.nombre,
          };
        });
      }

      // Map and consolidate both registers lists
      const consolidated = [
        ...listIngredientes.map(m => ({
          ...m,
          uniqueId: `ingrediente-${m.id}`,
          registroTipo: "Ingrediente",
          nombre: ingredientesMap[m.id_ingrediente]?.nombre || `Ingrediente #${m.id_ingrediente}`,
          unidad: ingredientesMap[m.id_ingrediente]?.unidad || "kg",
          cantidad: parseFloat(m.cantidad || 0),
          stock_anterior: parseFloat(m.stock_anterior || 0),
          stock_posterior: parseFloat(m.stock_posterior || 0),
          fechaParsed: new Date(m.fecha),
        })),
        ...listProductos.map(m => ({
          ...m,
          uniqueId: `producto-${m.id}`,
          registroTipo: "Producto",
          nombre: productosMap[m.id_producto]?.nombre || `Producto #${m.id_producto}`,
          unidad: "unidades",
          cantidad: parseFloat(m.cantidad || 0),
          stock_anterior: parseFloat(m.stock_anterior || 0),
          stock_posterior: parseFloat(m.stock_posterior || 0),
          fechaParsed: new Date(m.fecha),
        }))
      ];

      // Sort by date descending
      consolidated.sort((a, b) => b.fechaParsed - a.fechaParsed);

      setMovimientos(consolidated);
      
      // Toast notification for explicit user actions or initial loads
      if (!isSilent) {
        toast.success("Historial cargado correctamente");
      }
    } catch (err) {
      console.error("Error fetching inventory movements history:", err);
      setError(err.message || "No fue posible cargar el historial");
      toast.error("No fue posible cargar el historial");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount asynchronously to prevent cascading renders warning
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistorialData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchHistorialData]);

  // Apply filters on frontend dynamically
  const filteredMovimientos = movimientos.filter(item => {
    // 1. Search by Name
    if (filters.nombre) {
      const search = filters.nombre.toLowerCase();
      if (!item.nombre.toLowerCase().includes(search) && !item.comentarios?.toLowerCase().includes(search)) {
        return false;
      }
    }

    // 2. Filter by Registry Type (Todos / Ingrediente / Producto)
    if (filters.tipo !== "Todos" && item.registroTipo !== filters.tipo) {
      return false;
    }

    // 3. Filter by Movement Type (Todos / ENTRADA / SALIDA / AJUSTE)
    if (filters.movimiento !== "Todos" && item.tipo_movimiento !== filters.movimiento) {
      return false;
    }

    // 4. Filter by Date Range (Fecha Inicio & Fecha Fin)
    if (item.fecha) {
      const itemDateStr = item.fecha.split("T")[0]; // "YYYY-MM-DD"
      
      if (filters.fechaInicio && itemDateStr < filters.fechaInicio) {
        return false;
      }
      
      if (filters.fechaFin && itemDateStr > filters.fechaFin) {
        return false;
      }
    }

    return true;
  });

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    toast.success("Filtros restablecidos");
  };

  return (
    <div className="space-y-8 animate-fade-in text-black">
      
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight flex items-center gap-2">
            <History className="size-8 text-orange-500 shrink-0" />
            Historial de Inventario
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Registro unificado de todos los movimientos de stock para ingredientes y productos.
          </p>
        </div>
        <div>
          <button 
            onClick={() => fetchHistorialData(false)}
            disabled={loading}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-green-700 transition active:scale-[0.98] disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> 
            Actualizar
          </button>
        </div>
      </div>

      {/* 4 Stats Cards Dashboard */}
      <HistorialStats 
        data={movimientos} 
        loading={loading} 
      />

      {/* Filter and query controls */}
      <HistorialFilters 
        filters={filters} 
        setFilters={setFilters} 
        onReset={handleResetFilters} 
      />

      {/* Main consolidated unified history list */}
      <HistorialTable 
        data={filteredMovimientos} 
        loading={loading} 
      />

    </div>
  );
}
