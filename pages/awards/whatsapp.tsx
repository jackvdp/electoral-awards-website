import {Fragment} from "react";
import PageProgress from "components/common/PageProgress";
import {Navbar} from "components/blocks/navbar";
import SimpleBanner from "components/blocks/banner/SimpleBanner";
import {Footer} from "components/blocks/footer";

export default function WhatsApp() {
    return (
        <Fragment>
            <PageProgress />

            <Navbar />

            <main className="content-wrapper">
                <SimpleBanner title={"Official WhatsApp Group"}></SimpleBanner>

                <div className="container py-10 d-flex flex-column justify-content-center align-items-center">
                    <div className="container mt-4">
                        <div>
                            <div>
                                <h5 className="mb-4">WhatsApp Group</h5>
                                <p>The official WhatsApp group for the 22nd International Electoral Awards &amp; Symposium will be created closer to the event. Please check back nearer the time.</p>
                                <p>In the meantime, for any enquiries please email <a href="mailto:electoral@parlicentre.org">electoral@parlicentre.org</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer/>
        </Fragment>
    );
}
