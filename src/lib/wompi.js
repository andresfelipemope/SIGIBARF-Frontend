/**
 * Carga el script de Wompi dinámicamente si no está presente en el window.
 * @returns {Promise<any>} Resuelve con la clase WidgetCheckout de window.
 */
export function loadWompiScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("window no está definido (SSR)"));
      return;
    }
    if (window.WidgetCheckout) {
      resolve(window.WidgetCheckout);
      return;
    }
    
    // Evitar duplicar elementos de script en el DOM
    const existingScript = document.querySelector('script[src="https://checkout.wompi.co/widget.js"]');
    if (existingScript) {
      const handleLoad = () => {
        if (window.WidgetCheckout) {
          resolve(window.WidgetCheckout);
        } else {
          reject(new Error("WidgetCheckout no encontrado tras cargar el script existente."));
        }
      };
      const handleError = () => {
        reject(new Error("Error al descargar el script existente de Wompi."));
      };
      existingScript.addEventListener('load', handleLoad);
      existingScript.addEventListener('error', handleError);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;
    
    script.onload = () => {
      if (window.WidgetCheckout) {
        resolve(window.WidgetCheckout);
      } else {
        reject(new Error("WidgetCheckout no encontrado tras descargar el script de Wompi"));
      }
    };
    
    script.onerror = () => {
      reject(new Error("Error de red al descargar el script de Wompi."));
    };
    
    document.body.appendChild(script);
  });
}

/**
 * Abre el widget de Wompi de manera programática.
 * @param {Object} params - Parámetros de Wompi.
 * @param {string} params.publicKey - Llave pública de Wompi.
 * @param {string} params.currency - Moneda de pago (por defecto COP).
 * @param {number} params.amountInCents - Monto en centavos.
 * @param {string} params.reference - Referencia única del pedido.
 * @param {string} params.integrity - Firma de integridad generada por el backend.
 * @returns {Promise<Object|null>} Promesa que resuelve con la transacción de Wompi o null si se cancela.
 */
export async function openWompiWidget({ publicKey, currency = "COP", amountInCents, reference, integrity }) {
  // Asegura la carga del script
  const WidgetCheckoutClass = await loadWompiScript();

  return new Promise((resolve) => {
    const checkoutWidget = new WidgetCheckoutClass({
      currency,
      amountInCents,
      reference,
      publicKey,
      signature: {
        integrity: integrity
      },
      "signature:integrity": integrity
    });

    checkoutWidget.open((result) => {
      const transaction = result.transaction;
      resolve(transaction || null);
    });
  });
}
