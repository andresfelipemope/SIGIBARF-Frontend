import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingTable() {
  return (
    <div className="space-y-4">
      {/* Table Skeletons */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <Skeleton className="h-9 w-64 rounded-xl bg-gray-100 animate-pulse" />
          <Skeleton className="h-9 w-32 rounded-xl bg-gray-100 animate-pulse" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50/30">
                <th className="py-4 px-3 w-16">ID</th>
                <th className="py-4 px-3 w-64">Producto</th>
                <th className="py-4 px-3 w-28">Tipo</th>
                <th className="py-4 px-3 w-24 text-right">Cantidad</th>
                <th className="py-4 px-3 w-32 text-right">Stock Pre/Post</th>
                <th className="py-4 px-3 w-40">Fecha</th>
                <th className="py-4 px-3 w-16 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((index) => (
                <tr key={index} className="transition-colors">
                  <td className="py-4 px-3">
                    <Skeleton className="h-4 w-8 rounded bg-gray-100 animate-pulse" />
                  </td>
                  <td className="py-4 px-3">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-48 rounded bg-gray-100 animate-pulse" />
                      <Skeleton className="h-3 w-32 rounded bg-gray-100 animate-pulse" />
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <Skeleton className="h-6 w-20 rounded-full bg-gray-100 animate-pulse" />
                  </td>
                  <td className="py-4 px-3 text-right">
                    <Skeleton className="h-4 w-12 rounded ml-auto bg-gray-100 animate-pulse" />
                  </td>
                  <td className="py-4 px-3 text-right">
                    <Skeleton className="h-4 w-20 rounded ml-auto bg-gray-100 animate-pulse" />
                  </td>
                  <td className="py-4 px-3">
                    <Skeleton className="h-4 w-32 rounded bg-gray-100 animate-pulse" />
                  </td>
                  <td className="py-4 px-3 text-center">
                    <Skeleton className="h-8 w-12 rounded-lg mx-auto bg-gray-100 animate-pulse" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
