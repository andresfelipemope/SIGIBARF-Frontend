"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Detect if we are in the management dashboard routes (/gestion) or authentication routes (/auth)
  const isDashboardOrAuth =
    pathname.startsWith("/gestion") || pathname.startsWith("/auth");

  if (isDashboardOrAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
