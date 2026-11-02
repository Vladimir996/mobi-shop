import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, mediaUrl } from '@/lib/strapi';
import { discountPercent, formatPrice } from '@/lib/format';
import AddToCartButton from '@/components/AddToCartButton';
import ProductGallery from '@/components/ProductGallery';
import Markdown from '@/components/Markdown';
import BackendError from '@/components/BackendError';

const SPECS = [
  ['screen', 'Ekran'],
  ['processor', 'Procesor'],
  ['ram', 'RAM memorija'],
  ['storage', 'Interna memorija'],
  ['camera', 'Kamera'],
  ['battery', 'Baterija'],
  ['os', 'Operativni sistem'],
  ['color', 'Boja'],
];

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (product) return { title: product.name, description: product.shortDescription };
  } catch {}
  return { title: 'Proizvod' };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch {
    return <BackendError />;
  }
  if (!product) notFound();

  const images = (product.images ?? []).map((img) => ({
    src: mediaUrl(img),
    thumb: mediaUrl(img, 'thumbnail'),
    alt: img.alternativeText || product.name,
  }));
  const discount = discountPercent(product.price, product.oldPrice);
  const specs = SPECS.filter(([key]) => product[key]);

  const cartProduct = {
    documentId: product.documentId,
    slug: product.slug,
    name: product.name,
    price: Number(product.price),
    stock: product.stock,
    image: images[0]?.thumb ?? null,
  };

  return (
    <div className="container product">
      <nav className="breadcrumbs">
        <Link href="/">Pocetna</Link> / <Link href="/telefoni">Telefoni</Link>
        {product.brand && (
          <>
            {' '}/ <Link href={`/telefoni?brend=${product.brand.slug}`}>{product.brand.name}</Link>
          </>
        )}
      </nav>

      <div className="product__grid">
        <ProductGallery images={images} name={product.name} />

        <div className="product__info">
          {product.brand && <span className="card__brand">{product.brand.name}</span>}
          <h1>{product.name}</h1>
          {product.shortDescription && <p className="product__lead">{product.shortDescription}</p>}

          <div className="product__price">
            <span className="price price--lg">{formatPrice(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="price-old">{formatPrice(product.oldPrice)}</span>
                <span className="badge badge--sale">-{discount}%</span>
              </>
            )}
          </div>

          <p className={product.stock > 0 ? 'stock stock--in' : 'stock stock--out'}>
            {product.stock > 0
              ? product.stock <= 5
                ? `Na stanju – jos samo ${product.stock} kom.`
                : 'Na stanju'
              : 'Rasprodato'}
          </p>

          <AddToCartButton product={cartProduct} />

          <ul className="product__perks">
            <li>✓ Garancija 24 meseca</li>
            <li>✓ Isporuka za 1–3 radna dana</li>
            <li>✓ Placanje pouzecem ili karticom</li>
          </ul>
        </div>
      </div>

      <div className="product__details">
        {specs.length > 0 && (
          <section>
            <h2>Specifikacije</h2>
            <table className="specs">
              <tbody>
                {specs.map(([key, label]) => (
                  <tr key={key}>
                    <th>{label}</th>
                    <td>{product[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {product.description && (
          <section>
            <h2>Opis</h2>
            <Markdown content={product.description} />
          </section>
        )}
      </div>
    </div>
  );
}
