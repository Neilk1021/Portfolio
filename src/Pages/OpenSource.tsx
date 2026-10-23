import './Project.css';
import TerminalHeader from '../components/TerminalHeader';
import TerminalLink from '../components/TerminalLink';
import GithubFeed from '../components/GithubFeed';

export default function OpenSource() {
  return (
    <div className="Page">
      <TerminalHeader path="Users/Neil/Open_Source" docTitle="Open Source // cnel.info" />

      <div className="TerminalContent" style={{ maxWidth: '80ch' }}>
        <p>
          Pull requests I've authored on other people's projects, pulled live from the GitHub API.
          Most of this is Apache Texera, an incubating Apache project where I work as an
          undergraduate researcher. The merged PRs there are the same work described on my
          experience page.
        </p>
        <p style={{ fontSize: 'var(--fs-micro)', opacity: 0.7 }}>
          Only public repositories appear here, and my own repositories are filtered out, since
          this is upstream contribution rather than my own pushes.
        </p>

        <GithubFeed />

        <div className="LinkRow" style={{ marginTop: 'var(--sp-5)' }}>
          <TerminalLink label="EXPERIENCE" to="/experience" />
          <TerminalLink label="ALL_PROJECTS" to="/software" />
        </div>
      </div>
    </div>
  );
}
