import { 
  LayoutDashboard, 
  Boxes, 
  Beef, 
  Import, 
  FlaskConical, 
  Factory, 
  AlertCircle, 
  ShoppingBag, 
  Coins,
  History
} from "lucide-react";

export const sidebarMenuItems = [
  {
    title: "Panel Principal",
    url: "/gestion",
    icon: LayoutDashboard,
  },
  {
    title: "Inventario",
    url: "/gestion/inventario",
    icon: Boxes,
  },
  {
    title: "Ingredientes",
    url: "/gestion/ingredientes",
    icon: Beef,
  },
  {
    title: "Entradas de Ingredientes",
    url: "/gestion/entradas",
    icon: Import,
  },
  {
    title: "Formulaciones",
    url: "/gestion/formulaciones",
    icon: FlaskConical,
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
    badge: "3", // Example badge count (could be loaded from an API/state later)
  },
  {
    title: "Movimientos de Inventario",
    url: "/gestion/pedidos",
    icon: ShoppingBag,
  },
  {
    title: "Historial de Inventario",
    url: "/gestion/historial",
    icon: History,
  },
  {
    title: "Gestión de Deudas",
    url: "/gestion/deudas",
    icon: Coins,
  }
];
