import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import Layout from './Layout';
import Home from './Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Resume from './Pages/Resume';
import Experience from './Pages/Experience';
import OpenSource from './Pages/OpenSource';
import GamesIndex from './Pages/GamesIndex';
import SoftwareIndex from './Pages/SoftwareIndex';
import ProjectPage from './Pages/ProjectTemplate';
import ErrorPage, { NotFound } from './Pages/ErrorPage';
import Blog from './Pages/Blog/Blog';
import Admin from './Pages/Blog/Admin';
import BlogPostDetail from './Pages/Blog/BlogPostDetail';
import { allFeatured, legacyRedirects } from './content';

/**
 * Exported separately from main.tsx so tests can mount the real route table
 * instead of rendering page components directly - rendering a page by hand
 * skips the routing layer, which is exactly where the last bug lived.
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },

      { path: 'games', element: <GamesIndex /> },
      { path: 'software', element: <SoftwareIndex /> },
      { path: 'experience', element: <Experience /> },
      { path: 'open_source', element: <OpenSource /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'resume', element: <Resume /> },

      { path: 'blog', element: <Blog /> },
      { path: 'blog/admin', element: <Admin /> },
      { path: 'blog/:id', element: <BlogPostDetail /> },

      // URLs shared before things were renamed.
      ...Object.entries(legacyRedirects).map(([from, to]) => ({
        path: from,
        element: <Navigate to={`/${to}`} replace />,
      })),

      // One explicit route per project, each handed its own record. No
      // :slug lookup - the route already knows which project it is.
      ...allFeatured.map((project) => ({
        path: project.slug,
        element: <ProjectPage project={project} />,
      })),

      { path: '*', element: <NotFound /> },
    ],
  },
];
