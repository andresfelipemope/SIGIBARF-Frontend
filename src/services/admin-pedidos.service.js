import { apiRequest } from '@/lib/api';

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, value);
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Gestión administrativa de pedidos de venta.
 * Solo endpoints documentados en el requerimiento.
 */
export const adminPedidosService = {
  /**
   * GET /api/ventas/admin/pedidos/
   * @param {Object} params - Query params confirmados por backend (page, search, estado, usuario, con_credito, ordering)
   */
  async listPedidos(params = {}) {
    return apiRequest(`/api/ventas/admin/pedidos/${buildQuery(params)}`, {
      method: 'GET',
      headers: authHeaders(),
    });
  },

  /**
   * POST /api/ventas/admin/pedidos/presencial/
   * Pedido manual creado por administrador.
   */
  async crearPedidoManual(body) {
    return apiRequest('/api/ventas/admin/pedidos/presencial/', {
      method: 'POST',
      body,
      headers: authHeaders(),
    });
  },

  /**
   * POST /api/ventas/admin/pedidos/<id>/confirmar-pago/
   */
  async confirmarPago(pedidoId) {
    return apiRequest(`/api/ventas/admin/pedidos/${pedidoId}/confirmar-pago/`, {
      method: 'POST',
      headers: authHeaders(),
    });
  },

  /**
   * POST /api/ventas/admin/pedidos/<id>/cancelar/
   */
  async cancelarPedido(pedidoId) {
    return apiRequest(`/api/ventas/admin/pedidos/${pedidoId}/cancelar/`, {
      method: 'POST',
      headers: authHeaders(),
    });
  },
};
