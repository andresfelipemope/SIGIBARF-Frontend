"use client";

import { useState, useEffect } from "react";
import { useFormulaciones } from "@/hooks/useFormulaciones";
import FormulacionesCards from "@/components/formulaciones/formulaciones-cards";
import FormulacionRecetaForm from "@/components/formulaciones/formulacion-receta-form";
import FormulacionDeleteDialog from "@/components/formulaciones/formulacion-delete-dialog";

import { Plus, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";

export default function FormulacionesPage() {
  const {
    formulaciones,
    productos,
    ingredientes,
    productosMap,
    ingredientesMap,
    loading,
    error,
    success,
    loadAllData,
    createFormulacion,
    updateFormulacion,
    deleteFormulacion,
    clearMessages,
    showSuccess,
  } = useFormulaciones();

  const [isRecetaFormOpen, setIsRecetaFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState("create");

  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    if (success) {
      setToastMsg({ type: "success", text: success });
      const timer = setTimeout(() => {
        setToastMsg(null);
        clearMessages();
      }, 4000);
      return () => clearTimeout(timer);
    }
    if (error) {
      setToastMsg({ type: "error", text: error });
    }
  }, [success, error, clearMessages]);

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedItem(null);
    setIsRecetaFormOpen(true);
  };

  const handleOpenEdit = (formulaciones) => {
    setFormMode("edit");
    setSelectedItem(Array.isArray(formulaciones) ? formulaciones : [formulaciones]);
    setIsRecetaFormOpen(true);
  };

  const handleOpenDelete = (formulaciones) => {
    setSelectedItem(Array.isArray(formulaciones) ? formulaciones : [formulaciones]);
    setIsDeleteOpen(true);
  };

  const handleSaveReceta = async (id, formData) => {
    if (id !== undefined && id !== null) {
      return await updateFormulacion(id, formData);
    }
    return await createFormulacion(formData);
  };

  const handleDeleteConfirm = async (id) => {
    const res = await deleteFormulacion(id);
    if (res.success) {
      setIsDeleteOpen(false);
      setSelectedItem(null);
    }
    return res;
  };

  return (
    <div className="space-y-8 animate-fade-in text-black relative">
      {toastMsg && (
        <div 
          className={`fixed top-24 right-8 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border animate-slide-in-right ${
            toastMsg.type === "success" 
              ? "bg-emerald-50 border-emerald-500 text-emerald-800" 
              : "bg-red-50 border-red-500 text-red-800"
          }`}
        >
          {toastMsg.type === "success" ? (
            <CheckCircle className="size-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="size-5 text-red-600 shrink-0" />
          )}
          <span className="font-semibold text-sm">{toastMsg.text}</span>
          <button 
            onClick={() => { setToastMsg(null); clearMessages(); }}
            className="ml-2 text-gray-400 hover:text-gray-700 font-bold"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Fórmulas y Recetarios
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Parámetros de composición porcentual, balanceo y control de macronutrientes para cada línea de producto BARF.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={loadAllData}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> 
            Actualizar
          </button>
          <button 
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all duration-200 cursor-pointer"
          >
            <Plus className="size-4" />
            Nueva Formulación
          </button>
        </div>
      </div>

      <FormulacionesCards 
        formulaciones={formulaciones}
        productosMap={productosMap}
        ingredientesMap={ingredientesMap}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <FormulacionRecetaForm 
        open={isRecetaFormOpen}
        mode={formMode}
        existingFormulaciones={selectedItem}
        productos={productos}
        ingredientes={ingredientes}
        onClose={() => { setIsRecetaFormOpen(false); setSelectedItem(null); }}
        onSave={handleSaveReceta}
        onDelete={deleteFormulacion}
        onSuccess={showSuccess}
      />

      <FormulacionDeleteDialog 
        open={isDeleteOpen}
        item={selectedItem}
        productosMap={productosMap}
        ingredientesMap={ingredientesMap}
        onClose={() => { setIsDeleteOpen(false); setSelectedItem(null); }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}