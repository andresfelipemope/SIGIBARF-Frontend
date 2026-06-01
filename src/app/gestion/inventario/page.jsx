"use client";

import { useState, useEffect } from "react";
import { 
  Boxes, 
  AlertTriangle, 
  Search, 
  Filter,
  Plus,
  Loader2,
  X,
  CheckCircle,
  Pencil,
  Trash2
} from "lucide-react";
import { inventarioService } from "@/services/inventario";

export default function InventarioPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Modal y Formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock_actual: 0,
    stock_minimo: 0,
    inhabilitado: false
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventarioService.getProductos();
      setProductos(data);
    } catch (err) {
      setError(err.message || "Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Validaciones básicas en tiempo real (longitudes)
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
    if (name === 'nombre') {
      if (value.length > 100) {
        setFieldErrors(prev => ({ ...prev, nombre: 'El nombre no puede superar los 100 caracteres' }));
      }
    }
    if (name === 'descripcion') {
      if (value && value.length > 1000) {
        setFieldErrors(prev => ({ ...prev, descripcion: 'La descripción no puede superar los 1000 caracteres' }));
      }
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({
      nombre: "",
      precio: "",
      stock_actual: 0,
      stock_minimo: 0,
      inhabilitado: false,
      descripcion: ''
    });
    setFieldErrors({});
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (producto) => {
    setEditingId(producto.id);
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio,
      stock_actual: producto.stock_actual,
      stock_minimo: producto.stock_minimo,
      inhabilitado: producto.inhabilitado,
      descripcion: producto.descripcion || ''
    });
    setFieldErrors({});
    setFormError(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (producto) => {
    setProductToDelete(producto);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      setDeleteLoading(true);
      setError(null);
      await inventarioService.deleteProducto(productToDelete.id);
      setSuccessMessage("Producto eliminado correctamente");
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProductos(); // Refrescar lista
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || "Error al eliminar el producto");
      setIsDeleteModalOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    
    // Frontend validaciones simples
    // Nombre: obligatorio y max 100 chars
    const nombreVal = String(formData.nombre || '').trim();
    if (!nombreVal) {
      setFieldErrors(prev => ({ ...prev, nombre: 'El nombre es obligatorio' }));
      return;
    }
    if (nombreVal.length > 100) {
      setFieldErrors(prev => ({ ...prev, nombre: 'El nombre no puede superar los 100 caracteres' }));
      return;
    }

    // Precio: string decimal, hasta 10 dígitos en la parte entera y 2 decimales, y > 0
    const precioStr = String(formData.precio || '').trim();
    const precioRegex = /^\d{1,10}(\.\d{1,2})?$/;
    if (!precioRegex.test(precioStr) || Number(precioStr) <= 0) {
      setFieldErrors(prev => ({ ...prev, precio: 'Precio inválido. Máx 10 dígitos y hasta 2 decimales, y debe ser mayor a 0' }));
      return;
    }

    // Stock actual: solo en creación, entero >= 0
    if (!editingId) {
      const sa = parseInt(String(formData.stock_actual || '0'), 10);
      if (isNaN(sa) || sa < 0) {
        setFieldErrors(prev => ({ ...prev, stock_actual: 'Stock actual debe ser un número entero >= 0' }));
        return;
      }
    }

    // Stock mínimo: entero >= 0
    const sm = parseInt(String(formData.stock_minimo || '0'), 10);
    if (isNaN(sm) || sm < 0) {
      setFieldErrors(prev => ({ ...prev, stock_minimo: 'Stock mínimo debe ser un número entero >= 0' }));
      return;
    }

    // Descripción: opcional, max 1000 chars
    if (formData.descripcion && String(formData.descripcion).length > 1000) {
      setFieldErrors(prev => ({ ...prev, descripcion: 'La descripción no puede superar los 1000 caracteres' }));
      return;
    }

    try {
      setFormLoading(true);
      // Asegurar tipos para el backend
      if (editingId) {
        // Modo Edición: no se envía stock_actual
        const payload = {
          nombre: formData.nombre,
          precio: String(formData.precio),
          stock_minimo: parseInt(formData.stock_minimo, 10) || 0,
          inhabilitado: formData.inhabilitado,
          descripcion: formData.descripcion || null
        };
        await inventarioService.updateProducto(editingId, payload);
        setSuccessMessage("Producto actualizado correctamente");
      } else {
        // Modo Creación
        const payload = {
          ...formData,
          precio: String(formData.precio), // El backend pide string decimal
          stock_actual: parseInt(formData.stock_actual, 10) || 0,
          stock_minimo: parseInt(formData.stock_minimo, 10) || 0,
          descripcion: formData.descripcion || null
        };
        await inventarioService.createProducto(payload);
        setSuccessMessage("Producto registrado correctamente");
      }
      
      // Éxito
      setIsModalOpen(false);
      setFormData({
        nombre: "",
        precio: "",
        stock_actual: 0,
        stock_minimo: 0,
        inhabilitado: false,
        descripcion: ''
      });
      fetchProductos(); // Refrescar lista

      // Quitar mensaje de éxito después de 3 seg
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err) {
      if (err.data && typeof err.data === 'object') {
        // Errores de validación del backend por campos
        setFieldErrors(err.data);
      } else {
        setFormError(err.message || "Error al registrar el producto");
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Calcular métricas
  const totalItems = productos.length;
  const itemsInAlert = productos.filter(p => !p.inhabilitado && p.stock_actual <= p.stock_minimo).length;
  
  const metrics = [
    { label: "Total Productos", value: loading ? "..." : totalItems.toString(), icon: Boxes, color: "text-green-700 bg-green-50 border-green-100" },
    { label: "Alertas de Stock", value: loading ? "..." : `${itemsInAlert} Ítems`, icon: AlertTriangle, color: "text-rose-600 bg-rose-50 border-rose-100" }
  ];

  // Filtering Logic
  const filteredItems = productos.filter(item => {
    const searchMatch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    let statusMatch = true;
    if (statusFilter === "activos") statusMatch = !item.inhabilitado;
    if (statusFilter === "inhabilitados") statusMatch = item.inhabilitado;
    if (statusFilter === "alerta") statusMatch = !item.inhabilitado && item.stock_actual <= item.stock_minimo;

    return searchMatch && statusMatch;
  });

  return (
    <div className="space-y-8 animate-fade-in text-black relative">
      {successMessage && (
        <div className="absolute top-0 right-0 z-50 flex items-center gap-2 bg-emerald-100 border border-emerald-500 text-emerald-800 px-4 py-3 rounded-xl shadow-lg animate-slide-in-right">
          <CheckCircle className="size-5" />
          <span className="font-medium text-sm">{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Gestión de Productos
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Control de productos finales del inventario administrativo.
          </p>
        </div>
        <button 
          onClick={openNewModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all duration-200"
        >
          <Plus className="size-4" />
          Registrar Producto
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 sm:grid-cols-2">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {m.label}
              </span>
              <div className={`flex size-10 items-center justify-center rounded-xl border ${m.color}`}>
                <m.icon className="size-5" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-black mt-4">
              {m.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Table Filters & Actions */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-black placeholder-gray-400 focus:border-green-600 focus:bg-white focus:outline-hidden transition-all duration-200"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-500">Estado:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-green-50/20 transition-colors focus:outline-hidden"
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inhabilitados">Inhabilitados</option>
              <option value="alerta">En Alerta (Stock Bajo)</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="size-4" />
            {error}
          </div>
        )}

        {/* Inventory List Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-3">Producto</th>
                <th className="py-4 px-3 text-right">Precio</th>
                <th className="py-4 px-3 text-right">Stock Actual</th>
                <th className="py-4 px-3 text-right">Mínimo</th>
                <th className="py-4 px-3 text-center">Estado</th>
                <th className="py-4 px-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <Loader2 className="size-8 animate-spin text-green-600 mx-auto" />
                    <p className="text-sm text-gray-500 mt-2 font-medium">Cargando productos...</p>
                  </td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className={`transition-colors group ${item.inhabilitado ? 'bg-gray-50/50 opacity-70' : 'hover:bg-green-50/10'}`}>
                    <td className="py-4 px-3 text-sm font-semibold text-black">
                      {item.nombre}
                    </td>
                    <td className="py-4 px-3 text-right text-sm font-bold text-gray-700">
                      ${parseFloat(item.precio).toLocaleString()}
                    </td>
                    <td className="py-4 px-3 text-right text-sm font-bold text-black">
                      {item.stock_actual}
                    </td>
                    <td className="py-4 px-3 text-right text-xs font-semibold text-gray-400">
                      {item.stock_minimo}
                    </td>
                    <td className="py-4 px-3 text-center">
                      {item.inhabilitado ? (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-600 border border-gray-200">
                          Inhabilitado
                        </span>
                      ) : item.stock_actual <= 0 ? (
                        <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-100">
                          Agotado
                        </span>
                      ) : item.stock_actual <= item.stock_minimo ? (
                        <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-100 animate-pulse">
                          Stock Bajo
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                          Suficiente
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Editar Producto"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar Producto"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs font-medium text-gray-500">
                    No se encontraron productos que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-black">
                {editingId ? "Editar Producto" : "Registrar Nuevo Producto"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={formLoading}
              >
                <X className="size-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
              {formError && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-2">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Nombre del Producto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl border ${fieldErrors.nombre ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-600'} bg-gray-50/50 px-4 py-2.5 text-sm text-black focus:bg-white focus:outline-hidden transition-all`}
                    placeholder="Ej. Mezcla Premium Res"
                    disabled={formLoading}
                  />
                  {fieldErrors.nombre && <p className="text-red-500 text-xs mt-1 font-medium">{Array.isArray(fieldErrors.nombre) ? fieldErrors.nombre[0] : fieldErrors.nombre}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Precio <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border ${fieldErrors.precio ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-600'} bg-gray-50/50 pl-8 pr-4 py-2.5 text-sm text-black focus:bg-white focus:outline-hidden transition-all`}
                      placeholder="0.00"
                      disabled={formLoading}
                    />
                  </div>
                  {fieldErrors.precio && <p className="text-red-500 text-xs mt-1 font-medium">{Array.isArray(fieldErrors.precio) ? fieldErrors.precio[0] : fieldErrors.precio}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Descripción (opcional)
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full rounded-xl border ${fieldErrors.descripcion ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-600'} bg-gray-50/50 px-4 py-2.5 text-sm text-black focus:bg-white focus:outline-hidden transition-all`}
                    placeholder="Descripción para el catálogo (opcional)"
                    disabled={formLoading}
                  />
                  {fieldErrors.descripcion && <p className="text-red-500 text-xs mt-1 font-medium">{Array.isArray(fieldErrors.descripcion) ? fieldErrors.descripcion[0] : fieldErrors.descripcion}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                      Stock Actual
                    </label>
                    <input
                      type="number"
                      name="stock_actual"
                      value={formData.stock_actual}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full rounded-xl border ${fieldErrors.stock_actual && !editingId ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-600'} bg-gray-50/50 px-4 py-2.5 text-sm text-black focus:bg-white focus:outline-hidden transition-all ${editingId ? 'opacity-60 cursor-not-allowed bg-gray-100' : ''}`}
                      disabled={formLoading || !!editingId}
                    />
                    {editingId && <p className="text-gray-500 text-[10px] mt-1 font-medium">No modificable (gestionado por Producción)</p>}
                    {fieldErrors.stock_actual && !editingId && <p className="text-red-500 text-xs mt-1 font-medium">{Array.isArray(fieldErrors.stock_actual) ? fieldErrors.stock_actual[0] : fieldErrors.stock_actual}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                      Stock Mínimo
                    </label>
                    <input
                      type="number"
                      name="stock_minimo"
                      value={formData.stock_minimo}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full rounded-xl border ${fieldErrors.stock_minimo ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-600'} bg-gray-50/50 px-4 py-2.5 text-sm text-black focus:bg-white focus:outline-hidden transition-all`}
                      disabled={formLoading}
                    />
                    {fieldErrors.stock_minimo && <p className="text-red-500 text-xs mt-1 font-medium">{Array.isArray(fieldErrors.stock_minimo) ? fieldErrors.stock_minimo[0] : fieldErrors.stock_minimo}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="inhabilitado"
                    name="inhabilitado"
                    checked={formData.inhabilitado}
                    onChange={handleInputChange}
                    className="size-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                    disabled={formLoading}
                  />
                  <label htmlFor="inhabilitado" className="text-sm font-medium text-gray-700">
                    Producto inhabilitado (no visible en tienda)
                  </label>
                </div>
                {fieldErrors.inhabilitado && <p className="text-red-500 text-xs font-medium">{Array.isArray(fieldErrors.inhabilitado) ? fieldErrors.inhabilitado[0] : fieldErrors.inhabilitado}</p>}
              </div>

              <div className="mt-8 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-green-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    editingId ? 'Guardar Cambios' : 'Guardar Producto'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="size-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Eliminar Producto</h3>
            <p className="text-sm text-gray-500 mb-6">
              ¿Está seguro de que desea eliminar <strong>{productToDelete?.nombre}</strong>? Esta acción no se puede deshacer.
            </p>
            
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                disabled={deleteLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-red-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}