'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'prodavnica-korpa';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved)) setItems(saved);
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const value = useMemo(() => {
    const addItem = (product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.documentId === product.documentId);
        if (existing) {
          return prev.map((i) =>
            i.documentId === product.documentId
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
              : i,
          );
        }
        return [...prev, { ...product, quantity: Math.min(quantity, product.stock) }];
      });
    };

    const updateQuantity = (documentId, quantity) => {
      setItems((prev) =>
        prev
          .map((i) => (i.documentId === documentId ? { ...i, quantity: Math.min(quantity, i.stock) } : i))
          .filter((i) => i.quantity > 0),
      );
    };

    const removeItem = (documentId) => setItems((prev) => prev.filter((i) => i.documentId !== documentId));
    const clear = () => setItems([]);

    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const total = items.reduce((sum, i) => sum + i.quantity * Number(i.price), 0);

    return { items, loaded, count, total, addItem, updateQuantity, removeItem, clear };
  }, [items, loaded]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart mora biti unutar <CartProvider>');
  return ctx;
}
