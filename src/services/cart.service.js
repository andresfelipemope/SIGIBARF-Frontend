import { apiRequest } from '@/lib/api';

/**
 * Helper to retrieve Authorization headers using the locally stored JWT access token.
 */
function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Service to centralize all cart and checkout API request logic.
 */
export const cartService = {
  /**
   * Retrieves the current user's shopping cart.
   * GET /api/ventas/carrito/
   */
  async getCart() {
    return apiRequest('/api/ventas/carrito/', {
      method: 'GET',
      headers: authHeaders(),
    });
  },

  /**
   * Updates the quantity of a specific product in the cart.
   * PATCH /api/ventas/carrito/productos/<producto_id>/
   * @param {number|string} productId - ID of the product to update.
   * @param {number} cantidad - New quantity.
   */
  async updateCartItem(productId, cantidad) {
    return apiRequest(`/api/ventas/carrito/productos/${productId}/`, {
      method: 'PATCH',
      body: { cantidad },
      headers: authHeaders(),
    });
  },

  /**
   * Removes a product from the shopping cart.
   * DELETE /api/ventas/carrito/productos/<producto_id>/
   * @param {number|string} productId - ID of the product to delete.
   */
  async removeCartItem(productId) {
    return apiRequest(`/api/ventas/carrito/productos/${productId}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
  },

  /**
   * Initiates checkout and processes order details.
   * POST /api/ventas/checkout/
   */
  async checkout() {
    return apiRequest('/api/ventas/checkout/', {
      method: 'POST',
      headers: authHeaders(),
    });
  },
};
