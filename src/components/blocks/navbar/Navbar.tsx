import { FC, Fragment, ReactElement, useRef } from 'react';
// -------- custom hook -------- //
import useSticky from 'hooks/useSticky';
import { useAuth } from 'auth/AuthProvider';
// -------- custom component -------- //
import NextLink from 'components/reuseable/links/NextLink';
import SocialLinks from 'components/reuseable/links/SocialLinks';
import ListItemLink from 'components/reuseable/links/ListItemLink';
import DropdownToggleLink from 'components/reuseable/links/DropdownToggleLink';
// -------- partial header component -------- //
import Info from './partials/Info';
import Signin from './partials/Signin';
import Signup from './partials/Signup';
// -------- data -------- //
import { contactInfo } from 'data/contact';

// ===================================================================
type NavbarProps = {
  info?: boolean;
  cart?: boolean;
  fancy?: boolean;
  logoAlt?: string;
  search?: boolean;
  social?: boolean;
  language?: boolean;
  stickyBox?: boolean;
  navClassName?: string;
  button?: ReactElement;
  navOtherClass?: string;
};
// ===================================================================

const NavbarICPS = () => {
  return (
    <header className="wrapper mb-1">
      <Navbar
        info
        social
        navClassName="navbar navbar-expand-lg center-nav"
      />
    </header>
  )
}

const Navbar: FC<NavbarProps> = (props) => {
  const { navClassName, info, social, fancy, navOtherClass, stickyBox } =
    props;

  const sticky = useSticky(350);
  const navbarRef = useRef<HTMLElement | null>(null);
  const { isLoggedIn } = useAuth()

  // dynamically render the logo
  const logo = 'ICPSLogo';
  // dynamically added navbar classname
  const fixedClassName = 'navbar navbar-expand-lg center-nav transparent navbar-light navbar-clone fixed';

  // all main header contents
  const headerContent = (
    <Fragment>
      <div className="navbar-brand w-100">
        <NextLink href="/" title={<img alt="logo" src={`/img/${logo}.png`} srcSet={`/img/${logo}@2x.png 2x`} />} />
      </div>

      <div id="offcanvas-nav" data-bs-scroll="true" className="navbar-collapse offcanvas offcanvas-nav offcanvas-start">
        <div className="offcanvas-header d-lg-none">
          <NextLink href="/" title={<img className="mb-4 ms-n1" src="/img/ICPSLogo-White.png" width={120} alt="" />} />
          <button type="button" aria-label="Close" data-bs-dismiss="offcanvas" className="btn-close btn-close-white" />
        </div>

        <div className="offcanvas-body ms-lg-auto d-flex flex-column h-100">
          <ul className="navbar-nav">
            <ListItemLink title="Home" href='/' />
            
            <li className="nav-item dropdown">
              <DropdownToggleLink title="Programme" className="nav-link dropdown-toggle" />
              <ul className="dropdown-menu">
                <ListItemLink href="/schedule" title="Schedule" linkClassName="dropdown-item" />
                <ListItemLink href="/events" title="Events" linkClassName="dropdown-item" />
              </ul>
            </li>

            <li className="nav-item dropdown">
              <DropdownToggleLink title="Awards" className="nav-link dropdown-toggle" />
              <ul className="dropdown-menu">
                <ListItemLink href="/categories" title="Categories" linkClassName="dropdown-item" />
                <ListItemLink href="/judges" title="Judges" linkClassName="dropdown-item" />
              </ul>
            </li>

            <ListItemLink title="Location" href='/location' />
            <ListItemLink title="Contact" href='/contact' />
          </ul>

          {/* ============= show contact info in the small device sidebar ============= */}
          <div className="offcanvas-footer d-lg-none">
            <div>
              <NextLink title={contactInfo.email} className="link-inverse" href={contactInfo.emailPrompt} />
              <br />
              <NextLink href={contactInfo.phonePrompt} title={contactInfo.phone} />
              <br />
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>

      {/* ============= right side header content ============= */}
      <div className={navOtherClass}>
        <ul className="navbar-nav flex-row align-items-center ms-auto">
          {/* ============= info button ============= */}
          {info && (
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="offcanvas" data-bs-target="#offcanvas-info">
                <i className="uil uil-info-circle" />
              </a>
            </li>
          )}

          {/* ============= Join button ============= */}
          {!isLoggedIn &&
            <li className="nav-item">
              <NextLink title="Register" href="/register" className="btn btn-sm btn-primary rounded" />
            </li>}

          {/* ============= Sign in/out button ============= */}
          {/* <li className="nav-item">
            {
              isLoggedIn ?
                <NextLink
                  title="Account"
                  className="btn btn-sm btn-outline-secondary my-custom-btn"
                  href='/account' /> :
                <button
                  className="btn btn-sm btn-outline-secondary my-custom-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-signin">
                  Sign In
                </button>
            }
          </li> */}


          {/* ============= humburger button for small device ============= */}
          <li className="nav-item d-lg-none">
            <button data-bs-toggle="offcanvas" data-bs-target="#offcanvas-nav" className="hamburger offcanvas-nav-btn">
              <span />
            </button>
          </li>
        </ul>
      </div>
    </Fragment>
  );

  return (
    <Fragment>
      {stickyBox && <div style={{ paddingTop: sticky ? navbarRef.current?.clientHeight : 0 }} />}

      <nav ref={navbarRef} className={sticky ? fixedClassName : navClassName}>
        {fancy ? (
          <div className="container">
            <div className="navbar-collapse-wrapper bg-white d-flex flex-row flex-nowrap w-100 justify-content-between align-items-center">
              {headerContent}
            </div>
          </div>
        ) : (
          <div className="container flex-lg-row flex-nowrap align-items-center">{headerContent}</div>
        )}
      </nav>

      {/* ============= signin modal ============= */}
      <Signin />

      {/* ============= signup modal ============= */}
      <Signup />

      {/* ============= info sidebar ============= */}
      {info && <Info />}
    </Fragment>
  );
};

// set deafult Props
Navbar.defaultProps = {
  cart: false,
  info: false,
  social: false,
  search: false,
  language: false,
  stickyBox: true,
  navOtherClass: 'navbar-other w-100 d-flex ms-auto',
  navClassName: 'navbar navbar-expand-lg center-nav transparent navbar-light'
};



export default NavbarICPS;
