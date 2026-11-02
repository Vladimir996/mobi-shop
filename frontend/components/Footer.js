import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <div className="logo">
            <span className="logo__mark">◆</span> MobiShop
          </div>
          <p className="muted">Mobilni telefoni i oprema po najboljim cenama. Isporuka na teritoriji cele Srbije.</p>
        </div>
        <div>
          <h4>Prodavnica</h4>
          <Link href="/telefoni">Svi proizvodi</Link>
          <Link href="/telefoni?sortiraj=cena-rastuce">Najpovoljnije</Link>
          <Link href="/korpa">Korpa</Link>
        </div>
        <div>
          <h4>Kontakt</h4>
          <span>011 123 4567</span>
          <span>info@mobishop.rs</span>
          <span>Pon–Sub: 09–20h</span>
        </div>
      </div>
      <div className="container footer__bottom muted">© {new Date().getFullYear()} MobiShop. Sva prava zadrzana.</div>
    </footer>
  );
}
