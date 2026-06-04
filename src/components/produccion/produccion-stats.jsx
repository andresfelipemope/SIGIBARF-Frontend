"use client";

import { Factory, TrendingUp, AlertTriangle, Boxes } from "lucide-react";

export default function ProduccionStats({
  producciones,
  productos,
  ingredientes,
}) {
  const totalProducciones = producciones.length;

  // Calculate total units produced
  const totalUnidades = producciones.reduce(
    (acc, curr) => acc + (parseInt(curr.cantidad_producida) || 0),
    0,
  );

  // Products with low stock
  const productosCriticos = productos.filter(
    (p) => !p.inhabilitado && p.stock_actual <= p.stock_minimo,
  ).length;

  // Ingredients with low stock
  const ingredientesCriticos = ingredientes.filter(
    (i) => parseFloat(i.stock_actual) <= parseFloat(i.stock_minimo),
  ).length;

  const metrics = [
    {
      label: "Total Producciones",
      value: totalProducciones,
      icon: Factory,
      color: "text-green-700 bg-green-50 border-green-100",
    },
    {
      label: "Unidades Producidas",
      value: totalUnidades,
      icon: TrendingUp,
      color: "text-emerald-700 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Productos en Alerta",
      value: productosCriticos,
      icon: Boxes,
      color: "text-orange-600 bg-orange-50 border-orange-100",
    },
    {
      label: "Ingredientes Críticos",
      value: ingredientesCriticos,
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {m.label}
            </span>
            <div
              className={`flex size-10 items-center justify-center rounded-xl border ${m.color}`}
            >
              <m.icon className="size-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-black mt-4">{m.value}</h3>
        </div>
      ))}
    </div>
  );
}
