import { contactInfo } from "data/contact";

const Social = () => {
  return (
    <li className="nav-item d-none d-lg-block">
      <nav className="nav social social-muted justify-content-end text-end">
        {contactInfo.links.map(({ id, icon, url }) => (
          <a href={url} key={id}>
            <i className={icon} />
          </a>
        ))}
      </nav>
    </li>
  );
};

export default Social;
