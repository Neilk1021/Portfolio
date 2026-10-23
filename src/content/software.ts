import type { CompactProject, FeaturedProject } from './types';

import hackGrid from '../assets/hack-grid.jpg';
import hackRunmap from '../assets/hack-runmap.jpg';
import hackEditor from '../assets/hack-editor.jpg';
import hackPayout from '../assets/hack-payout.jpg';
import survEmporium from '../assets/surv-emporium.jpg';
import survMesh from '../assets/surv-mesh.jpg';
import survChain from '../assets/surv-chain.jpg';
import survCoverage from '../assets/surv-coverage.jpg';
import survBoot from '../assets/surv-boot.jpg';
import vkModel from '../assets/vk-model.jpg';
import vkModel2 from '../assets/vk-model-2.jpg';
import vkQuad from '../assets/vk-quad.jpg';
import nbodyDemo from '../assets/nbody-demo.gif';

const GH = 'https://github.com/Neilk1021';

export const featuredSoftware: FeaturedProject[] = [
  {
    slug: 'vulkan_renderer',
    title: 'Vulkan Renderer',
    category: 'software',
    breadcrumb: 'SYSTEMS',
    tagline: 'Learning Vulkan properly, and writing down what I actually understood.',
    synopsis: [
      'Built a Vulkan graphics pipeline in C++, manually configuring swapchain recreation, render passes, descriptor set layouts, and staging buffers to load and render textured 3D models.',
      'This started as a pass through the Vulkan Tutorial, and I am not going to pretend otherwise. The goal was never a novel renderer; rather, rather I wanted to actually understand how Vulkan works, because almost nothing in it is implicit and there is no way to fake having read the spec.',
      'So the real output is the notes. Twenty-two pages on the parts that took effort to understand: image layout transitions and what src/dst stage and access masks are actually doing to the caches, command pool flags, the fixed-function stages, input assembly, the rasterizer, colour blending, vertex input, viewports and scissors. Written against the modern vulkan.hpp bindings and synchronization2.',
      'That groundwork is what the in-progress Quake-style renderer in the same repo is built on, and where the screenshots come from: a textured quad first, then full model loading through tinyobjloader.',
      'The shaders are written in Slang rather than GLSL, and the whole thing is built on the vulkan.hpp RAII wrappers, so handles clean themselves up instead of being manually destroyed in reverse order.',
    ],
    tech: ['C++', 'Vulkan API', 'vulkan.hpp RAII', 'Slang', 'CMake'],
    meta: {
      dateRange: 'May 2026',
      role: 'Solo project',
      status: 'Learning project - notes are the deliverable',
    },
    sections: [
      {
        heading: 'From the repo',
        body: [
          '"This repo is really messy, and isn\u2019t representative of my core software habits. The main goal of this project wasn\u2019t to build anything new, rather it was for me to understand how Vulkan works."',
        ],
        quote: true,
      },
    ],
    gallery: [
      { src: vkModel, alt: 'A textured OBJ model rendered by the engine, lit and rotating', width: 828, height: 612 },
      { src: vkModel2, alt: 'The same model from another angle as it turns', width: 828, height: 612 },
      { src: vkQuad, alt: 'The earlier milestone: a single textured quad with interpolated vertex colour', width: 828, height: 612 },
    ],
    links: [
      { label: 'READ_THE_NOTES', url: 'https://github.com/Neilk1021/FirstVulkanEngine/tree/main/Notes' },
      { label: 'QUAKE_FOLLOW_UP', url: 'https://github.com/Neilk1021/Quake-But-awesome-' },
    ],
    primaryLink: { label: 'VIEW_ON_GITHUB', url: `${GH}/FirstVulkanEngine` },
  },
  {
    slug: 'n_body',
    title: 'N-Body Gravity Simulator',
    category: 'software',
    breadcrumb: 'SYSTEMS',
    tagline: 'Real-time gravitational particle simulation with a hand-rolled OpenGL engine.',
    synopsis: [
      'Architected a real-time particle simulation in C++ and OpenGL with custom shader pipelines and VBO management to compute interactive gravitational physics.',
      'The renderer underneath it is its own engine rather than a library call: a shader compiler that turns .shader files into linked vertex and fragment programs, and hand-written VAO / VBO / IBO and renderer components.',
    ],
    tech: ['C++', 'OpenGL', 'GLSL', 'GLFW', 'GLEW', 'GLM'],
    meta: { dateRange: 'Nov 2023', role: 'Solo project', license: 'MIT' },
    contributions: [
      'Custom graphics engine over raw OpenGL, with an integrated .shader compiler.',
      'Speed-dependent shading, so each particle is coloured by how fast it is moving.',
      'A custom vector class handling the forces and velocity integration.',
    ],
    sections: [
      {
        heading: 'Controls',
        rows: [
          ['Spawn a mass', 'Right click'],
          ['Drag the camera', 'Left click'],
        ],
      },
    ],
    gallery: [
      {
        src: nbodyDemo,
        alt: 'Masses spawned into the simulation, pulled into orbits and shaded by how fast they are moving',
        width: 600,
        height: 338,
      },
    ],
    primaryLink: { label: 'VIEW_ON_GITHUB', url: `${GH}/N-Body-Simulation` },
  },
  {
    slug: 'jsm_telemetry',
    title: 'JSM - Telemetry',
    category: 'software',
    breadcrumb: 'SYSTEMS',
    tagline: 'Go telemetry backend that replaced spreadsheet guesswork with real playtest data.',
    synopsis: [
      'Built a Go telemetry backend with goroutine-based concurrent request handling and PostgreSQL persistence to capture real-time playtester data, deployed on a hardened Hetzner Linux server with systemd process management, Caddy-automated TLS, and schema migrations.',
      'The point was to stop balancing Japanese Salaryman’s in-game economy on a spreadsheet and start balancing it on what playtesters actually did. A separate TypeScript dashboard reads the collected data.',
    ],
    tech: ['Go', 'PostgreSQL', 'TypeScript', 'Linux', 'systemd', 'Caddy'],
    meta: { role: 'Solo - backend, deploy and dashboard', dateRange: '2026', status: 'Internal tool @ Antikat Studios' },
    links: [
      { label: 'BACKEND_REPO', url: `${GH}/JSM-Telemetry` },
      { label: 'DASHBOARD_REPO', url: `${GH}/JSM-Telemetry-View` },
    ],
    related: [
      { label: 'JAPANESE_SALARYMAN', to: '/japanese_salaryman' },
      { label: 'EXPERIENCE > ANTIKAT', to: '/experience' },
    ],
  },
  {
    slug: 'antikat_site',
    title: 'antikat.site',
    category: 'software',
    breadcrumb: 'SOFTWARE',
    tagline: 'The studio site: a React SPA with a Firestore-backed devlog CMS, self-hosted.',
    synopsis: [
      'Antikat Studios’ public site and the storefront for Japanese Salaryman. A React single-page app with a games catalogue, devlogs, a press kit and a mailing-list signup.',
      'Devlogs are authored through an admin area gated by Firebase Auth and stored in Firestore, so posts go up without a redeploy. The whole thing is self-hosted behind Caddy rather than on a managed platform.',
    ],
    tech: ['React', 'TypeScript', 'Vite', 'React Router', 'Firebase', 'Firestore', 'Caddy', 'Linux'],
    meta: { role: 'Solo - design, build and deploy', status: 'Live' },
    primaryLink: { label: 'VISIT_ANTIKAT.SITE', url: 'https://antikat.site' },
    related: [{ label: 'JAPANESE_SALARYMAN', to: '/japanese_salaryman' }],
  },
  {
    slug: 'jsme_scripting',
    title: 'JSM - Cutscene Scripting',
    category: 'software',
    breadcrumb: 'SYSTEMS',
    tagline: 'An interpreted language, built so writers can script cutscenes without a programmer.',
    synopsis: [
      'Every scripted scene in Japanese Salaryman used to be a programmer task. JSME is a purpose-built language that moves that work to the people writing the story.',
      'It is a real implementation rather than a string parser: a lexer, a token-filtering pass, a recursive descent parser, command objects built by a factory, and a runner that executes them. About 1,700 lines of C# in its own assembly definition, covered by 36 unit tests, with a Unity asset importer so .jsme files are first-class project assets and a cache so repeated scenes are not re-parsed.',
      '49 scripts drive the shipped game: prologue cutscenes, per-day scene events, and weather.',
    ],
    tech: ['C#', 'Unity', 'Lexer / Parser', 'Interpreter'],
    meta: { role: 'Solo project', status: '49 scripts in the shipped game' },
    sections: [
      {
        heading: 'What a script looks like',
        body: ['From the prologue, the scene where Shuichi first appears:'],
        code: `RUN LockExit.EnableObject()
RUN normalLighting.DisableObject()
RUN shuichiLighting.EnableObject()
RUN issei.PauseMovement()
RUN coolCamera.LoadDialogue("day_4_player_confused")
RUN coolCamera.WaitForConversationComplete()
RUN issei.UnpauseMovement()
RUN shuichiJumpscare.EnableObject()
RUN DaysLoader.LoadDay(4)`,
      },
      {
        heading: 'The language',
        bullets: [
          'RUN calls a method on a named scene object, with typed arguments.',
          'SET, arithmetic, and the full set of comparison operators for state and branching.',
          'IF and GOTO with labels, so a scene can take different paths.',
          'ASYNC, AWAIT and ONCOMPLETE, because cutscenes are mostly a sequencing problem: some things run in parallel, some must finish before the next line.',
        ],
      },
    ],
    primaryLink: { label: 'VIEW_ON_GITHUB', url: `${GH}/JsmEventsScripting` },
    related: [{ label: 'JAPANESE_SALARYMAN', to: '/japanese_salaryman' }],
  },
  {
    slug: 'jsm_hacking',
    title: 'JSM - Hacking',
    category: 'software',
    breadcrumb: 'SYSTEMS',
    tagline: 'Tower defense as a budget problem, with a procedurally generated run map.',
    synopsis: [
      'The night half of Japanese Salaryman. Around 12,600 lines of C# across ~196 files, the second largest system in the game.',
      'You break into a server by placing towers on a grid, except the towers are arithmetic: adders, multipliers, mergers, copiers, accelerators, blockers and cloaks that transform packets moving along a line, so a working layout reads more like a small program than a wall of turrets.',
      'The constraint is the machine you are hacking from. Every placement is spent against a CPU allocation, a RAM cost, a boot time and a network budget, while the server\u2019s detection chance climbs and eventually ends the run.',
      'A run is a branching tree of servers generated per playthrough and populated with easy nodes, hard nodes, shops and save points, so which route you take through it is a real decision. It is drawn as a memory hex dump, with the nodes sitting in the bytes.',
      'Clearing a server pays out on how efficiently you did it, with a bonus for using a variety of towers rather than stacking one, and levels each tower type toward its next upgrade.',
    ],
    tech: ['C#', 'Unity', 'Unity Editor Tooling', 'Procedural Generation'],
    meta: {
      role: 'Solo, within Japanese Salaryman',
      engine: 'Unity',
      status: '~12,600 lines across ~196 files',
    },
    contributions: [
      'Ten tower types built as operators on a packet stream rather than as damage numbers.',
      'A resource model where CPU allocation, RAM cost, boot time and network bandwidth trade against each other and against how likely you are to be detected.',
      'Procedural run maps: a binary tree expanded and then filled to a target mix of easy, hard, shop and save nodes.',
      'A custom Unity editor window for designing hacking levels: an entity palette, per-level enemy tuning, and save, load and test-in-place.',
      'Run economy: payouts scaled by efficiency and tower variety, per-tower EXP and levels, and priced upgrades between servers.',
    ],
    gallery: [
      { src: hackGrid, alt: 'The hacking grid: adder and factor towers wired into a packet route, against CPU, RAM, boot and network budgets', width: 1400, height: 785 },
      { src: hackRunmap, alt: 'The generated run map drawn as a memory hex dump, with easy, hard, shop and complete nodes in the bytes', width: 1400, height: 782 },
      { src: hackEditor, alt: 'The custom Unity editor window for authoring hacking levels, with an entity palette and save, load and test', width: 1600, height: 900 },
      { src: hackPayout, alt: 'Payout screen: base pay scaled by an efficiency bonus and a variety bonus, plus EXP toward each tower', width: 1400, height: 779 },
    ],
    related: [{ label: 'JAPANESE_SALARYMAN', to: '/japanese_salaryman' }],
  },
  {
    slug: 'jsm_surveillance',
    title: 'JSM - Surveillance',
    category: 'software',
    breadcrumb: 'SYSTEMS',
    tagline: 'A tick-based production-chain simulation on a half-edge mesh of a city.',
    synopsis: [
      'The largest system in Japanese Salaryman, and the half of it that earns the "meets Factorio" comparison. Around 16,000 lines of C#.',
      'Stolen information is a raw material. The player lays out a grid of machines, inputs, processors, splitters, mergers and outputs, wires them together, and refines cheap data into something worth selling. Recipes consume input volumes and produce an output over a fixed number of ticks, and the whole factory advances on a simulation tick rather than on frame time.',
      'The city it sits on is a half-edge mesh. Each face is a map cell that knows its own population, and each surveillance source covers some fraction of the faces it touches, so coverage and overlap fall out of the mesh topology instead of being hand-authored.',
    ],
    tech: ['C#', 'Unity', 'UI Toolkit', 'Computational Geometry'],
    meta: {
      role: 'Solo, within Japanese Salaryman',
      status: '~16,000 lines across ~180 files',
    },
    contributions: [
      'Tick-based factory simulation over a grid, with recipes, resource volumes, and connection graphs between machines.',
      'Half-edge mesh representation of the city, with per-face population and fractional source coverage driving the surveillance layer.',
      'A custom binary save format, described below, replacing JSON.',
      'A half-edge graph editor as a Unity editor window, with a pan and zoom canvas drawn through painter2D, for authoring the map faces.',
      'A tech tree with its own node editor, where recipes and machines are unlockables.',
      'A shop for information sources, each with its own grid footprint and output, priced on an escalating curve so the twenty-first camera costs well over the first.',
    ],
    sections: [
      {
        heading: 'The save format',
        body: [
          'JSON could not describe this cleanly. The factory is a heterogeneous graph, so every record on the stream carries a one-byte type tag and the reader switches on it to build the right concrete class:',
        ],
        code: `DtoType type = (DtoType)reader.ReadByte();
switch (type)
{
    case DtoType.ProcessorInstance:
        var processor = new ProcessorInstanceDTO();
        processor.Read(reader);
        return processor;
    case DtoType.MergerInstance:
        ...
    default:
        throw new ArgumentException(
            "Tried to instantiate non valid Machine on file load");
}`,
      },
      {
        heading: 'Why it is more than a writer',
        bullets: [
          'The stream is versioned, so old saves stay loadable as the format moves.',
          'Machines reference sources by GUID on disk. Those are rehydrated into real object references only once the whole graph is in memory, because a machine can point at something that has not been read yet.',
          'A failed load throws and clears the partially built state rather than leaving the player with half a factory.',
        ],
      },
    ],
    gallery: [
      { src: survMesh, alt: 'Placing a camera on the city mesh, each face it reaches labelled with what that source contributes', width: 1400, height: 788 },
      { src: survChain, alt: 'A camera feed wired through a refining chain, raw observations combined into something sellable', width: 1400, height: 788 },
      { src: survCoverage, alt: 'Coverage falling off across neighbouring faces, warmer where sources overlap', width: 1400, height: 788 },
      { src: survEmporium, alt: 'Buying a CCTV camera in the Emporium, priced on an escalating curve', width: 1400, height: 840 },
      { src: survBoot, alt: 'The in-fiction boot screen: LOOKOUT v1.0, 1992 METTA SYSTEMS', width: 1400, height: 788 },
    ],
    links: [{ label: 'EARLY_PROTOTYPE_REPO', url: `${GH}/JSM_Surveillance_MVP` }],
    related: [
      { label: 'JAPANESE_SALARYMAN', to: '/japanese_salaryman' },
      { label: 'CUTSCENE_SCRIPTING', to: '/jsme_scripting' },
    ],
  },
  {
    slug: 'jsm_days',
    title: 'JSM - Day Editor',
    category: 'software',
    breadcrumb: 'SYSTEMS',
    tagline: 'A SQLite-backed Unity editor plugin so designers rebalance a game day without a build.',
    synopsis: [
      'Japanese Salaryman is a calendar. Every in-game day is a schedule of events, weather, NPC availability and social links, and all of it needs tuning constantly. Doing that in Unity inspectors or in code meant a programmer in the loop for every change.',
      'JsmDays is the editor plugin that removed that. Seven SQLite-backed databases behind a set of UI Toolkit windows: a day planner, plus dedicated editors for events, NPCs, weather, social links, social rank upgrades and scenes. Designers author the calendar directly and the game loads it at runtime.',
    ],
    tech: ['C#', 'Unity Editor', 'UI Toolkit / UXML', 'SQLite'],
    meta: { role: 'Solo, within Japanese Salaryman', status: 'In production use by the team' },
    contributions: [
      'Seven database classes over SQLite covering days, events, NPCs, scenes, weather, social links and social rank upgrades.',
      'A day planner view plus per-entity editor windows, laid out in UXML.',
      'Runtime loading, so the day system reads designer-authored data instead of hardcoded schedules.',
    ],
    related: [{ label: 'JAPANESE_SALARYMAN', to: '/japanese_salaryman' }],
  },
  {
    slug: 'member_sorting',
    title: 'VGDC Member Sorting',
    category: 'software',
    breadcrumb: 'SOFTWARE',
    tagline: 'Three days of manual team assignment, cut to under an hour.',
    synopsis: [
      'Designed and implemented an automated member-sorting algorithm in Python, cutting team assignment processing time from 3 days to under an hour.',
      'Every quarter VGDC has to place 120+ members across 10 concurrent game teams. Doing that by hand was three days of work; this does it in under one hour.',
    ],
    tech: ['Python'],
    meta: { role: 'Project Manager, VGDC @ UCI', dateRange: 'Feb 2025 - Present', status: 'Internal club tool - no public repo' },
    related: [{ label: 'EXPERIENCE > VGDC', to: '/experience' }],
  },
  {
    slug: 'roi_calculator',
    title: 'College ROI Calculator',
    category: 'software',
    breadcrumb: 'SOFTWARE',
    tagline: 'A cross-platform C++ terminal app for costing out a degree.',
    synopsis: [
      'A terminal tool that calculates the return on investment of attending a given college, from its yearly cost of attendance and the expected salary after graduation.',
      '"Wrote this in high school before I learned how to write cleaner C++. However, the C++ I wrote to create a terminal app in both Windows and OSX is still pretty neat."',
    ],
    tech: ['C++'],
    meta: { platforms: ['Windows', 'macOS'], license: 'MIT', role: 'Solo project' },
    contributions: [
      'Calculates and stores ROI for hundreds of colleges.',
      'Persists to a .csv file, so each college only has to be entered once.',
      'Searchable, and the output loads straight into Sheets or Excel.',
    ],
    primaryLink: { label: 'VIEW_ON_GITHUB', url: `${GH}/CollegeROI` },
  },
];

export const compactSoftware: CompactProject[] = [
  {
    title: 'Quake-But-Awesome',
    tagline: 'In-progress Vulkan renderer, built on the notes from the learning pass.',
    genre: 'C++ / Vulkan',
    url: `${GH}/Quake-But-awesome-`,
  },
  {
    title: 'Generic C++ Terminal Framework',
    tagline: 'A reusable framework for building terminal applications.',
    genre: 'C++',
    url: `${GH}/terminalApp`,
  },
  {
    title: 'Sorts Review',
    tagline: 'Reference implementations of the standard sorts, "in case I forget".',
    genre: 'C++',
    url: `${GH}/SortsReview`,
  },
  {
    title: 'Donut.cpp',
    tagline: 'Orthographic projection of a rotating donut.',
    genre: 'C++',
    url: `${GH}/Donut.cpp`,
  },
  {
    title: 'Vex Brain Serialization',
    tagline: 'Library for reading live data off a VEX V5 cortex.',
    genre: 'C++',
    url: `${GH}/Vex-Brain-Serialization-Project`,
  },
];
