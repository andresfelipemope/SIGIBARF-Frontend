"use client";

import { useState, useMemo, useEffect } from "react";
import { Leaf, AlertCircle } from "lucide-react";
import ProductFilters from "@/components/catalogo/product-filters";
import ProductGrid from "@/components/catalogo/product-grid";
import { catalogoService } from "@/services/catalogo.service";
import { useCart } from "@/hooks/useCart";

/**
 * Página principal del catálogo de productos.
 */
export default function CatalogoPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    cartMap,
    loadingCart,
    errorCart,
    updatingItems,
    addToCart,
    updateQuantity,
  } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await catalogoService.getProductos();
        setProductos(data || []);
      } catch (err) {
        setError(err.message || "Error al cargar los productos del catálogo.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = productos;

    // Se mantiene por si se añaden categorías al backend en el futuro
    if (activeCategory !== "all") {
      result = result.filter((p) => p.categoria === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.nombre && p.nombre.toLowerCase().includes(query)) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(query))
      );
    }

    return result;
  }, [searchQuery, activeCategory, productos]);

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

        {errorCart && !loadingCart && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorCart}
          </div>
        )}

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

        {error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4 text-red-500">
            <AlertCircle size={40} />
            <p className="font-medium text-lg">{error}</p>
          </div>
        ) : (
          <ProductGrid
            products={filteredProducts}
            isLoading={loading || loadingCart}
            onAddToCart={addToCart}
            onUpdateQuantity={updateQuantity}
            cartMap={cartMap}
            updatingItems={updatingItems}
          />
        )}
      </section>
    </>
  );
}
