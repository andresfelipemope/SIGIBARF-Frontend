"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { ChevronRight, Home, Calendar } from "lucide-react";
import NotificationBell from "./notification-bell";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);

  const labelMap = {
    gestion: "Gestión",
    inventario: "Inventario",
    ingredientes: "Ingredientes",
    entradas: "Entradas de Ingredientes",
    formulaciones: "Formulaciones",
    produccion: "Producción",
    alertas: "Alertas",
    "auditoria-inventario": "Auditoría de Inventario",
    pedidos: "Gestión de Pedidos",
    creditos: "Gestión de Créditos",
    historial: "Historial de Inventario",
    deudas: "Gestión de Deudas",
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />

        <SidebarInset className="flex flex-col bg-gray-50 text-black overflow-hidden">
          {/* Header Bar */}
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-green-100 bg-white px-6 transition-all duration-300">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-gray-400 hover:bg-green-50 hover:text-green-700" />
              <div className="h-4 w-px bg-green-100" />

              {/* Breadcrumbs */}
              <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                <Link
                  href="/gestion"
                  className="flex items-center gap-1 transition-colors hover:text-green-700"
                >
                  <Home className="size-3.5" />
                </Link>

                {pathSegments.map((segment, index) => {
                  const isLast = index === pathSegments.length - 1;
                  const href = "/" + pathSegments.slice(0, index + 1).join("/");
                  const label = labelMap[segment] || segment;

                  if (segment === "gestion" && pathSegments.length > 1)
                    return null;

                  return (
                    <div key={href} className="flex items-center gap-1.5">
                      <ChevronRight className="size-3 text-gray-300" />
                      {isLast ? (
                        <span className="font-bold text-green-700">
                          {label}
                        </span>
                      ) : (
                        <Link
                          href={href}
                          className="transition-colors hover:text-green-700"
                        >
                          {label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Right side: fecha + campana */}
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-1.5 text-xs text-gray-500 sm:flex font-semibold">
                <Calendar className="size-3.5 text-orange-500" />
                <span>
                  {new Date().toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>

              {/* Campana de notificaciones */}
              <NotificationBell />
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto px-6 py-8 md:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
