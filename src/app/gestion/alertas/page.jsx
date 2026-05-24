"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle, Clock, TrendingDown, Package,
  ChevronDown, ChevronUp, RefreshCw, Loader2
} from "lucide-react";
import { API, apiFetch } from "@/lib/api";

const DIAS_ALERTA_VENCIMIENTO = 30;

function diasRestantes(fechaStr) {
  if (!fechaStr) return null;
  return Math.ceil((new Date(fechaStr + "T00:00:00") - new Date()) / 86400000);
}

function generarAlertas(ingredientes, productos) {
  const alertas = [];

  // Stock bajo — ingredientes
  ingredientes.forEach(i => {
    if (Number(i.stock_actual) < Number(i.stock_minimo)) {
      alertas.push({
        id: `si-${i.id}`, tipo: "stock_ingrediente",
        nombre: i.nombre, stockActual: Number(i.stock_actual),
        stockMinimo: Number(i.stock_minimo), unidad: i.unidad_medida,
        proveedor: i.proveedor,
      });
    }
  });

  // Stock bajo — productos
  productos.forEach(p => {
    if (Number(p.stock_actual) < Number(p.stock_minimo)) {
      alertas.push({
        id: `sp-${p.id}`, tipo: "stock_producto",
        nombre: p.nombre, stockActual: Number(p.stock_actual),
        stockMinimo: Number(p.stock_minimo), unidad: "uds",
      });
    }
  });

  // Vencimiento — ingredientes (campo fecha_vencimiento si existe)
  ingredientes.forEach(i => {
    const dias = diasRestantes(i.fecha_vencimiento);
    if (dias !== null && dias <= DIAS_ALERTA_VENCIMIENTO) {
      alertas.push({
        id: `vi-${i.id}`, tipo: "vencimiento_ingrediente",
        nombre: i.nombre, proveedor: i.proveedor,
        fechaVencimiento: i.fecha_vencimiento, diasRestantes: dias,
      });
    }
  });

  // Vencimiento — productos
  productos.forEach(p => {
    const dias = diasRestantes(p.fecha_vencimiento);
    if (dias !== null && dias <= DIAS_ALERTA_VENCIMIENTO) {
      alertas.push({
        id: `vp-${p.id}`, tipo: "vencimiento_producto",
        nombre: p.nombre, lote: p.lote,
        fechaVencimiento: p.fecha_vencimiento, diasRestantes: dias,
      });
    }
  });

  return alertas;
}

