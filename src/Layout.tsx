import { Outlet, ScrollRestoration } from 'react-router-dom';

/**
 * Shared layout for every route.
 *
 * It deliberately does NOT own the terminal header: header text is page-local
 * data (the blog post title comes from an async Firestore read, a project's
 * comes from the content record), so hoisting it would mean either a route
 * `handle` that can't express those cases or a context write that flashes the
 * previous page's header for a frame.
 *
 * ScrollRestoration must be mounted exactly once app-wide, which is why it
 * lives here. It also fixes landing mid-page after following a link.
 */
export default function Layout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}
