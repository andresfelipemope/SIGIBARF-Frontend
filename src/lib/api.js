const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ── Token helpers ────────────────────────────────────────────────────
function getAccess() {
  return typeof window !== "undefined" ? localStorage.getItem("access") : null;
}
function getRefresh() {
  return typeof window !== "undefined" ? localStorage.getItem("refresh") : null;
}

function saveTokens({ access, refresh }) {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
}

function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

function redirectToLogin() {
  if (typeof window !== "undefined") window.location.href = "/auth/login";
}

// ── Renovar access token usando el refresh ───────────────────────────
async function refreshAccessToken() {
  const refresh = getRefresh();
  if (!refresh) throw new Error("No hay refresh token");

  const res = await fetch(`${BASE_URL}/api/usuarios/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) throw new Error("Refresh inválido");

  const data = await res.json();
  saveTokens(data); // guarda el nuevo access (y refresh si viene rotado)
  return data.access;
}

// ── Helper principal ─────────────────────────────────────────────────
export async function apiRequest(
  endpoint,
  { method = "GET", body = null, headers = {} } = {},
  _retry = false,
) {
  const url = `${BASE_URL.replace(/\/$/, "")}${endpoint}`;

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) config.body = JSON.stringify(body);

  try {
    const response = await fetch(url, config);

    if (response.status === 204) return { success: true };

    const data = await response.json().catch(() => null);

    // 401 → intentar refresh una sola vez
    if (response.status === 401 && !_retry) {
      try {
        const newAccess = await refreshAccessToken();
        // Reintentar con el token nuevo
        return apiRequest(
          endpoint,
          {
            method,
            body: body ? JSON.parse(config.body) : null,
            headers: { ...headers, Authorization: `Bearer ${newAccess}` },
          },
          true,
        );
      } catch {
        clearTokens();
        redirectToLogin();
        throw new Error("Sesión expirada. Redirigiendo al login...");
      }
    }

    if (!response.ok) {
      console.log("URL:", url);
      console.log("STATUS:", response.status);
      console.log("RESPONSE:", data);

      const error = new Error(
        data?.detail || "Ha ocurrido un error en la solicitud.",
      );

      error.status = response.status;
      error.data = data;

      throw error;
    }

    return data;
  } catch (error) {
    if (error.status) throw error;
    const networkError = new Error(
      "No se pudo establecer comunicación con el servidor. Por favor, verifica tu conexión.",
    );
    networkError.status = 500;
    throw networkError;
  }
}

// ── Auth service ─────────────────────────────────────────────────────
export const authService = {
  async login(correo, password) {
    return apiRequest("/api/usuarios/auth/login/", {
      method: "POST",
      body: { correo, password },
    });
  },

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

  async googleLogin(idToken) {
    return apiRequest("/api/usuarios/auth/google/", {
      method: "POST",
      body: { id_token: idToken },
    });
  },

  async requestPasswordReset(correo) {
    return apiRequest("/api/usuarios/auth/password-reset/", {
      method: "POST",
      body: { correo },
    });
  },

  async validateResetToken(uidb64, token) {
    return apiRequest(
      `/api/usuarios/auth/password-reset/confirm/${uidb64}/${token}/`,
      { method: "GET" },
    );
  },

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

  async getProfile() {
    const token = getAccess();
    return apiRequest("/api/usuarios/me/", {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  async updateProfile(profileData) {
    const token = getAccess();
    return apiRequest("/api/usuarios/me/", {
      method: "PATCH",
      body: profileData,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  async changePassword(current_password, new_password, new_password_confirm) {
    const token = getAccess();
    return apiRequest("/api/usuarios/auth/change-password/", {
      method: "POST",
      body: { current_password, new_password, new_password_confirm },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  async logout(refresh) {
    const token = getAccess();
    await apiRequest("/api/usuarios/auth/logout/", {
      method: "POST",
      body: { refresh },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).catch(() => {}); // aunque falle, limpiamos local
    clearTokens();
  },
};
