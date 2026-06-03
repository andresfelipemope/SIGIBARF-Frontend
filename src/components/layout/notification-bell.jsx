"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    Bell, TrendingDown, Clock, AlertTriangle,
    X, CheckCircle, Loader2, DollarSign
} from "lucide-react";
import Link from "next/link";
import { notificacionesService } from "@/services/notificaciones.service";

const POLL_INTERVAL_MS = 60_000;

// ── Helpers de presentación ──────────────────────────────────────────
const TIPO_CONFIG = {
    stock_producto: { icon: TrendingDown, color: "red", label: "Stock bajo · Producto" },
    stock_ingrediente: { icon: TrendingDown, color: "red", label: "Stock bajo · Ingrediente" },
    vencimiento_producto: { icon: Clock, color: "orange", label: "Vencimiento · Producto" },
    deuda_vencida: { icon: DollarSign, color: "red", label: "Deuda vencida" },
    deuda_proxima: { icon: DollarSign, color: "orange", label: "Deuda próxima" },
};

const SOURCE_ROUTES = {
    producto: "/gestion/inventario",
    ingrediente: "/gestion/ingredientes",
    credito: "/gestion/creditos",
};

function getTipoConfig(tipo) {
    return TIPO_CONFIG[tipo] ?? { icon: AlertTriangle, color: "orange", label: tipo };
}

function iconBg(color) {
    return color === "red"
        ? "bg-red-50 border-red-100 text-red-500"
        : "bg-orange-50 border-orange-100 text-orange-500";
}

function formatFecha(fechaStr) {
    if (!fechaStr) return "";
    return new Date(fechaStr).toLocaleString("es-CO", {
        day: "2-digit", month: "2-digit",
        hour: "2-digit", minute: "2-digit",
    });
}

// ── Componente principal ─────────────────────────────────────────────
export default function NotificationBell() {
    const [notifs, setNotifs] = useState([]);
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [resolving, setResolving] = useState(new Set());

    const dropdownRef = useRef(null);
    const toastTimer = useRef(null);
    const prevIdsRef = useRef(new Set());

    // ── Fetch ────────────────────────────────────────────────────────
    const fetchNotifs = useCallback(async () => {
        try {
            const data = await notificacionesService.getNotificaciones();
            const lista = Array.isArray(data) ? data : [];
            setNotifs(lista);

            // Detectar nuevas (IDs que no estaban antes)
            const nuevos = lista.filter(n => !n.leida && !prevIdsRef.current.has(n.id));
            prevIdsRef.current = new Set(lista.map(n => n.id));

            if (nuevos.length > 0 && !open) {
                showToast(nuevos[0]);
            }
        } catch {
            // Falla silenciosamente
        }
    }, [open]);

    useEffect(() => {
        fetchNotifs();
        const interval = setInterval(fetchNotifs, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [fetchNotifs]);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        function handler(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ── Toast ────────────────────────────────────────────────────────
    function showToast(notif) {
        clearTimeout(toastTimer.current);
        setToast(notif);
        toastTimer.current = setTimeout(() => setToast(null), 5000);
    }

    // ── Resolver notificación ────────────────────────────────────────
    async function handleResolver(id) {
        setResolving(prev => new Set(prev).add(id));
        try {
            await notificacionesService.resolverNotificacion(id);
            setNotifs(prev => prev.filter(n => n.id !== id));
        } catch {
            // Si falla, dejamos la notif visible
        } finally {
            setResolving(prev => { const s = new Set(prev); s.delete(id); return s; });
        }
    }

    const unread = notifs.filter(n => !n.leida).length;

    return (
        <>
            {/* ── Toast ───────────────────────────────────────────────── */}
            {toast && (() => {
                const cfg = getTipoConfig(toast.tipo);
                const Icon = cfg.icon;
                return (
                    <div className="fixed top-5 right-5 z-[100] flex items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 shadow-xl max-w-xs w-full">
                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-xl border ${iconBg(cfg.color)}`}>
                            <Icon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-black">{cfg.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                                {toast.mensaje}
                            </p>
                        </div>
                        <button
                            onClick={() => setToast(null)}
                            className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
                        >
                            <X className="size-3.5" />
                        </button>
                    </div>
                );
            })()}

            {/* ── Campana + Dropdown ──────────────────────────────────── */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setOpen(o => !o)}
                    className="relative flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                    aria-label="Notificaciones"
                >
                    <Bell className="size-4" />
                    {unread > 0 && (
                        <span className="absolute -top-1 -right-1 flex size-[18px] items-center justify-center rounded-full bg-red-500 text-[9px] font-extrabold text-white shadow-sm">
                            {unread > 9 ? "9+" : unread}
                        </span>
                    )}
                </button>

                {open && (
                    <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <Bell className="size-4 text-gray-500" />
                                <span className="text-sm font-bold text-black">Notificaciones</span>
                            </div>
                            {unread > 0 && (
                                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-extrabold text-red-700">
                                    {unread} sin resolver
                                </span>
                            )}
                        </div>

                        {/* Lista */}
                        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                            {notifs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                                    <CheckCircle className="size-8 text-emerald-400" />
                                    <p className="text-sm font-bold text-emerald-700">Todo en orden</p>
                                    <p className="text-xs text-gray-400">No hay alertas activas.</p>
                                </div>
                            ) : (
                                notifs.map(n => {
                                    const cfg = getTipoConfig(n.tipo);
                                    const Icon = cfg.icon;
                                    const route = SOURCE_ROUTES[n.source_type];
                                    const isRes = resolving.has(n.id);

                                    return (
                                        <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
                                            <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg border mt-0.5 ${iconBg(cfg.color)}`}>
                                                <Icon className="size-3.5" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold text-black leading-tight">{cfg.label}</p>
                                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.mensaje}</p>
                                                <div className="flex items-center justify-between mt-1.5">
                                                    <span className="text-[10px] text-gray-300">{formatFecha(n.fecha_generada)}</span>
                                                    <div className="flex items-center gap-2">
                                                        {route && (
                                                            <Link
                                                                href={route}
                                                                onClick={() => setOpen(false)}
                                                                className="text-[10px] font-bold text-orange-500 hover:text-orange-600 transition-colors"
                                                            >
                                                                Ver →
                                                            </Link>
                                                        )}
                                                        <button
                                                            onClick={() => handleResolver(n.id)}
                                                            disabled={isRes}
                                                            className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
                                                        >
                                                            {isRes
                                                                ? <Loader2 className="size-3 animate-spin" />
                                                                : <CheckCircle className="size-3" />}
                                                            Resolver
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50">
                            <Link
                                href="/gestion/alertas"
                                onClick={() => setOpen(false)}
                                className="block w-full rounded-xl bg-orange-500 py-2 text-center text-xs font-bold text-white hover:bg-orange-600 transition-colors"
                            >
                                Ver módulo de alertas
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}