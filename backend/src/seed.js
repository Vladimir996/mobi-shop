'use strict';

/**
 * Ubacuje pocetne podatke ako je baza prazna (nema nijednog brenda).
 * Slike proizvoda se dodaju kroz Strapi admin panel (Content Manager).
 */

const BRANDS = [
  { name: 'Apple', slug: 'apple' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Xiaomi', slug: 'xiaomi' },
  { name: 'Google', slug: 'google' },
  { name: 'Motorola', slug: 'motorola' },
];

const CATEGORIES = [
  { name: 'Pametni telefoni', slug: 'pametni-telefoni' },
  { name: 'Slusalice', slug: 'slusalice' },
  { name: 'Punjaci i kablovi', slug: 'punjaci-i-kablovi' },
];

const PRODUCTS = [
  {
    name: 'iPhone 17 Pro 256GB',
    brand: 'apple',
    category: 'pametni-telefoni',
    price: 164999,
    oldPrice: 174999,
    stock: 8,
    featured: true,
    shortDescription: 'Titanijumsko kuciste, A19 Pro cip i trostruka kamera od 48 MP.',
    description:
      'iPhone 17 Pro donosi **A19 Pro** cip, ProMotion ekran od 120 Hz i profesionalni sistem kamera.\n\n- Titanijumsko kuciste\n- USB-C sa USB 3 brzinom\n- Do 4K 120 fps snimanje',
    screen: '6.3" Super Retina XDR OLED, 120 Hz',
    processor: 'Apple A19 Pro',
    ram: '12 GB',
    storage: '256 GB',
    camera: '48 + 48 + 48 MP',
    battery: '3.988 mAh',
    os: 'iOS 26',
    color: 'Kosmicko narandzasta',
  },
  {
    name: 'iPhone 17 128GB',
    brand: 'apple',
    category: 'pametni-telefoni',
    price: 109999,
    stock: 15,
    featured: false,
    shortDescription: 'Svetao 120 Hz ekran i ceo dan baterije.',
    description: 'iPhone 17 sa A19 cipom, ProMotion ekranom i duplom kamerom od 48 MP.',
    screen: '6.3" OLED, 120 Hz',
    processor: 'Apple A19',
    ram: '8 GB',
    storage: '128 GB',
    camera: '48 + 48 MP',
    battery: '3.692 mAh',
    os: 'iOS 26',
    color: 'Plava',
  },
  {
    name: 'Samsung Galaxy S25 Ultra 512GB',
    brand: 'samsung',
    category: 'pametni-telefoni',
    price: 154999,
    oldPrice: 169999,
    stock: 6,
    featured: true,
    shortDescription: 'S Pen, kamera od 200 MP i Galaxy AI.',
    description:
      'Vrhunski Galaxy sa ugradjenom **S Pen** olovkom, kamerom od 200 MP i Snapdragon 8 Elite procesorom.',
    screen: '6.9" Dynamic AMOLED 2X, 120 Hz',
    processor: 'Snapdragon 8 Elite for Galaxy',
    ram: '12 GB',
    storage: '512 GB',
    camera: '200 + 50 + 50 + 10 MP',
    battery: '5.000 mAh',
    os: 'Android 15, One UI 7',
    color: 'Titanium Silverblue',
  },
  {
    name: 'Samsung Galaxy A56 5G 256GB',
    brand: 'samsung',
    category: 'pametni-telefoni',
    price: 49999,
    stock: 25,
    featured: true,
    shortDescription: 'Odlican odnos cene i kvaliteta, 6 godina azuriranja.',
    description: 'Galaxy A56 donosi Super AMOLED ekran, IP67 zastitu i brzo punjenje od 45 W.',
    screen: '6.7" Super AMOLED, 120 Hz',
    processor: 'Exynos 1580',
    ram: '8 GB',
    storage: '256 GB',
    camera: '50 + 12 + 5 MP',
    battery: '5.000 mAh',
    os: 'Android 15, One UI 7',
    color: 'Grafitna',
  },
  {
    name: 'Xiaomi 15 Ultra 512GB',
    brand: 'xiaomi',
    category: 'pametni-telefoni',
    price: 139999,
    stock: 4,
    featured: true,
    shortDescription: 'Leica kamere i 1" senzor za vrhunske fotografije.',
    description: 'Xiaomi 15 Ultra je fotografski flagship sa Leica optikom i Snapdragon 8 Elite cipom.',
    screen: '6.73" AMOLED, 120 Hz',
    processor: 'Snapdragon 8 Elite',
    ram: '16 GB',
    storage: '512 GB',
    camera: '50 + 50 + 200 + 50 MP',
    battery: '5.410 mAh',
    os: 'Android 15, HyperOS 2',
    color: 'Crna',
  },
  {
    name: 'Redmi Note 14 Pro 256GB',
    brand: 'xiaomi',
    category: 'pametni-telefoni',
    price: 36999,
    oldPrice: 41999,
    stock: 30,
    featured: false,
    shortDescription: 'Kamera od 200 MP po pristupacnoj ceni.',
    description: 'Redmi Note 14 Pro sa 200 MP kamerom, AMOLED ekranom i punjenjem od 45 W.',
    screen: '6.67" AMOLED, 120 Hz',
    processor: 'MediaTek Dimensity 7300 Ultra',
    ram: '8 GB',
    storage: '256 GB',
    camera: '200 + 8 + 2 MP',
    battery: '5.110 mAh',
    os: 'Android 14, HyperOS',
    color: 'Ljubicasta',
  },
  {
    name: 'Google Pixel 10 Pro 256GB',
    brand: 'google',
    category: 'pametni-telefoni',
    price: 129999,
    stock: 5,
    featured: false,
    shortDescription: 'Najpametniji Android uz Gemini i Tensor G5.',
    description: 'Pixel 10 Pro sa Tensor G5 cipom, 7 godina azuriranja i vrhunskom obradom fotografija.',
    screen: '6.3" LTPO OLED, 120 Hz',
    processor: 'Google Tensor G5',
    ram: '16 GB',
    storage: '256 GB',
    camera: '50 + 48 + 48 MP',
    battery: '4.870 mAh',
    os: 'Android 16',
    color: 'Obsidian',
  },
  {
    name: 'Motorola Edge 60 256GB',
    brand: 'motorola',
    category: 'pametni-telefoni',
    price: 44999,
    stock: 12,
    featured: false,
    shortDescription: 'Zakrivljeni pOLED ekran i vojna MIL-STD izdrzljivost.',
    description: 'Motorola Edge 60 sa zakrivljenim ekranom, IP69 zastitom i punjenjem od 68 W.',
    screen: '6.67" pOLED, 120 Hz',
    processor: 'MediaTek Dimensity 7400',
    ram: '12 GB',
    storage: '256 GB',
    camera: '50 + 50 + 10 MP',
    battery: '5.200 mAh',
    os: 'Android 15',
    color: 'Zelena',
  },
  {
    name: 'Apple AirPods Pro 3',
    brand: 'apple',
    category: 'slusalice',
    price: 32999,
    stock: 20,
    featured: false,
    shortDescription: 'Aktivno ponistavanje buke i merenje pulsa.',
    description: 'AirPods Pro 3 sa unapredjenim ANC-om, H2 cipom i USB-C kutijom.',
  },
  {
    name: 'Samsung punjac 45W USB-C',
    brand: 'samsung',
    category: 'punjaci-i-kablovi',
    price: 3999,
    stock: 50,
    featured: false,
    shortDescription: 'Super Fast Charging 2.0 sa kablom u kompletu.',
    description: 'Originalni Samsung adapter od 45 W sa USB-C kablom duzine 1.8 m.',
  },
];

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

module.exports = async function seed(strapi) {
  const brandCount = await strapi.documents('api::brand.brand').count();
  if (brandCount > 0) return;

  strapi.log.info('[seed] Ubacujem pocetne podatke...');

  const brandIds = {};
  for (const brand of BRANDS) {
    const created = await strapi.documents('api::brand.brand').create({ data: brand });
    brandIds[brand.slug] = created.documentId;
  }

  const categoryIds = {};
  for (const category of CATEGORIES) {
    const created = await strapi.documents('api::category.category').create({ data: category });
    categoryIds[category.slug] = created.documentId;
  }

  for (const { brand, category, ...product } of PRODUCTS) {
    await strapi.documents('api::product.product').create({
      data: {
        ...product,
        slug: slugify(product.name),
        brand: brandIds[brand],
        category: categoryIds[category],
      },
      status: 'published',
    });
  }

  strapi.log.info(`[seed] Ubaceno: ${BRANDS.length} brendova, ${PRODUCTS.length} proizvoda.`);
};
