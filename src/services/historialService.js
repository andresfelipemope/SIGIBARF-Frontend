import { apiRequest } from '@/lib/api';

// Helper to inject active session JWT Bearer token
function authHeaders() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('access') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const historialService = {
  /**
   * Obtiene todos los movimientos de ingredientes.
   * GET /api/inventario/movimientos-ingrediente/
   */
  async getMovimientosIngredientes() {
    return apiRequest('/api/inventario/movimientos-ingrediente/', {
      method: 'GET',
      headers: authHeaders(),
    });
  },

  /**
   * Obtiene todos los movimientos de productos.
   * GET /api/inventario/movimientos-producto/
   */
  async getMovimientosProductos() {
    return apiRequest('/api/inventario/movimientos-producto/', {
      method: 'GET',
      headers: authHeaders(),
    });
  },

  /**
   * Obtiene el catálogo de ingredientes para resolver nombres por ID.
   * GET /api/inventario/ingredientes/
   */
  async getIngredientes() {
    return apiRequest('/api/inventario/ingredientes/', {
      method: 'GET',
      headers: authHeaders(),
    });
  },

  /**
   * Obtiene el catálogo de productos para resolver nombres por ID.
   * GET /api/inventario/productos/
   */
  async getProductos() {
    return apiRequest('/api/inventario/productos/', {
      method: 'GET',
      headers: authHeaders(),
    });
  },
};
