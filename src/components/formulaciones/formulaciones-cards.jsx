// components/formulaciones/formulaciones-cards.jsx
"use client";

import { Edit, Trash2, FlaskConical, AlertTriangle } from "lucide-react";

/**
 * Vista de cards para mostrar formulaciones agrupadas por producto
 */
export default function FormulacionesCards({
  formulaciones,
  productosMap,
  ingredientesMap,
  loading,
  onEdit,
  onDelete,
}) {
  if (loading && formulaciones.length === 0) {
    return <CardsSkeleton />;
  }

  if (!loading && formulaciones.length === 0) {
    return <EmptyState />;
  }

  // Agrupar formulaciones por producto
  const formulacionesPorProducto = formulaciones.reduce((acc, f) => {
    if (!acc[f.id_producto]) {
      acc[f.id_producto] = [];
    }
    acc[f.id_producto].push(f);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(formulacionesPorProducto).map(([productoId, ingredients]) => {
        const producto = productosMap[productoId];
        const totalPorcentaje = ingredients.reduce((sum, ing) => sum + parseFloat(ing.porcentaje_ingrediente), 0);
        
        return (
          <div key={productoId} className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
            {/* Header del producto */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <FlaskConical className="size-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{producto?.nombre || `Producto #${productoId}`}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {ingredients.length} ingredientes • Total: {totalPorcentaje.toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                {/* Botones de acción */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(ingredients)}
                    className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition cursor-pointer"
                    title="Editar formulación"
                  >
                    <Edit className="size-4" />
                  </button>
                  <button
                    onClick={() => onDelete(ingredients)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Eliminar formulación completa"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Barra de progreso porcentual */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Balance de la receta</span>
                <span className={`text-sm font-bold ${totalPorcentaje === 100 ? "text-green-600" : "text-amber-600"}`}>
                  {totalPorcentaje.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
                {ingredients.map((ing, idx) => {
                  const porcentaje = parseFloat(ing.porcentaje_ingrediente);
                  const colores = ["bg-green-500", "bg-orange-500", "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-yellow-500"];
                  return (
                    <div
                      key={ing.id}
                      className={`${colores[idx % colores.length]} transition-all`}
                      style={{ width: `${porcentaje}%` }}
                      title={`${ingredientesMap[ing.id_ingrediente]?.nombre}: ${porcentaje}%`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Lista de ingredientes */}
            <div className="p-6">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {ingredients.map((ing, idx) => {
                  const ingrediente = ingredientesMap[ing.id_ingrediente];
                  const colores = ["border-green-200", "border-orange-200", "border-blue-200", "border-purple-200", "border-pink-200", "border-yellow-200"];
                  
                  return (
                    <div key={ing.id} className={`p-4 rounded-xl border-2 ${colores[idx % colores.length]} bg-white hover:shadow-md transition`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 rounded-lg ${colores[idx % colores.length].replace('border', 'bg').replace('200', '100')} flex items-center justify-center`}>
                            <span className="text-sm font-bold text-gray-700">
                              {ingrediente?.nombre?.charAt(0)?.toUpperCase() || "I"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{ingrediente?.nombre || `Ingrediente #${ing.id_ingrediente}`}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{ingrediente?.unidad_medida || ""}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Cantidad</p>
                          <p className="text-sm font-bold text-gray-900">{parseFloat(ing.cantidad_ingrediente).toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Porcentaje</p>
                          <p className="text-lg font-extrabold text-gray-900">{parseFloat(ing.porcentaje_ingrediente).toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Skeleton
function CardsSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-3 bg-gray-200 rounded-full" />
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-24 bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty state
function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
      <div className="mx-auto size-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
        <FlaskConical className="size-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Sin formulaciones</h3>
      <p className="mt-1 text-sm text-gray-500">
        No has creado ninguna formulación aún.
      </p>
    </div>
  );
}