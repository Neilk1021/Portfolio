import './Project.css';
import './Experience.css';
import TerminalHeader from '../components/TerminalHeader';
import TerminalLink from '../components/TerminalLink';
import { education, profile, roles, skills } from '../content';

export default function Experience() {
  return (
    <div className="Page">
      <TerminalHeader path="Users/Neil/Experience" docTitle="Experience // cnel.info" />

      <div className="TerminalContent" style={{ maxWidth: '80ch' }}>
        <h2 className="SectionLabel">{'> EDUCATION'}</h2>
        <div className="Entry">
          <div className="EntryHead">
            <span className="EntryOrg">{education.institution}</span>
            <span className="EntryDate">Graduation: {education.graduation}</span>
          </div>
          <div className="EntryHead">
            <span className="EntrySub">{education.degree}</span>
            <span className="EntryDate">GPA: {education.gpa}</span>
          </div>
          <p className="EntrySub">{education.school}</p>
        </div>

        <h2 className="SectionLabel">{'> EXPERIENCE'}</h2>
        {roles.map((role) => (
          <div className="Entry" key={role.slug}>
            <div className="EntryHead">
              <span className="EntryOrg">
                {role.orgUrl ? (
                  <a href={role.orgUrl} target="_blank" rel="noopener noreferrer">
                    {role.org}
                  </a>
                ) : (
                  role.org
                )}
              </span>
              <span className="EntryDate">{role.dateRange}</span>
            </div>
            <p className="EntrySub">{role.title}</p>

            <ul>
              {role.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <p className="StackRow">
              <span className="StackLabel">STACK</span> {role.tech.join(' | ')}
            </p>

            {(role.links || role.related) && (
              <div className="LinkRow">
                {role.links?.map((l) => (
                  <TerminalLink key={l.url} label={l.label} href={l.url} />
                ))}
                {role.related?.map((r) => (
                  <TerminalLink key={r.to} label={r.label} to={r.to} />
                ))}
              </div>
            )}
          </div>
        ))}

        <h2 className="SectionLabel">{'> SKILLS'}</h2>
        <dl className="SkillList">
          {skills.map((group) => (
            <div key={group.label} style={{ display: 'contents' }}>
              <dt>{group.label}</dt>
              <dd>{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>

        <div className="LinkRow" style={{ marginTop: 'var(--sp-5)' }}>
          <TerminalLink label="VIEW_RESUME.PDF" href={profile.resumePath} />
          <TerminalLink label="OPEN_SOURCE" to="/open_source" />
          <TerminalLink label="CONTACT" to="/contact" />
        </div>
      </div>
    </div>
  );
}
