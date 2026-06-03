'use client';

import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from 'lucide-react';
import Image from 'next/image';

const CONTACTO = {
    telefono: '+57 311 874 5980',
    telefonoHref: 'tel:+573118745980',
    whatsappHref: 'https://api.whatsapp.com/send/?phone=573118745980&text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20Athletic%20Barf',
    email: 'athletic_barf_cucuta@hotmail.com',
    mailtoHref: 'mailto:athletic_barf_cucuta@hotmail.com',
    instagram: 'https://www.instagram.com/athleticbarf',
    facebook: 'https://www.facebook.com/athleticbarf/?ref=NONE_xav_ig_profile_page_web',
    ubicacion1: 'Cúcuta, Norte de Santander, Colombia 🇨🇴',
    ubicacion2: 'Estado Táchira, Venezuela 🇻🇪',
    horario: 'Lunes a Sábado · 8:00 am – 6:00 pm',
};

// ── Tarjeta de canal ─────────────────────────────────────────────────
function CanalCard({ icon: Icon, iconBg, title, value, href, label, target }) {
    return (
        <a
            href={href}
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-200"
        >
            <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className="size-5" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{title}</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5 group-hover:text-green-700 transition-colors truncate">{value}</p>
                {label && <p className="text-xs text-green-600 font-semibold mt-1">{label}</p>}
            </div>
        </a>
    );
}

export default function ContactoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5F1E8] to-white font-sans">

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/banner_barf.png')] bg-cover bg-center opacity-10" />
                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                        Contáctanos
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                        Estamos para ayudarte
                    </h1>
                    <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
                        Escríbenos por WhatsApp, llámanos o síguenos en redes sociales. Con gusto te asesoramos sobre nuestros productos BARF.
                    </p>
                    <a
                        href={CONTACTO.whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-green-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-500/30 hover:bg-green-600 transition-all"
                    >
                        <FaWhatsapp className="size-5" />
                        Escríbenos por WhatsApp
                    </a>
                </div>
            </section>

            {/* ── Canales de contacto ───────────────────────────────────────── */}
            <section className="max-w-5xl mx-auto px-6 pb-16">
                <h2 className="text-xl font-extrabold text-gray-900 mb-6">Canales de contacto</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <CanalCard
                        icon={FaWhatsapp}
                        iconBg="bg-green-50 text-green-600 border border-green-100"
                        title="WhatsApp"
                        value={CONTACTO.telefono}
                        href={CONTACTO.whatsappHref}
                        label="Escríbenos ahora →"
                        target="_blank"
                    />
                    <CanalCard
                        icon={Phone}
                        iconBg="bg-blue-50 text-blue-600 border border-blue-100"
                        title="Teléfono"
                        value={CONTACTO.telefono}
                        href={CONTACTO.telefonoHref}
                        label="Llamar ahora →"
                    />
                    <CanalCard
                        icon={Mail}
                        iconBg="bg-orange-50 text-orange-500 border border-orange-100"
                        title="Correo electrónico"
                        value={CONTACTO.email}
                        href={CONTACTO.mailtoHref}
                        label="Enviar correo →"
                    />
                </div>
            </section>

            {/* ── Redes sociales + info ─────────────────────────────────────── */}
            <section className="max-w-5xl mx-auto px-6 pb-16">
                <div className="grid gap-8 md:grid-cols-2">

                    {/* Redes */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h2 className="text-base font-extrabold text-gray-900 mb-1">Síguenos en redes</h2>
                        <p className="text-xs text-gray-400 mb-5">Recetas, tips nutricionales y novedades de Athletic Barf.</p>
                        <div className="space-y-3">
                            <a
                                href={CONTACTO.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3.5 rounded-xl border border-pink-100 bg-gradient-to-r from-pink-50 to-orange-50 px-4 py-3.5 hover:shadow-sm transition-all group"
                            >
                                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-orange-400">
                                    <FaInstagram className="size-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 group-hover:text-pink-600 transition-colors">@athleticbarf</p>
                                    <p className="text-xs text-gray-400">Instagram</p>
                                </div>
                                <span className="ml-auto text-xs font-bold text-pink-500 group-hover:translate-x-0.5 transition-transform">→</span>
                            </a>

                            <a
                                href={CONTACTO.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3.5 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3.5 hover:shadow-sm transition-all group"
                            >
                                <div className="flex size-10 items-center justify-center rounded-xl bg-[#1877F2]">
                                    <FaFacebook className="size-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Athletic Barf</p>
                                    <p className="text-xs text-gray-400">Facebook</p>
                                </div>
                                <span className="ml-auto text-xs font-bold text-blue-500 group-hover:translate-x-0.5 transition-transform">→</span>
                            </a>

                            <a
                                href={CONTACTO.whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3.5 rounded-xl border border-green-100 bg-green-50/50 px-4 py-3.5 hover:shadow-sm transition-all group"
                            >
                                <div className="flex size-10 items-center justify-center rounded-xl bg-[#25D366]">
                                    <FaWhatsapp className="size-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors">{CONTACTO.telefono}</p>
                                    <p className="text-xs text-gray-400">WhatsApp Business</p>
                                </div>
                                <span className="ml-auto text-xs font-bold text-green-500 group-hover:translate-x-0.5 transition-transform">→</span>
                            </a>
                        </div>
                    </div>

                    {/* Ubicación + horario */}
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="flex size-9 items-center justify-center rounded-xl bg-green-50 border border-green-100">
                                    <MapPin className="size-4 text-green-600" />
                                </div>
                                <h2 className="text-base font-extrabold text-gray-900">Cobertura</h2>
                            </div>
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                                    <span className="text-xl">🇨🇴</span>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Colombia</p>
                                        <p className="text-xs text-gray-400">Cúcuta y Norte de Santander · Envíos nacionales</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                                    <span className="text-xl">🇻🇪</span>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Venezuela</p>
                                        <p className="text-xs text-gray-400">Estado Táchira · Único proveedor BARF en el país</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 border border-amber-100">
                                    <Clock className="size-4 text-amber-600" />
                                </div>
                                <h2 className="text-base font-extrabold text-gray-900">Horario de atención</h2>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">{CONTACTO.horario}</p>
                            <p className="text-xs text-gray-400 mt-1">Pedidos por WhatsApp disponibles las 24 horas</p>
                        </div>

                        {/* CTA final */}
                        <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                            <div className="flex items-start gap-3">
                                <MessageCircle className="size-5 text-green-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-green-800">¿Listo para mejorar la nutrición de tu mascota?</p>
                                    <p className="text-xs text-green-600 mt-1">Escríbenos y un asesor te ayudará a elegir el plan ideal.</p>
                                    <a
                                        href={CONTACTO.whatsappHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700 transition-colors"
                                    >
                                        <Send className="size-3.5" /> Empezar ahora
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}