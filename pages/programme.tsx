import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';

const Programme: NextPage = () => {
    return (
        <Fragment>
            {/* ========== header section ========== */}
            <Navbar />

            <main className="content-wrapper">
                <section className="wrapper bg-light px-md-20 px-10 py-md-10 py-5 ">

                    {schedule.map((day, index) => (
                        <DayCard key={index} day={day} />
                    ))}

                </section>
            </main>

            {/* ========== footer section ========== */}
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
                                <th>Time</th>
                                <th>Event</th>
                            </tr>
                        </thead>
                        <tbody>
                            {day.events.map((event, index) => (
                                <tr key={index}>
                                    <td>{event.time}</td>
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


type Event = {
    time: string;
    description: string;
};

type Day = {
    title: string;
    events: Event[];
};

const schedule: Day[] = [
    {
        title: "Monday: Arrival of delegates and welcome dinner",
        events: [
            { time: "1000h", description: "Arrival & Registration" },
            { time: "1800h", description: "Welcome Drinks" }
        ]
    },
    {
        title: "Tuesday: Event registration, Symposium opening, dinner & entertainment",
        events: [
            { time: "0930h", description: "Symposium Registration" },
            { time: "1030h", description: "Symposium Opening" },
            { time: "1100h-1200h", description: "Morning Panel: Navigating Elections in a Pandemic: Lessons Learned from COVID-19" },
            { time: "1200h", description: "Lunch" },
            { time: "1330h-1430h", description: "Keynote Presentation – Alberto Guevara, The Observer & the Observed" },
            { time: "1430h-1530h", description: "Afternoon Panel: The Future of Voting: Voter Identification, Biometrics, and Electronic Voting" },
            { time: "1545h", description: "In Conversation: Wafula Chebukati, Kenya Election 2022: Success Story" },
            { time: "1600h-1730h", description: "Fringe events: Industry demonstrations" },
            { time: "2000h", description: "Dinner & Entertainment" }
        ]
    },
    {
        title: "Wednesday Morning: Symposium closing",
        events: [
            { time: "0930h", description: "Symposium Opening" },
            { time: "0945h-1015h", description: "Keynote Presentation – TBC" },
            { time: "1030h-1130h", description: "Morning Panel: Combating Disinformation: Strategies for Protecting Electoral Integrity" },
            { time: "1030h - 1400h", description: "Fringe events: Industry demonstrations" },
            { time: "1145h-1215h", description: "Keynote Presentation – TBC" },
            { time: "1230h - 1300h", description: "Symposium Closing" },
            { time: "1300h", description: "Lunch at Hotel" }
        ]
    },
    {
        title: "Wednesday afternoon: rest/explore nearby places",
        events: [
            { time: "1400h", description: "Rest and/or explore places of interest nearby before the start of the Awards Ceremony" }
        ]
    },
    {
        title: "Wednesday Evening: The International Electoral Awards Ceremony",
        events: [
            { time: "1900h", description: "The International Electoral Awards Ceremony will start at 19:00, ending at 22:00. There will be a dinner and entertainment accompanying the awards ceremony." }
        ]
    },
    {
        title: "Thursday: Departures and morning sight seeing",
        events: [
            { time: "1000h", description: "Departures and morning sight seeing. We usually reserve this day for a day tour in the morning for delegates who have late departures, and departures throughout the day." },
            { time: "1000h", description: "Sight seeing trip" }
        ]
    }
];
