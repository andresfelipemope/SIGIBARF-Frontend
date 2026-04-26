"use client";

import { ProductCarousel } from "../components/ProductCarousel"
import { Leaf, Shield, Heart } from "lucide-react"

export default function Home() {
    return (
        <main>

            {/* HERO */}
            <section className="relative h-[80vh] flex items-center text-white">
                <img
                    src="/images/banner_barf.png"
                    className="absolute w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="relative z-10 max-w-6xl mx-auto px-6">
                    <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
                        Dietas y Snacks 100% Naturales
                    </span>

                    <h1 className="text-5xl font-bold mt-4 max-w-xl">
                        ¡Bienvenido a Athletic Barf!
                    </h1>

                    <p className="mt-4 max-w-lg text-gray-200">
                        Alimentación cruda biológicamente apropiada (BARF), elaborada con ingredientes de grado humano para una vida más larga y saludable.
                    </p>

                    <div className="flex gap-4 mt-6">
                        <button className="bg-green-600 px-6 py-3 rounded-full">
                            Comprar Ahora →
                        </button>
                        <button className="border px-6 py-3 rounded-full">
                            Calcular Porción
                        </button>
                    </div>
                </div>
            </section>

            {/* WHY SECTION */}
            <section className="py-20 text-center">
                <h2 className="text-3xl font-bold text-green-600">
                    ¿Por qué elegir BARF?
                </h2>
                <p className="text-gray-600 mt-2">
                    A diferencia de los alimentos industriales, BARF respeta las necesidades biológicas de perros y gatos, ayudando a mejorar su salud desde adentro.
                </p>
                <p className="text-gray-600">
                    Al elegir BARF, no solo estás alimentando a tu mascota… estás invirtiendo en su bienestar, longevidad y calidad de vida.
                </p>

                <div className="grid md:grid-cols-3 gap-10 mt-12 max-w-5xl mx-auto">
                    <div>
                        <div className="flex justify-center mb-4">
                            <div className="bg-green-100 p-4 rounded-full flex items-center justify-center">
                                <Leaf className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <h3 className="font-semibold mt-2">100% Natural</h3>
                        <p className="text-sm text-gray-600">
                            Sin conservantes, colorantes ni rellenos artificiales. Solo alimentos reales e integrales.
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-center mb-4">
                            <div className="bg-blue-100 p-4 rounded-full flex items-center justify-center">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="font-semibold mt-2">Grado Humano</h3>
                        <p className="text-sm text-gray-600">
                            Ingredientes obtenidos de los mismos proveedores que abastecen tu supermercado local.
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-center mb-4">
                            <div className="bg-red-100 p-4 rounded-full flex items-center justify-center">
                                <Heart className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <h3 className="font-semibold mt-2">Vida Saludable</h3>
                        <p className="text-sm text-gray-600">
                            Promueve pelaje brillante, dientes limpios y mayores niveles de energía.
                        </p>
                    </div>
                </div>
            </section>

            {/* CAROUSEL */}
            <section className="py-20 text-center bg-gray-100">
                <h2 className="text-3xl font-bold text-green-600">
                    Echa un vistazo a nuestros productos
                </h2>
                <ProductCarousel />
            </section>

        </main>
    )
}