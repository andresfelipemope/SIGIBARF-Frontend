"use client";

import { ProductCarousel } from "../components/ProductCarousel";
import { Bone, Leaf, ShieldCheck, HeartPulse, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
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
            Alimentación cruda biológicamente apropiada (BARF), elaborada con
            ingredientes de grado humano para una vida más larga y saludable.
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => router.push("/catalogo")}
              className="bg-green-600 px-6 py-3 rounded-full"
            >
              Comprar Ahora →
            </button>
            <button
              onClick={() => router.push("/calculadora")}
              className="border px-6 py-3 rounded-full"
            >
              Calcular Porción
            </button>
          </div>
        </div>
      </section>

      {/* ═══ ¿QUÉ ES BARF? ═══ */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-4 rounded-full">
                <Bone className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              ¿Qué es la Dieta BARF?
            </h2>

            <p className="mt-6 text-gray-600 leading-relaxed text-lg">
              BARF significa <strong>Biologically Appropriate Raw Food </strong>
              (Alimentación Cruda Biológicamente Apropiada). Es una filosofía de
              alimentación basada en ingredientes naturales y frescos que busca
              respetar las necesidades nutricionales de perros y gatos.
            </p>

            <p className="mt-4 text-gray-600 leading-relaxed text-lg">
              A diferencia de muchos alimentos altamente procesados, la dieta
              BARF está compuesta por carnes, vísceras, huesos carnosos, frutas
              y verduras cuidadosamente seleccionadas para aportar nutrientes de
              forma natural y equilibrada.
            </p>
          </div>

          {/* Beneficios */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center text-orange-600">
              ¿Por qué elegir BARF?
            </h3>

            <p className="text-center text-gray-600 mt-4 max-w-3xl mx-auto">
              Alimentar con BARF no es solo darle comida a tu mascota; es
              invertir en su bienestar, energía y calidad de vida mediante una
              nutrición más cercana a su naturaleza.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-4 rounded-full">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                </div>

                <h4 className="font-semibold text-lg">100% Natural</h4>

                <p className="text-sm text-gray-600 mt-2">
                  Sin conservantes, colorantes ni rellenos artificiales. Solo
                  ingredientes reales y naturales.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>

                <h4 className="font-semibold text-lg">Grado Humano</h4>

                <p className="text-sm text-gray-600 mt-2">
                  Elaborada con ingredientes aptos para consumo humano y
                  sometidos a estrictos controles de calidad.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-red-100 p-4 rounded-full">
                    <HeartPulse className="w-6 h-6 text-red-600" />
                  </div>
                </div>

                <h4 className="font-semibold text-lg">Más Salud</h4>

                <p className="text-sm text-gray-600 mt-2">
                  Favorece una mejor digestión, fortalece el sistema
                  inmunológico y ayuda a mantener un peso saludable.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-orange-100 p-4 rounded-full">
                    <Sparkles className="w-6 h-6 text-orange-600" />
                  </div>
                </div>

                <h4 className="font-semibold text-lg">Mejor Calidad de Vida</h4>

                <p className="text-sm text-gray-600 mt-2">
                  Contribuye a un pelaje brillante, dientes más limpios, mayor
                  energía y bienestar general.
                </p>
              </div>
            </div>
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
  );
}
