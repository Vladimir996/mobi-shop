'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import ProductImage from '@/components/ProductImage';
import { createOrder } from '@/lib/strapi';
import { formatPrice } from '@/lib/format';

const FREE_SHIPPING = 10000;
const SHIPPING_PRICE = 450;

export default function CartPage() {
  const { items, loaded, total, updateQuantity, removeItem, clear } = useCart();
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const shipping = total >= FREE_SHIPPING || total === 0 ? 0 : SHIPPING_PRICE;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('sending');
    const form = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const result = await createOrder({
        ...form,
        items: items.map((i) => ({ documentId: i.documentId, quantity: i.quantity })),
      });
      setOrder(result);
      clear();
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  };

  if (status === 'done') {
    return (
      <div className="container empty">
        <div className="success-icon">✓</div>
        <h1>Hvala na porudzbini!</h1>
        <p className="muted">
          Vasa porudzbina je primljena. Broj porudzbine: <strong>{order?.documentId}</strong>
          <br />
          Ukupno za placanje: <strong>{formatPrice(order?.total)}</strong> (+ dostava)
        </p>
        <Link href="/telefoni" className="btn btn--primary">
          Nastavi kupovinu
        </Link>
      </div>
    );
  }

  if (!loaded) return <div className="container section" />;

  if (items.length === 0) {
    return (
      <div className="container empty">
        <h1>Vasa korpa je prazna</h1>
        <p className="muted">Dodajte proizvode iz ponude da biste nastavili.</p>
        <Link href="/telefoni" className="btn btn--primary">
          Pogledaj telefone
        </Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className="shop__title">Korpa</h1>
      <div className="checkout">
        <div>
          <div className="cart-list">
            {items.map((item) => (
              <div key={item.documentId} className="cart-item">
                <Link href={`/telefoni/${item.slug}`} className="cart-item__image">
                  <ProductImage src={item.image} alt={item.name} />
                </Link>
                <div className="cart-item__info">
                  <Link href={`/telefoni/${item.slug}`} className="cart-item__name">
                    {item.name}
                  </Link>
                  <span className="muted">{formatPrice(item.price)} / kom</span>
                </div>
                <div className="qty">
                  <button onClick={() => updateQuantity(item.documentId, item.quantity - 1)} aria-label="Manje">
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.documentId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    aria-label="Vise"
                  >
                    +
                  </button>
                </div>
                <strong className="cart-item__total">{formatPrice(item.price * item.quantity)}</strong>
                <button className="cart-item__remove" onClick={() => removeItem(item.documentId)} aria-label="Ukloni">
                  ✕
                </button>
              </div>
            ))}
          </div>

          <form className="order-form" onSubmit={handleSubmit}>
            <h2>Podaci za dostavu</h2>
            <div className="form-grid">
              <label>
                Ime i prezime
                <input name="customerName" required autoComplete="name" />
              </label>
              <label>
                Telefon
                <input name="phone" type="tel" required autoComplete="tel" />
              </label>
              <label className="form-grid__full">
                Email
                <input name="email" type="email" required autoComplete="email" />
              </label>
              <label>
                Adresa
                <input name="address" required autoComplete="street-address" />
              </label>
              <label>
                Grad
                <input name="city" required autoComplete="address-level2" />
              </label>
              <label className="form-grid__full">
                Napomena (opciono)
                <textarea name="note" rows={3} />
              </label>
            </div>
            {error && <p className="form-error">{error}</p>}
            <button className="btn btn--primary btn--lg btn--block" disabled={status === 'sending'}>
              {status === 'sending' ? 'Slanje...' : 'Poruci (placanje pouzecem)'}
            </button>
          </form>
        </div>

        <aside className="summary">
          <h3>Pregled porudzbine</h3>
          <div className="summary__row">
            <span>Proizvodi</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="summary__row">
            <span>Dostava</span>
            <span>{shipping === 0 ? 'Besplatna' : formatPrice(shipping)}</span>
          </div>
          {shipping > 0 && (
            <p className="summary__hint">Jos {formatPrice(FREE_SHIPPING - total)} do besplatne dostave.</p>
          )}
          <div className="summary__row summary__total">
            <span>Ukupno</span>
            <span>{formatPrice(total + shipping)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
