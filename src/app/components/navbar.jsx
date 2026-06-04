"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, User, Menu } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access");
      setIsLoggedIn(!!token);

      const userString = localStorage.getItem("user");
      if (token && userString) {
        try {
          const userObj = JSON.parse(userString);
          setAdmin(userObj.rol === "Administrador");
        } catch (error) {
          console.error("Error al parsear el usuario del localStorage:", error);
          setAdmin(false);
        }
      } else {
        setAdmin(false);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleClick = (route) => router.push(route);

  const handleUser = () => {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    setShowDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setAdmin(false);
    setIsLoggedIn(false);
    setShowDropdown(false);
    toast.success("Sesión cerrada correctamente.");
    router.push("/auth/login");
  };

  const handleCart = () => {
    const token = localStorage.getItem("access");
    if (!token) {
      toast.error("Debes iniciar sesión para acceder al carrito.");
      router.push("/auth/login");
      return;
    }
    router.push("/cart");
  };

  const activeCls = "border-b-2 border-green-500 text-green-700 font-semibold";
  const inactiveCls = "hover:border-b-2 border-gray-200";

  const activeSheet =
    "bg-green-50/70 text-green-700 border-l-4 border-orange-500 pl-2.5 rounded-l-none";
  const inactiveSheet = "hover:bg-zinc-50 hover:text-zinc-950";

  const navLinks = [
    { label: "Inicio", route: "/home", match: (p) => p === "/home" },
    {
      label: "Catálogo",
      route: "/catalogo",
      match: (p) => p.startsWith("/catalogo"),
    },
    {
      label: "Calculadora nutricional",
      route: "/calculadora",
      match: (p) => p.startsWith("/calculadora"),
    },
    {
      label: "Nosotros",
      route: "/nosotros",
      match: (p) => p.startsWith("/nosotros"),
    },
    {
      label: "Contacto",
      route: "/contacto",
      match: (p) => p.startsWith("/contacto"),
    },
  ];

  return (
    <nav className="flex justify-between items-center p-3 border-b-2 border-green-600 bg-white relative z-40">
      {/* Logo */}
      <a href="/home" className="flex flex-1 items-center gap-2 font-bold">
        <img
          src="/images/AthleticBarf.png"
          alt="Athletic Barf"
          className="w-12 h-12 md:w-16 md:h-16 shrink-0"
        />
        <p className="text-xl md:text-2xl tracking-tight text-zinc-900 leading-none">
          ATHLETIC BARF
        </p>
      </a>

      {/* Navegación Desktop */}
      <div className="hidden lg:flex shrink-0 gap-6 text-lg justify-center text-zinc-600 font-medium">
        {navLinks.map(({ label, route, match }) => (
          <p
            key={route}
            onClick={() => handleClick(route)}
            className={`cursor-pointer transition-all duration-300 ${match(pathname) ? activeCls : inactiveCls}`}
          >
            {label}
          </p>
        ))}

        {admin && (
          <p
            onClick={() => handleClick("/gestion")}
            className={`cursor-pointer transition-all duration-300 ${
              pathname.startsWith("/gestion") ? activeCls : inactiveCls
            }`}
          >
            Gestión
          </p>
        )}
      </div>

      {/* Acciones Derecha */}
      <div className="flex flex-1 justify-end items-center gap-3 md:gap-4">
        {/* Usuario */}
        <div className="relative flex items-center">
          <User
            onClick={handleUser}
            className="cursor-pointer text-zinc-700 hover:text-zinc-950 transition-colors size-5 md:size-6"
          />

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-[998]"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-zinc-200/80 bg-white p-1.5 shadow-md z-[999] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-1.5 text-[9px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 pb-1 mb-1">
                  Mi Cuenta
                </div>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    router.push("/user");
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 rounded-lg transition-colors font-medium cursor-pointer"
                >
                  Mi Perfil
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    router.push("/pedidos");
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 rounded-lg transition-colors font-medium cursor-pointer"
                >
                  Mis Pedidos
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-semibold cursor-pointer"
                >
                  Cerrar Sesión
                </button>
              </div>
            </>
          )}
        </div>

        {/* Carrito */}
        <ShoppingCart
          onClick={handleCart}
          className="cursor-pointer text-zinc-700 hover:text-zinc-950 transition-colors size-5 md:size-6"
        />

        {/* Mobile Menu */}
        <div className="flex lg:hidden items-center ml-1">
          <Sheet>
            <SheetTrigger className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer focus:outline-none">
              <Menu className="size-5 md:size-6" />
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[280px] sm:w-[320px] bg-white border-r border-zinc-200 p-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <SheetHeader className="border-b border-zinc-100 pb-4 flex flex-row items-center gap-2.5">
                  <img
                    src="/images/AthleticBarf.png"
                    alt="logo"
                    className="w-10 h-10 object-contain"
                  />
                  <SheetTitle className="text-base font-extrabold tracking-tight text-zinc-950 uppercase leading-none">
                    Athletic Barf
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-2.5 py-2 text-sm font-semibold text-zinc-600">
                  {navLinks.map(({ label, route, match }) => (
                    <SheetClose
                      key={route}
                      onClick={() => handleClick(route)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer font-bold ${
                        match(pathname) ? activeSheet : inactiveSheet
                      }`}
                    >
                      {label}
                    </SheetClose>
                  ))}

                  {admin && (
                    <SheetClose
                      onClick={() => handleClick("/gestion")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer font-bold ${
                        pathname.startsWith("/gestion")
                          ? activeSheet
                          : inactiveSheet
                      }`}
                    >
                      Gestión Integral
                    </SheetClose>
                  )}
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4 flex flex-col gap-2 mt-auto">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-center leading-normal">
                  Saludable, Seguro y Natural
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
