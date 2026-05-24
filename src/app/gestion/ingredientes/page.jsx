"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, Pencil, Trash2, AlertTriangle, X, Loader2, PackageSearch, RefreshCw
} from "lucide-react";
import { API, apiFetch } from "@/lib/api";

const UNIDADES = [
  { value: "kg", label: "Kilogramos (kg)" },
  { value: "g", label: "Gramos (g)" },
  { value: "l", label: "Litros (l)" },
  { value: "ml", label: "Mililitros (ml)" },
];

const EMPTY_FORM = {
  nombre: "", unidad_medida: "kg",
  stock_actual: "0", stock_minimo: "0", proveedor: "",
};

// ── Modal Crear / Editar ─────────────────────────────────────────────
function IngredienteModal({ open, onClose, ingrediente, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(ingrediente ? { ...ingrediente } : EMPTY_FORM);
      setErrors({});
      setApiError("");
    }
  }, [open, ingrediente]);

  if (!open) return null;

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.proveedor.trim()) e.proveedor = "Requerido";
    if (Number(form.stock_actual) < 0) e.stock_actual = "Debe ser ≥ 0";
    if (Number(form.stock_minimo) < 0) e.stock_minimo = "Debe ser ≥ 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const payload = {
        nombre: form.nombre.trim(),
        proveedor: form.proveedor.trim(),
        unidad_medida: form.unidad_medida,
        stock_actual: form.stock_actual,
        stock_minimo: form.stock_minimo,
      };
      const url = ingrediente
        ? `${API.inventario}/ingredientes/${ingrediente.id}/`
        : `${API.inventario}/ingredientes/`;
      const method = ingrediente ? "PUT" : "POST";
      const data = await apiFetch(url, { method, body: JSON.stringify(payload) });
      onSave(data, !!ingrediente);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 mx-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-extrabold text-black">
              {ingrediente ? "Editar Ingrediente" : "Agregar Nuevo Ingrediente"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Completa todos los campos obligatorios</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
            <X className="size-4" />
          </button>
        </div>

        {apiError && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-700 font-medium">{apiError}</div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Nombre del Ingrediente <span className="text-orange-500">*</span></label>
            <input value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Ej: Carne de Pollo"
              className={`rounded-lg border px-3 py-2 text-sm text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 ${errors.nombre ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`} />
            {errors.nombre && <span className="text-[11px] text-red-500">{errors.nombre}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Unidad de Medida <span className="text-orange-500">*</span></label>
            <select value={form.unidad_medida} onChange={e => set("unidad_medida", e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-black outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100">
              {UNIDADES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Stock Inicial</label>
            <input type="number" min="0" step="0.01" value={form.stock_actual} onChange={e => set("stock_actual", e.target.value)}
              className={`rounded-lg border px-3 py-2 text-sm text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 ${errors.stock_actual ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`} />
            {errors.stock_actual && <span className="text-[11px] text-red-500">{errors.stock_actual}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Stock Mínimo</label>
            <input type="number" min="0" step="0.01" value={form.stock_minimo} onChange={e => set("stock_minimo", e.target.value)}
              className={`rounded-lg border px-3 py-2 text-sm text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 ${errors.stock_minimo ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`} />
            {errors.stock_minimo && <span className="text-[11px] text-red-500">{errors.stock_minimo}</span>}
          </div>

          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">Proveedor <span className="text-orange-500">*</span></label>
            <input value={form.proveedor} onChange={e => set("proveedor", e.target.value)} placeholder="Nombre del proveedor"
              className={`rounded-lg border px-3 py-2 text-sm text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 ${errors.proveedor ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`} />
            {errors.proveedor && <span className="text-[11px] text-red-500">{errors.proveedor}</span>}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
          <button onClick={handleSubmit} disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-600 transition disabled:opacity-60">
            {loading && <Loader2 className="size-4 animate-spin" />}
            {ingrediente ? "Guardar Cambios" : "Agregar Ingrediente"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Confirmar Eliminación ──────────────────────────────────────
function DeleteModal({ open, onClose, ingrediente, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  if (!open || !ingrediente) return null;

  const handleDelete = async () => {
    setLoading(true);
    setApiError("");
    try {
      await apiFetch(`${API.inventario}/ingredientes/${ingrediente.id}/`, { method: "DELETE" });
      onConfirm(ingrediente.id);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="size-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-black">Eliminar Ingrediente</h2>
            <p className="text-xs text-gray-400">Esta acción no se puede deshacer</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          ¿Estás seguro de que deseas eliminar <strong className="text-black">{ingrediente.nombre}</strong>?
        </p>
        {apiError && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">{apiError}</div>
        )}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
          <button onClick={handleDelete} disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 transition disabled:opacity-60">
            {loading && <Loader2 className="size-4 animate-spin" />}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página Principal ─────────────────────────────────────────────────
export default function IngredientesPage() {
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const fetchIngredientes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(`${API.inventario}/ingredientes/`);
      setIngredientes(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los ingredientes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchIngredientes(); }, [fetchIngredientes]);

  const stockBajo = ingredientes.filter(i => Number(i.stock_actual) < Number(i.stock_minimo));

  const filtered = ingredientes.filter(i =>
    i.nombre.toLowerCase().includes(search.toLowerCase()) ||
    i.proveedor?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data, isEdit) => {
    setIngredientes(prev => isEdit ? prev.map(i => i.id === data.id ? data : i) : [...prev, data]);
    setModalOpen(false);
    setEditItem(null);
  };

  const handleDelete = (id) => {
    setIngredientes(prev => prev.filter(i => i.id !== id));
    setDeleteItem(null);
  };

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">Gestión de Ingredientes</h1>
          <p className="text-sm text-gray-500 mt-1">Administra ingredientes para la producción de alimentos.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchIngredientes}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
            <RefreshCw className="size-3.5" /> Actualizar
          </button>
          <button onClick={() => { setEditItem(null); setModalOpen(true); }}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition">
            <Plus className="size-4" /> Agregar Ingrediente
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">{error}</div>
      )}

      {!loading && stockBajo.length > 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="size-4 text-orange-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-orange-700">{stockBajo.length} ingrediente(s) con stock bajo</p>
            <p className="text-xs text-orange-600 mt-0.5">{stockBajo.map(i => i.nombre).join(", ")}</p>
          </div>
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o proveedor..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-black placeholder-gray-400 focus:border-green-600 focus:outline-none transition" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-sm">Cargando ingredientes...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4">Ingrediente</th>
                  <th className="py-3.5 px-4">Unidad</th>
                  <th className="py-3.5 px-4 text-right">Stock Actual</th>
                  <th className="py-3.5 px-4 text-right">Stock Mínimo</th>
                  <th className="py-3.5 px-4">Proveedor</th>
                  <th className="py-3.5 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center">
                    <PackageSearch className="mx-auto size-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">{search ? "No se encontraron resultados" : "No hay ingredientes registrados"}</p>
                  </td></tr>
                ) : filtered.map(item => {
                  const isLow = Number(item.stock_actual) < Number(item.stock_minimo);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4 text-sm font-semibold text-black">{item.nombre}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center rounded-lg bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-700 border border-green-100">{item.unidad_medida}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`text-sm font-bold ${isLow ? "text-red-600" : "text-black"}`}>{item.stock_actual}</span>
                        {isLow && <span className="ml-1.5 inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-100">Bajo</span>}
                      </td>
                      <td className="py-3.5 px-4 text-right text-sm text-gray-500 font-medium">{item.stock_minimo}</td>
                      <td className="py-3.5 px-4 text-sm text-gray-600">{item.proveedor}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setEditItem(item); setModalOpen(true); }}
                            className="flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-green-200 hover:bg-green-50 hover:text-green-700 transition">
                            <Pencil className="size-3.5" />
                          </button>
                          <button onClick={() => setDeleteItem(item)}
                            className="flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition">
                            <Trash2 className="size-3.5" />
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
            Mostrando {filtered.length} de {ingredientes.length} ingredientes
          </div>
        )}
      </div>

      <IngredienteModal open={modalOpen} onClose={() => { setModalOpen(false); setEditItem(null); }} ingrediente={editItem} onSave={handleSave} />
      <DeleteModal open={!!deleteItem} onClose={() => setDeleteItem(null)} ingrediente={deleteItem} onConfirm={handleDelete} />
    </div>
  );
}