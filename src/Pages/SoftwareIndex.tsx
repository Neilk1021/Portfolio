import { Link } from 'react-router-dom';
import './Project.css';
import TerminalHeader from '../components/TerminalHeader';
import TerminalLink from '../components/TerminalLink';
import CompactEntry from '../components/CompactEntry';
import { compactSoftware, featuredSoftware } from '../content';

export default function SoftwareIndex() {
  return (
    <div className="Page">
      <TerminalHeader path="Users/Neil/Software" docTitle="Systems & Software // cnel.info" />

      <div className="TerminalContent" style={{ maxWidth: '80ch' }}>
        {featuredSoftware.map((project) => (
          <Link className="ProjectCard" to={`/${project.slug}`} key={project.slug}>
            <h2>{project.title}</h2>
            <p>{project.tagline}</p>
            {project.tech && (
              <p style={{ fontSize: 'var(--fs-micro)', color: 'var(--fg)', opacity: 0.7, marginTop: 'var(--sp-1)' }}>
                {project.tech.join(' | ')}
              </p>
            )}
          </Link>
        ))}

        <h2 style={{ marginTop: 'var(--sp-6)' }}>{'> SMALLER REPOSITORIES'}</h2>
        <ul className="CompactList">
          {compactSoftware.map((item) => (
            <CompactEntry item={item} key={item.url} />
          ))}
        </ul>

        <div className="LinkRow" style={{ marginTop: 'var(--sp-5)' }}>
          <TerminalLink label="OPEN_SOURCE_CONTRIBUTIONS" to="/open_source" />
          <TerminalLink label="ALL_GAMES" to="/games" />
        </div>
      </div>
    </div>
  );
}
