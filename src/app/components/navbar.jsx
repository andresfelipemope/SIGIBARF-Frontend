"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, User } from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const [active, setActive] = useState({
    catalogo: true,
    calculadora: false,
    nosotros: false,
    gestion: false,
  });

  const [admin, setAdmin] = useState(false);

  const handleClick = (section, route) => {
    setActive({
      catalogo: false,
      calculadora: false,
      nosotros: false,
      gestion: false,
      [section]: true,
    });

    //route.push(route);
  };

  const handleUser = () => {
    route.push("/login")
  }

  const handleCart = () => {
    route.push("/cart")
  }

  return (
    <div className="flex justify-between p-3 items-center border-b-2 border-green-600">

      <div className="flex gap-2 items-center font-bold">
        <img src="/images/AthleticBarf.png" alt="logo" className="w-16 h-16" />
        <p className="text-2xl">ATHLETIC BARF</p>
      </div>

      <div className="flex gap-6 text-lg">
        <p className={`cursor-pointer
        ${active.catalogo
            ? "border-b-2 border-green-500 text-green-700 transition-all duration-300"
            : "hover:border-b-2 border-gray-200 transition-all duration-300"
          }`}
          onClick={() => handleClick("catalogo", "/catalogo")}>
          Catálogo
        </p>
        <p className={`cursor-pointer
        ${active.calculadora
            ? "border-b-2 border-green-500 text-green-700 transition-all duration-300"
            : "hover:border-b-2 border-gray-200 text transition-all duration-300"
          }`}
          onClick={() => handleClick("calculadora", "/calculadora")}>
          Calculadora nutricional
        </p>
        <p className={`cursor-pointer
        ${active.nosotros
            ? "border-b-2 order-green-500 text-green-700 transition-all duration-300"
            : "hover:border-b-2 border-gray-200 transition-all duration-300"
          }`}
          onClick={() => handleClick("nosotros", "/nosotros")}>
          Nosotros
        </p>
        {admin && (<p className={`cursor-pointer
        ${active.gestion
            ? "border-b-2 order-green-500 text-green-700 transition-all duration-300"
            : "hover:border-b-2 border-gray-200 transition-all duration-300"
          }`}
          onClick={() => handleClick("gestion", "/gestion")}>
          Gestion de Inventario
        </p>)}

      </div>

      <div className="flex gap-4">
        <User className="cursor-pointer" onClick={() => handleUser()} />
        <ShoppingCart className="cursor-pointer" onClick={() => handleCart()} />
      </div>
    </div>
  );
}