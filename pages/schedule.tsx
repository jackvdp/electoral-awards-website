import { NextPage } from 'next';
import { useState, Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import { schedule, Day } from 'data/schedule';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import { TabBarAndContent } from 'components/reuseable/TabBar';

const Programme: NextPage = () => {
    return (
        <Fragment>
            <Navbar />

            <SimpleBanner title={"Schedule"} />

            <main className="content-wrapper">
                <section className="wrapper bg-light px-md-20 px-10 py-md-10 py-5 ">
                    <TabBarAndContent items={
                        schedule.map(day => ({
                            title: day.title.split(':')[0],
                            content: <DayCard day={day} />,
                            icon: <i className="uil uil-calendar-alt pe-1" />
                        }))
                    } />
                </section>
            </main>

            <Footer />
        </Fragment>
    );
};

export default Programme;

type DayCardProps = {
    day: Day;
};

const DayCard: React.FC<DayCardProps> = ({ day }) => {
    return (
        <div className="mb-3">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{day.title}</h5>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th className='w-15'>Time</th>
                                <th>Event</th>
                            </tr>
                        </thead>
                        <tbody>
                            {day.events.map((event, index) => (
                                <tr key={index}>
                                    <td className='w-15'>{event.time}</td>
                                    <td>{event.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};