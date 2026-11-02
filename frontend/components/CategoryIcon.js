const ICONS = {
  'pametni-telefoni': (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <line x1="10.5" y1="18.5" x2="13.5" y2="18.5" />
    </>
  ),
  slusalice: (
    <>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z" />
    </>
  ),
  'punjaci-i-kablovi': (
    <>
      <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
    </>
  ),
};

const FALLBACK = (
  <>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M3 9h18" />
  </>
);

export default function CategoryIcon({ slug }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[slug] ?? FALLBACK}
    </svg>
  );
}
