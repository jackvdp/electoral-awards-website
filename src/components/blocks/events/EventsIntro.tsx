import {FC, Fragment} from 'react';
import Link from 'next/link';


const BlogTemplate: FC = () => {
    return (
        <Fragment>
            <div className="blog classic-view">

                <div className="card bg-soft-primary mb-8">
                    <div className="card-body p-6">
                        <h4 className="mb-3">22nd International Electoral Awards &amp; Symposium</h4>
                        <p className="mb-2">
                            <strong>25&ndash;28 November 2026 &middot; Manila, Philippines</strong>
                        </p>
                        <p className="mb-3">
                            The only international electoral symposium of its kind this year &mdash; featuring keynote addresses, panel discussions, dedicated breakout sessions, and the prestigious Awards Ceremony. Don&apos;t miss it.
                        </p>
                        <Link href="/awards" className="btn btn-sm btn-primary rounded-pill">
                            Find out more
                        </Link>
                    </div>
                </div>

                <div className='mb-8'>
                    <p>The Electoral Stakeholders&apos; Network hosts a range of events, including webinars, in-person
                        symposiums, and the prestigious International Electoral Awards. These gatherings bring together
                        electoral commissioners, political analysts, and seasoned practitioners to explore key electoral
                        challenges and innovations, offering valuable insights into global electoral dynamics.</p>

                    <p>Each event fosters engagement, allowing participants to interact with experts, ask questions, and
                        exchange ideas. Networking opportunities enable attendees to connect with peers and build
                        professional relationships. For those unable to attend live, recordings of webinars are
                        available for members. Our schedule is regularly updated with new opportunities designed to
                        enhance skills and knowledge in electoral management.</p>
                </div>

            </div>

        </Fragment>
    );
};

export default BlogTemplate;
