"use client";

import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black border-t border-gray-200 mt-10">
            <div className="max-w-6xl mx-auto pt-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center text-center">

                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold text-green-700">
                        ATHLETIC BARF
                    </h2>
                    <p className="text-white mt-3 text-sm max-w-xs">
                        Alimentación natural y balanceada para mascotas.
                        Mejora su bienestar con productos frescos, seguros y nutritivos.
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <h3 className="font-bold text-green-700 mb-3 text-lg">Navegación</h3>
                    <ul className="space-y-2 text-white text-sm">
                        <li className="cursor-pointer hover:text-green-600 transition">
                            Catálogo
                        </li>
                        <li className="cursor-pointer hover:text-green-600 transition">
                            Calculadora nutricional
                        </li>
                        <li className="cursor-pointer hover:text-green-600 transition">
                            Nosotros
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col items-center">
                    <h3 className="font-bold text-green-700 mb-3 text-lg">Contacto</h3>
                    <div className="space-y-2 text-white text-sm flex flex-col items-center">
                        <a
                            href="tel:+573118745980"
                            className="flex items-center justify-center gap-2 hover:text-green-400 transition"
                        >
                            <Phone size={16} /> +57 311 874 5980
                        </a>
                        <a
                            href="mailto:athletic_barf_cucuta@hotmail.com"
                            className="inline-flex items-center justify-center gap-2 hover:text-green-400 transition"
                        >
                            <Mail size={16} /> athletic_barf_cucuta@hotmail.com
                        </a>
                    </div>

                    {/* 🔹 Redes */}
                    <div className="flex justify-center gap-4 mt-2">
                        <a
                            href="https://www.instagram.com/athleticbarf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 inline-flex"
                        >
                            <FaInstagram className="text-xl text-green-200 hover:text-green-600 transition" />
                        </a>
                        <a
                            href="https://www.facebook.com/athleticbarf/?ref=NONE_xav_ig_profile_page_web"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 inline-flex"
                        >
                            <FaFacebook className="text-xl text-green-200 hover:text-green-600 transition" />
                        </a>
                        <a
                            href="https://api.whatsapp.com/send/?phone=573118745980&text=Hola"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 inline-flex"
                        >
                            <FaWhatsapp className="text-xl text-green-200 hover:text-green-600 transition" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="text-white mb-4">
                <p className="flex items-center justify-center gap-2">
                    <MapPin size={16} /> Cúcuta, Colombia 🇨🇴
                </p>
                <p className="flex items-center justify-center gap-2">
                    <MapPin size={16} /> Estado Táchira, Venezuela 🇻🇪
                </p>
            </div>
        </footer>
    );
}