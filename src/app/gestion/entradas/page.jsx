"use client";

import { 
  Thermometer, 
  Calendar, 
  Plus, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function EntradasPage() {
  const entries = [
    {
      id: "ENT-209",
      ingredient: "Carne de Res Premium (Lomo)",
      quantity: "350 Kg",
      supplier: "Frigorífico Central del Norte",
      date: "2026-05-21",
      supplierBatch: "LOT-牛肉-948",
      temperature: "-18.5 °C",
      qcStatus: "aprobado",
    },
    {
      id: "ENT-208",
      ingredient: "Hígado de Pollo Fresco",
      quantity: "80 Kg",
      supplier: "Avícola San Jorge",
      date: "2026-05-19",
      supplierBatch: "LOT-HP-083",
      temperature: "-19.1 °C",
      qcStatus: "aprobado",
    },
    {
      id: "ENT-207",
      ingredient: "Zanahoria Orgánica Rallada",
      quantity: "120 Kg",
      supplier: "Distribuidores del Campo",
      date: "2026-05-18",
      supplierBatch: "LOT-ZO-572",
      temperature: "4.2 °C",
      qcStatus: "aprobado",
    },
    {
      id: "ENT-206",
      ingredient: "Aceite de Salmón Extraído en Frío",
      quantity: "25 Litros",
      supplier: "Patagonia Seafoods",
      date: "2026-05-15",
      supplierBatch: "LOT-SAL-301",
      temperature: "14.8 °C",
      qcStatus: "revisión",
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-black">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Entrada de Ingredientes
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Historial de recepciones de materia prima, controles de cadena de frío y trazabilidad de lotes.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all duration-200">
          <Plus className="size-4" />
          Registrar Entrada
        </button>
      </div>

      {/* Entry Logs Table */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-3">Código</th>
                <th className="py-4 px-3">Ingrediente</th>
                <th className="py-4 px-3">Cantidad</th>
                <th className="py-4 px-3">Proveedor</th>
                <th className="py-4 px-3">Fecha</th>
                <th className="py-4 px-3 text-right">Lote Proveedor</th>
                <th className="py-4 px-3 text-right">Cadena de Frío</th>
                <th className="py-4 px-3 text-center">Control Calidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-green-50/10 transition-colors">
                  <td className="py-4 px-3 text-xs font-bold text-green-700">
                    {entry.id}
                  </td>
                  <td className="py-4 px-3 text-sm font-semibold text-black">
                    {entry.ingredient}
                  </td>
                  <td className="py-4 px-3 text-sm font-bold text-black">
                    {entry.quantity}
                  </td>
                  <td className="py-4 px-3 text-xs font-medium text-gray-700">
                    {entry.supplier}
                  </td>
                  <td className="py-4 px-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1 font-semibold">
                      <Calendar className="size-3.5 text-orange-500" />
                      <span>{entry.date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-right text-xs font-bold text-gray-500">
                    {entry.supplierBatch}
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700">
                      <Thermometer className="size-3.5 text-green-600" />
                      <span>{entry.temperature}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-center">
                    {entry.qcStatus === "aprobado" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                        <CheckCircle className="size-3" />
                        Aprobado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-100 animate-pulse">
                        <AlertCircle className="size-3" />
                        En Revisión
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
