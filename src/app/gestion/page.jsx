"use client";

import Link from "next/link";
import { 
  TrendingUp, 
  Boxes, 
  Factory, 
  AlertTriangle, 
  ShoppingBag,
  ArrowUpRight,
  Plus,
  Activity,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function GestionDashboard() {
  const stats = [
    {
      title: "Inventario Total",
      value: "1,240 Kg",
      change: "+12.3%",
      timeframe: "vs. mes anterior",
      isPositive: true,
      icon: Boxes,
      color: "text-green-600 bg-green-50 border-green-100",
      href: "/gestion/inventario"
    },
    {
      title: "Lotes en Producción",
      value: "8 Lotes",
      change: "Activos hoy",
      timeframe: "4 en preparación",
      isPositive: true,
      icon: Factory,
      color: "text-orange-600 bg-orange-50 border-orange-100",
      href: "/gestion/produccion"
    },
    {
      title: "Alertas Activas",
      value: "3 Críticas",
      change: "Requiere atención",
      timeframe: "Stock mínimo superado",
      isPositive: false,
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50 border-rose-100",
      href: "/gestion/alertas"
    },
    {
      title: "Pedidos Pendientes",
      value: "24 Pedidos",
      change: "+8 hoy",
      timeframe: "vía E-commerce",
      isPositive: true,
      icon: ShoppingBag,
      color: "text-green-600 bg-green-50 border-green-100",
      href: "/gestion/pedidos"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "produccion",
      title: "Lote #204 - Athletic Dog Max",
      description: "Finalizó la etapa de mezclado y pasó a empaquetado.",
      time: "Hace 15 min",
      status: "completado",
      icon: Factory,
      iconBg: "bg-green-50 text-green-700 border-green-100"
    },
    {
      id: 2,
      type: "inventario",
      title: "Ingreso de Carne de Res Premium",
      description: "Se registraron 250 Kg provenientes de Carnes del Norte.",
      time: "Hace 45 min",
      status: "completado",
      icon: Boxes,
      iconBg: "bg-orange-50 text-orange-700 border-orange-100"
    },
    {
      id: 3,
      type: "alerta",
      title: "Stock Mínimo Excedido - Hígado de Pollo",
      description: "El inventario disponible cayó a 15 Kg (mínimo: 30 Kg).",
      time: "Hace 2 horas",
      status: "alerta",
      icon: AlertTriangle,
      iconBg: "bg-rose-50 text-rose-700 border-rose-100"
    },
    {
      id: 4,
      type: "pedido",
      title: "Nuevo Pedido Registrado #9482",
      description: "Cliente Andrés Felipe - Total: $145,000 COP.",
      time: "Hace 3 horas",
      status: "pendiente",
      icon: ShoppingBag,
      iconBg: "bg-orange-50 text-orange-700 border-orange-100"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-black">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Panel Principal
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Bienvenido al centro de comando de <span className="font-semibold text-green-600">Athletic Barf</span>. Aquí tienes el control de tu producción.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/gestion/formulaciones"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-100 bg-white px-4 py-2.5 text-xs font-semibold text-green-700 shadow-xs hover:bg-green-50/30 transition-all duration-200"
          >
            Ver Recetas
          </Link>
          <Link
            href="/gestion/produccion"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all duration-200"
          >
            <Plus className="size-4" />
            Iniciar Producción
          </Link>
        </div>
      </div>

      {/* Operational Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-green-600/30 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {stat.title}
              </span>
              <div className={`flex size-10 items-center justify-center rounded-xl border ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                <stat.icon className="size-5" />
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-2xl font-extrabold text-black">
                {stat.value}
              </h3>
              <div className="mt-1 flex items-center gap-1.5 text-xs">
                <span className={`font-semibold ${stat.isPositive ? "text-green-600" : "text-rose-600"}`}>
                  {stat.change}
                </span>
                <span className="text-gray-400 font-medium">{stat.timeframe}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Yield Charts & Metrics */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-black">Eficiencia de Producción Semanal</h2>
                <p className="text-xs text-gray-500 mt-0.5">Relación de insumos procesados vs. producto final (Kg)</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 border border-green-100 text-xs font-semibold text-green-700">
                <Activity className="size-3.5" />
                <span>94.8% Eficiencia</span>
              </div>
            </div>

            {/* Premium CSS Bar Chart Mockup */}
            <div className="mt-8 space-y-5">
              {[
                { label: "Lunes", inputs: 180, output: 172, pct: 95 },
                { label: "Martes", inputs: 210, output: 198, pct: 94 },
                { label: "Miércoles", inputs: 150, output: 145, pct: 96 },
                { label: "Jueves", inputs: 240, output: 226, pct: 94 },
                { label: "Viernes", inputs: 190, output: 181, pct: 95 }
              ].map((day) => (
                <div key={day.label} className="grid grid-cols-12 items-center gap-4">
                  <span className="col-span-2 text-xs font-semibold text-gray-700">{day.label}</span>
                  <div className="col-span-8 space-y-1.5">
                    {/* Processed ingredients bar */}
                    <div className="relative h-2.5 w-full rounded-full bg-orange-50/50">
                      <div 
                        className="h-full rounded-full bg-green-600 transition-all duration-500" 
                        style={{ width: `${(day.output / 250) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="col-span-2 text-right text-xs font-extrabold text-black">
                    {day.output} Kg
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-green-600" />
                  <span className="text-gray-500 font-medium">Producto Terminado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-orange-100" />
                  <span className="text-gray-500 font-medium">Capacidad Total</span>
                </div>
              </div>
              <span className="text-gray-500 font-medium">Actualizado hace 5 min</span>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activities */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-black">Actividad Reciente</h2>
            <p className="text-xs text-gray-500 mt-0.5">Últimos movimientos operacionales y de stock</p>
          </div>

          <div className="mt-6 flex-1 space-y-6">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex gap-4">
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${act.iconBg}`}>
                  <act.icon className="size-4.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xs font-bold text-black leading-normal">
                    {act.title}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {act.description}
                  </p>
                  <span className="text-[10px] text-gray-400 font-medium mt-1">
                    {act.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <Link
              href="/gestion/inventario"
              className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-green-50/20 py-2 text-xs font-bold text-green-700 border border-green-100 hover:bg-green-50/50 transition-colors"
            >
              <span>Ver Auditoría Completa</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
