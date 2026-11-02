const priceFormatter = new Intl.NumberFormat('sr-RS', {
  style: 'currency',
  currency: 'RSD',
  maximumFractionDigits: 0,
});

export function formatPrice(value) {
  return priceFormatter.format(Number(value) || 0);
}

export function discountPercent(price, oldPrice) {
  if (!oldPrice || Number(oldPrice) <= Number(price)) return 0;
  return Math.round((1 - Number(price) / Number(oldPrice)) * 100);
}
