import {NextPage} from 'next';
import {Fragment, useEffect} from 'react';
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import Account from 'components/blocks/account/Account';
import {useRouter} from 'next/router';
import {useAuth} from 'auth/AuthProvider';
import CustomHead from "../src/components/common/CustomHead";

const AccountPage: NextPage = () => {

    const router = useRouter();
    const {isLoggedIn} = useAuth()

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn]);

    return (
        <Fragment>
            <CustomHead
                title="Account"
                description="Manage your Electoral Stakeholders' Network profile, update your professional information, and customize your network preferences and notifications."
            />
            <PageProgress/>

            <Navbar/>

            <Account/>

            <Footer/>
        </Fragment>
    );
};

export default AccountPage;