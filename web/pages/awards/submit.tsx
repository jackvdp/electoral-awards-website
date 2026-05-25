import {NextPage} from 'next';
import {Fragment} from 'react';
// -------- custom component -------- //
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import ApplicationForm from 'components/blocks/awards/ApplicationForm';
import CustomHead from "../../src/components/common/CustomHead";

const SubmitPage: NextPage = () => {

    return (
        <Fragment>
            <CustomHead
                title="Submit Your Nomination – 22nd International Electoral Awards"
                description="Celebrating excellence in electoral management. Recognizing outstanding contributions and innovations in election administration and democratic processes."
            />
            <PageProgress/>

            <Navbar/>

            <main className="content-wrapper">

                <SimpleBanner title={"Submit Nomination for 22nd International Electoral Awards"}></SimpleBanner>

                <div
                    className="container pt-14 pt-md-16 pb-7 pt-md-8 d-flex flex-column justify-content-center align-items-center">
                    <ApplicationForm/>
                </div>

            </main>

            {/* ========== footer section ========== */}
            <Footer/>
        </Fragment>
    );
};

export default SubmitPage;
