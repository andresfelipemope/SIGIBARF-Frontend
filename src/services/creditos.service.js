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

export const creditosService = {
  async listCreditos(params = {}) {
    return apiRequest(`/api/creditos/creditos/${buildQuery(params)}`, {
      method: 'GET',
      headers: authHeaders(),
    });
  },

  async getCredito(id) {
    return apiRequest(`/api/creditos/creditos/${id}/`, {
      method: 'GET',
      headers: authHeaders(),
    });
  },

  async patchObservaciones(id, observaciones) {
    return apiRequest(`/api/creditos/creditos/${id}/`, {
      method: 'PATCH',
      body: { observaciones },
      headers: authHeaders(),
    });
  },

  async deleteCredito(id) {
    return apiRequest(`/api/creditos/creditos/${id}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
  },

  async registrarPago(id, monto) {
    return apiRequest(`/api/creditos/creditos/${id}/registrar-pago/`, {
      method: 'POST',
      body: { monto },
      headers: authHeaders(),
    });
  },

  async listCuotas(params = {}) {
    return apiRequest(`/api/creditos/cuotas/${buildQuery(params)}`, {
      method: 'GET',
      headers: authHeaders(),
    });
  },

  async getCuota(id) {
    return apiRequest(`/api/creditos/cuotas/${id}/`, {
      method: 'GET',
      headers: authHeaders(),
    });
  },

  async toggleNotificacionesCuota(id, notificacionesActivas) {
    return apiRequest(`/api/creditos/cuotas/${id}/toggle-notificaciones/`, {
      method: 'PATCH',
      body: { notificaciones_activas: notificacionesActivas },
      headers: authHeaders(),
    });
  },
};
