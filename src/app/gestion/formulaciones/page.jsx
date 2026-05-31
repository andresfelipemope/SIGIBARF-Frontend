// formulaciones/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useFormulaciones } from "@/hooks/useFormulaciones";
import FormulacionesTable from "@/components/formulaciones/formulaciones-table";
import FormulacionForm from "@/components/formulaciones/formulacion-form";
import FormulacionDetail from "@/components/formulaciones/formulacion-detail";
import FormulacionDeleteDialog from "@/components/formulaciones/formulacion-delete-dialog";
import FormulacionFilters from "@/components/formulaciones/formulacion-filters";

import { 
  Plus, 
  FlaskConical, 
  Boxes, 
  Beef, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle 
} from "lucide-react";

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
  } = useFormulaciones();

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductFilter, setSelectedProductFilter] = useState("todos");
  const [selectedIngredientFilter, setSelectedIngredientFilter] = useState("todos");

  // Modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Toast
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Manejar toasts
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

  // Reset filtros
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedProductFilter("todos");
    setSelectedIngredientFilter("todos");
  };

  // Handlers de modales
  const handleOpenCreate = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  // Guardar formulario
  const handleSaveForm = async (formData) => {
    if (selectedItem) {
      const res = await updateFormulacion(selectedItem.id, formData);
      if (res.success) {
        setIsFormOpen(false);
        setSelectedItem(null);
      }
      return res;
    } else {
      const res = await createFormulacion(formData);
      if (res.success) {
        setIsFormOpen(false);
      }
      return res;
    }
  };

  // Confirmar eliminación
  const handleDeleteConfirm = async (id) => {
    const res = await deleteFormulacion(id);
    if (res.success) {
      setIsDeleteOpen(false);
      setSelectedItem(null);
    }
    return res;
  };

  // Filtrado
  const filteredFormulaciones = formulaciones.filter((f) => {
    const prod = productosMap[f.id_producto];
    const ing = ingredientesMap[f.id_ingrediente];

    const matchSearch =
      f.id.toString().includes(searchTerm) ||
      prod?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ing?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchProduct =
      selectedProductFilter === "todos" ||
      f.id_producto.toString() === selectedProductFilter;

    const matchIngredient =
      selectedIngredientFilter === "todos" ||
      f.id_ingrediente.toString() === selectedIngredientFilter;

    return matchSearch && matchProduct && matchIngredient;
  });

  // Métricas
  const totalFormulaciones = formulaciones.length;
  const uniqueProductsFormulated = new Set(formulaciones.map((f) => f.id_producto)).size;
  const avgIngredients = uniqueProductsFormulated > 0 
    ? (totalFormulaciones / uniqueProductsFormulated).toFixed(1) 
    : "0";

  return (
    <div className="space-y-8 animate-fade-in text-black relative">
      {/* Toast */}
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
            onClick={() => {
              setToastMsg(null);
              clearMessages();
            }}
            className="ml-2 text-gray-400 hover:text-gray-700 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Fórmulas y Formulaciones
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Define y gestiona los insumos e ingredientes exactos que componen cada producto final BARF de Athletic BARF.
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

      {/* Métricas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { 
            label: "Total Asociaciones", 
            value: loading ? "..." : totalFormulaciones, 
            icon: FlaskConical, 
            color: "text-green-700 bg-green-50 border-green-100" 
          },
          { 
            label: "Productos Formulados", 
            value: loading ? "..." : `${uniqueProductsFormulated} ítems`, 
            icon: Boxes, 
            color: "text-orange-700 bg-orange-50 border-orange-100" 
          },
          { 
            label: "Ingredientes prom. / Receta", 
            value: loading ? "..." : `${avgIngredients} insumos`, 
            icon: Beef, 
            color: "text-gray-600 bg-gray-50 border-gray-200" 
          },
        ].map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{metric.label}</span>
              <div className={`flex size-9 items-center justify-center rounded-xl border ${metric.color}`}>
                <metric.icon className="size-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-black mt-3">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <FormulacionFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedProductFilter={selectedProductFilter}
        setSelectedProductFilter={setSelectedProductFilter}
        productos={productos}
        selectedIngredientFilter={selectedIngredientFilter}
        setSelectedIngredientFilter={setSelectedIngredientFilter}
        ingredientes={ingredientes}
        onReset={handleResetFilters}
      />

      {/* Tabla */}
      <FormulacionesTable 
        formulaciones={filteredFormulaciones}
        productosMap={productosMap}
        ingredientesMap={ingredientesMap}
        loading={loading && formulaciones.length === 0}
        onEdit={handleOpenEdit}
        onDetail={handleOpenDetail}
        onDelete={handleOpenDelete}
      />

      {/* Modales */}
      <FormulacionForm 
        open={isFormOpen}
        productos={productos}
        ingredientes={ingredientes}
        editData={selectedItem}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSaveForm}
      />

      <FormulacionDetail 
        open={isDetailOpen}
        item={selectedItem}
        productosMap={productosMap}
        ingredientesMap={ingredientesMap}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedItem(null);
        }}
      />

      <FormulacionDeleteDialog 
        open={isDeleteOpen}
        item={selectedItem}
        productosMap={productosMap}
        ingredientesMap={ingredientesMap}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}