import { Link } from 'react-router-dom';
import './HomeBanner.css';
import { education, featuredGames, profile, skills } from '../content';
import { PR_SNAPSHOT } from '../data/prSnapshot';

/**
 * The login banner, rendered as the output of a command rather than as a
 * floating card. A terminal prints who you are when you log in, so tying this
 * to the prompt that already exists keeps one anchor on the page instead of
 * two competing headers.
 *
 * Every value derives from the content layer, so nothing here drifts out of
 * sync with the pages it summarises.
 */
export default function HomeBanner() {
  const merged = PR_SNAPSHOT.filter((pr) => pr.state === 'merged').length;
  const jsm = featuredGames.find((g) => g.slug === 'japanese_salaryman');
  const wishlists = jsm?.stats?.find((s) => s.label === 'Steam wishlists')?.value;
  const languages = skills.find((g) => g.label === 'LANGUAGES')?.items.slice(0, 6).join(', ');

  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: 'RESEARCH',
      value: (
        <>
          <Link to="/open_source">Apache Texera</Link> (Incubating), {merged} merged pull requests
        </>
      ),
    },
    {
      label: 'STUDIO',
      value: (
        <>
          Antikat, lead programmer on{' '}
          <Link to="/japanese_salaryman">Japanese Salaryman</Link>
          {wishlists && ` (${wishlists} wishlists, 100% positive)`}
        </>
      ),
    },
    {
      label: 'AWARDS',
      value: (
        <>
          1st place, Fall 2025 VGDC ZotJam, solo entry (
          <Link to="/dope_game_simulator">Dope Game Simulator</Link>)
        </>
      ),
    },
    { label: 'STACK', value: languages },
  ];

  return (
    <section className="Banner" aria-label="Summary">
      <p className="Prompt" aria-hidden="true">
        <span className="PromptMark">{'>'}</span> whoami
      </p>

      <p className="BannerName">{profile.name}</p>
      <p className="BannerLede">
        Computer science undergrad at {education.shortName}, graduating {education.graduation}.
        I make things, some people think they're kinda cool.
      </p>

      <dl className="BannerRows">
        {rows.map((row) => (
          <div key={row.label} style={{ display: 'contents' }}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="Prompt" aria-hidden="true">
        <span className="PromptMark">{'>'}</span> ls
      </p>
    </section>
  );
}
