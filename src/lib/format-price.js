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
 * Formatea una fecha ISO a formato legible en español.
 * @param {string} dateString - Fecha en formato ISO (ej: "2025-05-01")
 * @returns {string} Fecha legible, ej: "1 de mayo de 2025"
 */
export function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
