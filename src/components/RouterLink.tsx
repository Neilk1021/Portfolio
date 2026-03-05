import { Link } from 'react-router-dom';
import './RouterLink.css'

interface IRouterLinkProps {
    name : string;
    link : string;
}

function RouterLink({name, link}: IRouterLinkProps) {
    return (
      <>
          <Link className={"RouterLink"} to={"/" + link}> {name} </Link>
      </>
    );
}

export default RouterLink;