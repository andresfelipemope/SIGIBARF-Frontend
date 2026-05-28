"use client";

import { AlertTriangle, Boxes, Droplets } from "lucide-react";

export default function ProduccionAlerts({ ingredientes, productos }) {
  // Take top 5 ingredients in critical condition
  const criticos = ingredientes
    .filter(i => parseFloat(i.stock_actual) <= parseFloat(i.stock_minimo))
    .sort((a, b) => parseFloat(a.stock_actual) - parseFloat(b.stock_actual))
    .slice(0, 5);

  const productosBajos = productos
    .filter(p => !p.inhabilitado && p.stock_actual <= p.stock_minimo)
    .sort((a, b) => a.stock_actual - b.stock_actual)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Alertas Ingredientes */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs h-full">
        <h3 className="text-base font-extrabold text-black mb-4 flex items-center gap-2">
          <Droplets className="size-4 text-orange-500" />
          Ingredientes Críticos
        </h3>
        
        {criticos.length > 0 ? (
          <div className="space-y-4">
            {criticos.map(i => {
              const current = parseFloat(i.stock_actual);
              const minimum = parseFloat(i.stock_minimo);
              const isZero = current <= 0;
              
              return (
                <div key={i.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{i.nombre}</h4>
                    <span className="text-xs font-medium text-gray-500">Mínimo requerido: {minimum} {i.unidad_medida}</span>
                  </div>
                  <div className={`text-right ${isZero ? 'text-rose-600' : 'text-orange-600'}`}>
                    <span className="text-sm font-extrabold">{current}</span>
                    <span className="text-[10px] font-bold ml-1 uppercase">{i.unidad_medida}</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-start gap-2">
            <AlertTriangle className="size-4 shrink-0 mt-0.5 opacity-70" />
            <p className="text-xs font-semibold">Todos los ingredientes tienen stock suficiente.</p>
          </div>
        )}
      </div>

      {/* Alertas Productos */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs h-full">
        <h3 className="text-base font-extrabold text-black mb-4 flex items-center gap-2">
          <Boxes className="size-4 text-rose-500" />
          Productos por Agotarse
        </h3>
        
        {productosBajos.length > 0 ? (
          <div className="space-y-4">
            {productosBajos.map(p => {
              const isZero = p.stock_actual <= 0;
              
              return (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{p.nombre}</h4>
                    <span className="text-xs font-medium text-gray-500">Mínimo: {p.stock_minimo} uds</span>
                  </div>
                  <div className={`text-right ${isZero ? 'text-rose-600' : 'text-orange-600'}`}>
                    <span className="text-sm font-extrabold">{p.stock_actual}</span>
                    <span className="text-[10px] font-bold ml-1 uppercase">Uds</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-start gap-2">
            <AlertTriangle className="size-4 shrink-0 mt-0.5 opacity-70" />
            <p className="text-xs font-semibold">El stock de productos finales está en niveles óptimos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
