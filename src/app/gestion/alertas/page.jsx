"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle, Clock, TrendingDown, Package,
  ChevronDown, ChevronUp, RefreshCw, Loader2, Info, DollarSign
} from "lucide-react";
import Link from "next/link";
import { inventarioService } from "@/services/inventario";
import { produccionesService } from "@/services/producciones.service";
import { creditosService } from "@/services/creditos.service";

const DIAS_ALERTA_VENCIMIENTO = 30;
const DIAS_ALERTA_DEUDA       = 7;

function diasRestantes(fechaStr) {
  if (!fechaStr) return null;
  return Math.ceil((new Date(fechaStr) - new Date()) / 86400000);
}

function formatPrice(val) {
  return Number(val).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

function formatFecha(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function generarAlertas(ingredientes, productos, producciones, cuotas) {
  const alertas = [];

  // ── Stock bajo ───────────────────────────────────────────────────
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

  productos.forEach(p => {
    if (Number(p.stock_actual) < Number(p.stock_minimo)) {
      alertas.push({
        id: `sp-${p.id}`, tipo: "stock_producto",
        nombre: p.nombre, stockActual: Number(p.stock_actual),
        stockMinimo: Number(p.stock_minimo), unidad: "uds",
      });
    }
  });

  // ── Vencimiento: lotes de producción ─────────────────────────────
  const productosMap = Object.fromEntries(productos.map(p => [p.id, p]));
  producciones.forEach(prod => {
    const dias = diasRestantes(prod.fecha_vencimiento);
    if (dias === null || dias > DIAS_ALERTA_VENCIMIENTO) return;
    const producto = productosMap[prod.id_producto];
    alertas.push({
      id: `vp-${prod.id}`, tipo: "vencimiento_produccion",
      nombre: producto?.nombre ?? `Producto #${prod.id_producto}`,
      produccionId: prod.id,
      cantidadProducida: prod.cantidad_producida,
      fechaVencimiento: prod.fecha_vencimiento,
      diasRestantes: dias,
    });
  });

  // ── Deudas: cuotas vencidas ───────────────────────────────────────
  cuotas.forEach(q => {
    if (q.estado === "pagada") return;
    const dias = diasRestantes(q.fecha_vencimiento);
    if (dias === null) return;
    if (dias < 0) {
      alertas.push({
        id: `dv-${q.id}`, tipo: "deuda_vencida",
        cuotaId: q.id, creditoId: q.credito_id,
        numeroCuota: q.numero_cuota,
        valor: parseFloat(q.valor_cuota_final ?? 0),
        valorPagado: parseFloat(q.valor_pagado ?? 0),
        fechaVencimiento: q.fecha_vencimiento,
        diasRestantes: dias,
      });
    }
  });

  // ── Deudas: cuotas próximas a vencer ─────────────────────────────
  cuotas.forEach(q => {
    if (q.estado === "pagada") return;
    const dias = diasRestantes(q.fecha_vencimiento);
    if (dias === null) return;
    if (dias >= 0 && dias <= DIAS_ALERTA_DEUDA) {
      alertas.push({
        id: `dp-${q.id}`, tipo: "deuda_proxima",
        cuotaId: q.id, creditoId: q.credito_id,
        numeroCuota: q.numero_cuota,
        valor: parseFloat(q.valor_cuota_final ?? 0),
        valorPagado: parseFloat(q.valor_pagado ?? 0),
        fechaVencimiento: q.fecha_vencimiento,
        diasRestantes: dias,
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
            : <div className="divide-y divide-gray-100">{children}</div>}
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
            <div className={`h-1.5 rounded-full ${agotado ? "bg-red-500" : "bg-orange-500"}`}
              style={{ width: `${pct}%` }} />
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

// ── Fila Vencimiento Lote ────────────────────────────────────────────
function VencimientoRow({ alerta }) {
  const dias = alerta.diasRestantes;
  const vencido = dias < 0;
  const urgente = dias >= 0 && dias <= 7;
  const color = vencido ? "text-red-600" : urgente ? "text-orange-600" : "text-orange-500";
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div>
        <p className="text-sm font-semibold text-black">{alerta.nombre}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Lote #{alerta.produccionId} · {alerta.cantidadProducida} uds producidas
        </p>
      </div>
      <div className="text-right shrink-0 ml-4">
        <p className={`text-sm font-extrabold ${color}`}>{formatFecha(alerta.fechaVencimiento)}</p>
        <p className={`text-[10px] uppercase font-bold ${color}`}>
          {vencido ? "VENCIDO" : dias === 0 ? "HOY" : `${dias} DÍAS`}
        </p>
      </div>
    </div>
  );
}

// ── Fila Deuda ───────────────────────────────────────────────────────
function DeudaRow({ alerta }) {
  const dias = alerta.diasRestantes;
  const vencida = dias < 0;
  const color = vencida ? "text-red-600" : "text-orange-600";
  const saldo = alerta.valor - alerta.valorPagado;
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div>
        <p className="text-sm font-semibold text-black">
          Crédito #{alerta.creditoId} · Cuota {alerta.numeroCuota}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">Saldo pendiente: {formatPrice(saldo)}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <div className="text-right">
          <p className={`text-sm font-extrabold ${color}`}>{formatFecha(alerta.fechaVencimiento)}</p>
          <p className={`text-[10px] uppercase font-bold ${color}`}>
            {vencida ? `Hace ${Math.abs(dias)} días` : dias === 0 ? "HOY" : `${dias} DÍAS`}
          </p>
        </div>
        <Link href={`/gestion/creditos/${alerta.creditoId}`}
          className="text-[10px] font-bold text-green-600 hover:text-green-700 transition-colors whitespace-nowrap">
          Ver →
        </Link>
      </div>
    </div>
  );
}

// ── Página Principal ─────────────────────────────────────────────────
export default function AlertasPage() {
  const [ingredientes, setIngredientes]   = useState([]);
  const [productos, setProductos]         = useState([]);
  const [producciones, setProducciones]   = useState([]);
  const [cuotas, setCuotas]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [ings, prods, prodcs, cuots] = await Promise.all([
        inventarioService.getIngredientes(),
        inventarioService.getProductos(),
        produccionesService.getProducciones(),
        creditosService.listCuotas().catch(() => []),
      ]);
      setIngredientes(Array.isArray(ings)   ? ings   : []);
      setProductos(Array.isArray(prods)     ? prods   : []);
      setProducciones(Array.isArray(prodcs) ? prodcs  : []);
      const cuotList = Array.isArray(cuots) ? cuots : (cuots?.results ?? []);
      setCuotas(cuotList);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const alertas           = generarAlertas(ingredientes, productos, producciones, cuotas);
  const stockProductos    = alertas.filter(a => a.tipo === "stock_producto");
  const stockIngredientes = alertas.filter(a => a.tipo === "stock_ingrediente");
  const vencLotes         = alertas.filter(a => a.tipo === "vencimiento_produccion");
  const deudasVencidas    = alertas.filter(a => a.tipo === "deuda_vencida");
  const deudasProximas    = alertas.filter(a => a.tipo === "deuda_proxima");
  const totalAlertas      = alertas.length;

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">Alertas del Sistema</h1>
          <p className="text-sm text-gray-500 mt-1">Monitorea problemas críticos que requieren atención.</p>
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

      {/* Nota */}
      <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3">
        <Info className="size-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 font-medium leading-relaxed">
          Vencimientos = lotes de producción dentro de {DIAS_ALERTA_VENCIMIENTO} días. 
          Deudas = cuotas de clientes vencidas o que vencen en {DIAS_ALERTA_DEUDA} días.
          La campana notifica automáticamente 7 días antes.
        </p>
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
          <AlertCard title="Stock Bajo · Productos" subtitle="Productos con stock por debajo del mínimo"
            icon={TrendingDown} iconColor="text-red-600" bgColor="bg-red-50/40" borderColor="border-red-200"
            count={stockProductos.length}>
            {stockProductos.map(a => <StockRow key={a.id} alerta={a} />)}
          </AlertCard>

          <AlertCard title="Stock Bajo · Ingredientes" subtitle="Insumos con stock por debajo del mínimo"
            icon={TrendingDown} iconColor="text-red-600" bgColor="bg-red-50/40" borderColor="border-red-200"
            count={stockIngredientes.length}>
            {stockIngredientes.map(a => <StockRow key={a.id} alerta={a} />)}
          </AlertCard>

          <AlertCard title={`Lotes por Vencer (${DIAS_ALERTA_VENCIMIENTO} días)`}
            subtitle="Lotes de producción próximos a su fecha de vencimiento"
            icon={Clock} iconColor="text-orange-600" bgColor="bg-orange-50/30" borderColor="border-orange-200"
            count={vencLotes.length}>
            {vencLotes.map(a => <VencimientoRow key={a.id} alerta={a} />)}
          </AlertCard>

          <AlertCard title="Deudas Vencidas" subtitle="Cuotas de clientes que ya pasaron su fecha de pago"
            icon={DollarSign} iconColor="text-red-600" bgColor="bg-red-50/40" borderColor="border-red-200"
            count={deudasVencidas.length}>
            {deudasVencidas.map(a => <DeudaRow key={a.id} alerta={a} />)}
          </AlertCard>

          <AlertCard title={`Deudas por Vencer (${DIAS_ALERTA_DEUDA} días)`}
            subtitle="Cuotas de clientes próximas a su fecha límite de pago"
            icon={DollarSign} iconColor="text-orange-600" bgColor="bg-orange-50/30" borderColor="border-orange-200"
            count={deudasProximas.length}>
            {deudasProximas.map(a => <DeudaRow key={a.id} alerta={a} />)}
          </AlertCard>
        </div>
      )}
    </div>
  );
}