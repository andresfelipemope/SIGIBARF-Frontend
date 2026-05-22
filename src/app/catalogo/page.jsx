"use client";

import { useState, useMemo } from "react";
import { Leaf } from "lucide-react";
import { products } from "@/data/products";
import ProductFilters from "@/components/catalogo/product-filters";
import ProductGrid from "@/components/catalogo/product-grid";

/**
 * Página principal del catálogo de productos.
 *
 * Arquitectura preparada para API:
 * - Reemplazar `products` por `await getProducts()` en un Server Component,
 *   o por un `useEffect` + `fetch()` si se mantiene como Client Component.
 * - Los filtros de búsqueda y categoría funcionan localmente con mock data.
 * - Para filtrado en backend, pasar los parámetros como query params al fetch.
 */
export default function CatalogoPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  /**
   * Filtrado local — reemplazar por llamada a API con query params cuando exista backend.
   * Ej: fetch(`/api/products?search=${searchQuery}&category=${activeCategory}`)
   */
  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.shortDescription.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchQuery, activeCategory]);

  /**
   * Handler add to cart.
   * TODO: conectar con store global / contexto de carrito.
   */
  const handleAddToCart = ({ product, quantity }) => {
    console.log("Agregar al carrito:", { product, quantity });
    // TODO: dispatch al store del carrito
  };

  return (
    <>
      {/* SEO */}
      {/* title y meta se manejan en metadata export si es server component */}

      {/* ═══ HERO ═══ */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            <Leaf size={13} />
            100% Natural · Grado Humano · Sin Conservantes
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 leading-tight">
            Nuestras{" "}
            <span className="text-green-600">Dietas Naturales</span>
          </h1>

          <p className="mt-4 text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Alimentación cruda biológicamente apropiada (BARF), elaborada con
            ingredientes de grado humano para una vida más larga y saludable de
            tu mascota.
          </p>
        </div>
      </section>

      {/* ═══ FILTROS ═══ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <ProductFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </section>

      {/* ═══ RESULTADOS ═══ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">

        {/* Contador de resultados */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {filteredProducts.length === 0
              ? "Sin resultados"
              : `${filteredProducts.length} producto${filteredProducts.length !== 1 ? "s" : ""} encontrado${filteredProducts.length !== 1 ? "s" : ""}`}
          </p>
          {(searchQuery || activeCategory !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="text-xs text-green-600 hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <ProductGrid
          products={filteredProducts}
          isLoading={false}
          onAddToCart={handleAddToCart}
        />
      </section>
    </>
  );
}
