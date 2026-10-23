import type { ExternalLink } from './types';

export const profile = {
  name: 'Neil A. Ketteringham',
  location: 'Irvine, CA',
  /** verbatim from the itch.io profile */
  bio: 'I code, I design, I write, I make games.',
  resumePath: '/resume.pdf',
  emails: [
    { label: 'ACADEMIC', address: 'nketteri@uci.edu' },
    { label: 'PERSONAL', address: 'neilaketteringham@gmail.com' },
  ],
  socials: [
    { label: 'GITHUB', url: 'https://github.com/Neilk1021' },
    { label: 'LINKEDIN', url: 'https://linkedin.com/in/nketteri05' },
    { label: 'ITCH.IO', url: 'https://cnel.itch.io' },
    { label: 'ANTIKAT_STUDIOS', url: 'https://antikat.site' },
  ] satisfies ExternalLink[],
} as const;
