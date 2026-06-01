"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Plus, Trash2, AlertCircle, Loader2, FlaskConical, ChefHat } from "lucide-react";

export default function FormulacionRecetaForm({
  open,
  mode = "create",
  existingFormulaciones = null,
  productos,
  ingredientes,
  onClose,
  onSave,
  onDelete,
  onSuccess, 
}) {
  const [step, setStep] = useState(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [ingredientesAgregados, setIngredientesAgregados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [originalIngredients, setOriginalIngredients] = useState([]);

  const [tempIngrediente, setTempIngrediente] = useState({
    id_ingrediente: "",
    cantidad_ingrediente: "",
    porcentaje_ingrediente: "",
  });

  useEffect(() => {
    if (open) {
      setError(null);
      
      if (mode === "edit" && existingFormulaciones?.length > 0) {
        const first = existingFormulaciones[0];
        setProductoSeleccionado(first.id_producto);
        setEditData(existingFormulaciones);
        setOriginalIngredients(existingFormulaciones.map(f => ({ id: f.id, id_ingrediente: f.id_ingrediente })));
        setIngredientesAgregados(existingFormulaciones.map(f => ({
          id_ingrediente: f.id_ingrediente,
          cantidad_ingrediente: f.cantidad_ingrediente,
          porcentaje_ingrediente: f.porcentaje_ingrediente,
        })));
        setStep(2);
      } else {
        setProductoSeleccionado(null);
        setIngredientesAgregados([]);
        setEditData(null);
        setOriginalIngredients([]);
        setTempIngrediente({ id_ingrediente: "", cantidad_ingrediente: "", porcentaje_ingrediente: "" });
        setStep(1);
      }
    }
  }, [open, mode, existingFormulaciones]);

  const totalPorcentaje = useMemo(() => 
    ingredientesAgregados.reduce((sum, ing) => sum + parseFloat(ing.porcentaje_ingrediente || 0), 0),
    [ingredientesAgregados]
  );

  const canProceed = () => {
    if (step === 1) return productoSeleccionado !== null;
    if (step === 2) return ingredientesAgregados.length > 0 && totalPorcentaje <= 100;
    return true;
  };

  const handleAddIngrediente = () => {
    if (!tempIngrediente.id_ingrediente || !tempIngrediente.cantidad_ingrediente || !tempIngrediente.porcentaje_ingrediente) {
      return setError("Completa todos los campos");
    }
    const pct = parseFloat(tempIngrediente.porcentaje_ingrediente);
    const cant = parseFloat(tempIngrediente.cantidad_ingrediente);
    if (pct <= 0 || pct > 100) return setError("Porcentaje entre 1 y 100");
    if (cant <= 0) return setError("Cantidad debe ser mayor a 0");
    if (ingredientesAgregados.find(i => i.id_ingrediente === tempIngrediente.id_ingrediente)) return setError("Ingrediente ya agregado");
    if (totalPorcentaje + pct > 100) return setError(`Excede 100%. Actual: ${totalPorcentaje.toFixed(2)}%`);

    setIngredientesAgregados(prev => [...prev, {
      ...tempIngrediente,
      id_ingrediente: Number(tempIngrediente.id_ingrediente),
      cantidad_ingrediente: String(cant),
      porcentaje_ingrediente: String(pct),
    }]);
    setTempIngrediente({ id_ingrediente: "", cantidad_ingrediente: "", porcentaje_ingrediente: "" });
    setError(null);
  };

  const handleRemoveIngrediente = (index) => {
    setIngredientesAgregados(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!productoSeleccionado || ingredientesAgregados.length === 0) {
      return setError("Selecciona producto y al menos un ingrediente");
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === "edit" && editData) {
        const currentIds = ingredientesAgregados.map(i => i.id_ingrediente);
        const originalIds = originalIngredients.map(o => o.id_ingrediente);
        
        const eliminados = originalIngredients.filter(orig => !currentIds.includes(orig.id_ingrediente));
        const nuevos = ingredientesAgregados.filter(i => !originalIds.includes(i.id_ingrediente));
        const modificados = ingredientesAgregados.filter(i => {
          const existing = editData.find(f => f.id_ingrediente === i.id_ingrediente);
          return existing && (existing.cantidad_ingrediente !== i.cantidad_ingrediente || existing.porcentaje_ingrediente !== i.porcentaje_ingrediente);
        });

        if (eliminados.length > 0) {
          await Promise.all(eliminados.map(el => onDelete(el.id)));
        }

        const createPromises = nuevos.map(ing => onSave(null, {
          id_producto: productoSeleccionado,
          id_ingrediente: ing.id_ingrediente,
          cantidad_ingrediente: ing.cantidad_ingrediente,
          porcentaje_ingrediente: ing.porcentaje_ingrediente,
        }));

        const updatePromises = modificados.map(ing => {
          const existing = editData.find(f => f.id_ingrediente === ing.id_ingrediente);
          return onSave(existing.id, {
            id_producto: productoSeleccionado,
            id_ingrediente: ing.id_ingrediente,
            cantidad_ingrediente: ing.cantidad_ingrediente,
            porcentaje_ingrediente: ing.porcentaje_ingrediente,
          });
        });

        const results = await Promise.all([...createPromises, ...updatePromises]);
        
        if (results.every(r => r?.success)) {
          onSuccess("Formulación actualizada correctamente"); // ⭐ AQUÍ SE DISPARA
          onClose();
        } else {
          setError("Algunos ingredientes no se guardaron correctamente");
        }
      } else {
        const promises = ingredientesAgregados.map(ing => onSave(null, {
          id_producto: productoSeleccionado,
          id_ingrediente: ing.id_ingrediente,
          cantidad_ingrediente: ing.cantidad_ingrediente,
          porcentaje_ingrediente: ing.porcentaje_ingrediente,
        }));

        const results = await Promise.all(promises);
        if (results.every(r => r?.success)) {
          onSuccess("Formulación creada correctamente"); // ⭐ AQUÍ SE DISPARA
          onClose();
        } else {
          setError("Error al crear algunas relaciones");
        }
      }
    } catch (err) {
      console.error("Error guardando:", err);
      setError(err.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-3">
        <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden">
          {}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {mode === "edit" ? "Editar Formulación" : "Nueva Formulación"}
              </h2>
              <p className="text-xs text-gray-500">
                Paso {step} de 3: {step === 1 ? "Producto" : step === 2 ? "Ingredientes" : "Revisar"}
              </p>
            </div>
            <button onClick={onClose} disabled={loading} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition cursor-pointer disabled:opacity-50">
              <X className="size-4" />
            </button>
          </div>

          {}
          <div className="px-4 py-2 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition ${s <= step ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                    {s < step ? "✓" : s}
                  </div>
                  {s < 3 && <div className={`flex-1 h-0.5 mx-1.5 transition ${s < step ? "bg-orange-500" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </div>

          {}
          {error && (
            <div className="mx-4 mt-3 p-2 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-tight">{error}</p>
            </div>
          )}

          {}
          <div className="px-4 py-3 max-h-[calc(100vh-180px)] overflow-y-auto">
            {}
            {step === 1 && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">Producto a formular <span className="text-red-500">*</span></label>
                <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                  {productos.map((p) => (
                    <button key={p.id} onClick={() => setProductoSeleccionado(p.id)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition cursor-pointer text-sm ${productoSeleccionado === p.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{p.nombre}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Stock: {p.stock_actual} • ${parseFloat(p.precio).toLocaleString()}</p>
                        </div>
                        {productoSeleccionado === p.id && (
                          <div className="size-5 rounded-full bg-orange-500 flex items-center justify-center shrink-0 ml-2">
                            <svg className="size-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {}
            {step === 2 && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                    <Plus className="size-3.5" /> Agregar Ingrediente
                  </h3>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 sm:col-span-6">
                      <select value={tempIngrediente.id_ingrediente} onChange={(e) => setTempIngrediente({ ...tempIngrediente, id_ingrediente: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                        <option value="">Seleccionar...</option>
                        {ingredientes.filter(i => !ingredientesAgregados.find(a => a.id_ingrediente === i.id)).map(i => (
                          <option key={i.id} value={i.id}>{i.nombre} ({i.unidad_medida})</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <input type="number" step="0.01" min="0.01" value={tempIngrediente.cantidad_ingrediente} onChange={(e) => setTempIngrediente({ ...tempIngrediente, cantidad_ingrediente: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20" placeholder="Cant." />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <input type="number" step="0.01" min="0.01" max="100" value={tempIngrediente.porcentaje_ingrediente} onChange={(e) => setTempIngrediente({ ...tempIngrediente, porcentaje_ingrediente: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20" placeholder="%" />
                    </div>
                  </div>
                  <button type="button" onClick={handleAddIngrediente} disabled={!tempIngrediente.id_ingrediente || !tempIngrediente.cantidad_ingrediente || !tempIngrediente.porcentaje_ingrediente}
                    className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                    <Plus className="size-3.5" /> Agregar
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-xs font-semibold text-gray-700">Ingredientes ({ingredientesAgregados.length})</h3>
                    <span className={`text-xs font-bold ${totalPorcentaje > 100 ? "text-red-600" : "text-green-600"}`}>{totalPorcentaje.toFixed(1)}%</span>
                  </div>
                  
                  {ingredientesAgregados.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">Sin ingredientes agregados</p>
                  ) : (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {ingredientesAgregados.map((ing, idx) => {
                        const data = ingredientes.find(i => i.id === ing.id_ingrediente);
                        const esOriginal = originalIngredients.find(o => o.id_ingrediente === ing.id_ingrediente);
                        return (
                          <div key={idx} className={`flex items-center justify-between p-2 rounded-lg border text-xs ${esOriginal ? "bg-white border-gray-200" : "bg-blue-50 border-blue-200"}`}>
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-gray-400 font-medium">#{idx + 1}</span>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{data?.nombre}</p>
                                <p className="text-gray-500">{ing.cantidad_ingrediente} {data?.unidad_medida} • {ing.porcentaje_ingrediente}%</p>
                              </div>
                            </div>
                            <button onClick={() => handleRemoveIngrediente(idx)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer shrink-0">
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {ingredientesAgregados.length > 0 && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${totalPorcentaje > 100 ? "bg-red-500" : totalPorcentaje === 100 ? "bg-green-500" : "bg-orange-500"}`} style={{ width: `${Math.min(totalPorcentaje, 100)}%` }} />
                      </div>
                      {mode === "edit" && originalIngredients.length !== ingredientesAgregados.length && (
                        <p className="text-xs text-amber-600 mt-1">
                          Se aplicarán cambios a {Math.abs(originalIngredients.length - ingredientesAgregados.length)} ingrediente(s)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {}
            {step === 3 && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
                      <ChefHat className="size-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-orange-600 uppercase">Producto</p>
                      <p className="text-sm font-bold text-gray-900">{productos.find(p => p.id === productoSeleccionado)?.nombre}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold text-gray-700">Resumen ({ingredientesAgregados.length} ingredientes)</h3>
                  {ingredientesAgregados.map((ing, idx) => {
                    const data = ingredientes.find(i => i.id === ing.id_ingrediente);
                    return (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">#{idx + 1}</span>
                          <span className="font-semibold text-gray-900">{data?.nombre}</span>
                          <span className="text-gray-500">{ing.cantidad_ingrediente} {data?.unidad_medida}</span>
                        </div>
                        <span className="font-bold text-orange-600">{ing.porcentaje_ingrediente}%</span>
                      </div>
                    );
                  })}
                </div>

                {mode === "edit" && originalIngredients.length > ingredientesAgregados.length && (
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
                    <strong>Se eliminarán:</strong> {originalIngredients.length - ingredientesAgregados.length} ingrediente(s)
                  </div>
                )}

                {totalPorcentaje !== 100 && (
                  <div className={`p-2 rounded-lg border text-xs ${totalPorcentaje > 100 ? "bg-red-50 border-red-200 text-red-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
                    {totalPorcentaje > 100 ? `⚠ Excede 100% (${totalPorcentaje.toFixed(1)}%)` : `⚠ Incompleto: ${totalPorcentaje.toFixed(1)}%`}
                  </div>
                )}
              </div>
            )}
          </div>

          {}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <button onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1 || loading}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              ← Atrás
            </button>
            <div className="flex items-center gap-2">
              {step < 3 ? (
                <button onClick={() => { if (canProceed()) { setError(null); setStep(step + 1); } }} disabled={!canProceed()}
                  className="rounded-lg bg-orange-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-orange-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  Continuar →
                </button>
              ) : (
                <button onClick={handleSave} disabled={loading || ingredientesAgregados.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-green-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? <><Loader2 className="size-3.5 animate-spin" /> Guardando...</> : <><ChefHat className="size-3.5" /> {mode === "edit" ? "Actualizar" : "Crear"}</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}