/**
 * Content model for the site.
 *
 * Everything here is plain data so the router, the home menu and the index
 * pages can all be derived from one source. Before this existed, the menu and
 * the route table were two hand-maintained lists and had already drifted -
 * `sarge` and `surveillance` were routable but unreachable.
 *
 * Note: tsconfig sets `erasableSyntaxOnly`, so string unions - not enums.
 */

export type ProjectCategory = 'games' | 'software';

/** Where a claim came from. Renders nowhere; it exists so a later edit can
 *  tell sourced copy from placeholder copy without redoing the research. */
export type Provenance = 'resume' | 'steam' | 'itch' | 'github' | 'site-legacy' | 'owner';

export interface ExternalLink {
  /** Rendered verbatim between brackets, e.g. "STEAM_PAGE" -> [ STEAM_PAGE ] */
  label: string;
  url: string;
}

export interface MediaImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface VideoEmbed {
  youtubeId: string;
  title: string;
}

export interface StatLine {
  label: string;
  value: string;
  source: Provenance;
}

export interface ProjectMeta {
  role?: string;
  team?: string;
  dateRange?: string;
  status?: string;
  platforms?: string[];
  engine?: string;
  pricing?: string;
  jam?: string;
  updated?: string;
  genres?: string[];
  tags?: string[];
  credits?: string;
  license?: string;
}

/** Generic labelled block - Controls, Credits, Licensing, Postmortem, ... */
export interface ProjectSection {
  heading: string;
  body?: string[];
  bullets?: string[];
  /** definition-list rows, used for control schemes */
  rows?: [string, string][];
  /** verbatim code sample, rendered in a <pre> */
  code?: string;
  /** render body as an italic pull-quote */
  quote?: boolean;
}

export interface FeaturedProject {
  /** route segment and breadcrumb tail */
  slug: string;
  title: string;
  altTitle?: string;
  category: ProjectCategory;
  /** breadcrumb prefix, e.g. "GAMES" -> c:/GAMES/ULTRA_CULT */
  breadcrumb: string;
  /** one-line summary, also used on the index cards */
  tagline: string;
  synopsis: string[];
  tech?: string[];
  meta?: ProjectMeta;
  /** highlighted achievements, rendered in a bordered callout */
  awards?: string[];
  stats?: StatLine[];
  contributions?: string[];
  sections?: ProjectSection[];
  links?: ExternalLink[];
  /** rendered as the full-width bordered CTA */
  primaryLink?: ExternalLink;
  video?: VideoEmbed;
  gallery?: MediaImage[];
  related?: { label: string; to: string }[];
}

export interface CompactProject {
  title: string;
  tagline: string;
  genre?: string;
  platform?: string;
  url: string;
  note?: string;
}

export interface Role {
  slug: string;
  org: string;
  orgUrl?: string;
  title: string;
  dateRange: string;
  bullets: string[];
  tech: string[];
  links?: ExternalLink[];
  related?: { label: string; to: string }[];
}

export interface Education {
  institution: string;
  /** Used where the full name would wrap awkwardly inline. */
  shortName: string;
  school: string;
  degree: string;
  graduation: string;
  gpa: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}