// ── Tarjeta colapsable ───────────────────────────────────────────────
function AlertCard({ title, subtitle, icon: Icon, iconColor, bgColor, borderColor, count, children }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className={`rounded-2xl border ${borderColor} ${bgColor} overflow-hidden`}>
      <button onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-4 hover:brightness-95 transition">
        <div className="flex items-center gap-3">
          <Icon className={`size-5 ${iconColor}`} />
          <div className="text-left">
            <p className={`text-sm font-bold ${iconColor}`}>{title}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${borderColor} ${iconColor} bg-white`}>
            {count} {count === 1 ? "ítem" : "ítems"}
          </span>
          {expanded ? <ChevronUp className="size-4 text-gray-400" /> : <ChevronDown className="size-4 text-gray-400" />}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-gray-100 bg-white">
          {count === 0
            ? <p className="px-5 py-6 text-sm text-center text-gray-400">Sin alertas en esta categoría ✓</p>
            : <div className="divide-y divide-gray-100">{children}</div>
          }
        </div>
      )}
    </div>
  );
}

// ── Fila Stock Bajo ──────────────────────────────────────────────────
function StockRow({ alerta }) {
  const pct = Math.min(100, Math.round((alerta.stockActual / Math.max(alerta.stockMinimo, 1)) * 100));
  const agotado = alerta.stockActual === 0;
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div>
        <p className="text-sm font-semibold text-black">{alerta.nombre}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Stock mínimo: {alerta.stockMinimo} {alerta.unidad}
          {alerta.proveedor ? ` · ${alerta.proveedor}` : ""}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="w-28 rounded-full bg-gray-100 h-1.5">
            <div className={`h-1.5 rounded-full ${agotado ? "bg-red-500" : "bg-orange-500"}`} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[10px] font-bold text-gray-400">{pct}%</span>
        </div>
      </div>
      <div className="text-right shrink-0 ml-4">
        <p className={`text-lg font-extrabold ${agotado ? "text-red-600" : "text-orange-600"}`}>
          {alerta.stockActual} <span className="text-sm font-semibold">{alerta.unidad}</span>
        </p>
        <p className="text-[10px] uppercase font-bold text-gray-400">ACTUAL</p>
      </div>
    </div>
  );
}

// ── Fila Vencimiento ─────────────────────────────────────────────────
function VencimientoRow({ alerta }) {
  const dias = alerta.diasRestantes;
  const vencido = dias < 0;
  const urgente = dias >= 0 && dias <= 7;
  const color = vencido ? "text-red-600" : urgente ? "text-orange-600" : "text-orange-500";
  const fechaStr = new Date(alerta.fechaVencimiento + "T00:00:00")
    .toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div>
        <p className="text-sm font-semibold text-black">{alerta.nombre}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {alerta.lote ? `Lote: ${alerta.lote}` : alerta.proveedor ? `Proveedor: ${alerta.proveedor}` : ""}
        </p>
      </div>
      <div className="text-right shrink-0 ml-4">
        <p className={`text-sm font-extrabold ${color}`}>{fechaStr}</p>
        <p className={`text-[10px] uppercase font-bold ${color}`}>
          {vencido ? "VENCIDO" : dias === 0 ? "HOY" : `${dias} DÍAS`}
        </p>
      </div>
    </div>
  );
}

// ── Página Principal ─────────────────────────────────────────────────
export default function AlertasPage() {
  const [ingredientes, setIngredientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Ambos endpoints privados requieren JWT (authHeaders los agrega automáticamente)
      const [ings, prods] = await Promise.all([
        apiFetch(`${API.inventario}/ingredientes/`),
        apiFetch(`${API.inventario}/productos/`),
      ]);
      setIngredientes(Array.isArray(ings) ? ings : []);
      setProductos(Array.isArray(prods) ? prods : []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const alertas = generarAlertas(ingredientes, productos);

  const stockProductos = alertas.filter(a => a.tipo === "stock_producto");
  const stockIngredientes = alertas.filter(a => a.tipo === "stock_ingrediente");
  const vencProd = alertas.filter(a => a.tipo === "vencimiento_producto");
  const vencIng = alertas.filter(a => a.tipo === "vencimiento_ingrediente");
  const totalAlertas = alertas.length;

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">Alertas del Sistema</h1>
          <p className="text-sm text-gray-500 mt-1">Monitorea problemas críticos de inventario que requieren atención.</p>
        </div>
        <div className="flex items-center gap-3">
          {!loading && totalAlertas > 0 && (
            <div className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-1.5 border border-red-100 text-xs font-bold text-red-700">
              <AlertTriangle className="size-4" />
              {totalAlertas} alerta{totalAlertas > 1 ? "s" : ""} activa{totalAlertas > 1 ? "s" : ""}
            </div>
          )}
          <button onClick={fetchData}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
            <RefreshCw className="size-3.5" /> Actualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="size-6 animate-spin" />
          <span className="text-sm">Calculando alertas...</span>
        </div>
      ) : totalAlertas === 0 ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-10 text-center">
          <Package className="mx-auto size-10 text-emerald-400 mb-3" />
          <p className="text-base font-bold text-emerald-700">Todo en orden</p>
          <p className="text-sm text-emerald-600 mt-1">No hay alertas activas en este momento.</p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <AlertCard
            title="Stock Bajo · Productos"
            subtitle="Productos con stock por debajo del mínimo"
            icon={TrendingDown} iconColor="text-red-600"
            bgColor="bg-red-50/40" borderColor="border-red-200"
            count={stockProductos.length}>
            {stockProductos.map(a => <StockRow key={a.id} alerta={a} />)}
          </AlertCard>

          <AlertCard
            title="Stock Bajo · Ingredientes"
            subtitle="Insumos con stock por debajo del mínimo"
            icon={TrendingDown} iconColor="text-red-600"
            bgColor="bg-red-50/40" borderColor="border-red-200"
            count={stockIngredientes.length}>
            {stockIngredientes.map(a => <StockRow key={a.id} alerta={a} />)}
          </AlertCard>

          <AlertCard
            title={`Productos por Vencer (${DIAS_ALERTA_VENCIMIENTO} días)`}
            subtitle="Lotes de productos próximos a vencer"
            icon={Clock} iconColor="text-orange-600"
            bgColor="bg-orange-50/30" borderColor="border-orange-200"
            count={vencProd.length}>
            {vencProd.map(a => <VencimientoRow key={a.id} alerta={a} />)}
          </AlertCard>

          <AlertCard
            title={`Ingredientes por Vencer (${DIAS_ALERTA_VENCIMIENTO} días)`}
            subtitle="Insumos con fecha de vencimiento próxima"
            icon={Clock} iconColor="text-orange-600"
            bgColor="bg-orange-50/30" borderColor="border-orange-200"
            count={vencIng.length}>
            {vencIng.map(a => <VencimientoRow key={a.id} alerta={a} />)}
          </AlertCard>
        </div>
      )}
    </div>
  );
}