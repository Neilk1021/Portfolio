import './Project.css';
import TerminalHeader from '../components/TerminalHeader';
import TerminalLink from '../components/TerminalLink';
import { education, profile } from '../content';

export default function About() {
  return (
    <div className="Page">
      <TerminalHeader path="Users/Neil/About" docTitle="About // cnel.info" />

      <div className="TerminalContent" style={{ maxWidth: '76ch' }}>
        <h2>{'> WHO AM I'}</h2>
        <p>
          {profile.name}, computer science undergrad at {education.institution}
          {' '}({education.degree}, graduating {education.graduation}, {education.gpa} GPA).
          Based in {profile.location}.
        </p>
        <p className="Quote">"{profile.bio}"</p>

        <h2>{'> SYSTEMS'}</h2>

        <p>
          I'm an undergraduate researcher on Apache Texera, an incubating Apache project. I work on
          test-harness internals: a JVM-wide singleton with HikariCP pooling and in-memory DDL
          caching that cut the database suite from 5m40s to 4m05s across 1,600+ assertions. I also
          work on a multi-provider authentication system in Scala/jOOQ and Angular, including an
          idempotent OAuth 2.0/OIDC pipeline for ORCID.
        </p>
        <p>
          On my own time I write graphics and simulation code in C++: a Vulkan renderer built up from
          swapchain recreation and descriptor set layouts, and an OpenGL N-body gravity simulator
          with its own shader compiler and VBO management.
        </p>

        <h2>{'> GAMES'}</h2>
        <p>
          I'm lead programmer and project manager at Antikat Studios, where a 12-person team and I
          are building <em>Japanese Salaryman</em>: office politics by day, retro-hacking
          corporate espionage by night, in 1990s corporate Japan. The Steam demo is out now with 2.7k
          wishlists and 100% positive reviews.
        </p>
        <p>
          Most of what I personally build there is engine plumbing: a polymorphic binary serializer
          with type-tagging to replace JSON parsing, an interpreted cutscene DSL so the narrative team
          isn't blocked on programmers, an SQLite-backed event-driven day-scheduling pipeline with a
          custom Unity editor tool, and a Go telemetry backend on a hardened Hetzner box so the
          in-game economy gets balanced on real playtest data instead of a spreadsheet.
        </p>

        <h2>{'> CLUB'}</h2>
        <p>
          I'm also a project manager at UCI's Video Game Development Club, running 10 concurrent teams
          (120+ members) through 10-week cycles from pitch to public showcase. I wrote the Python
          member-sorting algorithm that turned three days of manual team assignment into under an
          hour, and I help run the quarterly showcases and playtest nights (200+ attendees).
        </p>
        <p>
          Outside of that I ship small games on itch.io, mostly for VGDC's ZotJam. The last one won
          the jam.
        </p>

        <div className="LinkRow" style={{ marginTop: 'var(--sp-5)' }}>
          <TerminalLink label="EXPERIENCE" to="/experience" />
          <TerminalLink label="GAMES" to="/games" />
          <TerminalLink label="RESUME.PDF" href={profile.resumePath} />
          <TerminalLink label="CONTACT" to="/contact" />
        </div>
      </div>
    </div>
  );
}
