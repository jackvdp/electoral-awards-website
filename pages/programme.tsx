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

                    <div className="mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Monday: Arrival of delegates and welcome dinner</h5>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Event</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1000h</td>
                                            <td>Arrival & Registration</td>
                                        </tr>
                                        <tr>
                                            <td>1800h</td>
                                            <td>Welcome Drinks</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Tuesday: Event registration, Symposium opening, dinner & entertainment</h5>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Event</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>0930h</td>
                                            <td>Symposium Registration</td>
                                        </tr>
                                        <tr>
                                            <td>1030h</td>
                                            <td>Symposium Opening</td>
                                        </tr>
                                        <tr>
                                            <td>1100h-1200h</td>
                                            <td>Morning Panel: Navigating Elections in a Pandemic: Lessons Learned from COVID-19</td>
                                        </tr>
                                        <tr>
                                            <td>1200h</td>
                                            <td>Lunch</td>
                                        </tr>
                                        <tr>
                                            <td>1330h-1430h</td>
                                            <td>Keynote Presentation – Alberto Guevara, The Observer & the Observed</td>
                                        </tr>
                                        <tr>
                                            <td>1430h-1530h</td>
                                            <td>Afternoon Panel: The Future of Voting: Voter Identification, Biometrics, and Electronic Voting</td>
                                        </tr>
                                        <tr>
                                            <td>1545h</td>
                                            <td>In Conversation: Wafula Chebukati, Kenya Election 2022: Success Story</td>
                                        </tr>
                                        <tr>
                                            <td>1600h-1730h</td>
                                            <td>Fringe events: Industry demonstrations</td>
                                        </tr>
                                        <tr>
                                            <td>2000h</td>
                                            <td>Dinner & Entertainment</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Wednesday Morning: Symposium closing</h5>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Event</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>0930h</td>
                                            <td>Symposium Opening</td>
                                        </tr>
                                        <tr>
                                            <td>0945h-1015h</td>
                                            <td>Keynote Presentation – TBC</td>
                                        </tr>
                                        <tr>
                                            <td>1030h-1130h</td>
                                            <td>Morning Panel: Combating Disinformation: Strategies for Protecting Electoral Integrity</td>
                                        </tr>
                                        <tr>
                                            <td>1030h - 1400h</td>
                                            <td>Fringe events: Industry demonstrations</td>
                                        </tr>
                                        <tr>
                                            <td>1145h-1215h</td>
                                            <td>Keynote Presentation – TBC</td>
                                        </tr>
                                        <tr>
                                            <td>1230h - 1300h</td>
                                            <td>Symposium Closing</td>
                                        </tr>
                                        <tr>
                                            <td>1300h</td>
                                            <td>Lunch at Hotel</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Wednesday afternoon: rest/explore nearby places</h5>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Event</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1400h</td>
                                            <td>Rest and/or explore places of interest nearby before the start of the Awards Ceremony</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Wednesday Evening: The International Electoral Awards Ceremony</h5>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Event</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1900h</td>
                                            <td>The International Electoral Awards Ceremony will start at 19:00, ending at 22:00. There will be a dinner and entertainment accompanying the awards ceremony.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Thursday: Departures and morning sight seeing</h5>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Event</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1000h</td>
                                            <td>Departures and morning sight seeing. We usually reserve this day for a day tour in the morning for delegates who have late departures, and departures throughout the day.</td>
                                        </tr>
                                        <tr>
                                            <td>1000h</td>
                                            <td>Sight seeing trip</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>


                </section>
            </main>

            {/* ========== footer section ========== */}
            <Footer />
        </Fragment>
    );
};

export default Programme;
