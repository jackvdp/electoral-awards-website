import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import FAQ from 'components/blocks/faq/FAQ';
import CTA from 'components/blocks/call-to-action/CTA';
import Team from 'components/blocks/team/Team';
import { useAuth } from 'auth/AuthProvider';

const Home: NextPage = () => {

  const { isLoggedIn } = useAuth()

  return (
    <Fragment>
      <PageProgress />

      <Navbar />

      <main className="content-wrapper">
        {/* ========== page title section ========== */}
        <section
          className="wrapper image-wrapper bg-image bg-overlay text-white"
          style={{ backgroundImage: 'url(/img/photos/bg22.png)' }}
        >
          <div className="container pt-19 pt-md-21 pb-18 pb-md-20 text-center">
            <div className="row">
              <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-6 mx-auto">
                <h1 className="display-1 text-white mb-3">19th Annual International Electoral Awards</h1>
                <p className="lead fs-lg px-md-3 px-lg-7 px-xl-9 px-xxl-10">
                Lisbon, Portugal<br /> 13th-16th November 2023
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-14 py-md-16">
            <FAQ />
        </div>

        <Team />

        <CTA />
        
      </main>

      {/* ========== footer section ========== */}
      <Footer />
    </Fragment>
  );
};

export default Home;
