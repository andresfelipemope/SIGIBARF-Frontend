import { AlertCircle, User } from "lucide-react";
import { usuariosAdminService } from "@/services/usuarios-admin.service";

/**
 * Selector de cliente para pedidos manuales.
 * Sin endpoint confirmado: permite ingresar ID manualmente.
 */
export function ClienteSelector({ value, onChange, disabled }) {
  const busquedaDisponible = usuariosAdminService.isBusquedaDisponible();

  if (!busquedaDisponible) {
    return (
      <div className="space-y-2">
        <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700">
          Cliente (ID de usuario) <span className="text-red-500">*</span>
        </label>
        <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50/50 p-3 mb-2">
          <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] font-semibold text-amber-800 leading-relaxed">
            El buscador de clientes estará disponible cuando el backend confirme el endpoint de usuarios.
            Ingresa el ID numérico del cliente registrado.
          </p>
        </div>
        <div className="relative">
          <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="number"
            min="1"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ej: 5"
            disabled={disabled}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-black focus:border-green-600 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700">
        Cliente <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre o correo..."
        disabled={disabled}
        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-black focus:border-green-600 focus:outline-hidden"
      />
    </div>
  );
}
