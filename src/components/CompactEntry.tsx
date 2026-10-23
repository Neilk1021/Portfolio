import type { CompactProject } from '../content';

export default function CompactEntry({ item }: { item: CompactProject }) {
  return (
    <li className="CompactEntry">
      <a
        className="name"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.title}
      </a>
      <span className="tagline">{item.tagline}</span>
      {item.genre && <span className="facet">{item.genre}</span>}
      {item.platform && <span className="facet">{item.platform}</span>}
      {item.note && <span className="note">{item.note}</span>}
    </li>
  );
}
