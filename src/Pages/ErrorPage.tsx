import { isRouteErrorResponse, useLocation, useRouteError } from 'react-router-dom';
import TerminalHeader from '../components/TerminalHeader';
import TerminalLink from '../components/TerminalLink';

/**
 * Both of these render their own .Page frame rather than relying on the layout:
 * when a child route throws, react-router swaps out the parent's element for
 * its errorElement, so the layout chrome is gone by then.
 */
export default function ErrorPage() {
  const error = useRouteError();

  let detail = 'An unknown fault occurred.';
  if (isRouteErrorResponse(error)) detail = `${error.status} ${error.statusText}`;
  else if (error instanceof Error) detail = error.message;

  return (
    <div className="Page">
      <TerminalHeader path="Users/Neil/ERROR" docTitle="Error // cnel.info" />
      <div className="TerminalContent">
        <p style={{ color: 'var(--danger)' }}>{'> FATAL: UNHANDLED_EXCEPTION'}</p>
        <p style={{ color: 'var(--danger)' }}>{`> ${detail}`}</p>
        <div className="LinkRow">
          <TerminalLink label="RETURN_TO_ROOT" to="/" />
        </div>
      </div>
    </div>
  );
}

export function NotFound() {
  const { pathname } = useLocation();

  return (
    <div className="Page">
      <TerminalHeader path="Users/Neil/404" docTitle="Not found // cnel.info" />
      <div className="TerminalContent">
        <p style={{ color: 'var(--danger)' }}>{'> FATAL: PATH_NOT_FOUND'}</p>
        <p>{`> REQUESTED: ${pathname}`}</p>
        <p>{'> No such file or directory.'}</p>
        <div className="LinkRow">
          <TerminalLink label="RETURN_TO_ROOT" to="/" />
          <TerminalLink label="ALL_GAMES" to="/games" />
          <TerminalLink label="ALL_PROJECTS" to="/software" />
        </div>
      </div>
    </div>
  );
}
