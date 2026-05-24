"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Boxes, AlertTriangle, TrendingDown, Search, Filter,
  X, Loader2, PackageSearch, ArrowDownCircle, History, RefreshCw
} from "lucide-react";
import { API, apiFetch } from "@/lib/api";

function getStatus(item) {
  const actual = Number(item.stock_actual);
  const minimo = Number(item.stock_minimo);
  if (actual === 0) return "agotado";
  if (actual < minimo) return "bajo";
  return "suficiente";
}

// ── Modal Registrar Entrada ──────────────────────────────────────────
// Nota: El ENDPOINTS.md advierte que la creación directa de movimientos
// puede fallar porque stock_anterior/stock_posterior son calculados por
// el backend solo en producciones. Se usa SOLO para entradas manuales
// de proveedor y el stock se refresca del servidor tras el POST.
function EntradaModal({ open, onClose, ingrediente, onSave }) {
  const [cantidad, setCantidad] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (open) { setCantidad(""); setComentarios(""); setErrors({}); setApiError(""); }
  }, [open]);

  if (!open || !ingrediente) return null;

  const validate = () => {
    const e = {};
    if (!cantidad || Number(cantidad) < 1) e.cantidad = "Debe ser ≥ 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const data = await apiFetch(`${API.inventario}/movimientos-ingrediente/`, {
        method: "POST",
        body: JSON.stringify({
          id_ingrediente: ingrediente.id,
          tipo_movimiento: "ENTRADA",
          cantidad: String(cantidad),
          comentarios: comentarios.trim(),
        }),
      });
      // Usamos stock_posterior que devuelve el backend
      onSave(ingrediente.id, data.stock_posterior);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 mx-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-extrabold text-black">Registrar Entrada de Stock</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{ingrediente.nombre}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"><X className="size-4" /></button>
        </div>

        {apiError && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-700 font-medium">{apiError}</div>
        )}

        <div className="space-y-4">
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Stock actual</span>
            <span className="font-bold text-black">{item.stock_actual} {ingrediente.unidad_medida}</span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Cantidad a ingresar <span className="text-orange-500">*</span></label>
            <input type="number" min="1" step="0.01" value={cantidad} onChange={e => setCantidad(e.target.value)} placeholder="0"
              className={`rounded-lg border px-3 py-2 text-sm text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 ${errors.cantidad ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`} />
            {errors.cantidad && <span className="text-[11px] text-red-500">{errors.cantidad}</span>}
            {cantidad && (
              <p className="text-[11px] text-green-700 font-medium mt-0.5">
                Stock resultante: {Number(ingrediente.stock_actual) + Number(cantidad)} {ingrediente.unidad_medida}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Comentarios</label>
            <textarea value={comentarios} onChange={e => setComentarios(e.target.value)} rows={2}
              placeholder="Ej: Reposición proveedor, compra semanal..."
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-black outline-none resize-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
          <button onClick={handleSubmit} disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-600 transition disabled:opacity-60">
            {loading && <Loader2 className="size-4 animate-spin" />}
            Registrar Entrada
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Historial ──────────────────────────────────────────────────
function HistorialModal({ open, onClose, ingrediente }) {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !ingrediente) return;
    setLoading(true);
    apiFetch(`${API.inventario}/movimientos-ingrediente/`)
      .then(data => setMovimientos(
        (Array.isArray(data) ? data : []).filter(m => m.id_ingrediente === ingrediente.id)
      ))
      .catch(() => setMovimientos([]))
      .finally(() => setLoading(false));
  }, [open, ingrediente]);

  if (!open || !ingrediente) return null;

  const colores = {
    ENTRADA: "text-green-700 bg-green-50 border-green-100",
    SALIDA: "text-red-600 bg-red-50 border-red-100",
    AJUSTE: "text-blue-600 bg-blue-50 border-blue-100",
  };

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

        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
            <Loader2 className="size-4 animate-spin" /><span className="text-sm">Cargando...</span>
          </div>
        ) : movimientos.length === 0 ? (
          <p className="text-sm text-center text-gray-400 py-8">Sin movimientos registrados</p>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {movimientos.map(m => (
              <div key={m.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3.5 flex items-start justify-between">
                <div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border uppercase ${colores[m.tipo_movimiento]}`}>
                    {m.tipo_movimiento}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{m.comentarios || "Sin comentarios"}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{new Date(m.fecha).toLocaleString("es-CO")}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-bold text-black">
                    {m.tipo_movimiento === "SALIDA" ? "-" : "+"}{m.cantidad} {ingrediente.unidad_medida}
                  </p>
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
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [entradaModal, setEntradaModal] = useState({ open: false, item: null });
  const [histModal, setHistModal] = useState({ open: false, item: null });

  const fetchInventario = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(`${API.inventario}/ingredientes/`);
      setInventario(data);
    } catch (err) {
      setError(err.message || "No se pudo cargar el inventario.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInventario(); }, [fetchInventario]);

  const stockBajo = inventario.filter(i => getStatus(i) === "bajo").length;
  const agotados = inventario.filter(i => getStatus(i) === "agotado").length;
  const totalKg = inventario
    .filter(i => i.unidad_medida === "kg")
    .reduce((s, i) => s + Number(i.stock_actual), 0);

  const filtered = inventario
    .filter(i => i.nombre.toLowerCase().includes(search.toLowerCase()))
    .filter(i => filterStatus === "todos" || getStatus(i) === filterStatus);

  const handleEntradaSave = (id, nuevoStock) => {
    setInventario(prev => prev.map(i => i.id === id ? { ...i, stock_actual: nuevoStock } : i));
    setEntradaModal({ open: false, item: null });
  };

  const stockPct = (item) =>
    Math.min(100, Math.round((Number(item.stock_actual) / Math.max(Number(item.stock_minimo) * 2, 1)) * 100));

  const statusBadge = (item) => {
    const s = getStatus(item);
    if (s === "agotado") return <span className="inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700 border border-red-100">Agotado</span>;
    if (s === "bajo") return <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-100">Stock Bajo</span>;
    return <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">Suficiente</span>;
  };

  return (
    <div className="space-y-6 text-black">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">Inventario de Ingredientes</h1>
          <p className="text-sm text-gray-500 mt-1">Visualiza y gestiona los niveles de stock de materias primas.</p>
        </div>
        <button onClick={fetchInventario}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
          <RefreshCw className="size-3.5" /> Actualizar
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">{error}</div>
      )}

      {/* Métricas */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Ingredientes", value: inventario.length, icon: Boxes, color: "text-green-700 bg-green-50 border-green-100" },
          { label: "Stock Bajo", value: stockBajo, icon: AlertTriangle, color: "text-orange-600 bg-orange-50 border-orange-100" },
          { label: "Agotados", value: agotados, icon: TrendingDown, color: "text-red-600 bg-red-50 border-red-100" },
        ].map(m => (
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
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-sm">Cargando inventario...</span>
          </div>
        ) : (
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
                            <div className={`h-2 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 w-8">{pct}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">{statusBadge(item)}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setEntradaModal({ open: true, item })}
                            className="flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-green-200 hover:bg-green-50 hover:text-green-700 transition" title="Registrar entrada">
                            <ArrowDownCircle className="size-3.5" />
                          </button>
                          <button onClick={() => setHistModal({ open: true, item })}
                            className="flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-700 transition" title="Ver historial">
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
        )}
        {!loading && filtered.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-400">
            Mostrando {filtered.length} de {inventario.length} ingredientes
          </div>
        )}
      </div>

      <EntradaModal
        open={entradaModal.open}
        ingrediente={entradaModal.item}
        onClose={() => setEntradaModal({ open: false, item: null })}
        onSave={handleEntradaSave}
      />
      <HistorialModal
        open={histModal.open}
        ingrediente={histModal.item}
        onClose={() => setHistModal({ open: false, item: null })}
      />
    </div>
  );
}