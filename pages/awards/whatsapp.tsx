import {Fragment} from "react";
import PageProgress from "components/common/PageProgress";
import {Navbar} from "components/blocks/navbar";
import SimpleBanner from "components/blocks/banner/SimpleBanner";
import {Footer} from "components/blocks/footer";
import {QRCode} from "components/elements/QRCode";

export default function WhatsaApp() {
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
                                <h5 className="mb-4">Join the 2025 Symposium & Awards Official WhatsApp Group</h5>
                                <p>The International Electoral Awards & Symposium is underway! Stay updated between 1st – 4th October with
                                    real-time announcements, schedule updates, and key information.</p>
                                <p>If you&apos;re on your phone, click the link below to join. If you&apos;re on a desktop, use
                                    the QR code to scan and join.</p>

                                {/* Centering the QR Code */}
                                <div className="mt-8" style={{textAlign: 'center', margin: '20px 0'}}>
                                    <QRCode data="https://chat.whatsapp.com/FT1dACeQ3RzGxbCmmyemD5" />
                                </div>

                                <p style={{ textAlign: 'center' }}>
                                    <a
                                        href="https://chat.whatsapp.com/FT1dACeQ3RzGxbCmmyemD5"
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            display: 'inline-block',
                                            padding: '10px 20px',
                                            fontSize: '16px',
                                            color: 'white',
                                            backgroundColor: '#25D366', // WhatsApp green
                                            textDecoration: 'none',
                                            borderRadius: '5px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Join WhatsApp Group
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ========== footer section ========== */}
            <Footer/>
        </Fragment>
    );
}