// Utilidad central para llamadas autenticadas al backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const API = {
  inventario: `${API_BASE}/api/inventario`,
  usuarios: `${API_BASE}/api/usuarios`,
};

/**
 * Devuelve los headers con JWT si hay token en localStorage.
 */
export function authHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Fetch autenticado. Lanza error con mensaje legible si la respuesta no es ok.
 */
export async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (res.status === 204) return null; // No Content

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      data?.detail ||
      Object.values(data).flat().join(" · ") ||
      `Error ${res.status}`;
    throw new Error(msg);
  }

    return data;
}
