import { Link } from 'react-router-dom';

interface Props {
  /** Path shown after the fixed "c:/" prefix, e.g. "Users/Neil/About". */
  path: string;
  /** Where the header links back to. Defaults to the site root. */
  backTo?: string;
  /** Overrides the document title, which otherwise uses the last path segment. */
  docTitle?: string;
}

/**
 * The breadcrumb header every page shares. It takes the whole path as a string
 * and never tries to parse its structure, which is why the site's inconsistent
 * casing ("Users/Neil/About" vs "GAMES/JAPANESE_SALARYMAN") survives intact.
 *
 * The bare <title> works because React 19 hoists document metadata into <head>
 * from anywhere in the tree - no helmet dependency needed.
 */
export default function TerminalHeader({ path, backTo = '/', docTitle }: Props) {
  const last = path.split('/').filter(Boolean).pop() ?? 'cnel.info';
  const title = docTitle ?? `${last.replace(/_/g, ' ')} // cnel.info`;

  return (
    <>
      <title>{title}</title>
      <Link to={backTo} className="TerminalHeader" aria-label={`Back to ${backTo === '/' ? 'home' : backTo}`}>
        <h1>c:/{path}</h1>
      </Link>
    </>
  );
}
