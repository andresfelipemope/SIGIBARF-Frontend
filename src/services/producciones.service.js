import { apiRequest } from "@/lib/api";

// ── Helper interno ───────────────────────────────────────────────────
function authHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const produccionesService = {
  async getProducciones() {
    return apiRequest("/api/inventario/producciones/", {
      method: "GET",
      headers: authHeaders(),
    });
  },

  async createProduccion(data) {
    return apiRequest("/api/inventario/producciones/", {
      method: "POST",
      body: data,
      headers: authHeaders(),
    });
  },
};
