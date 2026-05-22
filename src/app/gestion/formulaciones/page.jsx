"use client";

import { 
  FlaskConical, 
  Plus
} from "lucide-react";

export default function FormulacionesPage() {
  const recipes = [
    {
      id: "REC-A10",
      name: "Athletic Dog Adulto Premium",
      type: "Perros Adultos",
      efficiency: "96.4%",
      batchSize: "200 Kg",
      composition: [
        { name: "Proteína de Carne (Res/Pollo)", percentage: 70, color: "bg-green-600" },
        { name: "Hueso Blando Carnudo", percentage: 10, color: "bg-orange-500" },
        { name: "Vísceras y Órganos", percentage: 10, color: "bg-green-700" },
        { name: "Vegetales y Frutas", percentage: 8, color: "bg-orange-600" },
        { name: "Suplementos y Aceites", percentage: 2, color: "bg-gray-400" }
      ],
      state: "Activo"
    },
    {
      id: "REC-C05",
      name: "Athletic Cat Purrfect Protein",
      type: "Gatos Adultos",
      efficiency: "98.1%",
      batchSize: "150 Kg",
      composition: [
        { name: "Proteína Limpia (Pollo/Pavo)", percentage: 80, color: "bg-green-600" },
        { name: "Vísceras Ricas en Taurina", percentage: 10, color: "bg-green-700" },
        { name: "Hueso Blando Molido", percentage: 5, color: "bg-orange-500" },
        { name: "Vegetales Selectos", percentage: 3, color: "bg-orange-600" },
        { name: "Suplementos (Omega-3/Cálculo)", percentage: 2, color: "bg-gray-400" }
      ],
      state: "Activo"
    },
    {
      id: "REC-P02",
      name: "Athletic Puppy Grow & Strong",
      type: "Cachorros",
      efficiency: "95.0%",
      batchSize: "200 Kg",
      composition: [
        { name: "Proteína de Ternera / Pollo", percentage: 65, color: "bg-green-600" },
        { name: "Hueso Carnudo (Alto Calcio)", percentage: 15, color: "bg-orange-500" },
        { name: "Vísceras y Órganos Blandos", percentage: 10, color: "bg-green-700" },
        { name: "Puré de Calabaza y Zanahoria", percentage: 8, color: "bg-orange-600" },
        { name: "Suplementos de Crecimiento", percentage: 2, color: "bg-gray-400" }
      ],
      state: "Bajo Revisión"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-black">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Fórmulas y Recetarios
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Parámetros de composición porcentual, balanceo y control de macronutrientes para cada línea de producto BARF.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all duration-200">
          <Plus className="size-4" />
          Nueva Formulación
        </button>
      </div>

      {/* Recipes Listing */}
      <div className="space-y-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs hover:border-green-600/30 transition-all duration-300">
            {/* Header recipe details */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700 border border-green-100">
                  <FlaskConical className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wider">{recipe.id}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    <span className="text-xs font-semibold text-gray-500">{recipe.type}</span>
                  </div>
                  <h3 className="text-lg font-bold text-black mt-0.5">{recipe.name}</h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Lote de Prueba</span>
                  <span className="text-sm font-bold text-black">{recipe.batchSize}</span>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Rendimiento</span>
                  <span className="text-sm font-bold text-emerald-600">{recipe.efficiency}</span>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold border ${
                  recipe.state === "Activo" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                    : "bg-orange-50 text-orange-700 border-orange-100 animate-pulse"
                }`}>
                  {recipe.state}
                </span>
              </div>
            </div>

            {/* Visual composition progress bar segments */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Balance Porcentual de la Receta</h4>
              
              {/* Stacked gauge bar */}
              <div className="flex h-4 w-full overflow-hidden rounded-full bg-gray-50 border border-gray-100">
                {recipe.composition.map((c, i) => (
                  <div 
                    key={i}
                    className={`${c.color} h-full transition-all duration-300 hover:opacity-90 cursor-pointer`}
                    style={{ width: `${c.percentage}%` }}
                    title={`${c.name}: ${c.percentage}%`}
                  />
                ))}
              </div>

              {/* Legends list */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {recipe.composition.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`size-3 shrink-0 rounded-md ${c.color}`} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-semibold text-gray-500 truncate">{c.name}</span>
                      <span className="text-xs font-bold text-black">{c.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
