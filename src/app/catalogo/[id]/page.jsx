import { notFound } from "next/navigation";
import { catalogoService } from "@/services/catalogo.service";
import ProductDetail from "@/components/catalogo/product-detail";

/**
 * Genera metadatos dinámicos para SEO.
 */
export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await catalogoService.getProductoCompleto(id);
  if (!product) {
    return { title: "Producto no encontrado — Athletic Barf" };
  }
  return {
    title: `${product.nombre} — Athletic Barf`,
    description: product.Descripción || "Detalle del producto",
  };
}

/**
 * Página de detalle individual del producto — Server Component.
 */
export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await catalogoService.getProductoCompleto(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
