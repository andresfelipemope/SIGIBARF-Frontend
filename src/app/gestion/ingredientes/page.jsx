"use client";

import { 
  Beef, 
  Carrot,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Plus,
  Scale
} from "lucide-react";

export default function IngredientesPage() {
  const ingredients = [
    {
      id: "ING-01",
      name: "Carne de Res Premium (Lomo)",
      category: "Proteína",
      costPerKg: "$4.80 USD",
      moisture: "70%",
      protein: "22%",
      fat: "6%",
      allergens: "Ninguno",
      status: "Aprobado",
      icon: Beef,
      iconBg: "bg-red-50 text-red-700 border-red-100"
    },
    {
      id: "ING-02",
      name: "Hígado de Pollo Orgánico",
      category: "Víscera",
      costPerKg: "$2.10 USD",
      moisture: "72%",
      protein: "19%",
      fat: "5%",
      allergens: "Ninguno",
      status: "Aprobado",
      icon: Beef,
      iconBg: "bg-rose-50 text-rose-700 border-rose-100"
    },
    {
      id: "ING-03",
      name: "Zanahoria Rallada",
      category: "Vegetal",
      costPerKg: "$0.90 USD",
      moisture: "88%",
      protein: "1.2%",
      fat: "0.2%",
      allergens: "Ninguno",
      status: "Aprobado",
      icon: Carrot,
      iconBg: "bg-orange-50 text-orange-700 border-orange-100"
    },
    {
      id: "ING-04",
      name: "Corazón de Cerdo Selección",
      category: "Proteína",
      costPerKg: "$3.50 USD",
      moisture: "73%",
      protein: "17%",
      fat: "8%",
      allergens: "Ninguno",
      status: "Aprobado",
      icon: Beef,
      iconBg: "bg-red-50 text-red-700 border-red-100"
    },
    {
      id: "ING-05",
      name: "Aceite de Salmón Extraído en Frío",
      category: "Suplemento",
      costPerKg: "$12.00 USD",
      moisture: "0.1%",
      protein: "0%",
      fat: "99.8%",
      allergens: "Pescado",
      status: "Bajo Revisión",
      icon: Sparkles,
      iconBg: "bg-amber-50 text-amber-700 border-amber-100"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-black">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Catálogo de Ingredientes
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Parámetros nutricionales, costes y trazabilidad de alérgenos autorizados para formulaciones.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all duration-200">
          <Plus className="size-4" />
          Añadir Ingrediente
        </button>
      </div>

      {/* Grid of Ingredient Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {ingredients.map((ing) => (
          <div key={ing.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
            <div>
              {/* Header Details */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex size-10 items-center justify-center rounded-xl border ${ing.iconBg}`}>
                    <ing.icon className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
                      {ing.id} • {ing.category}
                    </span>
                    <h3 className="text-base font-bold text-black leading-tight mt-0.5">
                      {ing.name}
                    </h3>
                  </div>
                </div>
                
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold border ${
                  ing.status === "Aprobado" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                    : "bg-orange-50 text-orange-700 border-orange-100 animate-pulse"
                }`}>
                  {ing.status}
                </span>
              </div>

              {/* Nutritional breakdown */}
              <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl bg-gray-50 p-4 border border-gray-100">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Proteína</span>
                  <span className="text-sm font-bold text-black mt-0.5">{ing.protein}</span>
                </div>
                <div className="flex flex-col items-center border-x border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Grasa</span>
                  <span className="text-sm font-bold text-black mt-0.5">{ing.fat}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Humedad</span>
                  <span className="text-sm font-bold text-black mt-0.5">{ing.moisture}</span>
                </div>
              </div>
            </div>

            {/* Bottom Cost & Allergens info */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-gray-500">
                <TrendingUp className="size-3.5 text-green-600" />
                <span>Costo: <strong className="text-black">{ing.costPerKg}</strong> / Kg</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-gray-500">
                <Scale className="size-3.5 text-gray-400" />
                <span>Alérgeno: <strong className={ing.allergens !== "Ninguno" ? "text-orange-600 font-semibold" : "text-gray-700"}>{ing.allergens}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
