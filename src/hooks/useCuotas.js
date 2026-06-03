import { useState, useEffect, useCallback } from 'react';
import { creditosService } from '@/services/creditos.service';
import { toast } from 'sonner';

function normalizeListResponse(data) {
  if (Array.isArray(data)) return data;
  return data?.results ?? [];
}

export function useCuotas(creditoId) {
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCuotas = useCallback(async () => {
    if (!creditoId) {
      setCuotas([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await creditosService.listCuotas({ credito: creditoId });
      setCuotas(normalizeListResponse(data));
    } catch (err) {
      const msg = err.message || 'No se pudieron cargar las cuotas';
      setError(msg);
      toast.error(msg);
      setCuotas([]);
    } finally {
      setLoading(false);
    }
  }, [creditoId]);

  useEffect(() => {
    fetchCuotas();
  }, [fetchCuotas]);

  const toggleNotificaciones = useCallback(async (cuotaId, activas) => {
    try {
      await creditosService.toggleNotificacionesCuota(cuotaId, activas);
      toast.success(activas ? 'Notificaciones activadas' : 'Notificaciones desactivadas');
      await fetchCuotas();
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Error al actualizar notificaciones');
      return { success: false };
    }
  }, [fetchCuotas]);

  return {
    cuotas,
    loading,
    error,
    refetch: fetchCuotas,
    toggleNotificaciones,
  };
}
