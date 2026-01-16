import React, { createContext, useState, useCallback, useEffect } from 'react';
import { getCart, addToCart, removeFromCart, updateCartQuantity } from '../services/api';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCart(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getCart();
      setCart(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add item to cart
  const addItem = useCallback(async (productId, quantity) => {
    setError(null);
    try {
      const response = await addToCart({ productId, quantity });
      setCart(response.data.cart);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add to cart';
      setError(errorMsg);
      throw err;
    }
  }, []);

  // Remove item from cart
  const removeItem = useCallback(async (productId) => {
    setError(null);
    try {
      const response = await removeFromCart(productId);
      setCart(response.data.cart);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to remove from cart';
      setError(errorMsg);
      throw err;
    }
  }, []);

  // Update item quantity
  const updateQuantity = useCallback(async (productId, quantity) => {
    setError(null);
    try {
      const response = await updateCartQuantity(productId, { quantity });
      setCart(response.data.cart);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update quantity';
      setError(errorMsg);
      throw err;
    }
  }, []);

  // Calculate total price
  const getTotal = useCallback(() => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  // Get item count
  const getItemCount = useCallback(() => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        fetchCart,
        addItem,
        removeItem,
        updateQuantity,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
