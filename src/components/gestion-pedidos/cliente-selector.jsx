import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export function ClienteSelector({ value, onChange, disabled }) {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [texto, setTexto] = useState("");
  const [mostrarResultados, setMostrarResultados] = useState(false);

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const token = localStorage.getItem("access");

        const data = await apiRequest("/api/usuarios/clientes/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setClientes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    };

    cargarClientes();
  }, []);

  const clienteSeleccionado = clientes.find(
    (cliente) => String(cliente.id) === String(value)
  );

  useEffect(() => {
    if (clienteSeleccionado) {
      setTexto(
        `${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`
      );
    }
  }, [clienteSeleccionado]);

  const clientesFiltrados = clientes.filter((cliente) => {
    const textoBusqueda =
      `${cliente.nombre} ${cliente.apellido} ${cliente.correo}`.toLowerCase();

    return textoBusqueda.includes(busqueda.toLowerCase());
  });

  return (
    <div className="space-y-3">
      <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700">
        Cliente
      </label>

      <div className="relative">
        <input
          type="text"
          value={texto}
          placeholder="Buscar cliente..."
          disabled={disabled}
          onFocus={() => setMostrarResultados(true)}
          onChange={(e) => {
            const valor = e.target.value;

            setTexto(valor);
            setBusqueda(valor);
            setMostrarResultados(true);

            onChange("");
          }}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-600 focus:outline-none"
        />

        {mostrarResultados && busqueda.trim() && (
          <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <button
                  key={cliente.id}
                  type="button"
                  onClick={() => {
                    onChange(String(cliente.id));

                    setTexto(
                      `${cliente.nombre} ${cliente.apellido}`
                    );

                    setBusqueda("");
                    setMostrarResultados(false);
                  }}
                  className="block w-full border-b border-gray-100 px-4 py-3 text-left hover:bg-green-50"
                >
                  <p className="font-semibold text-sm text-black">
                    {cliente.nombre} {cliente.apellido}
                  </p>

                  <p className="text-xs text-gray-500">
                    {cliente.correo}
                  </p>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">
                No se encontraron clientes
              </div>
            )}
          </div>
        )}
      </div>

      {clienteSeleccionado && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-green-700">
            Cliente seleccionado
          </p>

          <p className="mt-1 font-semibold text-green-900">
            {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
          </p>

          <p className="text-xs text-green-700">
            {clienteSeleccionado.correo}
          </p>
        </div>
      )}
    </div>
  );
}