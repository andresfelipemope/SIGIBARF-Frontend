import { apiRequest } from '@/lib/api';

/**
 * Helper to retrieve Authorization headers using the locally stored JWT access token.
 */
function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Service to manage all order retrieval and payment reattempt operations.
 */
export const pedidosService = {
  /**
   * Obtiene la lista de pedidos del usuario autenticado.
   * GET /api/ventas/mis-pedidos/
   */
  async getMisPedidos() {
    return apiRequest('/api/ventas/mis-pedidos/', {
      method: 'GET',
      headers: authHeaders(),
    });
  },

  /**
   * Obtiene el detalle de un pedido específico.
   * GET /api/ventas/pedidos/<id>/
   * @param {number|string} id - ID del pedido.
   */
  async getPedidoDetalle(id) {
    return apiRequest(`/api/ventas/pedidos/${id}/`, {
      method: 'GET',
      headers: authHeaders(),
    });
  },

  /**
   * Inicia el proceso de reintento de pago para un pedido pendiente.
   * POST /api/ventas/pedidos/<id>/pagar/
   * @param {number|string} id - ID del pedido.
   */
  async pagarPedido(id) {
    return apiRequest(`/api/ventas/pedidos/${id}/pagar/`, {
      method: 'POST',
      headers: authHeaders(),
    });
  },

  /**
   * Cancela el pedido pendiente más reciente del usuario.
   * DELETE /api/ventas/pedidos/pending/
   */
  async cancelarPedidoPendiente() {
    return apiRequest('/api/ventas/pedidos/pending/', {
      method: 'DELETE',
      headers: authHeaders(),
    });
  },

};
