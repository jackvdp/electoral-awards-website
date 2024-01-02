import { NextPage } from 'next';
import { Fragment, useEffect } from 'react';
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import Account from 'components/blocks/account/Account';
import { useRouter } from 'next/router';
import { useAuth } from 'auth/AuthProvider';

const AccountPage: NextPage = () => {

    const router = useRouter();
    const { isLoggedIn } = useAuth()

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn]);

    return (
        <Fragment>
            <PageProgress />

            <Navbar />

            <Account />

            <Footer />
        </Fragment>
    );
};

export default AccountPage;