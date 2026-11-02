/* eslint-disable @next/next/no-img-element */

// Obican <img> jer next/image u Next 16 ne optimizuje slike sa lokalnih adresa (localhost:1338)
export default function ProductImage({ src, alt, className = '' }) {
  if (!src) {
    return (
      <div className={`placeholder ${className}`} aria-label={alt}>
        <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="6" y="2" width="12" height="20" rx="2.5" />
          <line x1="10.5" y1="18.5" x2="13.5" y2="18.5" />
        </svg>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} loading="lazy" />;
}
