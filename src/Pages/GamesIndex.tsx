import { Link } from 'react-router-dom';
import './Project.css';
import TerminalHeader from '../components/TerminalHeader';
import TerminalLink from '../components/TerminalLink';
import CompactEntry from '../components/CompactEntry';
import { compactGames, featuredGames, profile } from '../content';

export default function GamesIndex() {
  return (
    <div className="Page">
      <TerminalHeader path="Users/Neil/Games" docTitle="Games // cnel.info" />

      <div className="TerminalContent" style={{ maxWidth: '80ch' }}>
        {featuredGames.map((game) => (
          <Link className="ProjectCard" to={`/${game.slug}`} key={game.slug}>
            <h2>{game.title}</h2>
            <p>{game.tagline}</p>
            {game.awards && game.awards.length > 0 && (
              <p style={{ fontSize: 'var(--fs-micro)', color: 'var(--fg)', marginTop: 'var(--sp-1)' }}>
                {game.awards[0]}
              </p>
            )}
          </Link>
        ))}

        <h2 style={{ marginTop: 'var(--sp-6)' }}>{'> JAM & SMALL RELEASES'}</h2>
        <ul className="CompactList">
          {compactGames.map((item) => (
            <CompactEntry item={item} key={item.url} />
          ))}
        </ul>

        <div className="LinkRow" style={{ marginTop: 'var(--sp-5)' }}>
          <TerminalLink
            label="ITCH.IO_PROFILE"
            href={profile.socials.find((s) => s.label === 'ITCH.IO')!.url}
          />
          <TerminalLink label="ALL_PROJECTS" to="/software" />
        </div>
      </div>
    </div>
  );
}
