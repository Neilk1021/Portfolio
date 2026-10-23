import type { Education, SkillGroup } from './types';

export const education: Education = {
  institution: 'University of California, Irvine',
  shortName: 'UC Irvine',
  school: 'School of Information & Computer Sciences',
  degree: 'Bachelor of Science in Computer Science',
  graduation: 'Fall 2027',
  gpa: '3.97',
};

export const skills: SkillGroup[] = [
  {
    label: 'LANGUAGES',
    items: ['C++', 'C#', 'Java', 'Scala', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'Go', 'Lisp', 'Prolog'],
  },
  {
    label: 'SYSTEMS / GRAPHICS',
    items: ['Vulkan API', 'OpenGL', 'GLSL', 'Memory Management', 'Multi-threading / Concurrency'],
  },
  {
    label: 'FRAMEWORKS / WEB',
    items: ['Angular', 'Unity', 'REST APIs', 'WebSockets', 'OpenID', 'OAuth 2.0', 'JWT'],
  },
  {
    label: 'DATA / TOOLS',
    items: ['PostgreSQL', 'jOOQ', 'HikariCP', 'Liquibase', 'sbt', 'Git', 'Docker', 'Linux'],
  },
];
