import {NextPage} from 'next';
import {Fragment} from 'react';
// -------- custom component -------- //
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import Judges from 'components/blocks/judges/Judges2023';
import PageProgress from 'components/common/PageProgress';
import CustomHead from "../../src/components/common/CustomHead";

const JudgesPage: NextPage = () => {
    return (
        <Fragment>
            <CustomHead
                title="Judges – 20th International Electoral Awards"
                description="Celebrating excellence in electoral management. Recognizing outstanding contributions and innovations in election administration and democratic processes."
            />
            <PageProgress/>

            <Navbar/>

            <SimpleBanner title={"Judges"}/>

            <main className="content-wrapper">

                <Judges/>

            </main>

            <Footer/>
        </Fragment>
    );
};

export default JudgesPage;