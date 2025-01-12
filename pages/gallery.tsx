import {NextPage} from 'next';
import {Fragment} from 'react';
// -------- custom component -------- //
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import ImageGallery from 'components/blocks/gallery/ImageGallery';
import PageProgress from 'components/common/PageProgress';
import CustomHead from "../src/components/common/CustomHead";

const Gallery: NextPage = () => {

    return (
        <Fragment>
            <CustomHead
                title="Gallery"
                description="View photos from electoral events, conferences, and professional gatherings of the Electoral Stakeholders' Network community."
            />
            <PageProgress/>

            <Navbar/>

            <SimpleBanner title={"Gallery"}></SimpleBanner>

            <ImageGallery/>

            <Footer/>
        </Fragment>
    );
};

export default Gallery;

