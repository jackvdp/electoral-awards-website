import About from 'components/blocks/about/About';
import type { NextPage } from 'next';
import { Fragment } from 'react';
import { Navbar } from 'components/blocks/navbar'
import { Footer } from 'components/blocks/footer';

const AboutPage: NextPage = () => {
    return (
        <Fragment>
            <Navbar/>

            <About />

            <Footer />
        </Fragment>
        
    );
}

export default AboutPage;