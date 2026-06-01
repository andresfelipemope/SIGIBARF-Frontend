// components/formulaciones/formulaciones-cards.jsx
"use client";

import { 
  Edit, 
  Trash2, 
  FlaskConical, 
  Droplets, 
  Candy, 
  Beef, 
  Drumstick, 
  PiggyBank, 
  Salad, 
  Heart, 
  Bone, 
  Wheat, 
  Apple, 
  Pill, 
  Zap, 
  Package,
  ChefHat 
} from "lucide-react";

/**
 * Mapeo de colores HEX específicos para cada ingrediente
 * Garantiza que cada uno tenga una identidad visual única
 */
function getIngredientStyle(nombre) {
  const name = (nombre || "").toLowerCase();

  if (name.includes("agua")) return { icon: Droplets, hex: "#8ECAE6", label: "Agua" };
  if (name.includes("azucar") || name.includes("azúcar")) return { icon: Candy, hex: "#E9C46A", label: "Azúcar" };
  
  if (name === "carne magra de cerdo" || name.includes("carne magra de cerdo")) 
    return { icon: PiggyBank, hex: "#E76F51", label: "Cerdo (Magra)" };
  
  if (name === "carne magra de cordero" || name.includes("carne magra de cordero")) 
    return { icon: Salad, hex: "#B56576", label: "Cordero (Magra)" };
  
  if (name === "carne magra de pollo" || name.includes("carne magra de pollo")) 
    return { icon: Drumstick, hex: "#F4A261", label: "Pollo (Magra)" }; // Ajustado para diferenciar
  
  if (name === "carne magra de res" || name.includes("carne magra de res")) 
    return { icon: Beef, hex: "#D1495B", label: "Res (Magra)" };
  
  if (name.includes("cereal")) return { icon: Wheat, hex: "#90BE6D", label: "Cereales" };
  
  if (name.includes("fruta") || name.includes("vegetal")) 
    return { icon: Apple, hex: "#43AA8B", label: "Frutas/Veg" };
  
  if (name.includes("hueso carnoso de pollo")) return { icon: Bone, hex: "#8ECAE6", label: "Hueso Pollo" };
  
  if (name.includes("órganos") || name.includes("vísceras")) {
    if (name.includes("cerdo")) return { icon: Heart, hex: "#9D4EDD", label: "Vísceras Cerdo" };
    if (name.includes("cordero")) return { icon: Heart, hex: "#7B2CBF", label: "Vísceras Cordero" };
    if (name.includes("pollo")) return { icon: Heart, hex: "#C77DFF", label: "Vísceras Pollo" };
    if (name.includes("res")) return { icon: Heart, hex: "#5A189A", label: "Vísceras Res" };
  }
  
  if (name.includes("suplemento")) return { icon: Pill, hex: "#2A9D8F", label: "Suplementos" };
  if (name.includes("taurina")) return { icon: Zap, hex: "#277DA1", label: "Taurina" };

  // Default genérico
  return { icon: Package, hex: "#9CA3AF", label: "Otros" };
}

/**
 * Vista de cards con iconos y barras de colores sincronizados por ingrediente
 */
export default function FormulacionesCards({
  formulaciones,
  productosMap,
  ingredientesMap,
  loading,
  onEdit,
  onDelete,
}) {
  if (loading && formulaciones.length === 0) return <CardsSkeleton />;
  if (!loading && formulaciones.length === 0) return <EmptyState />;

  // Agrupar por producto
  const formulacionesPorProducto = formulaciones.reduce((acc, f) => {
    if (!acc[f.id_producto]) acc[f.id_producto] = [];
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
                    <ChefHat className="size-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{producto?.nombre || `Producto #${productoId}`}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {ingredients.length} ingredientes • Total: {totalPorcentaje.toFixed(1)}%
                    </p>
                  </div>
                </div>
                
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

            {/* Barra de progreso sincronizada con colores únicos de ingredientes */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Balance de la receta</span>
                <span className={`text-sm font-bold ${totalPorcentaje === 100 ? "text-green-600" : "text-amber-600"}`}>
                  {totalPorcentaje.toFixed(1)}%
                </span>
              </div>
              {/* Barra segmentada con colores HEX exactos */}
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
                {ingredients.map((ing) => {
                  const ingredienteData = ingredientesMap[ing.id_ingrediente];
                  const { hex } = getIngredientStyle(ingredienteData?.nombre);
                  const porcentaje = parseFloat(ing.porcentaje_ingrediente);
                  return (
                    <div
                      key={ing.id}
                      className="transition-all hover:opacity-80"
                      style={{ width: `${porcentaje}%`, backgroundColor: hex }}
                      title={`${ingredienteData?.nombre}: ${porcentaje}%`}
                    />
                  );
                })}
              </div>
              
              {/* Leyenda visual debajo de la barra con colores exactos */}
              <div className="flex flex-wrap gap-3 mt-3">
                {ingredients.map((ing) => {
                  const ingredienteData = ingredientesMap[ing.id_ingrediente];
                  const { hex, label } = getIngredientStyle(ingredienteData?.nombre);
                  return (
                    <div key={ing.id} className="flex items-center gap-1.5">
                      <div className="size-2.5 rounded-full" style={{ backgroundColor: hex }} />
                      <span className="text-xs text-gray-600">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lista de ingredientes con iconos y bordes de colores únicos */}
            <div className="p-6">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {ingredients.map((ing) => {
                  const ingredienteData = ingredientesMap[ing.id_ingrediente];
                  const { icon: Icon, hex, label } = getIngredientStyle(ingredienteData?.nombre);
                  
                  return (
                    <div key={ing.id} 
                      className="p-4 rounded-xl border-2 bg-white hover:shadow-md transition group"
                      style={{ borderColor: hex + "40" }} // Borde con opacidad 25% (hex + 40)
                    >
                      <div className="flex items-start gap-3">
                        {/* Icono del ingrediente con fondo de color exacto (opacidad 15%) */}
                        <div 
                          className="size-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: hex + "25" }} 
                        >
                          <Icon className="size-5" style={{ color: hex }} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {ingredienteData?.nombre || `Ingrediente #${ing.id_ingrediente}`}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {ingredienteData?.unidad_medida || ""}
                          </p>
                          
                          <div className="mt-2 flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wider">Cantidad</p>
                              <p className="text-sm font-bold text-gray-900">{parseFloat(ing.cantidad_ingrediente).toFixed(2)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400 uppercase tracking-wider">Porcentaje</p>
                              {/* Porcentaje con el color HEX exacto */}
                              <p className="text-lg font-extrabold" style={{ color: hex }}>{parseFloat(ing.porcentaje_ingrediente).toFixed(1)}%</p>
                            </div>
                          </div>
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
        <ChefHat className="size-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Sin formulaciones</h3>
      <p className="mt-1 text-sm text-gray-500">
        No has creado ninguna formulación aún.
      </p>
    </div>
  );
}