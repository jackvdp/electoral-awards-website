import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import { events } from 'data/events';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import EventCard from 'components/blocks/events/EventCard';

const Events: NextPage = () => {
    return (
        <Fragment>
            <Navbar />

            <SimpleBanner title={"Events"}></SimpleBanner>

            <main className="content-wrapper">
                <section className="wrapper bg-light px-md-20 px-2 py-md-10 py-5 container">

                    <div className='row'>
                        {events.map((event, index) => (
                            <div key={index} className='col-md-6 col-12 d-flex justify-content-center py-2'>
                                <EventCard event={event} index={index} />
                            </div>
                        ))}
                    </div>

                </section>
            </main>

            <Footer />
        </Fragment>
    );
};

export default Events;