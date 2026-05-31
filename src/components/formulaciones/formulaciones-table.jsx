"use client";

import { Edit, Eye, Trash2 } from "lucide-react";

export default function FormulacionesTable({
  formulaciones,
  productosMap,
  ingredientesMap,
  loading,
  onEdit,
  onDetail,
  onDelete,
}) {
  if (loading && formulaciones.length === 0) {
    return <TableSkeleton />;
  }

  if (!loading && formulaciones.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Producto</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Ingrediente</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Cantidad</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Porcentaje</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {formulaciones.map((f) => {
              const producto = productosMap[f.id_producto];
              const ingrediente = ingredientesMap[f.id_ingrediente];
              
              return (
                <tr key={f.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-700">
                          {producto?.nombre?.charAt(0)?.toUpperCase() || "P"}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {producto?.nombre || `Producto #${f.id_producto}`}
                        </p>
                        <p className="text-xs text-gray-400">ID: {f.id_producto}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-green-700">
                          {ingrediente?.nombre?.charAt(0)?.toUpperCase() || "I"}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {ingrediente?.nombre || `Ingrediente #${f.id_ingrediente}`}
                        </p>
                        <p className="text-xs text-gray-400">
                          {ingrediente?.unidad_medida || ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-800">
                      {parseFloat(f.cantidad_ingrediente).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-800">
                      {parseFloat(f.porcentaje_ingrediente).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onDetail(f)}
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                        title="Ver detalle"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        onClick={() => onEdit(f)}
                        className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        onClick={() => onDelete(f)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
            <div className="h-6 w-12 bg-gray-200 rounded-full" />
            <div className="flex gap-1">
              <div className="h-8 w-8 bg-gray-200 rounded-lg" />
              <div className="h-8 w-8 bg-gray-200 rounded-lg" />
              <div className="h-8 w-8 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
      <div className="mx-auto size-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
        <svg className="size-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 13.5h3.75m-3.75 0H6m10.5 0a2.25 2.25 0 01-2.25-2.25v-1.5m-6 3h12a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25v6a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Sin formulaciones</h3>
      <p className="mt-1 text-sm text-gray-500">
        Aún no has creado ninguna relación producto-ingrediente.
      </p>
      <p className="mt-4 text-xs text-gray-400">
        Haz clic en "Nueva Formulación" para comenzar.
      </p>
    </div>
  );
}