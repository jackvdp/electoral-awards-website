import About from 'components/blocks/about/About';
import type { NextPage } from 'next';
import { Fragment } from 'react';
import { Navbar } from 'components/blocks/navbar'
import { Footer } from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';

const AboutPage: NextPage = () => {
    return (
        <Fragment>
            <PageProgress/>
            
            <Navbar/>

            <About />

            <Footer />
        </Fragment>
        
    );
}

export default AboutPage;