import { useState, useEffect, useCallback } from 'react';
import { creditosService } from '@/services/creditos.service';
import { toast } from 'sonner';

export function useCreditoDetalle(creditoId) {
  const [credito, setCredito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCredito = useCallback(async () => {
    if (!creditoId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await creditosService.getCredito(creditoId);
      setCredito(data);
    } catch (err) {
      const msg = err.message || 'No se pudo cargar el crédito';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [creditoId]);

  useEffect(() => {
    fetchCredito();
  }, [fetchCredito]);

  const guardarObservaciones = useCallback(async (observaciones) => {
    try {
      setActionLoading(true);
      const data = await creditosService.patchObservaciones(creditoId, observaciones);
      setCredito(data);
      toast.success('Observaciones actualizadas');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Error al guardar observaciones');
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  }, [creditoId]);

  const eliminarCredito = useCallback(async () => {
    try {
      setActionLoading(true);
      await creditosService.deleteCredito(creditoId);
      toast.success('Crédito eliminado');
      return { success: true };
    } catch (err) {
      const msg = err.data?.detail || err.message || 'No se pudo eliminar el crédito';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  }, [creditoId]);

  const registrarPago = useCallback(async (monto) => {
    try {
      setActionLoading(true);
      const data = await creditosService.registrarPago(creditoId, monto);
      await fetchCredito();
      toast.success('Pago registrado correctamente');
      return { success: true, data };
    } catch (err) {
      toast.error(err.message || 'Error al registrar el pago');
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  }, [creditoId, fetchCredito]);

  return {
    credito,
    loading,
    actionLoading,
    error,
    refetch: fetchCredito,
    guardarObservaciones,
    eliminarCredito,
    registrarPago,
  };
}
