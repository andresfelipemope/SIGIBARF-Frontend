"use client";

import { 
  Plus, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  FileText
} from "lucide-react";

export default function DeudasPage() {
  const stats = [
    { label: "Cuentas por Pagar (Total)", value: "$2,350 USD", change: "4 Facturas", isAlert: false, icon: DollarSign, color: "text-green-700 bg-green-50 border-green-100" },
    { label: "Vencimiento Cercano (Esta Semana)", value: "$1,250 USD", change: "FAC-4089 (Mañana)", isAlert: true, icon: AlertTriangle, color: "text-orange-600 bg-orange-50 border-orange-100" },
    { label: "Facturas Vencidas", value: "$680 USD", change: "FAC-3990 (Ayer)", isAlert: true, icon: AlertTriangle, color: "text-rose-600 bg-rose-50 border-rose-100" },
    { label: "Egresos Conciliados (Este Mes)", value: "$4,120 USD", change: "9 Proveedores", isAlert: false, icon: CheckCircle, color: "text-green-700 bg-green-50 border-green-100" }
  ];

  const bills = [
    {
      id: "FAC-4089",
      provider: "Frigorífico Central del Norte",
      concept: "Carne de Res Premium (Lote 350 Kg)",
      amount: "$1,250 USD",
      dueDate: "2026-05-22",
      status: "pendiente"
    },
    {
      id: "FAC-4080",
      provider: "Avícola San Jorge",
      concept: "Hígado de Pollo Orgánico (Lote 80 Kg)",
      amount: "$420 USD",
      dueDate: "2026-05-28",
      status: "pendiente"
    },
    {
      id: "FAC-3990",
      provider: "Patagonia Seafoods",
      concept: "Aceite de Salmón (Lote 25 Litros)",
      amount: "$680 USD",
      dueDate: "2026-05-20",
      status: "vencida"
    },
    {
      id: "FAC-3980",
      provider: "Distribuidores del Campo",
      concept: "Zanahoria y Verduras de Temporada",
      amount: "$310 USD",
      dueDate: "2026-05-15",
      status: "pagada"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-black">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Gestión de Deudas
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Control de cuentas por pagar a proveedores de insumos y materias primas de Athletic Barf.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all duration-200">
          <Plus className="size-4" />
          Registrar Obligación
        </button>
      </div>

      {/* Financial Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {stat.label}
              </span>
              <div className={`flex size-10 items-center justify-center rounded-xl border ${stat.color}`}>
                <stat.icon className="size-5" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-black mt-4">
              {stat.value}
            </h3>
            <span className={`text-xs font-semibold block mt-1 ${stat.isAlert ? "text-orange-600 font-bold" : "text-gray-500"}`}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Debt Ledger Table */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-3">Nro. Factura</th>
                <th className="py-4 px-3">Proveedor</th>
                <th className="py-4 px-3">Concepto</th>
                <th className="py-4 px-3">Fecha Venc.</th>
                <th className="py-4 px-3">Monto</th>
                <th className="py-4 px-3 text-center">Estado Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-green-50/10 transition-colors">
                  <td className="py-4 px-3 text-xs font-bold text-green-700">
                    <div className="flex items-center gap-1.5 font-bold">
                      <FileText className="size-3.5 text-gray-400" />
                      <span>{bill.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-sm font-semibold text-black">
                    {bill.provider}
                  </td>
                  <td className="py-4 px-3 text-xs font-medium text-gray-700 max-w-xs truncate">
                    {bill.concept}
                  </td>
                  <td className="py-4 px-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1 font-semibold">
                      <Calendar className="size-3.5 text-orange-500" />
                      <span>{bill.dueDate}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-sm font-bold text-black">
                    {bill.amount}
                  </td>
                  <td className="py-4 px-3 text-center">
                    {bill.status === "pendiente" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-100 animate-pulse">
                        Pendiente
                      </span>
                    )}
                    {bill.status === "vencida" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-100">
                        Vencida
                      </span>
                    )}
                    {bill.status === "pagada" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                        Pagada
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
