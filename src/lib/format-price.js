/**
 * Formatea un número como precio en pesos colombianos (COP).
 * @param {number} price - Precio en COP
 * @param {string} [locale="es-CO"] - Locale para el formato
 * @returns {string} Precio formateado, ej: "$18.000"
 */
export function formatPrice(price, locale = "es-CO") {
  if (typeof price !== "number" || isNaN(price)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formatea una fecha ISO o datetime ISO a formato legible en español.
 * Soporta:
 * - 2025-05-01
 * - 2026-06-04T02:38:14.538835Z
 */
export function formatDate(dateString) {
  if (!dateString) return "—";

  let date;

  // Fecha simple YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    date = new Date(`${dateString}T00:00:00`);
  } else {
    // Datetime ISO completo
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
