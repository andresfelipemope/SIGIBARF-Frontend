import { apiRequest } from "@/lib/api";

function authHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Productos ────────────────────────────────────────────────────────
export const inventarioService = {
  async getProductos() {
    return apiRequest("/api/inventario/productos/", {
      method: "GET",
      headers: authHeaders(),
    });
  },

  async createProducto(data) {
    return apiRequest("/api/inventario/productos/", {
      method: "POST",
      body: data,
      headers: authHeaders(),
    });
  },

  async updateProducto(id, data) {
    return apiRequest(`/api/inventario/productos/${id}/`, {
      method: "PATCH",
      body: data,
      headers: authHeaders(),
    });
  },

  async deleteProducto(id) {
    return apiRequest(`/api/inventario/productos/${id}/`, {
      method: "DELETE",
      headers: authHeaders(),
    });
  },

  // ── Ingredientes ───────────────────────────────────────────────────

  async getIngredientes() {
    return apiRequest("/api/inventario/ingredientes/", {
      method: "GET",
      headers: authHeaders(),
    });
  },

  async createIngrediente(data) {
    return apiRequest("/api/inventario/ingredientes/", {
      method: "POST",
      body: data,
      headers: authHeaders(),
    });
  },

  async updateIngrediente(id, data) {
    return apiRequest(`/api/inventario/ingredientes/${id}/`, {
      method: "PATCH",
      body: data,
      headers: authHeaders(),
    });
  },

  async deleteIngrediente(id) {
    return apiRequest(`/api/inventario/ingredientes/${id}/`, {
      method: "DELETE",
      headers: authHeaders(),
    });
  },

  // ── Movimientos de Ingrediente ─────────────────────────────────────

  async getMovimientosIngrediente() {
    return apiRequest("/api/inventario/movimientos-ingrediente/", {
      method: "GET",
      headers: authHeaders(),
    });
  },

  async createMovimientoIngrediente(data) {
    return apiRequest("/api/inventario/movimientos-ingrediente/", {
      method: "POST",
      body: data,
      headers: authHeaders(),
    });
  },
};
