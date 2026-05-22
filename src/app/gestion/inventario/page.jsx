"use client";

import { useState } from "react";
import {
  Boxes, AlertTriangle, TrendingDown, Coins,
  Search, Filter, Plus, X, Loader2, PackageSearch,
  ArrowDownCircle, SlidersHorizontal, History
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ── Mock data ────────────────────────────────────────────────────────
const MOCK_INVENTARIO = [
  { id: 1, nombre: "Carne de Pollo",     unidad_medida: "kg", stock_actual: 150, stock_minimo: 30,  proveedor: "Proveedor Cárnico SA", fecha_vencimiento: "2026-05-18" },
  { id: 2, nombre: "Vísceras de Pollo",  unidad_medida: "kg", stock_actual: 15,  stock_minimo: 20,  proveedor: "Proveedor Cárnico SA", fecha_vencimiento: "2026-05-17" },
  { id: 3, nombre: "Carne de Cerdo",     unidad_medida: "kg", stock_actual: 60,  stock_minimo: 25,  proveedor: "Frigorífico Central",  fecha_vencimiento: "2026-05-24" },
  { id: 4, nombre: "Carne de Cordero",   unidad_medida: "kg", stock_actual: 20,  stock_minimo: 25,  proveedor: "Frigorífico Central",  fecha_vencimiento: "2026-05-21" },
  { id: 5, nombre: "Huesos Carnosos",    unidad_medida: "kg", stock_actual: 200, stock_minimo: 50,  proveedor: "Proveedor Cárnico SA", fecha_vencimiento: "2026-05-28" },
  { id: 6, nombre: "Zanahoria",          unidad_medida: "kg", stock_actual: 45,  stock_minimo: 10,  proveedor: "Verdulería El Campo",  fecha_vencimiento: "2026-05-14" },
  { id: 7, nombre: "Espinaca",           unidad_medida: "kg", stock_actual: 30,  stock_minimo: 8,   proveedor: "Verdulería El Campo",  fecha_vencimiento: "2026-05-11" },
  { id: 8, nombre: "Aceite de Salmón",   unidad_medida: "ml", stock_actual: 0,   stock_minimo: 500, proveedor: "NutriPets S.A.",       fecha_vencimiento: "2026-08-10" },
];

const MOCK_HISTORIAL = {
  1: [
    { id: 10, tipo_movimiento: "ENTRADA", cantidad: 50, stock_anterior: 100, stock_posterior: 150, fecha: "2026-05-20T14:00:00Z", comentarios: "Reposición semanal" },
    { id: 9,  tipo_movimiento: "SALIDA",  cantidad: 30, stock_anterior: 130, stock_posterior: 100, fecha: "2026-05-19T10:00:00Z", comentarios: "Producción lote L260402" },
  ],
  2: [
    { id: 8,  tipo_movimiento: "ENTRADA", cantidad: 40, stock_anterior: 0,  stock_posterior: 40,  fecha: "2026-05-18T09:00:00Z", comentarios: "Compra inicial" },
    { id: 7,  tipo_movimiento: "SALIDA",  cantidad: 25, stock_anterior: 40, stock_posterior: 15,  fecha: "2026-05-19T11:00:00Z", comentarios: "Producción lote L260401" },
  ],
};

function getStatus(item) {
  if (item.stock_actual === 0) return "agotado";
  if (item.stock_actual < item.stock_minimo) return "bajo";
  return "suficiente";
}

// ── Modal Registrar Movimiento (Entrada / Ajuste) ────────────────────
function MovimientoModal({ open, onClose, ingrediente, tipo, onSave }) {
  const [cantidad, setCantidad]       = useState("");
  const [comentarios, setComentarios] = useState("");
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);

  if (!open || !ingrediente) return null;

  const esEntrada = tipo === "ENTRADA";
  const esAjuste  = tipo === "AJUSTE";

  const validate = () => {
    const e = {};
    if (!cantidad || Number(cantidad) < 1) e.cantidad = "Debe ser ≥ 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        id_ingrediente:  ingrediente.id,
        tipo_movimiento: tipo,
        cantidad:        Number(cantidad),
        comentarios:     comentarios.trim(),
      };
      // await fetch(`${API_BASE}/movimientos-ingrediente/`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload) });
      await new Promise(r => setTimeout(r, 500));
      const delta = esEntrada ? Number(cantidad) : (esAjuste ? Number(cantidad) - ingrediente.stock_actual : -Number(cantidad));
      onSave(ingrediente.id, ingrediente.stock_actual + (esAjuste ? 0 : delta), Number(cantidad), tipo, comentarios);
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 mx-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-extrabold text-black">
              {esEntrada ? "Registrar Entrada" : esAjuste ? "Ajuste Manual de Stock" : "Registrar Salida"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{ingrediente.nombre}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"><X className="size-4" /></button>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Stock actual</span>
            <span className="font-bold text-black">{ingrediente.stock_actual} {ingrediente.unidad_medida}</span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">
              {esAjuste ? "Nueva cantidad total" : "Cantidad a ingresar"} <span className="text-orange-500">*</span>
            </label>
            <input type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)} placeholder="0"
              className={`rounded-lg border px-3 py-2 text-sm text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 ${errors.cantidad ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`} />
            {errors.cantidad && <span className="text-[11px] text-red-500">{errors.cantidad}</span>}
            {cantidad && !esAjuste && (
              <p className="text-[11px] text-green-700 font-medium mt-0.5">
                Stock resultante: {ingrediente.stock_actual + Number(cantidad)} {ingrediente.unidad_medida}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Comentarios</label>
            <textarea value={comentarios} onChange={e => setComentarios(e.target.value)} rows={2}
              placeholder="Ej: Reposición proveedor, ajuste por conteo físico..."
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-black outline-none resize-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
          <button onClick={handleSubmit} disabled={loading}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold text-white transition disabled:opacity-60 ${esAjuste ? "bg-blue-500 hover:bg-blue-600" : "bg-orange-500 hover:bg-orange-600"}`}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            {esEntrada ? "Registrar Entrada" : esAjuste ? "Aplicar Ajuste" : "Registrar Salida"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Historial ──────────────────────────────────────────────────
function HistorialModal({ open, onClose, ingrediente }) {
  if (!open || !ingrediente) return null;
  const historial = MOCK_HISTORIAL[ingrediente.id] || [];
  const colores = { ENTRADA: "text-green-700 bg-green-50 border-green-100", SALIDA: "text-red-600 bg-red-50 border-red-100", AJUSTE: "text-blue-600 bg-blue-50 border-blue-100" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 mx-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-extrabold text-black">Historial de Movimientos</h2>
            <p className="text-xs text-gray-400 mt-0.5">{ingrediente.nombre}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"><X className="size-4" /></button>
        </div>
        {historial.length === 0 ? (
          <p className="text-sm text-center text-gray-400 py-8">Sin movimientos registrados</p>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {historial.map(m => (
              <div key={m.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3.5 flex items-start justify-between">
                <div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border uppercase ${colores[m.tipo_movimiento]}`}>{m.tipo_movimiento}</span>
                  <p className="text-xs text-gray-500 mt-1">{m.comentarios || "Sin comentarios"}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{new Date(m.fecha).toLocaleString("es-CO")}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-bold text-black">{m.tipo_movimiento === "SALIDA" ? "-" : "+"}{m.cantidad} {ingrediente.unidad_medida}</p>
                  <p className="text-[11px] text-gray-400">{m.stock_anterior} → {m.stock_posterior}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

// ── Página Principal ─────────────────────────────────────────────────
export default function InventarioPage() {
  const [inventario, setInventario]     = useState(MOCK_INVENTARIO);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [movModal, setMovModal]         = useState({ open: false, item: null, tipo: "ENTRADA" });
  const [histModal, setHistModal]       = useState({ open: false, item: null });

  const stockBajo    = inventario.filter(i => getStatus(i) === "bajo").length;
  const agotados     = inventario.filter(i => getStatus(i) === "agotado").length;
  const totalKg      = inventario.reduce((s, i) => s + (i.unidad_medida === "kg" ? i.stock_actual : 0), 0);

  const filtered = inventario
    .filter(i => i.nombre.toLowerCase().includes(search.toLowerCase()))
    .filter(i => filterStatus === "todos" || getStatus(i) === filterStatus);

  const handleMovSave = (id, nuevoStock, cantidad, tipo, comentarios) => {
    setInventario(prev => prev.map(i => i.id === id ? { ...i, stock_actual: tipo === "AJUSTE" ? cantidad : i.stock_actual + (tipo === "ENTRADA" ? cantidad : -cantidad) } : i));
    setMovModal({ open: false, item: null, tipo: "ENTRADA" });
  };

  const metrics = [
    { label: "Total Ingredientes", value: inventario.length, icon: Boxes,        color: "text-green-700 bg-green-50 border-green-100" },
    { label: "Stock Bajo",         value: stockBajo,         icon: AlertTriangle, color: "text-orange-600 bg-orange-50 border-orange-100" },
    { label: "Agotados",           value: agotados,          icon: TrendingDown,  color: "text-red-600 bg-red-50 border-red-100" },
    { label: "Total en kg",        value: `${totalKg} kg`,   icon: Coins,         color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
  ];

  const statusBadge = (item) => {
    const s = getStatus(item);
    if (s === "agotado") return <span className="inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700 border border-red-100">Agotado</span>;
    if (s === "bajo")    return <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-100 animate-pulse">Stock Bajo</span>;
    return <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">Suficiente</span>;
  };

  const stockPct = (item) => Math.min(100, Math.round((item.stock_actual / Math.max(item.stock_minimo * 2, 1)) * 100));

  return (
    <div className="space-y-6 animate-fade-in text-black">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">Inventario de Ingredientes</h1>
          <p className="text-sm text-gray-500 mt-1">Visualiza y gestiona los niveles de stock de materias primas.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMovModal({ open: true, item: null, tipo: "ENTRADA" })}
            disabled
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Selecciona un ingrediente en la tabla">
            <Plus className="size-4" /> Registrar Entrada
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(m => (
          <div key={m.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{m.label}</span>
              <div className={`flex size-9 items-center justify-center rounded-xl border ${m.color}`}>
                <m.icon className="size-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-black mt-3">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar ingrediente..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-black placeholder-gray-400 focus:border-green-600 focus:outline-none transition" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-gray-400" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none">
            <option value="todos">Todos</option>
            <option value="suficiente">Suficiente</option>
            <option value="bajo">Stock Bajo</option>
            <option value="agotado">Agotado</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="py-3.5 px-4">Ingrediente</th>
                <th className="py-3.5 px-4 text-right">Stock Actual</th>
                <th className="py-3.5 px-4 text-right">Mínimo</th>
                <th className="py-3.5 px-4">Nivel</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center">
                  <PackageSearch className="mx-auto size-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">Sin resultados</p>
                </td></tr>
              ) : filtered.map(item => {
                const pct = stockPct(item);
                const barColor = getStatus(item) === "agotado" ? "bg-red-500" : getStatus(item) === "bajo" ? "bg-orange-500" : "bg-emerald-500";
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="text-sm font-semibold text-black">{item.nombre}</p>
                      <p className="text-xs text-gray-400">{item.proveedor}</p>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`text-sm font-bold ${getStatus(item) !== "suficiente" ? "text-red-600" : "text-black"}`}>
                        {item.stock_actual} {item.unidad_medida}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-gray-400 font-semibold">
                      {item.stock_minimo} {item.unidad_medida}
                    </td>
                    <td className="py-3.5 px-4 min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-full bg-gray-100 h-2">
                          <div className={`h-2 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 w-8">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">{statusBadge(item)}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setMovModal({ open: true, item, tipo: "ENTRADA" })}
                          className="flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-green-200 hover:bg-green-50 hover:text-green-700 transition"
                          title="Registrar entrada">
                          <ArrowDownCircle className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setMovModal({ open: true, item, tipo: "AJUSTE" })}
                          className="flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition"
                          title="Ajuste manual">
                          <SlidersHorizontal className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setHistModal({ open: true, item })}
                          className="flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-700 transition"
                          title="Ver historial">
                          <History className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-400">
            Mostrando {filtered.length} de {inventario.length} ingredientes
          </div>
        )}
      </div>

      <MovimientoModal
        open={movModal.open}
        tipo={movModal.tipo}
        ingrediente={movModal.item}
        onClose={() => setMovModal({ open: false, item: null, tipo: "ENTRADA" })}
        onSave={handleMovSave}
      />
      <HistorialModal
        open={histModal.open}
        ingrediente={histModal.item}
        onClose={() => setHistModal({ open: false, item: null })}
      />
    </div>
  );
}