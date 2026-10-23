import type { ReactNode } from 'react';

interface Props {
  tone?: 'info' | 'error' | 'ok';
  children: ReactNode;
}

const COLOR = {
  info: 'var(--fg-bright)',
  error: 'var(--danger)',
  ok: 'var(--ok)',
} as const;

/**
 * Terminal-style status line for async states.
 *
 * The reason this is a component rather than a styled <p> is `aria-live`:
 * every loading / error transition on the site used to be silent to a screen
 * reader.
 */
export default function StatusLine({ tone = 'info', children }: Props) {
  return (
    <p role="status" aria-live="polite" style={{ color: COLOR[tone] }}>
      {'> '}
      {children}
    </p>
  );
}
