import About from 'components/blocks/about/About';
import type {NextPage} from 'next';
import {Fragment} from 'react';
import {Navbar} from 'components/blocks/navbar'
import {Footer} from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import CustomHead from "../src/components/common/CustomHead";

const AboutPage: NextPage = () => {
    return (
        <Fragment>
            <CustomHead
                title="About"
                description="Learn about the Electoral Stakeholders' Network, our mission to strengthen electoral processes worldwide through professional networking, knowledge sharing, and capacity building."
            />
            <PageProgress/>

            <Navbar/>

            <About/>

            <Footer/>
        </Fragment>

    );
}

export default AboutPage;