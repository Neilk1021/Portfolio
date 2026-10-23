import './App.css';
import { Link } from 'react-router-dom';
import ExpandableButton from './components/ExpandableButton';
import RouterLink from './components/RouterLink';
import TerminalLink from './components/TerminalLink';
import HomeBanner from './components/HomeBanner';
import { navTree } from './content';

function Home() {
  return (
    <div className="Page">
      <title>Neil Ketteringham // cnel.info</title>
      <div className="TerminalHeader">
        <h1>c:/Users/Neil</h1>
      </div>

      <HomeBanner />

      <div className="TerminalContent">
        {navTree.groups.map((group) => (
          <ExpandableButton name={group.name} key={group.name}>
            {group.items.map((item) => (
              <RouterLink name={item.name} link={item.to} key={item.to} />
            ))}
            <TerminalLink label={group.indexLabel} to={group.indexTo} className="RouterLink" />
          </ExpandableButton>
        ))}

        {navTree.links.map((link) => (
          <Link to={link.to} className="StaticLink" key={link.to}>
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
