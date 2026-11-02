'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';

const NAV = [
  { href: '/', label: 'Pocetna' },
  { href: '/telefoni', label: 'Telefoni' },
  { href: '/telefoni?kategorija=slusalice', label: 'Slusalice' },
  { href: '/telefoni?kategorija=punjaci-i-kablovi', label: 'Oprema' },
];

export default function Header() {
  const { count } = useCart();
  const pathname = usePathname();

  return (
    <header className="header">
      <div className="container header__inner">
        <Link href="/" className="logo">
          <span className="logo__mark">◆</span> MobiShop
        </Link>

        <nav className="nav">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'nav__link nav__link--active' : 'nav__link'}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action="/telefoni" className="search">
          <input type="search" name="pretraga" placeholder="Pretrazi telefone..." aria-label="Pretraga" />
        </form>

        <Link href="/korpa" className="cart-link" aria-label="Korpa">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          {count > 0 && <span className="cart-link__badge">{count}</span>}
        </Link>
      </div>
    </header>
  );
}
