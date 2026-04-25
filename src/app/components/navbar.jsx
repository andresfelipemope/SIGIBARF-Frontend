"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const [active, setActive] = useState({
    catalogo: true,
    calculadora: false,
    nosotros: false,
  });

  const handleClick = (section, route) => {
    setActive({
      catalogo: false,
      calculadora: false,
      nosotros: false,
      [section]: true,
    });

    //route.push(route);
  };

  return (
    <div className="flex justify-between p-3 items-center">

      <div className="flex gap-2 items-center font-bold">
        <img src="/images/AthleticBarf.png" alt="logo" className="w-12 h-12" />
        <p className="text-2xl">ATHLETIC BARF</p>
      </div>

      <div className="flex gap-6">
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

      </div>

      <div>logos</div>
    </div>
  );
}