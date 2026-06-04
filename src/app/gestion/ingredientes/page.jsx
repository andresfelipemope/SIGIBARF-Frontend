"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Package,
  Search,
  Filter,
  Plus,
  Loader2,
  X,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Pencil,
  Trash2,
  Scale,
  TriangleAlert
} from "lucide-react";
import { inventarioService } from "@/services/inventario";

const UNIDADES = ["kg", "g", "l", "ml"];

const UNIDAD_LABELS = { kg: "kg", g: "g", l: "l", ml: "ml" };

const EMPTY_FORM = {
  nombre: "",
  proveedor: "",
  stock_actual: "",
  stock_minimo: "",
  unidad_medida: "kg",
};

function IngredienteModal({ open, onClose, onSaved, editData = null }) {
  const [formData, setFormData]       = useState(EMPTY_FORM);
  const [loading, setLoading]         = useState(false);
  const [formError, setFormError]     = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData(editData ? {
        nombre:       editData.nombre       ?? "",
        proveedor:    editData.proveedor    ?? "",
        stock_actual: editData.stock_actual ?? "",
        stock_minimo: editData.stock_minimo ?? "",
        unidad_medida: editData.unidad_medida ?? "kg",
      } : EMPTY_FORM);
      setFormError(null);
      setFieldErrors({});
    }
  }, [open, editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    // Validaciones frontend
    const errors = {};
    if (!formData.nombre.trim())    errors.nombre    = "El nombre es obligatorio";
    if (!formData.proveedor.trim()) errors.proveedor = "El proveedor es obligatorio";
    if (!formData.stock_actual || Number(formData.stock_actual) <= 0)
      errors.stock_actual = "Debe ser mayor a 0";
    if (!formData.stock_minimo || Number(formData.stock_minimo) <= 0)
      errors.stock_minimo = "Debe ser mayor a 0";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // El backend espera decimal string con 2 decimales
    const payload = {
      nombre:        formData.nombre.trim(),
      proveedor:     formData.proveedor.trim(),
      stock_actual:  parseFloat(formData.stock_actual).toFixed(2),
      stock_minimo:  parseFloat(formData.stock_minimo).toFixed(2),
      unidad_medida: formData.unidad_medida,
    };

    try {
      setLoading(true);
      if (editData?.id) {
        await inventarioService.updateIngrediente(editData.id, payload);
      } else {
        await inventarioService.createIngrediente(payload);
      }
      onSaved();
    } catch (err) {
      if (err.data && typeof err.data === "object") {
        setFieldErrors(err.data);
      } else {
        setFormError(err.message || "Error al guardar el ingrediente");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const inputClass = (name) =>
    `w-full rounded-xl border ${
      fieldErrors[name] ? "border-red-400" : "border-gray-200"
    } bg-gray-50/50 px-4 py-2.5 text-sm text-black focus:bg-white focus:border-orange-500 focus:outline-none transition-all`;

  const fieldErr = (name) =>
    fieldErrors[name] ? (
      <p className="text-red-500 text-xs mt-1 font-medium">
        {Array.isArray(fieldErrors[name]) ? fieldErrors[name][0] : fieldErrors[name]}
      </p>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-black">
            {editData ? "Editar Ingrediente" : "Registrar Ingrediente"}
          </h2>
          <button onClick={onClose} disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {formError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-2">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input name="nombre" value={formData.nombre} onChange={handleChange}
              placeholder="Ej. Hígado de Pollo" disabled={loading}
              className={inputClass("nombre")} />
            {fieldErr("nombre")}
          </div>

          {/* Proveedor */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Proveedor <span className="text-red-500">*</span>
            </label>
            <input name="proveedor" value={formData.proveedor} onChange={handleChange}
              placeholder="Ej. Frigorífico Central" disabled={loading}
              className={inputClass("proveedor")} />
            {fieldErr("proveedor")}
          </div>

          {/* Stock actual + mínimo + unidad */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Stock Actual <span className="text-red-500">*</span>
              </label>
              <input type="number" step="0.01" min="0.01"
                name="stock_actual" value={formData.stock_actual}
                onChange={handleChange} placeholder="0.00" disabled={loading}
                className={inputClass("stock_actual")} />
              {fieldErr("stock_actual")}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Stock Mínimo <span className="text-red-500">*</span>
              </label>
              <input type="number" step="0.01" min="0.01"
                name="stock_minimo" value={formData.stock_minimo}
                onChange={handleChange} placeholder="0.00" disabled={loading}
                className={inputClass("stock_minimo")} />
              {fieldErr("stock_minimo")}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Unidad</label>
              <select name="unidad_medida" value={formData.unidad_medida}
                onChange={handleChange} disabled={loading}
                className={inputClass("unidad_medida")}>
                {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={loading}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-orange-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
              {loading
                ? <><Loader2 className="size-4 animate-spin" /> Guardando...</>
                : "Guardar Ingrediente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Página Principal ─────────────────────────────────────────────────
export default function IngredientesPage() {
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [searchTerm, setSearchTerm]     = useState("");
  const [unitFilter, setUnitFilter]     = useState("todas");

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData]   = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchIngredientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventarioService.getIngredientes();
      setIngredientes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar los ingredientes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchIngredientes(); }, [fetchIngredientes]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSaved = () => {
    setModalOpen(false);
    setEditData(null);
    fetchIngredientes();
    showSuccess(editData ? "Ingrediente actualizado correctamente" : "Ingrediente registrado correctamente");
  };

  const handleEdit = (ing) => { setEditData(ing); setModalOpen(true); };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      await inventarioService.deleteIngrediente(deleteTarget.id);

      fetchIngredientes();
      showSuccess("Ingrediente eliminado correctamente");

      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || "Error al eliminar");
    } finally {
      setDeleting(false);
    }
  };

  // Unidades únicas para filtro
  const unidades = ["todas", ...new Set(ingredientes.map(i => i.unidad_medida).filter(Boolean))];

  const filtered = ingredientes.filter(i => {
    const q = searchTerm.toLowerCase();
    const matchSearch = i.nombre?.toLowerCase().includes(q) || i.proveedor?.toLowerCase().includes(q);
    const matchUnit   = unitFilter === "todas" || i.unidad_medida === unitFilter;
    return matchSearch && matchUnit;
  });

  // Métricas
  const totalItems = ingredientes.length;
  const lowStock   = ingredientes.filter(i => Number(i.stock_actual) < Number(i.stock_minimo)).length;

  return (
    <div className="space-y-8 animate-fade-in text-black relative">
      {/* Toast */}
      {successMsg && (
        <div className="absolute top-0 right-0 z-50 flex items-center gap-2 bg-emerald-100 border border-emerald-500 text-emerald-800 px-4 py-3 rounded-xl shadow-lg">
          <CheckCircle className="size-5" />
          <span className="font-medium text-sm">{successMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Gestión de Ingredientes
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Insumos registrados con stock y proveedor para formulaciones y producción.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchIngredientes}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
            <RefreshCw className="size-3.5" /> Actualizar
          </button>
          <button onClick={() => { setEditData(null); setModalOpen(true); }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all">
            <Plus className="size-4" /> Añadir Ingrediente
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total Ingredientes", value: loading ? "..." : totalItems, icon: Package, color: "text-green-700 bg-green-50 border-green-100" },
          { label: "Stock Bajo", value: loading ? "..." : `${lowStock} ítems`, icon: AlertTriangle, color: "text-rose-600 bg-rose-50 border-rose-100" },
          { label: "Unidades Manejadas", value: loading ? "..." : [...new Set(ingredientes.map(i => i.unidad_medida))].join(" · ") || "—", icon: Scale, color: "text-gray-600 bg-gray-50 border-gray-200" },
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
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Buscar por nombre o proveedor..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-black placeholder-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none transition-all" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-gray-500 shrink-0" />
            <select value={unitFilter} onChange={e => setUnitFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none">
              {unidades.map(u => (
                <option key={u} value={u}>{u === "todas" ? "Todas las unidades" : u}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="size-4" /> {error}
          </div>
        )}

        {/* Tabla */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
            <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-3">Nombre</th>
                <th className="py-4 px-3">Proveedor</th>
                <th className="py-4 px-3 text-right">Stock Actual</th>
                <th className="py-4 px-3 text-right">Stock Mínimo</th>
                <th className="py-4 px-3 text-center">Unidad</th>
                <th className="py-4 px-3 text-center">Estado</th>
                <th className="py-4 px-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <Loader2 className="size-8 animate-spin text-orange-500 mx-auto" />
                    <p className="text-sm text-gray-500 mt-2 font-medium">Cargando ingredientes...</p>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map(ing => {
                  const lowS = Number(ing.stock_actual) < Number(ing.stock_minimo);
                  const pct  = Math.min(100, Math.round((Number(ing.stock_actual) / Math.max(Number(ing.stock_minimo), 0.01)) * 100));
                  return (
                    <tr key={ing.id} className="hover:bg-orange-50/10 transition-colors group">
                      <td className="py-4 px-3 text-sm font-semibold text-black">{ing.nombre}</td>
                      <td className="py-4 px-3 text-sm text-gray-500">{ing.proveedor}</td>
                      <td className="py-4 px-3 text-right">
                        <p className={`text-sm font-bold ${lowS ? "text-red-600" : "text-black"}`}>
                          {parseFloat(ing.stock_actual).toLocaleString()}
                        </p>
                        <div className="w-20 ml-auto mt-1 rounded-full bg-gray-100 h-1">
                          <div
                            className={`h-1 rounded-full ${lowS ? "bg-red-500" : "bg-emerald-500"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-3 text-right text-xs font-semibold text-gray-400">
                        {parseFloat(ing.stock_minimo).toLocaleString()}
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
                          {ing.unidad_medida}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center">
                        {lowS ? (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700 border border-red-100 animate-pulse">
                            Stock Bajo
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                            Suficiente
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => handleEdit(ing)} title="Editar"
                            className="inline-flex size-8 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-colors">
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                id: ing.id,
                                nombre: ing.nombre,
                              })
                            } title="Eliminar"
                            className="inline-flex size-8 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-sm font-medium text-gray-400">
                    {ingredientes.length === 0
                      ? "No hay ingredientes registrados aún."
                      : "No hay resultados para los filtros aplicados."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <IngredienteModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSaved={handleSaved}
        editData={editData}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">

            <div className="flex justify-center mb-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <TriangleAlert className="h-7 w-7 text-red-600" />
              </div>
            </div>

            <h3 className="text-center text-2xl font-bold text-gray-900">
              Eliminar Ingrediente
            </h3>

            <p className="mt-3 text-center text-sm text-gray-500 leading-relaxed">
              ¿Está seguro de que desea eliminar{" "}
              <span className="font-semibold text-gray-700">
                {deleteTarget.nombre}
              </span>
              ? Esta acción no se puede deshacer.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-xl px-5 py-2.5 font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-6 py-2.5 font-bold text-white shadow-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Eliminar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}