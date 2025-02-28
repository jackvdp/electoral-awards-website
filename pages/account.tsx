import {GetServerSideProps, NextPage} from 'next';
import {Fragment} from 'react';
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import Account from 'components/blocks/account/Account';
import CustomHead from "components/common/CustomHead";
import {createClient} from "backend/supabase/server-props";
import {User} from "@supabase/supabase-js";
import {createMutableUserData, MutableUserData} from "../src/backend/models/user";

interface AccountPageProps {
    user: MutableUserData
}

const AccountPage: NextPage<AccountPageProps> = ({user}) => {

    return (
        <Fragment>
            <CustomHead
                title="Account"
                description="Manage your Electoral Stakeholders' Network profile, update your professional information, and customize your network preferences and notifications."
            />
            <PageProgress/>

            <Navbar/>

            <Account user={user}/>

            <Footer/>
        </Fragment>
    );
};

export default AccountPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const supabase = createClient(ctx);

    // Check session; ensure an admin session
    const {data: {session}} = await supabase.auth.getSession();
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {
            user: createMutableUserData(session.user)
        }
    }
}