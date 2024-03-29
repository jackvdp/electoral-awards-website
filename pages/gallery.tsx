import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import ImageGallery from 'components/blocks/gallery/ImageGallery'; 
import PageProgress from 'components/common/PageProgress';

const Gallery: NextPage = () => {
    
    return (
        <Fragment>
            <PageProgress />

            <Navbar />

            <SimpleBanner title={"Gallery"}></SimpleBanner>
            
            <ImageGallery />

            <Footer />
        </Fragment>
    );
};

export default Gallery;

