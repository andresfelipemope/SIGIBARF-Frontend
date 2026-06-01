"use client";

import Link from "next/link";
import {
  Boxes,
  Beef,
  Import,
  FlaskConical,
  Factory,
  ShoppingBag,
  History,
  AlertCircle,
  Coins,
  ArrowRight,
} from "lucide-react";

const MODULES = [
  {
    title: "Inventario",
    description:
      "Consulta y administra los productos disponibles del sistema, incluyendo stock actual y unidades de medida.",
    icon: Boxes,
    href: "/gestion/inventario",
    accent: "green",
  },
  {
    title: "Ingredientes",
    description:
      "Gestiona los ingredientes registrados, sus proveedores y niveles mínimos de stock requeridos.",
    icon: Beef,
    href: "/gestion/ingredientes",
    accent: "orange",
  },
  {
    title: "Entradas de Ingredientes",
    description:
      "Registra ingresos de materia prima al inventario con su respectivo proveedor y cantidad.",
    icon: Import,
    href: "/gestion/entradas",
    accent: "green",
  },
  {
    title: "Formulaciones",
    description:
      "Define y administra las recetas de producción, especificando proporciones de ingredientes por producto.",
    icon: FlaskConical,
    href: "/gestion/formulaciones",
    accent: "orange",
  },
  {
    title: "Producción",
    description:
      "Registra y controla los procesos de producción de productos BARF, consumiendo insumos del inventario.",
    icon: Factory,
    href: "/gestion/produccion",
    accent: "green",
  },
  {
    title: "Movimientos de Inventario",
    description:
      "Gestiona ventas externas, ajustes manuales y auditorías que afectan directamente el stock de productos.",
    icon: ShoppingBag,
    href: "/gestion/pedidos",
    accent: "orange",
  },
  {
    title: "Historial de Inventario",
    description:
      "Consulta el historial completo de movimientos de ingredientes y productos con filtros avanzados.",
    icon: History,
    href: "/gestion/historial",
    accent: "green",
  },
  {
    title: "Alertas",
    description:
      "Visualiza eventos importantes, stock crítico y situaciones operativas que requieren atención inmediata.",
    icon: AlertCircle,
    href: "/gestion/alertas",
    accent: "orange",
  },
  {
    title: "Gestión de Deudas",
    description:
      "Administra obligaciones financieras pendientes y realiza seguimiento a compromisos de pago.",
    icon: Coins,
    href: "/gestion/deudas",
    accent: "green",
  },
];

export default function GestionDashboard() {
  return (
    <div className="space-y-10 animate-fade-in text-black">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="border-b border-gray-100 pb-8">
        <div className="flex items-start gap-4">
          {/* Vertical accent bar */}
          <div className="hidden sm:block mt-1 w-1 h-14 rounded-full bg-orange-500 shrink-0" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">
              Panel Principal
            </p>
            <h1 className="text-3xl font-extrabold text-black tracking-tight leading-tight">
              SIGIBARF
            </h1>
            <p className="text-sm font-semibold text-gray-500 mt-0.5">
              Sistema de Gestión de Inventario y Producción BARF
            </p>
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-sm text-gray-600 font-medium leading-relaxed">
          Plataforma integral para la administración de{" "}
          <span className="font-semibold text-green-700">inventario</span>,{" "}
          <span className="font-semibold text-green-700">producción</span>,{" "}
          <span className="font-semibold text-green-700">movimientos</span>,{" "}
          <span className="font-semibold text-green-700">historial</span>,{" "}
          <span className="font-semibold text-green-700">alertas</span> y{" "}
          <span className="font-semibold text-green-700">deudas</span> de Athletic Barf.
          Selecciona el módulo al que deseas acceder para comenzar.
        </p>
      </div>

      {/* ── Módulo Cards ─────────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">
          Módulos del Sistema
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((mod) => {
            const isGreen = mod.accent === "green";

            return (
              <Link
                key={mod.href}
                href={mod.href}
                className={`
                  group relative flex flex-col gap-4 rounded-2xl border bg-white p-6
                  shadow-xs transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-md
                  ${isGreen
                    ? "border-gray-200 hover:border-green-200"
                    : "border-gray-200 hover:border-orange-200"
                  }
                `}
              >
                {/* Top row: icon + name */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`
                      flex size-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-200
                      group-hover:scale-105
                      ${isGreen
                        ? "bg-green-50 border-green-100 text-green-700"
                        : "bg-orange-50 border-orange-100 text-orange-600"
                      }
                    `}
                  >
                    <mod.icon className="size-5" />
                  </div>

                  {/* Arrow hint on hover */}
                  <span
                    className={`
                      mt-1 flex size-6 shrink-0 items-center justify-center rounded-full opacity-0 transition-all duration-200
                      group-hover:opacity-100
                      ${isGreen
                        ? "bg-green-50 text-green-600"
                        : "bg-orange-50 text-orange-500"
                      }
                    `}
                  >
                    <ArrowRight className="size-3.5" />
                  </span>
                </div>

                {/* Name */}
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-black leading-snug">
                    {mod.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-gray-500 font-medium leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="pt-1 border-t border-gray-100">
                  <span
                    className={`
                      inline-flex items-center gap-1.5 text-xs font-bold transition-colors duration-200
                      ${isGreen
                        ? "text-green-600 group-hover:text-green-700"
                        : "text-orange-500 group-hover:text-orange-600"
                      }
                    `}
                  >
                    Ir al módulo
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
