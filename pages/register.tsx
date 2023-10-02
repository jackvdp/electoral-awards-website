import { NextPage } from 'next';
import { Fragment, useEffect } from 'react';
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import Contact from 'components/blocks/contact/Contact';
import { useRouter } from 'next/router';
import { useAuth } from 'auth/AuthProvider';

const CTA: NextPage = () => {

  const router = useRouter();
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn]);

  return (
    <Fragment>
      <PageProgress />

      <Navbar />

      <main className="content-wrapper bg-gray">

        <div className="container py-14 py-md-16">
          <Contact
            title='Register Your Place'
            subtitle='Complete the form below to register for the 19th Annual International Electoral Awards & Symposium.'
            showMessage={false}
            sendButtonTitle='Register'
            signUp={true}
          />
        </div>

      </main>

      {/* ========== footer section ========== */}
      <Footer />
    </Fragment>
  );
};

export default CTA;
