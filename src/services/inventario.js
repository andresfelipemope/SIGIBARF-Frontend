import { apiRequest } from '@/lib/api';

export const inventarioService = {
  /**
   * Obtener la lista de productos (Privado)
   */
  async getProductos() {
    const token = typeof window !== "undefined" ? localStorage.getItem("access") : null;
    return apiRequest('/api/inventario/productos/', {
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  },

  /**
   * Crear un nuevo producto (Privado)
   */
  async createProducto(productoData) {
    const token = typeof window !== "undefined" ? localStorage.getItem("access") : null;
    return apiRequest('/api/inventario/productos/', {
      method: 'POST',
      body: productoData,
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }
};
