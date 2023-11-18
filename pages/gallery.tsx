import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import useLightBox from 'hooks/useLightBox';
import ImageCard from 'components/blocks/gallery/ImageCard';

const Gallery: NextPage = () => {
    useLightBox();

    return (
        <Fragment>
            <Navbar />

            <SimpleBanner title={"Gallery"}></SimpleBanner>

            <main className="content-wrapper">

                <section className="wrapper bg-light px-md-20 px-2 py-md-10 py-5 container">
                    <div className="row gy-6">
                        <ImageCard name='alberto.jpg' />

                        <ImageCard name='barros.jpg' />

                        <ImageCard name='bruter.jpg' />

                        <ImageCard name='hicks.jpg' />
                    </div>
                </section>

            </main>

            <Footer />
        </Fragment>
    );
};

export default Gallery;

