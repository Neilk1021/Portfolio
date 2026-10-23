import type { CompactProject, FeaturedProject } from './types';

import jsmNight from '../assets/jsm-night.jpg';
import jsmBalcony from '../assets/jsm-balcony.jpg';
import jsmSilhouette from '../assets/jsm-silhouette.jpg';
import jsmHacking from '../assets/hack-grid.jpg';
import jsmSurveillance from '../assets/surv-mesh.jpg';
import ucCombat from '../assets/ultracult-combat.jpg';
import ucCorridor from '../assets/ultracult-corridor.jpg';
import ucAltar from '../assets/ultracult-altar.jpg';
import dopeGhosts from '../assets/dope-ghosts.jpg';
import dopeDialogue from '../assets/dope-dialogue.jpg';
import dopeAirborne from '../assets/dope-airborne.jpg';

export const featuredGames: FeaturedProject[] = [
  {
    slug: 'japanese_salaryman',
    title: 'Japanese Salaryman',
    category: 'games',
    breadcrumb: 'GAMES',
    tagline: 'Persona meets Factorio.',
    synopsis: [
      'Balance a double life of office politics by day and retro-hacking corporate espionage by night to escape crushing debt, in 1990s corporate Japan.',
      'You are a 30-something salaryman working a dead-end job when you get pulled into stealing information from your company to pay off your debts.',
      'Days are spent navigating office politics at METTA East. Nights are spent assembling hacks to steal corporate information, building a spy network across Osaka, buying upgrades, and working through increasingly sophisticated security.',
      'The "Factorio" half is literal: stolen information is raw material fed through a grid-based production chain of inputs, processors and mergers, laid out and rewired by the player to refine cheap data into things worth selling.',
    ],
    tech: ['Unity', 'C#', 'SQLite', 'Go', 'PostgreSQL'],
    meta: {
      role: 'Lead Programmer & Project Manager',
      team: '12-person cross-functional team',
      dateRange: 'Jan 2025 - Present',
      status: 'Unreleased - planned 2026. Demo available now.',
      engine: 'Unity',
      genres: ['Adventure', 'Indie', 'RPG', 'Simulation', 'Strategy'],
      tags: [
        'Political Sim', 'Management', 'Dark Comedy', 'Visual Novel',
        'Investigation', 'Story Rich', 'Hacking', 'Noir', 'Pixel Graphics',
        'Crime', 'Multiple Endings',
      ],
      credits: 'Developed and published by Antikat and cNel.',
    },
    stats: [
      { label: 'Steam wishlists', value: '2.7k', source: 'resume' },
      { label: 'Steam review rating', value: '100% positive', source: 'resume' },
    ],
    contributions: [
      'Wrote JSME, an interpreted language for cutscenes: lexer, parser and runner in their own assembly, 1,700 lines of C#, 36 unit tests, and 49 scripts driving the shipped game.',
      'Designed the save format. It is a versioned binary stream where every record carries a one-byte type tag, so polymorphic machine state deserialises back to the right concrete class, and object references are rehydrated from GUIDs once the whole graph is loaded. A failed load rolls back rather than leaving a half-built factory.',
      'Built the information-refining factory simulation: a grid of inputs, processors, mergers and outputs wired by recipes and connection graphs, and the tooling to lay it out. Around 180 C# files, the largest system in the game.',
      'Built JsmDays, a SQLite-backed Unity editor plugin with a day planner and editors for events, NPCs, weather, social links and scenes, so designers balance game days without touching code.',
      'Built the Go telemetry backend that replaced spreadsheet-only economy balancing with real playtest data.',
    ],
    sections: [
      {
        heading: 'Mission Log',
        body: ['"The daily grind is a cage. Information is the key."'],
        quote: true,
      },
      {
        heading: 'Developer Notes',
        body: [
          'This project pushed Unity’s UI systems hard to build the intricate menu-driven gameplay a management-sim / RPG hybrid needs.',
          'Most of the engineering underneath it exists so the rest of the team does not need me. The scripting language is there so writers ship cutscenes on their own, and the SQLite editor tooling is there so designers rebalance a day without a build. Both were worth more than the gameplay code I would have written in the same time.',
        ],
      },
    ],
    links: [
      { label: 'PLAY_THE_DEMO', url: 'https://store.steampowered.com/app/3738500/Japanese_Salaryman_Demo/' },
      { label: 'ANTIKAT.SITE', url: 'https://antikat.site' },
    ],
    primaryLink: {
      label: 'WISHLIST_ON_STEAM',
      url: 'https://store.steampowered.com/app/3098910/Japanese_Salaryman/',
    },
    video: { youtubeId: 'hLrKdih8pFc', title: 'Japanese Salaryman trailer' },
    gallery: [
      { src: jsmNight, alt: 'Night on a rooftop with Mae, morale and date tracked in the corner', width: 1400, height: 788 },
      { src: jsmBalcony, alt: 'Standing on a balcony over the city skyline', width: 1400, height: 788 },
      { src: jsmSilhouette, alt: 'A stylised white scene, the player in silhouette during a conversation', width: 1400, height: 788 },
      { src: jsmHacking, alt: 'The hacking minigame: towers wired into a packet route against CPU, RAM, boot and network budgets', width: 1400, height: 785 },
      { src: jsmSurveillance, alt: 'The surveillance map: the city as mesh faces, labelled with what a newly placed camera reaches', width: 1400, height: 788 },
    ],
    related: [
      { label: 'EXPERIENCE > ANTIKAT', to: '/experience' },
      { label: 'SURVEILLANCE', to: '/jsm_surveillance' },
      { label: 'HACKING', to: '/jsm_hacking' },
      { label: 'JSM_TELEMETRY', to: '/jsm_telemetry' },
      { label: 'CUTSCENE_SCRIPTING', to: '/jsme_scripting' },
    ],
  },

  {
    slug: 'dope_game_simulator',
    title: 'Dope Game Simulator',
    altTitle: 'a.k.a. Dope Ass Game Simulator',
    category: 'games',
    breadcrumb: 'GAMES',
    tagline: 'Climb out of hell using the ways other people died.',
    synopsis: [
      'A 2D platformer built for the Fall 2025 VGDC ZotJam, theme "Beyond the Grave". You are a severed head rolling back up through hell toward your own grave, and the only way to move is to borrow other people’s deaths.',
      'Every ghost you meet died in a specific way, and touching one does that to you. Bump the guy who was hit by a truck and a truck hits you, launching you across the gap. Bump the one who died on a trampoline and you get bounced straight up. The whole traversal kit is other people’s worst days.',
      'A red ghost tags along as your guide, and there is a lot of writing along the way.',
    ],
    tech: ['Unity', 'C#'],
    meta: {
      role: 'Solo developer - design, code, art, writing',
      dateRange: 'October 2025',
      jam: 'Fall 2025 VGDC ZotJam - theme "Beyond the Grave"',
      engine: 'Unity',
      platforms: ['Browser (HTML5)', 'Windows'],
      pricing: 'Name your own price',
      status: 'Released. Fullscreen or download recommended.',
      updated: 'Oct 13, 2025',
      genres: ['Platformer'],
      tags: ['2D', 'Halloween', 'Metroidvania', 'No AI', 'Spooky'],
    },
    awards: [
      '1st place overall, community vote - 4.074 / 5 across 23 entries',
      '1st place, Fun and Engagement - 4.471 / 5, the highest score in the jam',
      '1st place with the judging panel (GDIM faculty), scored separately from the community vote',
      '3rd Theme Relevance - 4.118 | 4th Creativity - 4.176',
    ],
    stats: [
      { label: 'Entries in the jam', value: '23', source: 'itch' },
      { label: 'Team size', value: 'Solo, in a team competition', source: 'owner' },
      { label: 'Build time', value: '~40 hours', source: 'owner' },
    ],
    contributions: [
      'Designed the death-inheritance traversal system that the whole game is built around.',
      'Wrote a custom falling-text dialogue effect in about 30 minutes rather than ship plain text boxes; the writing ended up being what players commented on most.',
      'Made the player a rolling head on purpose - it dodges a walk cycle entirely, since rotating a sprite is a few lines of code and animating one is not.',
      'Built and shipped the whole thing solo in roughly 40 hours after entering the jam late.',
    ],
    sections: [
      {
        heading: 'From the itch.io page',
        body: ['"Whaddup gamers, I got some REAL gaming for u today. Please play Dope Ass Game Simulator."'],
        quote: true,
      },
      {
        heading: 'Credits',
        bullets: [
          'All music and SFX (besides talking SFX) are royalty-free, sourced from pixabay.com.',
          'Everything else is the sole work of Neil Ketteringham.',
        ],
      },
    ],
    links: [
      { label: 'JAM_RESULTS', url: 'https://itch.io/jam/fall-2025-vgdc-zotjam/results' },
    ],
    primaryLink: { label: 'PLAY_IN_BROWSER', url: 'https://cnel.itch.io/dope-game-simulator' },
    gallery: [
      { src: dopeGhosts, alt: 'The rolling head mid-air beside orange ghosts in a brick corridor', width: 794, height: 446 },
      { src: dopeDialogue, alt: 'The red ghost guide cackling in a dark corridor', width: 794, height: 446 },
      { src: dopeAirborne, alt: 'The head launched airborne off an impact burst', width: 794, height: 446 },
    ],
  },

  {
    slug: 'ultra_cult',
    title: 'Ultra Cult',
    category: 'games',
    breadcrumb: 'GAMES',
    tagline: 'Purge cultists, don’t die.',
    synopsis: [
      'A fast first-person shooter made for the Fall 2024 VGDC ZotJam, theme "Spooky". You’ve fallen into a deep cave filled with raving lunatic cultists. Kill them before they can kill you.',
      'Ultrakill-inspired: you carry two weapons and swap between them because different enemies want to be killed in different ways. Cultists and their ghosts both come at you, and dashing is how you stay alive.',
    ],
    meta: {
      role: 'Solo developer, with modeling support',
      dateRange: 'Fall 2024',
      jam: 'Fall 2024 VGDC ZotJam - theme "Spooky"',
      platforms: ['Windows', 'macOS'],
      pricing: 'Name your own price',
      updated: 'Feb 14, 2025',
      genres: ['Action'],
      credits:
        'Designed, modeled, programmed, animated and textured by Neil Ketteringham, with modeling support from Serin Wang.',
    },
    sections: [
      {
        heading: 'Controls',
        rows: [
          ['Move', 'WASD'],
          ['Dash', 'Shift'],
          ['Fire', 'M1'],
          ['Switch weapons', '[1] and [2]'],
        ],
        body: ['Mouse required.'],
      },
      {
        heading: 'Licensed assets',
        bullets: [
          'Font: Sangoku4 - Caveras',
          'Music: More Distortion Plz - INeedMusic.co',
          'SFX: Ultimate SFX Bundle - DanielNMartin',
        ],
      },
    ],
    primaryLink: { label: 'DOWNLOAD_ON_ITCH.IO', url: 'https://cnel.itch.io/ultra-cult' },
    gallery: [
      { src: ucCombat, alt: 'Spearing a hooded cultist in a dark cave as a ghost closes in', width: 1280, height: 720 },
      { src: ucCorridor, alt: 'A lava-lit corridor with the objective "Kill their leader"', width: 1280, height: 720 },
      { src: ucAltar, alt: 'A glowing spear resting on a stone altar', width: 1280, height: 707 },
    ],
  },
];

/** Small releases and jam entries - listed, not given their own page. */
export const compactGames: CompactProject[] = [
  {
    title: 'Hack the M-Ad',
    tagline: 'Become the greatest "hacker" of all time.',
    genre: 'Action',
    platform: 'Browser',
    url: 'https://cnel.itch.io/hack-the-mad',
  },
  {
    title: 'METTA Mail',
    tagline: 'Sign your life away... for 20k a year.',
    genre: 'Simulation',
    platform: 'Browser',
    url: 'https://cnel.itch.io/metta-email-service',
  },
  {
    title: 'Office Tiles',
    tagline: 'Piano tiles with an office twist.',
    genre: 'Rhythm',
    platform: 'Browser',
    url: 'https://cnel.itch.io/office-tiles',
  },
  {
    title: 'Rebel Ocean',
    tagline: 'Pirate the 7 seas!',
    genre: 'Adventure',
    platform: 'Download',
    url: 'https://cnel.itch.io/rebel-ocean',
  },
  {
    title: 'Geometry Slash',
    tagline: 'Kill!',
    genre: 'Action',
    platform: 'Download',
    url: 'https://cnel.itch.io/geometry-slash',
  },
];
