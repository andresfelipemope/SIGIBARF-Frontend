import { apiRequest } from "@/lib/api";

/**
 * Endpoint de búsqueda de clientes para el panel admin.
 * Configurar cuando el backend confirme la ruta real.
 * Mientras tanto, USUARIOS_BUSQUEDA_ENDPOINT = null deshabilita las llamadas.
 */
export const USUARIOS_BUSQUEDA_ENDPOINT = null;
// Ejemplo cuando esté confirmado: '/api/usuarios/admin/clientes/'

function authHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, value);
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const usuariosAdminService = {
  isBusquedaDisponible() {
    return Boolean(USUARIOS_BUSQUEDA_ENDPOINT);
  },

  /**
   * Buscar clientes — solo si USUARIOS_BUSQUEDA_ENDPOINT está configurado.
   */
  async buscarClientes(params = {}) {
    if (!USUARIOS_BUSQUEDA_ENDPOINT) {
      return { results: [], count: 0 };
    }
    const data = await apiRequest(
      `${USUARIOS_BUSQUEDA_ENDPOINT}${buildQuery(params)}`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );
    return data;
  },
};
