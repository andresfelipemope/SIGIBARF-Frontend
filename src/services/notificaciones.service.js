import { apiRequest } from "@/lib/api";

function authHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const notificacionesService = {
  // Retorna todas las notificaciones activas (leida: false)
  async getNotificaciones() {
    return apiRequest("/api/notificaciones/", {
      method: "GET",
      headers: authHeaders(),
    });
  },

  // Marca una notificación como resuelta/leída
  async resolverNotificacion(id) {
    return apiRequest(`/api/notificaciones/${id}/resolve/`, {
      method: "PATCH",
      headers: authHeaders(),
    });
  },
};
