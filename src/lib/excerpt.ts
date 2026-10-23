/**
 * Post markdown to one line of prose.
 *
 * Shared by the blog index and scripts/prerender.ts so a post's preview text
 * and its share card can never disagree. The index used to strip only images,
 * so a post whose body opened with "## Foreword" showed the literal hashes.
 */

/** Longest excerpt worth writing. Cards clip somewhere around here anyway. */
export const EXCERPT_LIMIT = 200;

/** Strips the markdown syntax that would otherwise show up as punctuation. */
export function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Truncates on a word boundary rather than mid-word. */
export function clamp(text: string, max = EXCERPT_LIMIT): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(' ');
  const kept = space > max * 0.6 ? cut.slice(0, space) : cut;
  return `${kept.replace(/[\s,;:.!?-]+$/, '')}...`;
}

/**
 * What a reader sees before opening the post: on /blog, and in the unfurl when
 * the link is shared. A description the author wrote is used verbatim, because
 * they chose those words for exactly this slot. Only the automatic fallback
 * gets trimmed.
 */
export function excerpt(description: string | undefined, content: string): string {
  const written = description?.trim();
  return written || clamp(plainText(content ?? ''));
}
