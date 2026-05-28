import { Loader2 } from "lucide-react";

export default function ProduccionLoading() {
  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-4 animate-fade-in">
      <div className="relative flex size-20 items-center justify-center rounded-2xl bg-orange-50/50">
        <div className="absolute inset-0 rounded-2xl border-4 border-orange-100/50"></div>
        <div className="absolute inset-0 rounded-2xl border-4 border-orange-500 border-t-transparent animate-spin"></div>
        <Loader2 className="size-8 text-orange-600 animate-pulse" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-extrabold text-black">
          Cargando Producción
        </h3>
        <p className="mt-1 text-sm font-medium text-gray-500">
          Preparando entorno de manufactura...
        </p>
      </div>
    </div>
  );
}
