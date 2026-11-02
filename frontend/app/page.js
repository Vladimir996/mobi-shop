import Link from 'next/link';
import { getBrands, getCategories, getProducts } from '@/lib/strapi';
import ProductCard from '@/components/ProductCard';
import CategoryIcon from '@/components/CategoryIcon';
import BackendError from '@/components/BackendError';

export default async function HomePage() {
  let featured = [];
  let brands = [];
  let categories = [];
  try {
    const [featuredRes, brandList, categoryList] = await Promise.all([
      getProducts({ featured: true, pageSize: 8 }),
      getBrands(),
      getCategories(),
    ]);
    featured = featuredRes.data ?? [];
    brands = brandList;
    categories = categoryList;
  } catch {
    return <BackendError />;
  }

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div>
            <span className="hero__eyebrow">Nova kolekcija 2026</span>
            <h1>Pronadji telefon koji ti odgovara</h1>
            <p>
              Najnoviji modeli vodecih brendova, garancija 24 meseca i besplatna dostava za porudzbine preko 10.000
              RSD.
            </p>
            <div className="hero__actions">
              <Link href="/telefoni" className="btn btn--primary btn--lg">
                Pogledaj ponudu
              </Link>
              <Link href="/telefoni?sortiraj=cena-rastuce" className="btn btn--ghost btn--lg">
                Najpovoljniji modeli
              </Link>
            </div>
          </div>
          <div className="hero__visual" aria-hidden>
            <div className="hero__phone hero__phone--back" />
            <div className="hero__phone" />
          </div>
        </div>
      </section>

      <section className="container perks">
        <div className="perk">
          <strong>Besplatna dostava</strong>
          <span>za porudzbine preko 10.000 RSD</span>
        </div>
        <div className="perk">
          <strong>Garancija 24 meseca</strong>
          <span>na sve telefone</span>
        </div>
        <div className="perk">
          <strong>Placanje pouzecem</strong>
          <span>platite kada stigne</span>
        </div>
        <div className="perk">
          <strong>Povrat 14 dana</strong>
          <span>bez dodatnih pitanja</span>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="container section">
          <h2 className="section__title">Kategorije</h2>
          <div className="categories">
            {categories.map((category) => (
              <Link key={category.documentId} href={`/telefoni?kategorija=${category.slug}`} className="category-tile">
                <span className="category-tile__icon">
                  <CategoryIcon slug={category.slug} />
                </span>
                <span className="category-tile__name">{category.name}</span>
                <span className="category-tile__arrow">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {brands.length > 0 && (
        <section className="container section">
          <h2 className="section__title">Brendovi</h2>
          <div className="brands">
            {brands.map((brand) => (
              <Link key={brand.documentId} href={`/telefoni?brend=${brand.slug}`} className="brand-chip">
                {brand.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container section">
        <div className="section__head">
          <h2 className="section__title">Izdvojeni proizvodi</h2>
          <Link href="/telefoni" className="link">
            Svi proizvodi →
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="grid">
            {featured.map((product) => (
              <ProductCard key={product.documentId} product={product} />
            ))}
          </div>
        ) : (
          <p className="muted">Trenutno nema izdvojenih proizvoda.</p>
        )}
      </section>
    </>
  );
}
