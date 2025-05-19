import React, {Fragment} from 'react';
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import {TabBarAndContent} from 'components/reuseable/TabBar';
import PageProgress from 'components/common/PageProgress';
import CustomHead from "components/common/CustomHead";
import {Day} from "data/schedule";

const Schedule= ({ schedule, headTitle, dates  }: { schedule: Day[], headTitle: string, dates: string}) => {
    return (
        <Fragment>
            <CustomHead
                title={headTitle}
                description="Celebrating excellence in electoral management. Recognizing outstanding contributions and innovations in election administration and democratic processes."
            />
            <PageProgress/>

            <Navbar/>

            <SimpleBanner title={"Schedule"}/>

            <main className="content-wrapper">
                <section className="container wrapper bg-light px-2 py-md-10 py-5 ">
                    <h2 className="mb-5 text-center">{dates}</h2>
                    <TabBarAndContent items={
                        schedule.map(day => ({
                            title: day.title.split(':')[0],
                            content: <DayCard day={day}/>,
                            icon: <i className="uil uil-calendar-alt pe-1"/>
                        }))
                    }/>
                </section>
            </main>

            <Footer/>
        </Fragment>
    );
};

export default Schedule;

type DayCardProps = {
    day: Day;
};

const DayCard: React.FC<DayCardProps> = ({day}) => {
    return (
        <div className="mb-3">
            <DayContent day={day} cardEnabled={true}/>
            <DayContent day={day} cardEnabled={false}/>
        </div>
    );
};

function DayContent({day, cardEnabled}: { day: Day, cardEnabled: boolean }) {
    return (
        <div className={cardEnabled ? "d-none d-md-block card" : "d-md-none"}>
            <div className={cardEnabled ? "card-body" : ""}>
                <h5 className={cardEnabled ? "card-title" : ""}>{day.title}</h5>
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
                            <td dangerouslySetInnerHTML={{__html: event.description}}></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}