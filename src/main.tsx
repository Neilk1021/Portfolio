import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Self-hosted so the entire visual identity of the site doesn't wait on a
// third-party handshake. This was declared in CSS but never actually loaded.
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-700.css';
import './index.css';

import { routes } from './routes';

// Real paths, not #/paths. A fragment never reaches the server, so while the
// site was hash-routed every shared link arrived as a bare GET / and every
// unfurl showed the same card. scripts/prerender.tsx writes one real HTML file
// per URL so a crawler gets that page's own tags; that only works if the URL
// carries the path. See README "Share cards".
//
// Links shared under the old scheme still arrive as /#/blog/<id>, and only the
// client can honour them - rewrite before the router reads the location.
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1));
}

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
