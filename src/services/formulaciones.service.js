import { apiRequest } from "@/lib/api";

const BASE_PATH = "/api/inventario";

function authHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const FormulacionesService = {
  /**
   * @returns {Promise<Array>}
   */
  async getFormulaciones() {
    return apiRequest(`${BASE_PATH}/producto-ingredientes/`, {
      method: "GET",
      headers: authHeaders(),
    });
  },

  /**
   * @param {number|string} id
   * @returns {Promise<Object>}
   */
  async getFormulacionById(id) {
    return apiRequest(`${BASE_PATH}/producto-ingredientes/${id}/`, {
      method: "GET",
      headers: authHeaders(),
    });
  },

  /**
   * @param {Object} data - { id_producto, id_ingrediente, cantidad_ingrediente, porcentaje_ingrediente }
   * @returns {Promise<Object>}
   */
  async createFormulacion(data) {
    const payload = {
      id_producto: Number(data.id_producto),
      id_ingrediente: Number(data.id_ingrediente),
      cantidad_ingrediente: String(data.cantidad_ingrediente),
      porcentaje_ingrediente: String(data.porcentaje_ingrediente),
    };

    return apiRequest(`${BASE_PATH}/producto-ingredientes/`, {
      method: "POST",
      body: payload,
      headers: authHeaders(),
    });
  },

  /**
   * @param {number|string} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async updateFormulacion(id, data) {
    const payload = {
      id_producto: Number(data.id_producto),
      id_ingrediente: Number(data.id_ingrediente),
      cantidad_ingrediente: String(data.cantidad_ingrediente),
      porcentaje_ingrediente: String(data.porcentaje_ingrediente),
    };

    return apiRequest(`${BASE_PATH}/producto-ingredientes/${id}/`, {
      method: "PUT",
      body: payload,
      headers: authHeaders(),
    });
  },

  /**
   * @param {number|string} id
   * @param {Object} data - campos a actualizar
   * @returns {Promise<Object>}
   */
  async patchFormulacion(id, data) {
    const payload = {};

    if (data.id_producto !== undefined)
      payload.id_producto = Number(data.id_producto);
    if (data.id_ingrediente !== undefined)
      payload.id_ingrediente = Number(data.id_ingrediente);
    if (data.cantidad_ingrediente !== undefined) {
      payload.cantidad_ingrediente = String(data.cantidad_ingrediente);
    }
    if (data.porcentaje_ingrediente !== undefined) {
      payload.porcentaje_ingrediente = String(data.porcentaje_ingrediente);
    }

    return apiRequest(`${BASE_PATH}/producto-ingredientes/${id}/`, {
      method: "PATCH",
      body: Object.keys(payload).length > 0 ? payload : undefined,
      headers: authHeaders(),
    });
  },

  /**
   * @param {number|string} id
   * @returns {Promise<{ success: boolean }>} - tu apiRequest retorna { success: true } en 204
   */
  async deleteFormulacion(id) {
    return apiRequest(`${BASE_PATH}/producto-ingredientes/${id}/`, {
      method: "DELETE",
      headers: authHeaders(),
    });
  },

  /**
   * @returns {Promise<Array>}
   */
  async getProductos() {
    return apiRequest(`${BASE_PATH}/productos/`, {
      method: "GET",
      headers: authHeaders(),
    });
  },

  /**
   * @returns {Promise<Array>}
   */
  async getIngredientes() {
    return apiRequest(`${BASE_PATH}/ingredientes/`, {
      method: "GET",
      headers: authHeaders(),
    });
  },
};

export default FormulacionesService;
