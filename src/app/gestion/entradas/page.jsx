"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PackagePlus,
  Search,
  RefreshCw,
  Loader2,
  X,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ArrowUpCircle,
  ClipboardList,
  Scale,
} from "lucide-react";
import { inventarioService } from "@/services/inventario";

function formatDecimal(val) {
  return val !== null && val !== undefined
    ? parseFloat(val).toLocaleString("es-CO")
    : "—";
}

function formatFecha(fechaStr) {
  if (!fechaStr) return "—";
  return new Date(fechaStr).toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const EMPTY_FORM = { id_ingrediente: "", cantidad: "", comentarios: "" };

// ── Modal ────────────────────────────────────────────────────────────
function EntradaModal({ open, onClose, onSaved, ingredientes }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData(EMPTY_FORM);
      setFormError(null);
      setFieldErrors({});
    }
  }, [open]);

  const selectedIng = ingredientes.find(
    (i) => String(i.id) === String(formData.id_ingrediente),
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name])
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const errors = {};
    if (!formData.id_ingrediente)
      errors.id_ingrediente = "Selecciona un ingrediente";
    if (!formData.cantidad || Number(formData.cantidad) <= 0)
      errors.cantidad = "La cantidad debe ser mayor a 0";
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      // El backend ahora calcula stock_anterior/posterior y actualiza el stock
      // del ingrediente automáticamente dentro de perform_create.
      await inventarioService.createMovimientoIngrediente({
        id_ingrediente: parseInt(formData.id_ingrediente, 10),
        tipo_movimiento: "ENTRADA",
        cantidad: parseFloat(formData.cantidad).toFixed(2),
        comentarios: formData.comentarios.trim() || null,
      });
      onSaved(
        selectedIng.nombre,
        parseFloat(formData.cantidad),
        selectedIng.unidad_medida,
      );
    } catch (err) {
      if (err.data && typeof err.data === "object") {
        setFieldErrors(err.data);
      } else {
        setFormError(err.message || "Error al registrar la entrada");
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
        {Array.isArray(fieldErrors[name])
          ? fieldErrors[name][0]
          : fieldErrors[name]}
      </p>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-green-50 border border-green-100">
              <ArrowUpCircle className="size-5 text-green-600" />
            </div>
            <h2 className="text-xl font-extrabold text-black">
              Registrar Entrada
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto flex-1 space-y-5"
        >
          {formError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-2">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Selector de ingrediente */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Ingrediente <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="id_ingrediente"
                value={formData.id_ingrediente}
                onChange={handleChange}
                disabled={loading}
                className={
                  inputClass("id_ingrediente") + " appearance-none pr-10"
                }
              >
                <option value="">— Seleccionar ingrediente —</option>
                {ingredientes.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.nombre} · Stock: {formatDecimal(i.stock_actual)}{" "}
                    {i.unidad_medida}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
            {fieldErr("id_ingrediente")}
          </div>

          {/* Info del ingrediente seleccionado */}
          {selectedIng && (
            <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[10px] font-bold uppercase text-blue-400">
                  Stock Actual
                </p>
                <p className="text-sm font-extrabold text-blue-700 mt-0.5">
                  {formatDecimal(selectedIng.stock_actual)}{" "}
                  {selectedIng.unidad_medida}
                </p>
              </div>
              <div className="border-x border-blue-100">
                <p className="text-[10px] font-bold uppercase text-blue-400">
                  Mínimo
                </p>
                <p className="text-sm font-extrabold text-blue-700 mt-0.5">
                  {formatDecimal(selectedIng.stock_minimo)}{" "}
                  {selectedIng.unidad_medida}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-blue-400">
                  Proveedor
                </p>
                <p className="text-sm font-extrabold text-blue-700 mt-0.5 truncate">
                  {selectedIng.proveedor}
                </p>
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Cantidad Recibida <span className="text-red-500">*</span>
              {selectedIng && (
                <span className="ml-1 text-gray-400 font-normal">
                  ({selectedIng.unidad_medida})
                </span>
              )}
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              placeholder="0.00"
              disabled={loading}
              className={inputClass("cantidad")}
            />
            {fieldErr("cantidad")}
            {selectedIng &&
              formData.cantidad &&
              Number(formData.cantidad) > 0 && (
                <p className="text-xs text-gray-500 mt-1.5">
                  Stock resultante:{" "}
                  <strong className="text-emerald-600">
                    {(
                      parseFloat(selectedIng.stock_actual) +
                      parseFloat(formData.cantidad)
                    ).toFixed(2)}{" "}
                    {selectedIng.unidad_medida}
                  </strong>
                </p>
              )}
          </div>

          {/* Comentarios */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Comentarios{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              name="comentarios"
              value={formData.comentarios}
              onChange={handleChange}
              rows={3}
              placeholder="Ej. Compra a Frigorífico Central, factura #1234"
              disabled={loading}
              className={inputClass("comentarios") + " resize-none"}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-green-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Registrando...
                </>
              ) : (
                <>
                  <ArrowUpCircle className="size-4" /> Registrar Entrada
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Página Principal ─────────────────────────────────────────────────
export default function EntradasIngredientesPage() {
  const [ingredientes, setIngredientes] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const ingMap = Object.fromEntries(ingredientes.map((i) => [i.id, i]));

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ings, movs] = await Promise.all([
        inventarioService.getIngredientes(),
        inventarioService.getMovimientosIngrediente().catch(() => []),
      ]);
      setIngredientes(Array.isArray(ings) ? ings : []);
      const entradas = (Array.isArray(movs) ? movs : [])
        .filter((m) => m.tipo_movimiento === "ENTRADA")
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setMovimientos(entradas);
    } catch (err) {
      setError(err.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleSaved = (nombre, cantidad, unidad) => {
    setModalOpen(false);
    fetchData(); // recarga ingredientes (stock actualizado) + historial
    showSuccess(`Entrada registrada: +${cantidad} ${unidad} de ${nombre}`);
  };

  const filteredMovs = movimientos.filter((m) => {
    const ing = ingMap[m.id_ingrediente];
    return (
      !searchTerm ||
      ing?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const ingConAlertas = ingredientes.filter(
    (i) => Number(i.stock_actual) < Number(i.stock_minimo),
  ).length;

  return (
    <div className="space-y-8 text-black relative">
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
            Entradas de Ingredientes
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Registra compras y recepciones de ingredientes para actualizar el
            stock disponible.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            <RefreshCw className="size-3.5" /> Actualizar
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-green-600/20 hover:bg-green-700 transition-all"
          >
            <PackagePlus className="size-4" /> Nueva Entrada
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Ingredientes Disponibles",
            value: loading ? "..." : ingredientes.length,
            icon: Scale,
            color: "text-blue-700 bg-blue-50 border-blue-100",
          },
          {
            label: "Entradas en Historial",
            value: loading ? "..." : movimientos.length,
            icon: ClipboardList,
            color: "text-green-700 bg-green-50 border-green-100",
          },
          {
            label: "Ingredientes con Stock Bajo",
            value: loading ? "..." : ingConAlertas,
            icon: AlertTriangle,
            color:
              ingConAlertas > 0
                ? "text-red-700 bg-red-50 border-red-100"
                : "text-gray-500 bg-gray-50 border-gray-200",
          },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {m.label}
              </span>
              <div
                className={`flex size-9 items-center justify-center rounded-xl border ${m.color}`}
              >
                <m.icon className="size-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-black mt-3">{m.value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="size-4" /> {error}
        </div>
      )}

      {/* Historial */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ClipboardList className="size-5 text-gray-400" />
            <h2 className="text-base font-bold text-black">
              Historial de Entradas
            </h2>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ingrediente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-black placeholder-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-5">Ingrediente</th>
                <th className="py-4 px-5 text-right">Cantidad</th>
                <th className="py-4 px-5 text-right">Stock Anterior</th>
                <th className="py-4 px-5 text-right">Stock Posterior</th>
                <th className="py-4 px-5">Fecha</th>
                <th className="py-4 px-5">Comentarios</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <Loader2 className="size-8 animate-spin text-green-600 mx-auto" />
                    <p className="text-sm text-gray-500 mt-2 font-medium">
                      Cargando historial...
                    </p>
                  </td>
                </tr>
              ) : filteredMovs.length > 0 ? (
                filteredMovs.map((m) => {
                  const ing = ingMap[m.id_ingrediente];
                  return (
                    <tr
                      key={m.id}
                      className="hover:bg-green-50/20 transition-colors"
                    >
                      <td className="py-4 px-5">
                        <p className="text-sm font-semibold text-black">
                          {ing?.nombre ?? `Ingrediente #${m.id_ingrediente}`}
                        </p>
                        <p className="text-xs text-gray-400">
                          {ing?.unidad_medida ?? ""}
                        </p>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-green-700">
                          <ArrowUpCircle className="size-3.5" />+
                          {formatDecimal(m.cantidad)} {ing?.unidad_medida ?? ""}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right text-sm text-gray-500">
                        {m.stock_anterior != null
                          ? `${formatDecimal(m.stock_anterior)} ${ing?.unidad_medida ?? ""}`
                          : "—"}
                      </td>
                      <td className="py-4 px-5 text-right text-sm font-semibold text-black">
                        {m.stock_posterior != null
                          ? `${formatDecimal(m.stock_posterior)} ${ing?.unidad_medida ?? ""}`
                          : "—"}
                      </td>
                      <td className="py-4 px-5 text-xs text-gray-500">
                        {formatFecha(m.fecha)}
                      </td>
                      <td className="py-4 px-5 text-xs text-gray-500 max-w-[200px] truncate">
                        {m.comentarios || (
                          <span className="text-gray-300">Sin comentarios</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="py-12 text-center text-sm font-medium text-gray-400"
                  >
                    {movimientos.length === 0
                      ? "No hay entradas registradas aún. Usa el botón «Nueva Entrada» para comenzar."
                      : "No hay entradas que coincidan con la búsqueda."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EntradaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        ingredientes={ingredientes}
      />
    </div>
  );
}
