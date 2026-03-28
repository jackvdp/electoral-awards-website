import React from 'react';
import Link from 'next/link';
import HomeEventsSidebar from 'components/blocks/events/EventsSidebar';

const HomeProgramme: React.FC = () => {
    return (
        <section className="wrapper bg-light">
            <div className="container py-14 py-md-16">
                <div className="row text-center mb-10">
                    <div className="col-lg-8 mx-auto">
                        <h2 className="display-4 mb-3">2026 Programme</h2>
                        <p className="lead fs-lg">
                            A year of events, webinars, and knowledge-sharing for electoral professionals worldwide.
                        </p>
                    </div>
                </div>

                <div className="row gx-lg-8 gx-xl-12">
                    {/* Featured Awards Panel */}
                    <div className="col-lg-8 mb-8 mb-lg-0">
                        <div
                            className="card text-white h-100"
                            style={{
                                backgroundColor: '#1a2744',
                                borderRadius: '0.5rem',
                                overflow: 'hidden',
                            }}
                        >
                            <div className="card-body d-flex flex-column p-6 p-md-8">
                                <p
                                    className="text-uppercase mb-2"
                                    style={{
                                        letterSpacing: '0.15em',
                                        fontSize: '0.75rem',
                                        color: '#8da4c8',
                                    }}
                                >
                                    Flagship Event
                                </p>

                                <h3 className="text-white mb-2" style={{ fontSize: '1.75rem' }}>
                                    22nd International Electoral Awards &amp; Symposium
                                </h3>

                                <p className="mb-4" style={{ color: '#b0c4de', fontSize: '1.1rem' }}>
                                    29 November &ndash; 3 December 2026 &nbsp;&middot;&nbsp; The Manila Hotel, Philippines
                                </p>

                                <p className="mb-4" style={{ color: '#d0daea', lineHeight: 1.7 }}>
                                    Co-hosted with the Commission on Elections of the Philippines (COMELEC),
                                    the 22nd edition brings together electoral leaders from across the globe
                                    for five days of cultural exchange, symposium panels, keynote presentations,
                                    and the prestigious Awards Ceremony.
                                </p>

                                <div className="row gx-4 gy-3 mb-5">
                                    <div className="col-sm-6">
                                        <div className="d-flex align-items-center">
                                            <i className="uil uil-check-circle me-2" style={{ color: '#45c4a0', fontSize: '1.2rem' }} />
                                            <span style={{ color: '#d0daea' }}>Free attendance</span>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="d-flex align-items-center">
                                            <i className="uil uil-check-circle me-2" style={{ color: '#45c4a0', fontSize: '1.2rem' }} />
                                            <span style={{ color: '#d0daea' }}>Accommodation covered</span>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="d-flex align-items-center">
                                            <i className="uil uil-check-circle me-2" style={{ color: '#45c4a0', fontSize: '1.2rem' }} />
                                            <span style={{ color: '#d0daea' }}>5-day programme</span>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="d-flex align-items-center">
                                            <i className="uil uil-check-circle me-2" style={{ color: '#45c4a0', fontSize: '1.2rem' }} />
                                            <span style={{ color: '#d0daea' }}>150+ delegates worldwide</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto d-flex flex-wrap gap-3">
                                    <Link
                                        href="/events/69938de4f4f23e0fef2e3129"
                                        className="btn btn-white rounded-pill"
                                    >
                                        Register Now
                                    </Link>
                                    <Link
                                        href="/awards"
                                        className="btn btn-outline-white rounded-pill"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Events Sidebar */}
                    <div className="col-lg-4">
                        <HomeEventsSidebar />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeProgramme;
