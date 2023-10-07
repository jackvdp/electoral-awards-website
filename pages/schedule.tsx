import { NextPage } from 'next';
import { useState, Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import { schedule, Day } from 'data/schedule';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';

const Programme: NextPage = () => {
    return (
        <Fragment>
            <Navbar />

            <SimpleBanner title={"Schedule"} />

            <main className="content-wrapper">
                <section className="wrapper bg-light px-md-20 px-10 py-md-10 py-5 ">
                    <EventTabsAndTables />
                </section>
            </main>

            <Footer />
        </Fragment>
    );
};

export default Programme;

const EventTabsAndTables: React.FC = () => {
    const [activeTab, setActiveTab] = useState<number | 'all'>('all');

    const handleTabClick = (tabId: number | 'all') => {
        setActiveTab(tabId);
    };

    return (
        <>
            <ul className="nav nav-tabs nav-tabs-basic justify-content-center">
                <li className="nav-item mb-2">
                    <a className={`nav-link ${activeTab === 'all' ? 'active' : ''}`} onClick={() => handleTabClick('all')}>
                        <i className="uil uil-list-ul pe-1" />
                        <span>All Days</span>
                    </a>
                </li>
                {schedule.map((day, index) => (
                    <li key={index} className="nav-item mb-2">
                        <a className={`nav-link ${index === activeTab ? 'active' : ''}`} onClick={() => handleTabClick(index)}>
                            <i className="uil uil-calendar-alt pe-1" />
                            <span>{day.title.split(':')[0]}</span>
                        </a>
                    </li>
                ))}
            </ul>

            <div className="tab-content">
                {activeTab === 'all' &&
                    schedule.map((day, index) => (
                        <div key={index} className="tab-pane fade show active">
                            <DayCard day={day} />
                        </div>
                    ))
                }

                {typeof activeTab === 'number' &&
                    <div className="tab-pane fade show active">
                        <DayCard day={schedule[activeTab]} />
                    </div>
                }
            </div>
        </>
    );
}

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