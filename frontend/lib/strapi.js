export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';

/**
 * GET zahtev ka Strapi REST API-ju.
 * `params` je obican objekat sa kljucevima u Strapi formatu, npr.
 * { 'filters[brand][slug][$eq]': 'apple', 'sort[0]': 'price:asc' }
 */
export async function strapiGet(path, params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') query.append(key, value);
  }

  const res = await fetch(`${STRAPI_URL}/api${path}?${query}`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`Strapi greska ${res.status} za ${path}`);
  }
  return res.json();
}

// `format` = Strapi umanjena verzija: 'thumbnail' | 'small' | 'medium' | 'large' (ako postoji)
export function mediaUrl(media, format) {
  const url = (format && media?.formats?.[format]?.url) || media?.url;
  if (!url) return null;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

export const SORT_OPTIONS = {
  novo: 'createdAt:desc',
  'cena-rastuce': 'price:asc',
  'cena-opadajuce': 'price:desc',
  naziv: 'name:asc',
};

export async function getProducts({ brand, category, search, sort, page = 1, featured, pageSize = 12 } = {}) {
  return strapiGet('/products', {
    populate: '*',
    'filters[brand][slug][$eq]': brand,
    'filters[category][slug][$eq]': category,
    'filters[name][$containsi]': search,
    'filters[featured][$eq]': featured ? 'true' : undefined,
    'sort[0]': SORT_OPTIONS[sort] || SORT_OPTIONS.novo,
    'pagination[page]': page,
    'pagination[pageSize]': pageSize,
  });
}

export async function getProductBySlug(slug) {
  const json = await strapiGet('/products', {
    populate: '*',
    'filters[slug][$eq]': slug,
  });
  return json.data?.[0] ?? null;
}

export async function getBrands() {
  const json = await strapiGet('/brands', { populate: 'logo', 'sort[0]': 'name:asc' });
  return json.data ?? [];
}

export async function getCategories() {
  const json = await strapiGet('/categories', { 'sort[0]': 'name:asc' });
  return json.data ?? [];
}

export async function createOrder(data) {
  const res = await fetch(`${STRAPI_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error?.message || 'Porudzbina nije uspela. Pokusajte ponovo.');
  }
  return json.data;
}
