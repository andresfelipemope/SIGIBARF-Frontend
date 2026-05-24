"use client";

import { Toaster } from "sonner";
import { ArrowLeft, Sparkles, Shield, Heart } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex bg-[#fafaf9] text-zinc-900 antialiased selection:bg-orange-100 selection:text-orange-950">
      <Toaster position="top-right" richColors closeButton expand={false} />

      {/* Panel Izquierdo: Branding Premium (Solo visible en LG y superior) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-950 flex-col justify-between p-12 border-r border-zinc-800">
        {/* Fondo con degradado sutil de color verde bosque profundo y negro */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#132c1b]/30 via-zinc-950 to-zinc-950 z-0" />
        
        {/* Patrón de líneas decorativas sutiles */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] z-0" />

        {/* Header superior */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/home"
            className="inline-flex items-center text-xs font-bold text-orange-400 hover:text-orange-300 transition-all gap-2 group bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-orange-500/30 px-4 py-2.5 rounded-full shadow-lg hover:shadow-orange-500/5 hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            Volver a la tienda
          </Link>
          <span className="text-xs bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 px-3 py-1 rounded-full font-medium tracking-wide">
            v1.2.0
          </span>
        </div>

        {/* Branding Central */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Nutrición de Élite
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl leading-none">
              ATHLETIC <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">BARF</span>
            </h1>
            <p className="text-lg text-zinc-400 font-medium">
              Saludable, Seguro y Natural
            </p>
          </div>

          <p className="text-zinc-400 leading-relaxed font-light text-base">
            Diseñamos la alimentación biológicamente adecuada que tu mascota merece. 
            Ingredientes 100% naturales, balanceados científicamente para activar su vitalidad, 
            mejorar su pelaje y prolongar su felicidad a tu lado.
          </p>

          {/* Características destacadas */}
          <div className="pt-6 grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white text-xs font-semibold">100% Seguro</h4>
                <p className="text-zinc-500 text-[11px] mt-0.5 leading-normal">Estrictos controles bacteriológicos y frescura garantizada.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <Heart className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white text-xs font-semibold">Amor Natural</h4>
                <p className="text-zinc-500 text-[11px] mt-0.5 leading-normal">Sin colorantes, conservantes artificiales ni subproductos de relleno.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer inferior del panel de marca */}
        <div className="relative z-10 flex items-center justify-between text-xs text-zinc-500">
          <p>© 2026 Athletic Barf. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-300 transition-colors">Términos</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacidad</a>
          </div>
        </div>
      </div>

      {/* Panel Derecho: Formularios interactivos */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        {/* Fondo sutil móvil */}
        <div className="lg:hidden absolute inset-0 bg-radial-gradient(circle_at_top,_var(--tw-gradient-stops)) from-orange-50/40 via-[#fafaf9] to-[#fafaf9] z-0" />
        
        {/* Botón de volver móvil */}
        <div className="absolute top-6 left-6 z-10 lg:hidden">
          <Link
            href="/home"
            className="inline-flex items-center text-xs font-bold text-orange-600 hover:text-orange-500 transition-all gap-1.5 bg-white border border-zinc-200/80 hover:border-orange-500/30 px-4 py-2.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a la tienda
          </Link>
        </div>

        {/* Contenido del Formulario */}
        <div className="w-full max-w-md relative z-10 py-8">
          <div className="flex justify-center mb-6 lg:hidden">
            <img src="/images/AthleticBarf.png" alt="Athletic Barf Logo" className="w-16 h-16 object-contain" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}