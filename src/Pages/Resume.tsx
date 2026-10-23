import './Project.css';
import TerminalHeader from '../components/TerminalHeader';
import TerminalLink from '../components/TerminalLink';
import { profile } from '../content';

export default function Resume() {
  return (
    <div className="Page">
      <TerminalHeader path="Users/Neil/Resume" docTitle="Resume // cnel.info" />

      <div className="TerminalContent">
        <h2>Resume</h2>
        <p>View or download the PDF:</p>

        <TerminalLink label="VIEW_RESUME.PDF" href={profile.resumePath} variant="boxed" />

        <p style={{ marginTop: 'var(--sp-5)' }}>
          The same experience, laid out to read on a screen, is on the{' '}
          <TerminalLink label="EXPERIENCE" to="/experience" /> page.
        </p>
      </div>
    </div>
  );
}
