// Minimalni prikaz Strapi "rich text (markdown)" polja: paragrafi, liste i **bold**.
function inline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
  );
}

export default function Markdown({ content }) {
  if (!content) return null;

  const blocks = content.split(/\n\s*\n/);
  return (
    <div className="prose">
      {blocks.map((block, i) => {
        const lines = block.split('\n').filter(Boolean);
        if (lines.every((l) => /^[-*]\s/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^[-*]\s/, ''))}</li>
              ))}
            </ul>
          );
        }
        const heading = block.match(/^(#{1,3})\s+(.*)/);
        if (heading) return <h3 key={i}>{inline(heading[2])}</h3>;
        return <p key={i}>{inline(lines.join(' '))}</p>;
      })}
    </div>
  );
}
