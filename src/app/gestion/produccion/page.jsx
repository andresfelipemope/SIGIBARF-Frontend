"use client";

import { 
  Factory, 
  Plus, 
  Clock, 
  User, 
  ArrowRight
} from "lucide-react";

export default function ProduccionPage() {
  const batches = [
    {
      id: "LOT-204",
      recipe: "Athletic Dog Adulto Premium",
      quantity: "200 Kg",
      stage: "Mezclado y Adición de Aceites",
      progress: 65,
      operator: "Carlos Gómez",
      status: "activo",
      startedAt: "08:30 AM"
    },
    {
      id: "LOT-203",
      recipe: "Athletic Cat Purrfect Protein",
      quantity: "150 Kg",
      stage: "Ultracongelación Rápida",
      progress: 95,
      operator: "Ana Martínez",
      status: "activo",
      startedAt: "06:15 AM"
    },
    {
      id: "LOT-205",
      recipe: "Athletic Puppy Grow & Strong",
      quantity: "200 Kg",
      stage: "Dosificación e Insumos",
      progress: 15,
      operator: "Jorge Silva",
      status: "preparación",
      startedAt: "En espera"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-black">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Control de Producción
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Seguimiento de lotes en planta, fases de procesamiento, control microbiológico e historial de mermas.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all duration-200">
          <Plus className="size-4" />
          Iniciar Nuevo Lote
        </button>
      </div>

      {/* Production Batches List */}
      <div className="grid gap-6">
        {batches.map((batch) => (
          <div key={batch.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs hover:border-green-600/30 transition-all duration-300">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              
              {/* Batch identification */}
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-700 border border-green-100">
                  <Factory className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wider">{batch.id}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[8px] font-bold border uppercase tracking-wider ${
                      batch.status === "activo" 
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-orange-50 text-orange-700 border-orange-100 animate-pulse"
                    }`}>
                      {batch.status === "activo" ? "Procesando" : "Preparando"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-black mt-0.5">{batch.recipe}</h3>
                  <div className="mt-2 flex items-center gap-4 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <User className="size-3.5 text-gray-400" />
                      Operador: <strong className="text-gray-750">{batch.operator}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-gray-400" />
                      Inicio: <strong className="text-gray-750">{batch.startedAt}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress and status */}
              <div className="flex-1 max-w-md space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-500">Fase: <strong className="text-black font-semibold">{batch.stage}</strong></span>
                  <span className="font-bold text-green-700">{batch.progress}%</span>
                </div>
                <div className="relative h-2 w-full rounded-full bg-gray-50 border border-gray-100">
                  <div 
                    className="h-full rounded-full bg-green-600 transition-all duration-500" 
                    style={{ width: `${batch.progress}%` }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 justify-end">
                <div className="text-right mr-3 hidden sm:block">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Peso Neto</span>
                  <span className="text-sm font-bold text-black">{batch.quantity}</span>
                </div>
                <button className="inline-flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-green-50/20 transition-colors">
                  <ArrowRight className="size-4" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
