import {
  LayoutDashboard,
  Boxes,
  Beef,
  Import,
  ChefHat,
  Factory,
  AlertCircle,
  ShoppingBag,
  ClipboardCheck,
  CreditCard,
} from "lucide-react";

export const sidebarMenuItems = [
  {
    title: "Panel Principal",
    url: "/gestion",
    icon: LayoutDashboard,
  },
  {
    title: "Gestión de Productos",
    url: "/gestion/inventario",
    icon: Boxes,
  },
  {
    title: "Gestión de Ingredientes",
    url: "/gestion/ingredientes",
    icon: Beef,
  },
  {
    title: "Recetarios",
    url: "/gestion/formulaciones",
    icon: ChefHat,
  },
  {
    title: "Entradas de Ingredientes",
    url: "/gestion/entradas",
    icon: Import,
  },
  {
    title: "Producción",
    url: "/gestion/produccion",
    icon: Factory,
  },
  {
    title: "Alertas",
    url: "/gestion/alertas",
    icon: AlertCircle,
  },
  {
    title: "Gestión de Pedidos",
    url: "/gestion/pedidos",
    icon: ShoppingBag,
  },
  {
    title: "Gestión de Créditos",
    url: "/gestion/creditos",
    icon: CreditCard,
  },
  {
    title: "Historial y Auditorías",
    url: "/gestion/historial",
    icon: ClipboardCheck,
  },
];
