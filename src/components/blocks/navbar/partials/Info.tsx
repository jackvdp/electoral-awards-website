import NextLink from 'components/reuseable/links/NextLink';
import SocialLinks from 'components/reuseable/links/SocialLinks';
import { FC, Fragment, ReactElement } from 'react';
import { contactInfo } from 'data/contact';

// ========================================================
type InfoProps = {
  title?: string;
  phone?: string;
  description?: string;
  address?: string | ReactElement;
};
// ========================================================

const Info = () => {

  const otherPages = [
    { title: 'Terms of Use', url: 'https://parlicentre.org/terms-conditions' },
    { title: 'Privacy Policy', url: 'https://parlicentre.org/privacy-policy' },
    { title: 'Contact Us', url: '/contact' }
  ];

  return (
    <div className="offcanvas offcanvas-end text-inverse" id="offcanvas-info" data-bs-scroll="true">
      <div className="offcanvas-header">
        <img src="/img/logos/ICPSLogo-White.png" alt="ICPS logo" height="75" width="112" />
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>

      <div className="offcanvas-body pb-6">
        <div className="widget mb-8">
          <p>{contactInfo.about}</p>
        </div>

        <div className="widget mb-8">
          <h4 className="widget-title text-white mb-3">Contact Info</h4>
          <address>{contactInfo.address}</address>
          <NextLink
            title={contactInfo.email}
            className="link-inverse"
            href={contactInfo.emailPrompt}
          />
          <br />
          <NextLink href={contactInfo.phonePrompt} title={contactInfo.phone} />
        </div>

        <div className="widget mb-8">
          <h4 className="widget-title text-white mb-3">Learn More</h4>
          <ul className="list-unstyled">
            {otherPages.map((item) => (
              <li key={item.title}>
                <NextLink href={item.url} title={item.title} />
              </li>
            ))}
          </ul>
        </div>

        <div className="widget">
          <h4 className="widget-title text-white mb-3">Follow Us</h4>
          <SocialLinks className="nav social social-white" />
        </div>
      </div>
    </div>
  );
};

export default Info;
