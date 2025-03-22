import {NextPage} from 'next';
import {Fragment, useEffect} from 'react';
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import Register from 'components/blocks/register/Register';
import {useRouter} from 'next/router';
import {useAuth} from 'auth/useAuth';
import CustomHead from "../src/components/common/CustomHead";

const RegisterPage: NextPage = () => {

    const router = useRouter();
    const {isLoggedIn} = useAuth()

    useEffect(() => {
        if (isLoggedIn) {
            // Get the referrer from query parameter or default to account page
            const { redirect } = router.query;
            const redirectPath = typeof redirect === 'string' ? redirect : '/account';
            router.push(redirectPath);
        }
    }, [isLoggedIn, router.query]);

    return (
        <Fragment>
            <CustomHead
                title="Register"
                description="Join the Electoral Stakeholders' Network. Create an account to connect with electoral professionals, access exclusive resources, and participate in our global community."
            />
            <PageProgress/>

            <Navbar/>

            <main className="content-wrapper bg-gray">

                <div className="container py-14 py-md-16">
                    <Register/>
                </div>

            </main>

            {/* ========== footer section ========== */}
            <Footer/>
        </Fragment>
    );
};

export default RegisterPage;
