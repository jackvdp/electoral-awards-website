import {Fragment} from "react";
import PageProgress from "../../src/components/common/PageProgress";
import {Navbar} from "../../src/components/blocks/navbar";
import SimpleBanner from "../../src/components/blocks/banner/SimpleBanner";
import {Footer} from "../../src/components/blocks/footer";
import Image from 'next/image';

export default function VisaRequirementsPage() {
    return (
        <Fragment>
            <PageProgress />

            <Navbar />

            <main className="content-wrapper">
                <SimpleBanner title={"WhatsApp Group"}></SimpleBanner>

                <div className="container py-10 d-flex flex-column justify-content-center align-items-center">
                    <div className="container mt-4">

                        <div>
                            <div>
                                <h5 className="mb-4">Join the Symposium & Awards Official WhatsApp Group</h5>
                                <p>The International Electoral Awards & Symposium is underway! Stay updated over the
                                    next four days with
                                    real-time announcements, schedule updates, and key information.</p>
                                <p>If you&apos;re on your phone, click the link below to join. If you&apos;re on a desktop, use
                                    the QR code to scan and join.</p>

                                {/* Centering the QR Code */}
                                <div className="mt-8" style={{textAlign: 'center', margin: '20px 0'}}>
                                    <Image
                                        src="/img/illustrations/whatsapp2024awards.jpg"
                                        alt="WhatsApp Group QR Code"
                                        width={400}
                                        height={400}
                                    />
                                </div>

                                <p style={{ textAlign: 'center' }}>
                                    <a
                                        href="https://chat.whatsapp.com/LXlflvOjECUDpqerbXb9iF"
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