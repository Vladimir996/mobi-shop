'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';

export default function AddToCartButton({ product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (product.stock < 1) {
    return (
      <button className="btn btn--primary btn--lg" disabled>
        Trenutno nije dostupno
      </button>
    );
  }

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="add-to-cart">
      <div className="qty">
        <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Manje">
          −
        </button>
        <span>{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          aria-label="Vise"
        >
          +
        </button>
      </div>
      <button className="btn btn--primary btn--lg" onClick={handleAdd}>
        {added ? '✓ Dodato u korpu' : 'Dodaj u korpu'}
      </button>
    </div>
  );
}
