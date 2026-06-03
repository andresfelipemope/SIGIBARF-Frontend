"use client";

import { useState, useEffect } from "react";
import { produccionesService } from "@/services/producciones.service";
import { inventarioService } from "@/services/inventario";
import ProduccionStats from "./produccion-stats";
import ProduccionTable from "./produccion-table";
import ProduccionForm from "./produccion-form";
import ProduccionAlerts from "./produccion-alerts";
import { CheckCircle, AlertTriangle, Loader2, Plus } from "lucide-react";

export default function ProduccionDashboard() {
  const [producciones, setProducciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      let prodRes = [];
      let prodListRes = [];
      let ingListRes = [];

      try {
        prodListRes = await inventarioService.getProductos();
      } catch (e) {
        console.error("Error cargando productos:", e);
      }

      try {
        ingListRes = await inventarioService.getIngredientes();
      } catch (e) {
        console.error("Error cargando ingredientes:", e);
      }

      try {
        prodRes = await produccionesService.getProducciones();
      } catch (e) {
        console.error("Error cargando producciones:", e);
        setError(
          "El backend devolvió un error 500 al consultar las producciones. El historial no se pudo cargar.",
        );
      }

      setProducciones(prodRes || []);
      setProductos(prodListRes || []);
      setIngredientes(ingListRes || []);
    } catch (err) {
      console.error("Dashboard general error:", err);
      setError("Error general al cargar el módulo de producción.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSuccess = (msg) => {
    setSuccessMessage(msg);
    setIsFormOpen(false);
    fetchData();
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  if (loading && producciones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-green-600">
        <Loader2 className="size-10 animate-spin mb-4" />
        <p className="text-sm font-bold text-gray-500">
          Cargando módulo de producción...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-black relative">
      {successMessage && (
        <div className="fixed top-24 right-8 z-50 flex items-center gap-2 bg-emerald-100 border border-emerald-500 text-emerald-800 px-4 py-3 rounded-xl shadow-lg animate-slide-in-right">
          <CheckCircle className="size-5" />
          <span className="font-medium text-sm">{successMessage}</span>
        </div>
      )}

      {/* Header and Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Control de Producción
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Seguimiento de producciones, manufactura de lotes y control de
            inventario.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all duration-200"
        >
          <Plus className="size-4" />
          Registrar Producción
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="size-5 shrink-0" />
          {error}
        </div>
      )}

      <ProduccionStats
        producciones={producciones}
        productos={productos}
        ingredientes={ingredientes}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <ProduccionTable
            producciones={producciones}
            productos={productos}
            loading={loading}
          />
        </div>
        <div className="lg:col-span-1">
          <ProduccionAlerts ingredientes={ingredientes} productos={productos} />
        </div>
      </div>

      {isFormOpen && (
        <ProduccionForm
          productos={productos}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
