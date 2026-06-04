import { apiRequest } from "@/lib/api";

// Helper local para inyectar token de forma robusta
function authHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token") || localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const movimientosProductoService = {
  /**
   * Obtiene todos los movimientos de productos registrados.
   * GET /api/inventario/movimientos-producto/
   */
  async getMovimientos() {
    return apiRequest("/api/inventario/movimientos-producto/", {
      method: "GET",
      headers: authHeaders(),
    });
  },

  /**
   * Registra un nuevo movimiento manual de producto.
   * POST /api/inventario/movimientos-producto/
   * @param {Object} data - { id_producto, tipo_movimiento, cantidad, comentarios }
   */
  async createMovimiento(data) {
    return apiRequest("/api/inventario/movimientos-producto/", {
      method: "POST",
      body: {
        id_producto: parseInt(data.id_producto, 10),
        tipo_movimiento: data.tipo_movimiento,
        cantidad: parseFloat(data.cantidad),
        comentarios: data.comentarios || "",
      },
      headers: authHeaders(),
    });
  },

  /**
   * Obtiene el catálogo de productos para mostrar stock y nombres en selectores.
   * GET /api/inventario/productos/
   */
  async getProductos() {
    return apiRequest("/api/inventario/productos/", {
      method: "GET",
      headers: authHeaders(),
    });
  },

  async getPublicProductos() {
    return apiRequest("/api/inventario/public/productos/", {
      method: "GET",
    });
  },
};
