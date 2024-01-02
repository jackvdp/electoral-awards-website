import { NextPage } from 'next';
import { Fragment, useEffect } from 'react';
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import Register from 'components/blocks/register/Register';
import { useRouter } from 'next/router';
import { useAuth } from 'auth/AuthProvider';

const RegisterPage: NextPage = () => {

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
          <Register />
        </div>

      </main>

      {/* ========== footer section ========== */}
      <Footer />
    </Fragment>
  );
};

export default RegisterPage;
