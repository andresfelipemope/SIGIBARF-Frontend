import { notFound } from "next/navigation";
import { getProductById } from "@/data/products";
import ProductDetail from "@/components/catalogo/product-detail";

/**
 * Genera metadatos dinámicos para SEO.
 * TODO: Cuando exista API, reemplazar getProductById(id) por fetch al endpoint.
 */
export async function generateMetadata({ params }) {
  const product = await getProductById(params.id);
  if (!product) {
    return { title: "Producto no encontrado — Athletic Barf" };
  }
  return {
    title: `${product.name} — Athletic Barf`,
    description: product.shortDescription,
  };
}

/**
 * Página de detalle individual del producto — Server Component.
 *
 * Para conectar con API real, reemplazar getProductById por:
 *   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
 *     cache: "no-store",
 *   });
 *   const product = await res.json();
 */
export default async function ProductDetailPage({ params }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
