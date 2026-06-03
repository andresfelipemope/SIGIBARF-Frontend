"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarMenuItems } from "./sidebar-menu-items";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

export function AppSidebar({ ...props }) {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-green-100 bg-white text-black transition-all duration-300"
      {...props}
    >
      {/* Sidebar Header: Corporate Branding logo & title */}
      <SidebarHeader className="border-b border-gray-100 px-4 py-5">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <img
            src="/images/AthleticBarf.png"
            alt="logo"
            className="w-11 h-11 shrink-0 object-contain transition-transform duration-300 hover:scale-105"
          />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-extrabold tracking-tight text-black leading-none uppercase">
              Athletic Barf
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 mt-1">
              Gestión Integral
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Sidebar Content: Navigation Links */}
      <SidebarContent className="py-4 overflow-x-hidden">
        <SidebarGroup className="p-2">
          <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-data-[collapsible=icon]:hidden">
            Menú de Operaciones
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="space-y-1">
              {sidebarMenuItems.map((item) => {
                // Determine if this item matches the active path
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/gestion" && pathname.startsWith(item.url));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={<Link href={item.url} />}
                      tooltip={item.title}
                      className={cn(
                        "group/btn flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ease-in-out font-semibold",
                        // centering collapsed icons:
                        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:mx-auto",
                        // Default corporate styling
                        "text-gray-600 hover:bg-green-50/40 hover:text-green-700 active:scale-[0.98]",
                        // Active corporate colors: green, orange, white, black
                        isActive &&
                          "bg-green-50/70 text-green-700 border-l-3 border-orange-500 rounded-l-none font-bold",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "size-5 shrink-0 transition-all duration-200 group-hover/btn:scale-105",
                          isActive
                            ? "text-orange-500"
                            : "text-gray-400 group-hover/btn:text-green-600",
                        )}
                      />
                      <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                      {item.badge && (
                        <SidebarMenuBadge
                          className={cn(
                            "flex size-5 items-center justify-center rounded-full text-[10px] font-extrabold tracking-tight transition-colors duration-200 group-data-[collapsible=icon]:hidden",
                            isActive
                              ? "bg-orange-500 text-white"
                              : "bg-green-50 text-green-700",
                          )}
                        >
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer: Volver al comercio button replacing Modo Administrador */}
      <SidebarFooter className="border-t border-gray-100 p-3">
        <Link
          href="/home"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-green-700 transition-all active:scale-[0.98] group-data-[collapsible=icon]:p-2.5 group-data-[collapsible=icon]:justify-center"
          title="Volver al comercio"
        >
          <ShoppingBag className="size-4.5 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">
            Volver al comercio
          </span>
        </Link>
      </SidebarFooter>

      {/* Sidebar Rail */}
      <SidebarRail />
    </Sidebar>
  );
}
