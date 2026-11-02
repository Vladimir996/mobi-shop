'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('sortiraj', e.target.value);
    params.delete('strana');
    router.push(`${pathname}?${params}`);
  };

  return (
    <select className="select" value={searchParams.get('sortiraj') || 'novo'} onChange={onChange} aria-label="Sortiranje">
      <option value="novo">Najnovije</option>
      <option value="cena-rastuce">Cena: od najnize</option>
      <option value="cena-opadajuce">Cena: od najvise</option>
      <option value="naziv">Naziv A–Z</option>
    </select>
  );
}
