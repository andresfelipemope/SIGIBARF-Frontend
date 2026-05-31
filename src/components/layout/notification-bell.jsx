"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, TrendingDown, Clock, X, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { inventarioService } from "@/services/inventario";

// ── Constantes ───────────────────────────────────────────────────────
const POLL_INTERVAL_MS = 60_000; // cada 60 segundos
const DIAS_ALERTA_VENC = 30;
const LS_KEY_SEEN = "sigibarf_seen_alert_ids";

// ── Helpers ──────────────────────────────────────────────────────────
function diasRestantes(fechaStr) {
    if (!fechaStr) return null;
    return Math.ceil((new Date(fechaStr + "T00:00:00") - new Date()) / 86400000);
}

function generarAlertas(ingredientes, productos) {
    const alertas = [];

    ingredientes.forEach(i => {
        if (Number(i.stock_actual) < Number(i.stock_minimo)) {
            alertas.push({
                id: `si-${i.id}`,
                tipo: "stock_ingrediente",
                titulo: "Stock bajo · Ingrediente",
                desc: `${i.nombre} tiene ${parseFloat(i.stock_actual)} ${i.unidad_medida} (mín. ${parseFloat(i.stock_minimo)})`,
                color: "red",
            });
        }
    });

    productos.forEach(p => {
        if (Number(p.stock_actual) < Number(p.stock_minimo)) {
            alertas.push({
                id: `sp-${p.id}`,
                tipo: "stock_producto",
                titulo: "Stock bajo · Producto",
                desc: `${p.nombre} tiene ${p.stock_actual} uds (mín. ${p.stock_minimo})`,
                color: "red",
            });
        }
    });

    ingredientes.forEach(i => {
        const dias = diasRestantes(i.fecha_vencimiento);
        if (dias !== null && dias <= DIAS_ALERTA_VENC) {
            alertas.push({
                id: `vi-${i.id}`,
                tipo: "vencimiento_ingrediente",
                titulo: "Vencimiento · Ingrediente",
                desc: `${i.nombre} vence ${dias < 0 ? "hace " + Math.abs(dias) + " días" : dias === 0 ? "hoy" : "en " + dias + " días"}`,
                color: "orange",
            });
        }
    });

    productos.forEach(p => {
        const dias = diasRestantes(p.fecha_vencimiento);
        if (dias !== null && dias <= DIAS_ALERTA_VENC) {
            alertas.push({
                id: `vp-${p.id}`,
                tipo: "vencimiento_producto",
                titulo: "Vencimiento · Producto",
                desc: `${p.nombre} vence ${dias < 0 ? "hace " + Math.abs(dias) + " días" : dias === 0 ? "hoy" : "en " + dias + " días"}`,
                color: "orange",
            });
        }
    });

    return alertas;
}

function getSeenIds() {
    try {
        return new Set(JSON.parse(localStorage.getItem(LS_KEY_SEEN) || "[]"));
    } catch {
        return new Set();
    }
}

function saveSeenIds(ids) {
    localStorage.setItem(LS_KEY_SEEN, JSON.stringify([...ids]));
}

// ── Icono por tipo ───────────────────────────────────────────────────
function AlertIcon({ tipo, color }) {
    const cls = `size-4 shrink-0 ${color === "red" ? "text-red-500" : "text-orange-500"}`;
    if (tipo.startsWith("stock")) return <TrendingDown className={cls} />;
    return <Clock className={cls} />;
}

// ── Componente principal ─────────────────────────────────────────────
export default function NotificationBell() {
    const [alertas, setAlertas] = useState([]);
    const [unseenIds, setUnseenIds] = useState(new Set());
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState(null); // { titulo, desc }
    const dropdownRef = useRef(null);
    const toastTimer = useRef(null);

    // ── Fetch y diff ────────────────────────────────────────────────────
    const fetchAlertas = useCallback(async () => {
        try {
            const [ings, prods] = await Promise.all([
                inventarioService.getIngredientes(),
                inventarioService.getProductos(),
            ]);
            const nuevas = generarAlertas(
                Array.isArray(ings) ? ings : [],
                Array.isArray(prods) ? prods : [],
            );
            const seen = getSeenIds();
            const unseen = new Set(nuevas.map(a => a.id).filter(id => !seen.has(id)));

            setAlertas(nuevas);
            setUnseenIds(unseen);

            // Toast para alertas nuevas (solo si el dropdown está cerrado)
            if (unseen.size > 0 && !open) {
                const primera = nuevas.find(a => unseen.has(a.id));
                if (primera) showToast(primera);
            }
        } catch {
            // Falla silenciosamente — no interrumpir la navegación
        }
    }, [open]);

    // Polling
    useEffect(() => {
        fetchAlertas();
        const interval = setInterval(fetchAlertas, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [fetchAlertas]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ── Toast ────────────────────────────────────────────────────────────
    function showToast(alerta) {
        clearTimeout(toastTimer.current);
        setToast(alerta);
        toastTimer.current = setTimeout(() => setToast(null), 5000);
    }

    // ── Abrir dropdown → marcar todas como vistas ────────────────────────
    function handleOpen() {
        const next = !open;
        setOpen(next);
        if (next) {
            const allIds = new Set(alertas.map(a => a.id));
            saveSeenIds(allIds);
            setUnseenIds(new Set());
            setToast(null);
            clearTimeout(toastTimer.current);
        }
    }

    const unseen = unseenIds.size;

    return (
        <>
            {/* ── Toast ────────────────────────────────────────────────── */}
            {toast && (
                <div className="fixed top-5 right-5 z-[100] flex items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 shadow-xl max-w-xs animate-slide-in-right">
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${toast.color === "red" ? "bg-red-50 border border-red-100" : "bg-orange-50 border border-orange-100"
                        }`}>
                        <AlertIcon tipo={toast.tipo} color={toast.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-black">{toast.titulo}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{toast.desc}</p>
                    </div>
                    <button onClick={() => setToast(null)} className="text-gray-300 hover:text-gray-500 transition-colors shrink-0">
                        <X className="size-3.5" />
                    </button>
                </div>
            )}

            {/* ── Campana + Dropdown ────────────────────────────────────── */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={handleOpen}
                    className="relative flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                    aria-label="Notificaciones"
                >
                    <Bell className="size-4.5" />
                    {unseen > 0 && (
                        <span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-extrabold text-white shadow-sm">
                            {unseen > 9 ? "9+" : unseen}
                        </span>
                    )}
                </button>

                {/* Dropdown */}
                {open && (
                    <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                        {/* Header del dropdown */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <Bell className="size-4 text-gray-500" />
                                <span className="text-sm font-bold text-black">Alertas Activas</span>
                            </div>
                            {alertas.length > 0 && (
                                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-extrabold text-red-700">
                                    {alertas.length}
                                </span>
                            )}
                        </div>

                        {/* Lista */}
                        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                            {alertas.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                                    <CheckCircle className="size-8 text-emerald-400" />
                                    <p className="text-sm font-bold text-emerald-700">Todo en orden</p>
                                    <p className="text-xs text-gray-400">No hay alertas activas en este momento.</p>
                                </div>
                            ) : (
                                alertas.map(a => (
                                    <div key={a.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
                                        <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg mt-0.5 ${a.color === "red"
                                                ? "bg-red-50 border border-red-100"
                                                : "bg-orange-50 border border-orange-100"
                                            }`}>
                                            <AlertIcon tipo={a.tipo} color={a.color} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-black leading-tight">{a.titulo}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{a.desc}</p>
                                        </div>
                                    </div>
                                ))
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