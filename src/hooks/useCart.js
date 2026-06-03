"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cartService } from '@/services/cart.service';
import { requireCartAuth } from '@/lib/cart-auth';

export function useCart() {
  const router = useRouter();
  const [cartMap, setCartMap] = useState({});
  const [loadingCart, setLoadingCart] = useState(true);
  const [errorCart, setErrorCart] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({});

  const setItemPending = useCallback((productId, pending) => {
    setUpdatingItems((current) => {
      if (pending) {
        return { ...current, [productId]: true };
      }
      const next = { ...current };
      delete next[productId];
      return next;
    });
  }, []);

  const refreshCart = useCallback(async () => {
    setLoadingCart(true);
    setErrorCart(null);

    try {
      const map = await cartService.syncCart();
      setCartMap(map);
    } catch (error) {
      console.error('Cart sync failed:', error);
      setErrorCart(error.message || 'No fue posible cargar el carrito.');
    } finally {
      setLoadingCart(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const updateQuantity = useCallback(
    async ({ product, quantity }) => {
      const productId = product.id;
      if (quantity < 0) return false;

      const isInCart = Boolean(cartMap[productId]);
      if (!isInCart) return true;

      if (!requireCartAuth(router, toast)) return false;
      if (updatingItems[productId]) return false;

      setItemPending(productId, true);
      try {
        if (quantity === 0) {
          await cartService.removeCartItem(productId);
          toast.success('Producto eliminado del carrito');
        } else {
          await cartService.updateCartItem(productId, quantity);
          toast.success('Cantidad actualizada');
        }

        const synced = await cartService.syncCart();
        setCartMap(synced);
        return true;
      } catch (error) {
        console.error('Cart quantity update failed:', error);
        if (error.status === 401) {
          requireCartAuth(router, toast);
          return false;
        }
        toast.error('No fue posible actualizar el carrito');
        return false;
      } finally {
        setItemPending(productId, false);
      }
    },
    [cartMap, router, updatingItems, setItemPending]
  );

  const addToCart = useCallback(
    async ({ product, quantity }) => {
      const productId = product.id;
      if (quantity < 1) return false;

      if (!requireCartAuth(router, toast)) return false;
      if (updatingItems[productId]) return false;

      setItemPending(productId, true);
      try {
        if (cartMap[productId]) {
          await cartService.updateCartItem(productId, quantity);
          toast.success('Cantidad actualizada');
        } else {
          await cartService.addToCart(productId, quantity);
          toast.success('Producto agregado al carrito');
        }

        const synced = await cartService.syncCart();
        setCartMap(synced);
        return true;
      } catch (error) {
        console.error('Cart add failed:', error);
        if (error.status === 401) {
          requireCartAuth(router, toast);
          return false;
        }
        toast.error('No fue posible actualizar el carrito');
        return false;
      } finally {
        setItemPending(productId, false);
      }
    },
    [cartMap, router, updatingItems, setItemPending]
  );

  return {
    cartMap,
    loadingCart,
    errorCart,
    updatingItems,
    refreshCart,
    updateQuantity,
    addToCart,
  };
}
