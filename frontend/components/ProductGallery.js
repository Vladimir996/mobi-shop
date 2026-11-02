'use client';

import { useState } from 'react';
import ProductImage from './ProductImage';

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="gallery">
      <div className="gallery__main">
        <ProductImage src={current?.src} alt={current?.alt || name} />
      </div>
      {images.length > 1 && (
        <div className="gallery__thumbs">
          {images.map((img, i) => (
            <button
              key={img.src}
              className={i === active ? 'gallery__thumb gallery__thumb--active' : 'gallery__thumb'}
              onClick={() => setActive(i)}
              aria-label={`Slika ${i + 1}`}
            >
              <ProductImage src={img.thumb || img.src} alt={img.alt} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
