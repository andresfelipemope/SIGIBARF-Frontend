import { apiRequest } from '@/lib/api';

// ── Helper interno ───────────────────────────────────────────────────
function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Productos ────────────────────────────────────────────────────────
export const inventarioService = {

  async getProductos() {
    return apiRequest('/api/inventario/productos/', {
      method: 'GET',
      headers: authHeaders(),
    });
  },

  async createProducto(productoData) {
    return apiRequest('/api/inventario/productos/', {
      method: 'POST',
      body: productoData,
      headers: authHeaders(),
    });
  },

  async updateProducto(id, productoData) {
    return apiRequest(`/api/inventario/productos/${id}/`, {
      method: 'PATCH',
      body: productoData,
      headers: authHeaders(),
    });
  },

  async deleteProducto(id) {
    return apiRequest(`/api/inventario/productos/${id}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
  },

  // ── Ingredientes ───────────────────────────────────────────────────

  async getIngredientes() {
    return apiRequest('/api/inventario/ingredientes/', {
      method: 'GET',
      headers: authHeaders(),
    });
  },

  async createIngrediente(ingredienteData) {
    return apiRequest('/api/inventario/ingredientes/', {
      method: 'POST',
      body: ingredienteData,
      headers: authHeaders(),
    });
  },

  async updateIngrediente(id, ingredienteData) {
    return apiRequest(`/api/inventario/ingredientes/${id}/`, {
      method: 'PATCH',
      body: ingredienteData,
      headers: authHeaders(),
    });
  },

  async deleteIngrediente(id) {
    return apiRequest(`/api/inventario/ingredientes/${id}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
  },
};