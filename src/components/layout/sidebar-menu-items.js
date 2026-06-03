import { 
  LayoutDashboard, 
  Boxes, 
  Beef, 
  Import, 
  FlaskConical, 
  Factory, 
  AlertCircle, 
  ShoppingBag,
  ClipboardCheck,
  Coins,
  History,
  CreditCard,
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
    badge: "3",
  },
  {
    title: "Auditoría de Inventario",
    url: "/gestion/auditoria-inventario",
    icon: ClipboardCheck,
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
