export default function BackendError() {
  return (
    <div className="container empty">
      <h2>Prodavnica trenutno nije dostupna</h2>
      <p className="muted">
        Ne mogu da se povezem sa Strapi backend-om. Proverite da li je pokrenut (<code>npm run develop</code> u{' '}
        <code>backend</code> folderu) i da li je MySQL aktivan.
      </p>
    </div>
  );
}
