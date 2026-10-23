import type { Role } from './types';

/** Bullets are verbatim from the resume PDF. */
export const roles: Role[] = [
  {
    slug: 'apache-texera',
    org: 'Apache Texera (Incubating)',
    orgUrl: 'https://texera.apache.org/',
    title: 'Undergraduate Researcher',
    dateRange: 'Jun 2026 - Present',
    bullets: [
      'Reduced database test suite runtime by ~28% (5m 40s to 4m 05s) by refactoring Apache Texera’s test harness into a JVM-wide singleton with HikariCP connection pooling and in-memory DDL caching, eliminating thread race conditions across 1,600+ assertions.',
      'Engineered a multi-provider authentication system in Scala/jOOQ and Angular by decoupling user identity into a unified auth_provider schema; built an idempotent OAuth 2.0/OIDC pipeline for ORCID integration with fallback email verification modals for restricted profiles.',
    ],
    tech: ['Scala', 'jOOQ', 'Angular', 'HikariCP', 'PostgreSQL', 'OAuth 2.0 / OIDC', 'sbt'],
    related: [{ label: 'OPEN_SOURCE_FEED', to: '/open_source' }],
  },
  {
    slug: 'antikat-studios',
    org: 'Antikat Studios',
    orgUrl: 'https://antikat.site',
    title: 'Lead Programmer & Project Manager',
    dateRange: 'Jan 2025 - Present',
    bullets: [
      'Led a 12-person cross-functional team to ship the game "Japanese Salaryman" (Unity/C#), driving product roadmaps and launching a Steam demo that achieved 2.7k wishlists and 100% positive reviews.',
      'Engineered custom C# engine infrastructure, including a polymorphic binary serializer with type-tagging to replace JSON parsing, and an interpreted cutscene DSL to automate narrative workflows.',
      'Architected an event-driven scheduling pipeline using SQLite for backend data storage paired with a custom Unity editor tool, enabling designers to dynamically balance complex game days.',
      'Built a Go telemetry backend with goroutine-based concurrent request handling and PostgreSQL persistence to capture real-time playtester data, deployed on a hardened Hetzner Linux server with systemd process management, Caddy-automated TLS, and schema migrations; replacing spreadsheet-only economy balancing with empirical playtest data.',
    ],
    tech: ['Unity', 'C#', 'Go', 'SQLite', 'PostgreSQL', 'Linux', 'systemd', 'Caddy'],
    links: [{ label: 'ANTIKAT.SITE', url: 'https://antikat.site' }],
    related: [
      { label: 'JAPANESE_SALARYMAN', to: '/japanese_salaryman' },
      { label: 'JSM_TELEMETRY', to: '/jsm_telemetry' },
      { label: 'CUTSCENE_SCRIPTING', to: '/jsme_scripting' },
    ],
  },
  {
    slug: 'vgdc-uci',
    org: 'Video Game Development Club (VGDC) @ UCI',
    title: 'Project Manager',
    dateRange: 'Feb 2025 - Present',
    bullets: [
      'Directed 10 concurrent cross-functional game development teams (120+ total members) through complete 10-week development cycles from initial concept pitch to public showcase.',
      'Designed and implemented an automated member-sorting algorithm in Python, cutting team assignment processing time from 3 days to under an hour.',
      'Organized and executed flagship quarterly showcases and playtesting nights hosting 200+ attendees.',
    ],
    tech: ['Python'],
    related: [{ label: 'VGDC_MEMBER_SORTING', to: '/member_sorting' }],
  },
];
