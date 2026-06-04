import DashboardLayout from "@/components/layout/dashboard-layout";

export const metadata = {
  title: "Athletic Barf - Panel de Gestión",
  description:
    "Plataforma de administración interna y control de operaciones de Athletic Barf.",
};

export default function GestionRootLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
