import { Link } from 'react-router-dom';
import './RouterLink.css';

interface Props {
  name: string;
  /** Internal route segment; a leading slash is added for you. */
  link?: string;
  /** External URL. Renders an <a> instead of a <Link>. */
  href?: string;
}

function RouterLink({ name, link, href }: Props) {
  if (href) {
    return (
      <a className="RouterLink" href={href} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
    );
  }
  return (
    <Link className="RouterLink" to={`/${link ?? ''}`}>
      {name}
    </Link>
  );
}

export default RouterLink;
