import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container empty">
      <h1>Stranica nije pronadjena</h1>
      <p className="muted">Proizvod ili stranica koju trazite ne postoji.</p>
      <Link href="/telefoni" className="btn btn--primary">
        Nazad na ponudu
      </Link>
    </div>
  );
}
