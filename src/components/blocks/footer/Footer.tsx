import { FC } from 'react';
// -------- custom component -------- //
import NextLink from 'components/reuseable/links/NextLink';
import SocialLinks from 'components/reuseable/links/SocialLinks';
// -------- data -------- //
import { contactInfo } from 'data/contact';

const Footer: FC = () => {
  return (
    <footer className="bg-dark text-inverse">
      <div className="container py-13 py-md-15">
        <div className="row gy-6 gy-lg-0">
          <div className="col-lg-4">
            <div className="widget">
              <img className="mb-4 ms-n1" src="/img/logos/ICPSLogo-White.png" width={120} alt="" />

              <p className="mb-4">
                © 2023 ICPS. <br className="d-none d-lg-block" />
                All rights reserved.
              </p>

              <SocialLinks className="nav social social-white" />
            </div>
          </div>

          <div className="col-md-4 col-lg-2 offset-lg-3">
            <div className="widget">
              <h4 className="widget-title text-white mb-3">Quick Links</h4>
              <ul className="list-unstyled  mb-0">
                {footerNav.map(({ title, url }) => (
                  <li key={title}>
                    <NextLink title={title} href={url} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-4 col-lg-2 ">
            <div className="widget">
              <h4 className="widget-title mb-3 text-white">Get in Touch</h4>
              <address>{contactInfo.address}</address>
              <NextLink title={contactInfo.email} href={contactInfo.emailPrompt} />
              <br /> {contactInfo.phone}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

const footerNav = [
  { title: 'About Us', url: '/about' },
  { title: 'Our Courses', url: 'https://parlicentre.org/courses/' },
  { title: 'Upcoming Courses', url: 'https://parlicentre.org/courses/upcoming' },
  { title: 'Terms of Use', url: 'https://parlicentre.org/terms-conditions' },
  { title: 'Privacy Policy', url: 'https://parlicentre.org/privacy-policy' }
];