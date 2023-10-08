import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import FAQ from 'components/blocks/faq/FAQ';
import CTA from 'components/blocks/call-to-action/CTA';
import Organisers from 'components/blocks/organisers/Organisers';
import { useAuth } from 'auth/AuthProvider';
import NextLink from 'components/reuseable/links/NextLink';

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
          <div className="container pt-10 pt-md-20 pb-10 pb-md-20 text-center">
            <div className="row">
              <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-6 mx-auto">
                <h1 className="display-1 text-white mb-3">19th Annual International Electoral Awards</h1>
                <p className="lead fs-lg px-md-3 px-lg-7 px-xl-9 px-xxl-10">
                  Lisbon, Portugal<br /> 13th-16th November 2023
                </p>
                <p className="lead fs-md px-md-3 px-lg-7 px-xl-9 px-xxl-10">
                  <i>Recognising excellence in electoral management</i>
                </p>
                <NextLink title="Register" href="/register" className="btn btn-soft-blue rounded-pill mt-2" />
              </div>
            </div>
          </div>
        </section>

        <div className="container pt-14 pt-md-16 pb-7 pt-md-8">

          <div className='mb-15'>
            <p className="mb-5 px-lg-12 px-xl-15">
              Welcome to the 19th International Electoral Affairs Symposium &amp; Awards Ceremony, a four-day event held from <b>13th to 16th November 2023.</b>
            </p>
            <p className="mb-5 px-lg-12 px-xl-15">
              This event is organized by the <b>International Centre for Parliamentary Studies</b> in collaboration with the <b>Portuguese National Electoral Commission</b>, and will draw together leading figures in the world of electoral affairs, and recognise excellence in electoral management.
            </p>
            <p className="px-lg-12 px-xl-15">
              {"Be part of the dynamic dialogue, participate in enlightening panel discussions, and join us in celebrating the significant contributions to electoral democracy at the prestigious Awards Ceremony. Don't miss this exclusive opportunity to engage, share, and learn with global peers."}
            </p >
          </div>

          <FAQ />

        </div>

        <Organisers />

        <CTA />

      </main>

      {/* ========== footer section ========== */}
      <Footer />
    </Fragment>
  );
};

export default Home;
