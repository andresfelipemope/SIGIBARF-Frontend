import { useState, useEffect, useCallback, useMemo } from 'react';
import { creditosService } from '@/services/creditos.service';
import { toast } from 'sonner';

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

export function useCreditos() {
  const [creditos, setCreditos] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchCreditos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await creditosService.listCreditos();
      const normalized = normalizeListResponse(data);
      setCreditos(normalized.results);
      setCount(normalized.count);
    } catch (err) {
      const msg = err.message || 'No se pudieron cargar los créditos';
      setError(msg);
      toast.error(msg);
      setCreditos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreditos();
  }, [fetchCreditos]);

  const filteredCreditos = useMemo(() => {
    if (!search.trim()) return creditos;
    const q = search.toLowerCase();
    return creditos.filter((c) => {
      const cliente = (c.cliente_nombre || c.usuario_nombre || '').toLowerCase();
      const pedido = String(c.pedido_numero ?? c.numero_pedido ?? c.pedido_id ?? '');
      return cliente.includes(q) || pedido.includes(q);
    });
  }, [creditos, search]);

  return {
    creditos: filteredCreditos,
    count,
    loading,
    error,
    search,
    setSearch,
    refetch: fetchCreditos,
  };
}
