import Link from 'next/link';
import { mediaUrl } from '@/lib/strapi';
import { discountPercent, formatPrice } from '@/lib/format';
import ProductImage from './ProductImage';

export default function ProductCard({ product }) {
  const image = mediaUrl(product.images?.[0], 'small');
  const discount = discountPercent(product.price, product.oldPrice);

  return (
    <Link href={`/telefoni/${product.slug}`} className="card">
      <div className="card__image">
        {discount > 0 && <span className="badge badge--sale">-{discount}%</span>}
        <ProductImage src={image} alt={product.name} />
      </div>
      <div className="card__body">
        {product.brand && <span className="card__brand">{product.brand.name}</span>}
        <h3 className="card__title">{product.name}</h3>
        {product.shortDescription && <p className="card__desc">{product.shortDescription}</p>}
        <div className="card__footer">
          <div>
            {discount > 0 && <span className="price-old">{formatPrice(product.oldPrice)}</span>}
            <span className="price">{formatPrice(product.price)}</span>
          </div>
          <span className={product.stock > 0 ? 'stock stock--in' : 'stock stock--out'}>
            {product.stock > 0 ? 'Na stanju' : 'Rasprodato'}
          </span>
        </div>
      </div>
    </Link>
  );
}
