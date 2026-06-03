import { useState, useEffect, useCallback } from "react";
import { movimientosProductoService } from "@/services/movimientosProducto";

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState(null);

  const fetchProductos = useCallback(async () => {
    try {
      setLoadingProductos(true);
      setErrorProductos(null);
      const data = await movimientosProductoService.getPublicProductos();
      // Filtrar u ordenar si es necesario, o simplemente retornar el listado
      setProductos(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setErrorProductos(
        err.message || "Error al obtener la lista de productos",
      );
    } finally {
      setLoadingProductos(false);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  return {
    productos,
    loadingProductos,
    errorProductos,
    refetchProductos: fetchProductos,
  };
}
