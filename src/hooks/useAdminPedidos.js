import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminPedidosService } from '@/services/admin-pedidos.service';
import { toast } from 'sonner';

const DEFAULT_FILTERS = {
  search: '',
  estado: 'todos',
  usuarioId: '',
  soloCredito: false,
  ordering: 'fecha_desc',
};

function normalizeListResponse(data) {
  if (Array.isArray(data)) {
    return { results: data, count: data.length, next: null, previous: null };
  }
  return {
    results: data?.results ?? [],
    count: data?.count ?? (data?.results?.length ?? 0),
    next: data?.next ?? null,
    previous: data?.previous ?? null,
  };
}

function getPedidoFecha(pedido) {
  return pedido.fecha_creacion || pedido.created_at || pedido.fecha || '';
}

export function useAdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [count, setCount] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [previousUrl, setPreviousUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const fetchPedidos = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const query = { page: pageNum };
      if (filters.estado !== 'todos') query.estado = filters.estado;
      if (filters.usuarioId) query.usuario = filters.usuarioId;
      if (filters.soloCredito) query.con_credito = 'true';
      if (filters.search) query.search = filters.search;
      if (filters.ordering === 'fecha_desc') query.ordering = '-fecha_creacion';
      if (filters.ordering === 'fecha_asc') query.ordering = 'fecha_creacion';

      const data = await adminPedidosService.listPedidos(query);
      const normalized = normalizeListResponse(data);
      setPedidos(normalized.results);
      setCount(normalized.count);
      setNextUrl(normalized.next);
      setPreviousUrl(normalized.previous);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching admin pedidos:', err);
      const msg = err.message || 'No se pudieron cargar los pedidos';
      setError(msg);
      toast.error(msg);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPedidos(1);
  }, [fetchPedidos]);

  const filteredPedidos = useMemo(() => {
    let list = [...pedidos];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((p) => {
        const num = String(p.numero_pedido ?? p.id ?? '');
        const cliente = (p.cliente_nombre || p.usuario_nombre || p.cliente?.nombre || '').toLowerCase();
        const correo = (p.cliente_correo || p.usuario_correo || p.cliente?.correo || '').toLowerCase();
        return num.includes(q) || cliente.includes(q) || correo.includes(q);
      });
    }

    if (filters.estado !== 'todos') {
      list = list.filter((p) => {
        const est = (p.estado_pago || p.estado || '').toLowerCase();
        return est === filters.estado.toLowerCase();
      });
    }

    if (filters.soloCredito) {
      list = list.filter((p) => p.credito_id || p.tiene_credito || p.tipo_pago === 'credito');
    }

    if (filters.usuarioId) {
      list = list.filter((p) => {
        const uid = p.usuario_id || p.usuario?.id || p.cliente_id;
        return String(uid) === String(filters.usuarioId);
      });
    }

    list.sort((a, b) => {
      const da = new Date(getPedidoFecha(a)).getTime();
      const db = new Date(getPedidoFecha(b)).getTime();
      return filters.ordering === 'fecha_asc' ? da - db : db - da;
    });

    return list;
  }, [pedidos, filters]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const crearPedidoManual = useCallback(async (body) => {
    try {
      setActionLoading(true);
      const response = await adminPedidosService.crearPedidoManual(body);
      toast.success('Pedido manual registrado correctamente');
      await fetchPedidos(page);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.message || 'Error al crear el pedido manual';
      toast.error(msg);
      return { success: false, error: msg, fieldErrors: err.data };
    } finally {
      setActionLoading(false);
    }
  }, [fetchPedidos, page]);

  const confirmarPago = useCallback(async (pedidoId) => {
    try {
      setActionLoading(true);
      await adminPedidosService.confirmarPago(pedidoId);
      toast.success('Pago confirmado. Pedido aprobado.');
      await fetchPedidos(page);
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'No se pudo confirmar el pago');
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  }, [fetchPedidos, page]);

  const cancelarPedido = useCallback(async (pedidoId) => {
    try {
      setActionLoading(true);
      await adminPedidosService.cancelarPedido(pedidoId);
      toast.success('Pedido cancelado.');
      await fetchPedidos(page);
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'No se pudo cancelar el pedido');
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  }, [fetchPedidos, page]);

  return {
    pedidos: filteredPedidos,
    count,
    nextUrl,
    previousUrl,
    page,
    loading,
    actionLoading,
    error,
    filters,
    updateFilter,
    clearFilters,
    fetchPedidos,
    setPage,
    crearPedidoManual,
    confirmarPago,
    cancelarPedido,
  };
}
