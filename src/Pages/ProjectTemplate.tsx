import { Link } from 'react-router-dom';
import './Project.css';
import TerminalHeader from '../components/TerminalHeader';
import TerminalLink from '../components/TerminalLink';
import Gallery from '../components/Gallery';
import type { FeaturedProject, ProjectMeta, ProjectSection } from '../content';

/** Label for each ProjectMeta key, in the order they should render. */
const META_LABELS: [keyof ProjectMeta, string][] = [
  ['role', 'ROLE'],
  ['team', 'TEAM'],
  ['dateRange', 'DATES'],
  ['jam', 'JAM'],
  ['status', 'STATUS'],
  ['engine', 'ENGINE'],
  ['platforms', 'PLATFORMS'],
  ['pricing', 'PRICING'],
  ['updated', 'UPDATED'],
  ['genres', 'GENRES'],
  ['tags', 'TAGS'],
  ['license', 'LICENSE'],
  ['credits', 'CREDITS'],
];

function MetaRows({ meta }: { meta: ProjectMeta }) {
  const rows = META_LABELS.flatMap(([key, label]) => {
    const value = meta[key];
    if (!value) return [];
    return [[label, Array.isArray(value) ? value.join(', ') : value] as const];
  });
  if (rows.length === 0) return null;

  return (
    <dl className="MetaTable">
      {rows.map(([label, value]) => (
        <div key={label} style={{ display: 'contents' }}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Section({ section }: { section: ProjectSection }) {
  return (
    <>
      <h2>{section.heading}</h2>
      {section.rows && (
        <dl className="MetaTable">
          {section.rows.map(([k, v]) => (
            <div key={k} style={{ display: 'contents' }}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {section.body?.map((line) =>
        section.quote ? (
          <p className="Quote" key={line}>{line}</p>
        ) : (
          <p key={line}>{line}</p>
        ),
      )}
      {section.code && (
        <pre className="CodeBlock">
          <code>{section.code}</code>
        </pre>
      )}
      {section.bullets && (
        <ul>
          {section.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function ProjectPage({ project }: { project: FeaturedProject }) {
  const {
    title, altTitle, breadcrumb, slug, tagline, synopsis, tech, meta,
    awards, stats, contributions, sections, links, primaryLink, video, gallery,
    related,
  } = project;

  const hasMedia = Boolean(video || gallery?.length);

  return (
    <div className="Page">
      <TerminalHeader path={`${breadcrumb}/${slug.toUpperCase()}`} docTitle={`${title} // cnel.info`} />

      <div className="body">
        <div className="Left">
          <p className="Tagline">{tagline}</p>
          {altTitle && <p style={{ fontSize: 'var(--fs-micro)', opacity: 0.7 }}>{altTitle}</p>}

          <h2>Synopsis</h2>
          {synopsis.map((line) => (
            <p key={line}>{line}</p>
          ))}

          {tech && tech.length > 0 && (
            <ul className="TechTags">
              {tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}

          {meta && <MetaRows meta={meta} />}

          {awards && awards.length > 0 && (
            <div className="Awards">
              <h2 style={{ marginTop: 0 }}>Awards</h2>
              <ul>
                {awards.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {stats && stats.length > 0 && (
            <>
              <h2>Feats</h2>
              <ul>
                {stats.map((s) => (
                  <li key={s.label}>
                    {s.label}: {s.value}
                  </li>
                ))}
              </ul>
            </>
          )}

          {contributions && contributions.length > 0 && (
            <>
              <h2>Technical Contributions</h2>
              <ul>
                {contributions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </>
          )}

          {sections?.map((s) => (
            <Section key={s.heading} section={s} />
          ))}

          {links && links.length > 0 && (
            <div className="LinkRow">
              {links.map((l) => (
                <TerminalLink key={l.url} label={l.label} href={l.url} />
              ))}
            </div>
          )}

          {related && related.length > 0 && (
            <>
              <h2>Related</h2>
              <div className="LinkRow">
                {related.map((r) => (
                  <TerminalLink key={r.to} label={r.label} to={r.to} />
                ))}
              </div>
            </>
          )}

          {primaryLink && (
            <TerminalLink label={primaryLink.label} href={primaryLink.url} variant="boxed" />
          )}

          <p style={{ marginTop: 'var(--sp-5)' }}>
            <Link to={project.category === 'games' ? '/games' : '/software'} className="TermLink">
              {'<< '}
              {project.category === 'games' ? 'ALL_GAMES' : 'ALL_PROJECTS'}
            </Link>
          </p>
        </div>

        {hasMedia && (
          <div className="Right">
            {video && (
              <>
                <h2 className="MediaHeader">Media Feed</h2>
                <div className="VideoEmbed">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${video.youtubeId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </>
            )}
            {gallery && gallery.length > 0 && (
              <>
                <h2 className="MediaHeader">Gallery</h2>
                <Gallery images={gallery} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
