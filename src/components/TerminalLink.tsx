import { Link } from 'react-router-dom';
import './TerminalLink.css';

interface Props {
  /** Text between the brackets, e.g. "STEAM_PAGE" renders as [ STEAM_PAGE ]. */
  label: string;
  /** External or file URL. */
  href?: string;
  /** Internal route. Takes precedence over href. */
  to?: string;
  /** 'boxed' is the full-width bordered CTA; 'inline' is underlined text. */
  variant?: 'inline' | 'boxed';
  className?: string;
}

const isExternal = (href: string) => /^(https?:)?\/\//.test(href);

/**
 * Bracketed pseudo-command link. Two variants because the site genuinely uses
 * two treatments - underlined inline links in body copy, and the bordered
 * invert-on-hover box for a page's primary action.
 */
export default function TerminalLink({ label, href, to, variant = 'inline', className }: Props) {
  const cls = [variant === 'boxed' ? 'SteamButton' : 'TermLink', className].filter(Boolean).join(' ');
  const text = `[ ${label} ]`;

  if (to) {
    return (
      <Link to={to} className={cls}>
        {text}
      </Link>
    );
  }

  if (!href) return null;

  const external = isExternal(href);
  return (
    <a
      href={href}
      className={cls}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {text}
    </a>
  );
}
