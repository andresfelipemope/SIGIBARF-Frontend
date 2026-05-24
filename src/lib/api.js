const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-pongase-trucha.onrender.com";

/**
 * Helper para realizar peticiones HTTP de forma segura y estandarizada.
 * Maneja el parseo de respuestas y la extracción de errores del backend.
 */
async function apiRequest(
  endpoint,
  { method = "GET", body = null, headers = {} } = {},
) {
  const url = `${BASE_URL.replace(/\/$/, "")}${endpoint}`;

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    // Si es 204 No Content, no intentamos parsear JSON
    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Extraemos el error del backend de forma estructurada
      const error = new Error(
        data?.detail || "Ha ocurrido un error en la solicitud.",
      );
      error.status = response.status;
      error.data = data; // Guardamos los errores de campos (por ejemplo, de validación de contraseña)
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status) throw error;

    // Error de red o parseo
    const networkError = new Error(
      "No se pudo establecer comunicación con el servidor. Por favor, verifica tu conexión.",
    );
    networkError.status = 500;
    throw networkError;
  }
}

export const authService = {
  /**
   * Iniciar sesión con correo y contraseña.
   * @param {string} correo
   * @param {string} password
   */
  async login(correo, password) {
    return apiRequest("/api/usuarios/auth/login/", {
      method: "POST",
      body: { correo, password },
    });
  },

  /**
   * Registrar un nuevo usuario (rol Cliente por defecto en backend).
   * @param {Object} userData
   */
  async register({
    correo,
    password,
    password_confirm,
    nombre,
    apellido,
    telefono = "",
    direccion = "",
  }) {
    return apiRequest("/api/usuarios/auth/register/", {
      method: "POST",
      body: {
        correo,
        password,
        password_confirm,
        nombre,
        apellido,
        telefono,
        direccion,
      },
    });
  },

  /**
   * Iniciar sesión o registrar con Google Identity Services token.
   * @param {string} idToken
   */
  async googleLogin(idToken) {
    return apiRequest("/api/usuarios/auth/google/", {
      method: "POST",
      body: { id_token: idToken },
    });
  },

  /**
   * Solicitar el enlace de recuperación de contraseña.
   * @param {string} correo
   */
  async requestPasswordReset(correo) {
    return apiRequest("/api/usuarios/auth/password-reset/", {
      method: "POST",
      body: { correo },
    });
  },

  /**
   * Validar que el token de recuperación siga vigente antes de mostrar el formulario.
   * @param {string} uidb64
   * @param {string} token
   */
  async validateResetToken(uidb64, token) {
    return apiRequest(
      `/api/usuarios/auth/password-reset/confirm/${uidb64}/${token}/`,
      {
        method: "GET",
      },
    );
  },

  /**
   * Establecer la nueva contraseña tras validar uid/token.
   * @param {string} uidb64
   * @param {string} token
   * @param {string} new_password
   * @param {string} new_password_confirm
   */
  async confirmPasswordReset(
    uidb64,
    token,
    new_password,
    new_password_confirm,
  ) {
    return apiRequest(
      `/api/usuarios/auth/password-reset/confirm/${uidb64}/${token}/`,
      {
        method: "POST",
        body: { new_password, new_password_confirm },
      },
    );
  },

  /**
   * Obtener el perfil del usuario autenticado.
   */
  async getProfile() {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access") : null;
    return apiRequest("/api/usuarios/me/", {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  /**
   * Actualizar el perfil del usuario autenticado.
   */
  async updateProfile(profileData) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access") : null;
    return apiRequest("/api/usuarios/me/", {
      method: "PATCH",
      body: profileData,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  /**
   * Cambiar la contraseña del usuario logueado.
   */
  async changePassword(current_password, new_password, new_password_confirm) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access") : null;
    return apiRequest("/api/usuarios/auth/change-password/", {
      method: "POST",
      body: { current_password, new_password, new_password_confirm },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};
