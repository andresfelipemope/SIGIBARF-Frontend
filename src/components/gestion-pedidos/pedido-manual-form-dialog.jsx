import { useState } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ClienteSelector } from "./cliente-selector";

const EMPTY_ITEM = { producto_id: "", cantidad: 1 };

export function PedidoManualFormDialog({
  isOpen,
  onClose,
  onSubmit,
  productos,
  creating,
}) {
  const [usuarioId, setUsuarioId] = useState("");
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [tipoPago, setTipoPago] = useState("contado");
  const [cantidadCuotas, setCantidadCuotas] = useState("6");
  const [interes, setInteres] = useState("0.05");
  const [frecuenciaDias, setFrecuenciaDias] = useState("30");
  const [observaciones, setObservaciones] = useState("");
  const [formError, setFormError] = useState(null);
  const [creditoCreadoId, setCreditoCreadoId] = useState(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setUsuarioId("");
    setItems([{ ...EMPTY_ITEM }]);
    setTipoPago("contado");
    setCantidadCuotas("6");
    setInteres("0.05");
    setFrecuenciaDias("30");
    setObservaciones("");
    setFormError(null);
    setCreditoCreadoId(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);

  const removeItem = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setCreditoCreadoId(null);

    if (!usuarioId) {
      setFormError("Debes indicar el cliente (ID de usuario).");
      return;
    }

    const parsedItems = items
      .filter((it) => it.producto_id && Number(it.cantidad) > 0)
      .map((it) => ({
        producto_id: parseInt(it.producto_id, 10),
        cantidad: parseInt(it.cantidad, 10),
      }));

    if (parsedItems.length === 0) {
      setFormError("Agrega al menos un producto con cantidad válida.");
      return;
    }

    const body = {
      usuario: parseInt(usuarioId, 10),
      items: parsedItems,
      tipo_pago: tipoPago,
    };

    if (tipoPago === "credito") {
      body.cantidad_cuotas = parseInt(cantidadCuotas, 10);
      body.interes = parseFloat(interes);
      body.frecuencia_dias = parseInt(frecuenciaDias, 10);
      if (observaciones.trim()) {
        body.observaciones = observaciones.trim();
      }
    }

    const result = await onSubmit(body);
    if (result.success) {
      if (result.data?.credito_id) {
        setCreditoCreadoId(result.data.credito_id);
      } else {
        handleClose();
      }
    } else {
      setFormError(result.error || "Error al registrar el pedido manual.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-500">
              Canales externos · WhatsApp · Redes · Teléfono
            </span>
            <h2 className="text-lg font-extrabold text-black">Registrar pedido manual</h2>
          </div>
          <button onClick={handleClose} disabled={creating} className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer">
            <X className="size-5 text-gray-400" />
          </button>
        </div>

        {creditoCreadoId ? (
          <div className="p-8 text-center space-y-4">
            <p className="text-sm font-semibold text-green-700">
              Pedido y crédito creados correctamente.
            </p>
            <Link
              href={`/gestion/creditos/${creditoCreadoId}`}
              className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-green-700"
            >
              Ver crédito #{creditoCreadoId}
            </Link>
            <button
              onClick={handleClose}
              className="block mx-auto text-xs font-bold text-gray-500 hover:text-black"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {formError && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
                  {formError}
                </p>
              )}

              <ClienteSelector value={usuarioId} onChange={setUsuarioId} disabled={creating} />

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">
                  Tipo de pago
                </label>
                <select
                  value={tipoPago}
                  onChange={(e) => setTipoPago(e.target.value)}
                  disabled={creating}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-bold cursor-pointer"
                >
                  <option value="contado">Contado</option>
                  <option value="credito">Crédito</option>
                </select>
              </div>

              {tipoPago === "credito" && (
                <div className="grid grid-cols-2 gap-3 rounded-xl border border-orange-100 bg-orange-50/30 p-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500">Cuotas</label>
                    <input
                      type="number"
                      min="1"
                      value={cantidadCuotas}
                      onChange={(e) => setCantidadCuotas(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      disabled={creating}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500">Interés</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={interes}
                      onChange={(e) => setInteres(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      disabled={creating}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500">Frecuencia (días)</label>
                    <input
                      type="number"
                      min="1"
                      value={frecuenciaDias}
                      onChange={(e) => setFrecuenciaDias(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      disabled={creating}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase text-gray-500">Observaciones</label>
                    <textarea
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      rows={2}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none"
                      disabled={creating}
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                    Productos
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-1 text-xs font-bold text-green-700 hover:text-green-800"
                  >
                    <Plus className="size-3.5" /> Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <select
                        value={item.producto_id}
                        onChange={(e) => updateItem(index, "producto_id", e.target.value)}
                        className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm cursor-pointer"
                        disabled={creating}
                      >
                        <option value="">Producto...</option>
                        {productos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => updateItem(index, "cantidad", e.target.value)}
                        className="w-20 rounded-xl border border-gray-200 px-3 py-2 text-sm"
                        disabled={creating}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className={cn(
                          "p-2 text-gray-400 hover:text-rose-600",
                          items.length <= 1 && "opacity-30 pointer-events-none"
                        )}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={creating}
                className="text-xs font-bold text-gray-600 hover:text-black cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-600 disabled:opacity-70 cursor-pointer"
              >
                {creating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Registrando...
                  </>
                ) : (
                  "Registrar pedido manual"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
