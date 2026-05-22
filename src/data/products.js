/**
 * Mock data — estructura preparada para conectar con API REST.
 * Para conectar backend: reemplazar este array por un fetch() a tu endpoint.
 *
 * Estructura de producto:
 * {
 *   id: string,
 *   slug: string,
 *   name: string,
 *   category: string,          // "Dieta Tradicional" | "Dieta Premium" | "Dieta Gatos" | "Snacks"
 *   description: string,
 *   shortDescription: string,
 *   price: number,             // en pesos colombianos (COP)
 *   weight: string,            // ej: "500g", "1kg"
 *   stock: number,
 *   lot: string,
 *   productionDate: string,    // ISO date string
 *   expirationDate: string,    // ISO date string
 *   rating: number,            // 1–5
 *   image: string,             // ruta local en /public o URL de API
 * }
 */

export const CATEGORIES = [
  { label: "Todos", value: "all" },
  { label: "Dieta Tradicional", value: "Dieta Tradicional" },
  { label: "Dieta Premium", value: "Dieta Premium" },
  { label: "Dieta Gatos", value: "Dieta Gatos" },
  { label: "Snacks", value: "Snacks" },
];

export const products = [
  {
    id: "1",
    slug: "dieta-tradicional-canina-500g",
    name: "Dieta Tradicional Canina",
    category: "Dieta Tradicional",
    description:
      "Nuestra dieta BARF tradicional para perros adultos está elaborada con carne cruda de res, huesos carnosos, vísceras y vegetales frescos. Balanceada nutricionalmente para cubrir los requerimientos diarios de tu mascota sin conservantes ni aditivos artificiales.",
    shortDescription:
      "Dieta cruda balanceada para perros adultos con carne de res, huesos y vegetales frescos.",
    price: 18000,
    weight: "500g",
    stock: 42,
    lot: "LOT-2025-001",
    productionDate: "2025-05-01",
    expirationDate: "2025-06-01",
    rating: 4,
    image: "/images/products/dieta-tradicional-canina.png",
  },
  {
    id: "2",
    slug: "dieta-premium-salmon-1kg",
    name: "Dieta Premium Salmón & Vegetales",
    category: "Dieta Premium",
    description:
      "Fórmula premium elaborada con salmón fresco del Atlántico, arándanos, espinacas y aceite de krill. Rica en omega-3 para pelaje brillante y sistema inmune fuerte. Ideal para perros con sensibilidades alimentarias o que requieren mayor control de peso.",
    shortDescription:
      "Fórmula premium con salmón fresco, arándanos y aceite de krill. Alta en omega-3.",
    price: 32000,
    weight: "1kg",
    stock: 28,
    lot: "LOT-2025-002",
    productionDate: "2025-05-05",
    expirationDate: "2025-06-05",
    rating: 5,
    image: "/images/products/dieta-premium-salmon.png",
  },
  {
    id: "3",
    slug: "dieta-tradicional-pollo-1kg",
    name: "Dieta Tradicional de Pollo",
    category: "Dieta Tradicional",
    description:
      "Dieta BARF de pollo con huesos carnosos, mollejas, hígado y zanahoria rallada. Perfecta para perros en etapa de crecimiento o con mayor necesidad proteica. Fácil digestión y altamente palatable.",
    shortDescription:
      "Dieta cruda de pollo con vísceras, huesos carnosos y vegetales. Alta palatabilidad.",
    price: 16000,
    weight: "1kg",
    stock: 55,
    lot: "LOT-2025-003",
    productionDate: "2025-05-08",
    expirationDate: "2025-06-08",
    rating: 4,
    image: "/images/products/dieta-tradicional-pollo.png",
  },
  {
    id: "4",
    slug: "dieta-felina-natural-500g",
    name: "Dieta Felina Natural",
    category: "Dieta Gatos",
    description:
      "Dieta BARF especialmente formulada para gatos, con pollo crudo deshuesado, corazón de res, hígado de pollo y taurina natural. Cubre los requerimientos únicos de los felinos: alta proteína animal y mínimos carbohidratos.",
    shortDescription:
      "Dieta natural para gatos con pollo deshuesado, corazón, hígado y taurina.",
    price: 20000,
    weight: "500g",
    stock: 33,
    lot: "LOT-2025-004",
    productionDate: "2025-05-10",
    expirationDate: "2025-06-10",
    rating: 5,
    image: "/images/products/dieta-felina-natural.png",
  },
  {
    id: "5",
    slug: "snacks-higado-deshidratado-100g",
    name: "Snacks Hígado Deshidratado",
    category: "Snacks",
    description:
      "Bocados naturales de hígado de res deshidratado a baja temperatura para conservar todos sus nutrientes. Sin aditivos, colorantes ni conservantes. Ideales como premio durante el entrenamiento o refuerzo positivo.",
    shortDescription:
      "Hígado de res deshidratado 100% natural. Sin aditivos ni conservantes.",
    price: 12000,
    weight: "100g",
    stock: 70,
    lot: "LOT-2025-005",
    productionDate: "2025-04-20",
    expirationDate: "2025-10-20",
    rating: 5,
    image: "/images/products/snacks-higado.png",
  },
  {
    id: "6",
    slug: "dieta-premium-cordero-1kg",
    name: "Dieta Premium Cordero & Quinoa",
    category: "Dieta Premium",
    description:
      "Preparación premium de cordero neozelandés con quinoa cocida, manzana y zanahoria orgánica. Hipoalergénica y especialmente recomendada para mascotas con alergias cutáneas o problemas digestivos crónicos.",
    shortDescription:
      "Fórmula hipoalergénica de cordero, quinoa y vegetales orgánicos. Ideal para pieles sensibles.",
    price: 38000,
    weight: "1kg",
    stock: 15,
    lot: "LOT-2025-006",
    productionDate: "2025-05-12",
    expirationDate: "2025-06-12",
    rating: 4,
    image: "/images/products/dieta-premium-cordero.png",
  },
  {
    id: "7",
    slug: "snacks-oreja-cerdo-natural",
    name: "Snacks Oreja de Cerdo Natural",
    category: "Snacks",
    description:
      "Orejas de cerdo deshidratadas naturalmente, sin ningún tipo de aditivo. Ricas en colágeno y perfectas para la salud dental de tu mascota. Fuente natural de proteína y grasa saludable.",
    shortDescription:
      "Orejas de cerdo deshidratadas, ricas en colágeno. Excelentes para la salud dental.",
    price: 9000,
    weight: "80g",
    stock: 90,
    lot: "LOT-2025-007",
    productionDate: "2025-04-15",
    expirationDate: "2025-10-15",
    rating: 4,
    image: "/images/products/snacks-oreja-cerdo.png",
  },
  {
    id: "8",
    slug: "dieta-felina-premium-salmon",
    name: "Dieta Felina Premium Salmón",
    category: "Dieta Gatos",
    description:
      "Dieta felina de lujo elaborada con salmón fresco, atún, gambas y aceite de coco virgen. Formulada para gatos exigentes y con necesidades nutricionales especiales. Alta en proteína y ácidos grasos esenciales.",
    shortDescription:
      "Dieta premium para gatos con salmón, atún y aceite de coco. Alta proteína marina.",
    price: 26000,
    weight: "500g",
    stock: 20,
    lot: "LOT-2025-008",
    productionDate: "2025-05-14",
    expirationDate: "2025-06-14",
    rating: 5,
    image: "/images/products/dieta-felina-premium.png",
  },
];

/**
 * Obtiene todos los productos.
 * TODO: Reemplazar por: const res = await fetch(`${API_URL}/products`); return res.json();
 */
export async function getProducts() {
  return products;
}

/**
 * Obtiene un producto por su ID.
 * TODO: Reemplazar por: const res = await fetch(`${API_URL}/products/${id}`); return res.json();
 */
export async function getProductById(id) {
  return products.find((p) => p.id === String(id)) ?? null;
}

/**
 * Obtiene productos filtrados por categoría.
 * TODO: Reemplazar por: const res = await fetch(`${API_URL}/products?category=${category}`);
 */
export async function getProductsByCategory(category) {
  if (!category || category === "all") return products;
  return products.filter((p) => p.category === category);
}
