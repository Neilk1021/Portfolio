/** Tag identity IS its slug (see firestore.rules `tags/{tagId}`), so creation
 *  has to fold whatever the admin types into the same charset the rules
 *  enforce: lowercase, hyphen-separated, 1-40 chars. */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}
