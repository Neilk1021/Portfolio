import type { FeaturedProject } from './types';
import { featuredGames, compactGames } from './games';
import { featuredSoftware, compactSoftware } from './software';

export type {
  ProjectCategory, Provenance, ExternalLink, MediaImage, VideoEmbed,
  StatLine, ProjectMeta, ProjectSection, FeaturedProject, CompactProject,
  Role, Education, SkillGroup,
} from './types';

export { profile } from './profile';
export { education, skills } from './education';
export { roles } from './experience';
export { featuredGames, compactGames } from './games';
export { featuredSoftware, compactSoftware } from './software';

export const allFeatured: FeaturedProject[] = [...featuredGames, ...featuredSoftware];

export const projectBySlug: ReadonlyMap<string, FeaturedProject> = new Map(
  allFeatured.map((p) => [p.slug, p]),
);

export const gameCount = featuredGames.length + compactGames.length;
export const softwareCount = featuredSoftware.length + compactSoftware.length;

/**
 * Old URLs that have been shared publicly. Kept as redirects rather than
 * renamed away, because breaking a link someone already has is worse than
 * carrying three lines of table.
 */
export const legacyRedirects: Record<string, string> = {
  surveillance: 'jsm_surveillance',
  ultracult: 'ultra_cult',
  dope_ass_game: 'dope_game_simulator',
  pitch_sorting: 'member_sorting',
  cpp_framework: 'software',
  sarge: 'games',
};

/** Home menu, derived so the menu and the router can't drift apart again. */
export const navTree = {
  groups: [
    {
      name: 'Games',
      indexTo: '/games',
      indexLabel: 'ALL_GAMES',
      items: featuredGames.map((p) => ({ name: p.title, to: p.slug })),
    },
    {
      name: 'Systems/Software',
      indexTo: '/software',
      indexLabel: 'ALL_PROJECTS',
      // Hand-picked and ordered, strongest first, rather than sliced. The
      // point of this group is that the best engineering is one click away,
      // not buried behind the index page.
      items: [
        'jsm_surveillance',
        'jsm_hacking',
        'jsme_scripting',
        'vulkan_renderer',
        'n_body',
        'jsm_telemetry',
        'jsm_days',
      ].map((slug) => {
        const project = featuredSoftware.find((p) => p.slug === slug);
        if (!project) throw new Error(`navTree: no software project "${slug}"`);
        return { name: project.title, to: project.slug };
      }),
    },
  ],
  links: [
    { name: 'Experience & Skills', to: '/experience' },
    { name: 'Open Source', to: '/open_source' },
    { name: 'Blog', to: '/blog' },
    { name: 'About', to: '/about' },
    { name: 'Resume', to: '/resume' },
    { name: 'Contact', to: '/contact' },
  ],
} as const;
