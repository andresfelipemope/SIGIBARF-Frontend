import { apiRequest } from '@/lib/api';

/**
 * @typedef {Object} Producto
 * @property {number} id
 * @property {string} nombre
 * @property {string} precio
 * @property {number} stock_actual
 * @property {number} stock_minimo
 * @property {boolean} inhabilitado
 * @property {string} [descripcion]
 * @property {number[]} [ingredientes]
 */

/**
 * @typedef {Object} Ingrediente
 * @property {number} id
 * @property {string} nombre
 * @property {string} stock_actual
 * @property {string} stock_minimo
 * @property {string} unidad_medida
 */

/**
 * @typedef {Object} ProductoIngrediente
 * @property {number} id
 * @property {string} cantidad_ingrediente
 * @property {string} porcentaje_ingrediente
 * @property {number} id_producto
 * @property {number} id_ingrediente
 */

export const catalogoService = {
  async getProductos() {
    const data = await apiRequest('/api/inventario/public/productos/', {
      method: 'GET',
    });
    // Inferencia simple de categoría para mantener compatibilidad con los filtros visuales
    return (data || []).map(p => {
      let categoria = "General";
      const n = (p.nombre || "").toLowerCase();
      if (n.includes("tradicional")) categoria = "Dieta Tradicional";
      else if (n.includes("premium")) categoria = "Dieta Premium";
      else if (n.includes("gato") || n.includes("felin")) categoria = "Dieta Gatos";
      else if (n.includes("snack") || n.includes("oreja")) categoria = "Snacks";
      return { ...p, categoria };
    });
  },

  async getIngredientes() {
    return apiRequest('/api/inventario/public/ingredientes/', {
      method: 'GET',
    });
  },

  async getProductoIngredientes() {
    return apiRequest('/api/inventario/public/producto-ingredientes/', {
      method: 'GET',
    });
  },

  async getProductoCompleto(id) {
    if (!id) return null;
    
    const [productos, ingredientes, productoIngredientes] = await Promise.all([
      this.getProductos(),
      this.getIngredientes(),
      this.getProductoIngredientes()
    ]);

    const producto = productos.find(p => p.id.toString() === id.toString());
    if (!producto) return null;

    const relaciones = productoIngredientes.filter(pi => pi.id_producto.toString() === id.toString());
    
    const composicion = relaciones.map(rel => {
      const ingrediente = ingredientes.find(i => i.id.toString() === rel.id_ingrediente.toString());
      return {
        ...rel,
        ingrediente_nombre: ingrediente ? ingrediente.nombre : 'Desconocido'
      };
    });

    return {
      ...producto,
      composicion
    };
  }
};
