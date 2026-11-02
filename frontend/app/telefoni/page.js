import Link from 'next/link';
import { Suspense } from 'react';
import { getBrands, getCategories, getProducts } from '@/lib/strapi';
import ProductCard from '@/components/ProductCard';
import SortSelect from '@/components/SortSelect';
import BackendError from '@/components/BackendError';

export const metadata = { title: 'Telefoni' };

function buildHref(current, changes) {
  const params = new URLSearchParams();
  const merged = { ...current, ...changes };
  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `/telefoni?${qs}` : '/telefoni';
}

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const current = {
    brend: sp.brend || '',
    kategorija: sp.kategorija || '',
    pretraga: sp.pretraga || '',
    sortiraj: sp.sortiraj || '',
  };
  const page = Math.max(1, Number.parseInt(sp.strana, 10) || 1);

  let products, brands, categories;
  try {
    [products, brands, categories] = await Promise.all([
      getProducts({
        brand: current.brend,
        category: current.kategorija,
        search: current.pretraga,
        sort: current.sortiraj,
        page,
      }),
      getBrands(),
      getCategories(),
    ]);
  } catch {
    return <BackendError />;
  }

  const items = products.data ?? [];
  const pagination = products.meta?.pagination ?? { page: 1, pageCount: 1, total: items.length };

  return (
    <div className="container shop">
      <aside className="filters">
        <div className="filters__group">
          <h4>Kategorije</h4>
          <Link href={buildHref(current, { kategorija: '' })} className={!current.kategorija ? 'active' : ''}>
            Sve kategorije
          </Link>
          {categories.map((c) => (
            <Link
              key={c.documentId}
              href={buildHref(current, { kategorija: c.slug })}
              className={current.kategorija === c.slug ? 'active' : ''}
            >
              {c.name}
            </Link>
          ))}
        </div>
        <div className="filters__group">
          <h4>Brendovi</h4>
          <Link href={buildHref(current, { brend: '' })} className={!current.brend ? 'active' : ''}>
            Svi brendovi
          </Link>
          {brands.map((b) => (
            <Link
              key={b.documentId}
              href={buildHref(current, { brend: b.slug })}
              className={current.brend === b.slug ? 'active' : ''}
            >
              {b.name}
            </Link>
          ))}
        </div>
      </aside>

      <section>
        <div className="shop__toolbar">
          <div>
            <h1 className="shop__title">
              {current.pretraga ? `Rezultati za „${current.pretraga}“` : 'Svi proizvodi'}
            </h1>
            <span className="muted">{pagination.total} proizvoda</span>
          </div>
          <Suspense>
            <SortSelect />
          </Suspense>
        </div>

        {items.length > 0 ? (
          <div className="grid grid--3">
            {items.map((product) => (
              <ProductCard key={product.documentId} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>Nema proizvoda za izabrane filtere</h3>
            <Link href="/telefoni" className="btn btn--ghost">
              Ponisti filtere
            </Link>
          </div>
        )}

        {pagination.pageCount > 1 && (
          <nav className="pagination">
            {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={buildHref(current, { strana: p > 1 ? String(p) : '' })}
                className={p === pagination.page ? 'active' : ''}
              >
                {p}
              </Link>
            ))}
          </nav>
        )}
      </section>
    </div>
  );
}
