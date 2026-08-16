import {NextPage} from 'next';
import {Fragment, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
// -------- custom component -------- //
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import ApplicationForm from 'components/blocks/awards/ApplicationForm';
import CustomHead from "../../src/components/common/CustomHead";
import {isNominationsOpen} from 'data/awards-config';

const SubmitPage: NextPage = () => {
    const router = useRouter();
    const editId = typeof router.query.edit === 'string' ? router.query.edit : undefined;

    // Evaluated on the client after mount so the statically prerendered page
    // never disagrees with the visitor's clock.
    const [closed, setClosed] = useState(false);
    useEffect(() => {
        setClosed(!isNominationsOpen());
    }, []);

    return (
        <Fragment>
            <CustomHead
                title="Submit Your Nomination – 22nd International Electoral Awards"
                description="Celebrating excellence in electoral management. Recognizing outstanding contributions and innovations in election administration and democratic processes."
            />
            <PageProgress/>

            <Navbar/>

            <main className="content-wrapper">

                <SimpleBanner title={editId ? "Edit Your Nomination" : "Submit Nomination for 22nd International Electoral Awards"}></SimpleBanner>

                <div
                    className="container pt-14 pt-md-16 pb-7 pt-md-8 d-flex flex-column justify-content-center align-items-center">
                    {closed ? (
                        <div className="alert alert-info text-center" role="alert" style={{maxWidth: '40rem'}}>
                            <h5 className="alert-heading">Nominations have now closed</h5>
                            <p className="mb-1">
                                Nominations for the 22nd International Electoral Awards closed on 15 September 2026.
                            </p>
                            <p className="mb-0">
                                Winners will be announced at the Awards Ceremony in Manila this December.
                                See the <Link href="/awards/categories">award categories</Link> or{' '}
                                <Link href="/contact">contact us</Link> with any questions.
                            </p>
                        </div>
                    ) : (
                        <Fragment>
                            <p className="lead text-center mb-8">
                                Nominations close on <strong>15 September 2026</strong>.
                            </p>
                            <ApplicationForm editId={editId}/>
                        </Fragment>
                    )}
                </div>

            </main>

            {/* ========== footer section ========== */}
            <Footer/>
        </Fragment>
    );
};

export default SubmitPage;
