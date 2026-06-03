import { useState, useEffect, useCallback, useMemo } from "react";
import { movimientosProductoService } from "@/services/movimientosProducto";
import { toast } from "sonner";

export function useMovimientosProducto() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [productoFilter, setProductoFilter] = useState("todos");
  const [fechaFilter, setFechaFilter] = useState(""); // Formato: YYYY-MM-DD

  // Carga de datos
  const fetchMovimientos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await movimientosProductoService.getMovimientos();
      setMovimientos(data || []);
    } catch (err) {
      console.error("Error fetching movements:", err);
      setError(err.message || "Error al obtener los movimientos de productos");
      toast.error(
        err.message || "No se pudieron cargar los movimientos de productos",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Registro de un nuevo movimiento
  const createMovimiento = useCallback(
    async (payload, onSuccess) => {
      try {
        setCreating(true);
        const response =
          await movimientosProductoService.createMovimiento(payload);
        toast.success("Movimiento registrado correctamente");

        // Refrescar listado de movimientos
        await fetchMovimientos();

        if (onSuccess) onSuccess(response);
        return { success: true, data: response };
      } catch (err) {
        console.error("Error creating movement:", err);
        const errorMsg =
          err.message || "Error al registrar el movimiento de producto";
        toast.error(errorMsg);
        return {
          success: false,
          error: errorMsg,
          fieldErrors: err.data || null,
        };
      } finally {
        setCreating(false);
      }
    },
    [fetchMovimientos],
  );

  // Cargar al montar
  useEffect(() => {
    fetchMovimientos();
  }, [fetchMovimientos]);

  // Limpiar todos los filtros
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setTipoFilter("todos");
    setProductoFilter("todos");
    setFechaFilter("");
  }, []);

  // Lógica de filtrado en frontend
  const filteredMovimientos = useMemo(() => {
    return movimientos.filter((mov) => {
      // 1. Filtro por término de búsqueda (nombre del producto o comentario)
      const productoNombre = mov.producto_nombre || mov.producto?.nombre || "";
      const comentarios = mov.comentarios || "";
      const matchSearch =
        productoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comentarios.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(mov.id).includes(searchTerm);

      // 2. Filtro por tipo de movimiento
      const matchTipo =
        tipoFilter === "todos" ||
        mov.tipo_movimiento?.toUpperCase() === tipoFilter.toUpperCase();

      // 3. Filtro por producto (ID)
      const movProductoId = mov.id_producto || mov.producto?.id || "";
      const matchProducto =
        productoFilter === "todos" ||
        String(movProductoId) === String(productoFilter);

      // 4. Filtro por fecha (YYYY-MM-DD)
      let matchFecha = true;
      if (fechaFilter) {
        const movDate = mov.fecha_registro || mov.created_at || "";
        // Extraer YYYY-MM-DD del datetime de la base de datos
        const formattedMovDate = movDate.substring(0, 10);
        matchFecha = formattedMovDate === fechaFilter;
      }

      return matchSearch && matchTipo && matchProducto && matchFecha;
    });
  }, [movimientos, searchTerm, tipoFilter, productoFilter, fechaFilter]);

  // Estadísticas rápidas computadas en caliente
  const stats = useMemo(() => {
    let total = 0;
    let entradas = 0;
    let salidas = 0;
    let ajustes = 0;

    movimientos.forEach((mov) => {
      total += 1;
      const tipo = mov.tipo_movimiento?.toUpperCase();
      if (tipo === "ENTRADA") {
        entradas += 1;
      } else if (tipo === "SALIDA") {
        salidas += 1;
      } else if (tipo === "AJUSTE") {
        ajustes += 1;
      }
    });

    return { total, entradas, salidas, ajustes };
  }, [movimientos]);

  return {
    movimientos,
    filteredMovimientos,
    loading,
    error,
    creating,
    createMovimiento,
    refetchMovimientos: fetchMovimientos,
    // Estados de filtros
    searchTerm,
    setSearchTerm,
    tipoFilter,
    setTipoFilter,
    productoFilter,
    setProductoFilter,
    fechaFilter,
    setFechaFilter,
    clearFilters,
    // Estadísticas
    stats,
  };
}
