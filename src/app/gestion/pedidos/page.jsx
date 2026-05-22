"use client";

import { useState } from "react";
import { 
  Plus, 
  Calendar, 
  Truck, 
  CheckCircle, 
  Clock
} from "lucide-react";

export default function PedidosPage() {
  const [statusFilter, setStatusFilter] = useState("todos");

  const orders = [
    {
      id: "PED-9482",
      customer: "Andrés Felipe Moreno",
      amount: "$145,000 COP",
      items: "10 Kg Athletic Dog Premium",
      date: "2026-05-21",
      status: "preparando",
      channel: "Web"
    },
    {
      id: "PED-9481",
      customer: "María Camila Restrepo",
      amount: "$85,000 COP",
      items: "5 Kg Athletic Cat Purrfect",
      date: "2026-05-21",
      status: "enviado",
      channel: "WhatsApp"
    },
    {
      id: "PED-9480",
      customer: "Juan Sebastián Castro",
      amount: "$210,000 COP",
      items: "15 Kg Athletic Dog Premium + Suplementos",
      date: "2026-05-20",
      status: "entregado",
      channel: "Web"
    },
    {
      id: "PED-9479",
      customer: "Laura Daniela Gómez",
      amount: "$58,000 COP",
      items: "4 Kg Athletic Puppy Grow",
      date: "2026-05-19",
      status: "entregado",
      channel: "Web"
    }
  ];

  const filteredOrders = statusFilter === "todos" 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  return (
    <div className="space-y-8 animate-fade-in text-black">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Gestión de Pedidos
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Despachos, seguimiento de envíos a domicilio y facturación de ventas E-commerce de Athletic Barf.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all duration-200">
          <Plus className="size-4" />
          Nuevo Pedido Manual
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 flex-wrap">
          {["todos", "preparando", "enviado", "entregado"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all uppercase tracking-wider ${
                statusFilter === status 
                  ? "bg-green-600 text-white shadow-sm" 
                  : "bg-green-50/20 text-green-800 border border-green-100 hover:bg-green-50/50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-3">Pedido ID</th>
                <th className="py-4 px-3">Cliente</th>
                <th className="py-4 px-3">Detalle Insumos</th>
                <th className="py-4 px-3">Fecha</th>
                <th className="py-4 px-3">Total</th>
                <th className="py-4 px-3">Canal</th>
                <th className="py-4 px-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-green-50/10 transition-colors">
                  <td className="py-4 px-3 text-xs font-bold text-green-700">
                    {order.id}
                  </td>
                  <td className="py-4 px-3 text-sm font-semibold text-black">
                    {order.customer}
                  </td>
                  <td className="py-4 px-3 text-xs font-medium text-gray-700 max-w-xs truncate">
                    {order.items}
                  </td>
                  <td className="py-4 px-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1 font-semibold">
                      <Calendar className="size-3.5 text-orange-500" />
                      <span>{order.date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-sm font-bold text-black">
                    {order.amount}
                  </td>
                  <td className="py-4 px-3 text-xs text-gray-500 font-bold">
                    {order.channel}
                  </td>
                  <td className="py-4 px-3 text-center">
                    {order.status === "preparando" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-100 animate-pulse">
                        <Clock className="size-3" />
                        Preparando
                      </span>
                    )}
                    {order.status === "enviado" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-bold text-green-700 border border-green-100">
                        <Truck className="size-3" />
                        Despachado
                      </span>
                    )}
                    {order.status === "entregado" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                        <CheckCircle className="size-3" />
                        Entregado
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
