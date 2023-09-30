import { FC } from 'react';
import { contactInfo } from 'data/contact';

// ========================================================
type SocialLinksProps = { className?: string };
// ========================================================



const SocialLinks: FC<SocialLinksProps> = ({ className = 'nav social social-white mt-4' }) => {
  return (
    <nav className={className}>
      {contactInfo.links.map(({ id, icon, url }) => (
        <a href={url} key={id} target="_blank" rel="noreferrer">
          <i className={icon} />
        </a>
      ))}
    </nav>
  );
};

export default SocialLinks;
