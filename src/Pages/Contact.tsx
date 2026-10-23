import './Project.css';
import TerminalHeader from '../components/TerminalHeader';
import { profile } from '../content';

export default function Contact() {
  return (
    <div className="Page">
      <TerminalHeader path="Users/Neil/Contact" docTitle="Contact // cnel.info" />

      <div className="TerminalContent">
        <h2>Get in Touch</h2>

        <dl className="MetaTable">
          {profile.emails.map((email) => (
            <div key={email.address} style={{ display: 'contents' }}>
              <dt>{email.label}</dt>
              <dd>
                <a href={`mailto:${email.address}`}>{email.address}</a>
              </dd>
            </div>
          ))}
          {profile.socials.map((social) => (
            <div key={social.url} style={{ display: 'contents' }}>
              <dt>{social.label}</dt>
              <dd>
                <a href={social.url} target="_blank" rel="noopener noreferrer">
                  {social.url.replace(/^https?:\/\//, '')}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
