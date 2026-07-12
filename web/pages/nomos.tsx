import {NextPage} from 'next';
import {FormEvent, Fragment, useState} from 'react';
import Image from 'next/image';
// -------- custom component -------- //
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import CustomHead from "../src/components/common/CustomHead";

const NomosPage: NextPage = () => {
    return (
        <Fragment>
            <CustomHead
                title="NOMOS"
                description="Verifying a large temporary electoral workforce at speed is a recurring problem for many electoral management bodies. If your organisation recognises it, get in touch about the NOMOS workforce identity wallet."
            />

            <PageProgress/>

            {/* ========== header section ========== */}
            <Navbar/>

            <main className="content-wrapper">
                {/* ========== page title section ========== */}
                <section
                    className="wrapper image-wrapper bg-image bg-overlay bg-overlay-400 text-white"
                    style={{backgroundImage: 'url(/img/photos/bg22.png)'}}
                >
                    <div className="container pt-17 pb-20 pt-md-19 pb-md-21 text-center">
                        <div className="row">
                            <div className="col-lg-8 mx-auto">
                                <h1 className="display-1 mb-3 text-white">NOMOS</h1>
                                <p className="lead px-lg-5 px-xxl-8">
                                    Verifying a temporary electoral workforce at speed is hard. If that
                                    sounds familiar, we would like to hear from you.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="wrapper bg-light angled upper-end">
                    <div className="container py-14 py-md-16">
                        {/* ========== the problem section ========== */}
                        <div className="row gx-md-8 gx-xl-12 gy-6 align-items-center mb-14 mb-md-17" id="problem">
                            <div className="col-md-8 col-lg-6 mx-auto">
                                <div className="img-mask mask-3">
                                    <Image
                                        width={1600}
                                        height={1067}
                                        src="/img/photos/nomos-poll-worker.jpg"
                                        alt="Polling staff overseeing a ballot box as a voter casts her vote at a polling place"
                                        style={{width: '100%', height: 'auto'}}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <h2 className="display-5 mb-4">A problem you may recognise</h2>
                                <p>
                                    Every electoral cycle, an electoral management body (EMB) assembles a
                                    large temporary workforce at speed. Verifying those staff against tight
                                    deadlines is difficult. Training completion is hard to confirm at the
                                    point of deployment. And once people are out in the field, there is
                                    often no direct, reliable channel back to them.
                                </p>
                                <p>
                                    When something goes wrong (a worker who never completed training, a
                                    disputed identity, a point of contact who cannot be reached), the
                                    records that would settle it are usually spread across spreadsheets and
                                    paper, and cannot be checked in real time. And it tends to surface at
                                    the exact moment scrutiny is highest.
                                </p>
                                <p>
                                    Not every EMB has this problem. Many have systems that handle it well.
                                    But if this is how election periods feel in your organisation, get in
                                    touch below.
                                </p>
                            </div>
                        </div>

                        {/* ========== workforce identity wallet section ========== */}
                        <div className="row mb-14 mb-md-17" id="wallet">
                            <div className="col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
                                <h2 className="display-5 mb-4 text-center">The workforce identity wallet</h2>
                                <p>
                                    For EMBs that recognise this problem, we can arrange access to a digital
                                    identity and verification wallet built by our partner NOMOS. It gives
                                    each worker, temporary or permanent:
                                </p>
                                <ul className="icon-list bullet-bg bullet-soft-primary">
                                    <li>
                                        <i className="uil uil-check"/>
                                        a verified digital identity, issued by your organisation and
                                        auditable throughout
                                    </li>
                                    <li>
                                        <i className="uil uil-check"/>
                                        a portable, tamper-proof record of the training they have completed
                                    </li>
                                    <li>
                                        <i className="uil uil-check"/>
                                        a direct communication channel between them and your organisation
                                    </li>
                                </ul>
                                <p>
                                    You remain the issuing authority throughout. The architecture is
                                    federated: your organisation&apos;s data stays in your jurisdiction and
                                    under your control, with no central database and no third-party access.
                                    The wallet is free to Network members, credentials can be issued within
                                    days, and there is no integration work for your IT team.
                                </p>
                                <p className="mb-0">
                                    The wallet stands on its own. Using it carries no obligation towards the
                                    wider NOMOS platform, and getting in touch commits you to nothing beyond
                                    a conversation.
                                </p>
                            </div>
                        </div>

                        {/* ========== about NOMOS section ========== */}
                        <div className="row gx-md-8 gx-xl-12 gy-6 align-items-center mb-14 mb-md-17" id="about">
                            <div className="col-md-8 col-lg-6 order-lg-2 mx-auto">
                                <div className="img-mask mask-2">
                                    <Image
                                        width={1600}
                                        height={1067}
                                        src="/img/photos/nomos-polling-station.jpg"
                                        alt="A polling station sign on a post, with a park and voters in the background"
                                        style={{width: '100%', height: 'auto'}}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <h2 className="display-5 mb-4">About NOMOS</h2>
                                <p>
                                    NOMOS is a verified professional network for the people who run
                                    elections. Members carry a professional identity verified by their own
                                    institution, tied to their role and jurisdiction. The workforce wallet
                                    is one part of the platform.
                                </p>
                                <p>
                                    The International Centre for Parliamentary Studies (ICPS) is a convening
                                    partner of NOMOS, as part of our work to improve knowledge sharing
                                    across the electoral community. NOMOS is designed to sit alongside the
                                    organisations and networks people already use, not to replace them.
                                </p>
                            </div>
                        </div>

                        {/* ========== get in touch section ========== */}
                        <div className="row" id="register">
                            <div className="col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
                                <h2 className="display-5 mb-3 text-center">Get in touch</h2>
                                <p className="lead text-center mb-10">
                                    Leave your details and we will arrange a short conversation about how
                                    this problem shows up in your organisation.
                                </p>
                                <RegisterInterestForm/>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ========== footer section ========== */}
            <Footer/>
        </Fragment>
    );
};

const RegisterInterestForm = () => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);

        const message = `
            First name: ${data.get('firstName')}
            Last name: ${data.get('lastName')}
            Email: ${data.get('email')}
            Organisation: ${data.get('organisation')}
            Job title: ${data.get('jobTitle')}
            Message: ${data.get('message') || '(none)'}
        `;

        setStatus('sending');
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({subject: 'NOMOS interest registration', message}),
            });

            if (response.ok) {
                setStatus('sent');
                form.reset();
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <form className="contact-form needs-validation" method="post" onSubmit={handleSubmit}>
            <div className="row gx-4">
                <div className="col-md-6">
                    <div className="form-floating mb-4">
                        <input required type="text" name="firstName" id="form_firstname" placeholder="Jane"
                               className="form-control"/>
                        <label htmlFor="form_firstname">First name</label>
                        <div className="invalid-feedback">Please enter your first name.</div>
                    </div>
                    <div className="form-floating mb-4">
                        <input required type="email" name="email" id="form_email"
                               placeholder="jane.doe@example.com" className="form-control"/>
                        <label htmlFor="form_email">Email</label>
                        <div className="invalid-feedback">Please enter your email address.</div>
                    </div>
                    <div className="form-floating mb-4">
                        <input required type="text" name="jobTitle" id="form_jobtitle" placeholder="Manager"
                               className="form-control"/>
                        <label htmlFor="form_jobtitle">Job title</label>
                        <div className="invalid-feedback">Please enter your job title.</div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-floating mb-4">
                        <input required type="text" name="lastName" id="form_lastname" placeholder="Doe"
                               className="form-control"/>
                        <label htmlFor="form_lastname">Last name</label>
                        <div className="invalid-feedback">Please enter your last name.</div>
                    </div>
                    <div className="form-floating mb-4">
                        <input required type="text" name="organisation" id="form_organisation"
                               placeholder="Electoral Commission" className="form-control"/>
                        <label htmlFor="form_organisation">Organisation</label>
                        <div className="invalid-feedback">Please enter your organisation.</div>
                    </div>
                    <div className="form-floating mb-4">
                        <textarea name="message" id="form_message" placeholder="Your message"
                                  className="form-control" style={{height: 90}}/>
                        <label htmlFor="form_message">Message (optional)</label>
                    </div>
                </div>

                <div className="col-12 text-center">
                    {status === 'sent' ? (
                        <div className="alert alert-success" role="alert">
                            Thank you, we have your details and will be in touch shortly.
                        </div>
                    ) : (
                        <Fragment>
                            <button type="submit" disabled={status === 'sending'}
                                    className="btn btn-primary rounded-pill btn-send mb-3">
                                {status === 'sending' ? 'Sending...' : 'Get in touch'}
                            </button>
                            <p className="text-muted">
                                <strong>*</strong> All fields except the message are required.
                            </p>
                            {status === 'error' && (
                                <div className="alert alert-danger" role="alert">
                                    Something went wrong sending your details. Please try again, or email us
                                    via the contact page.
                                </div>
                            )}
                        </Fragment>
                    )}
                </div>
            </div>
        </form>
    );
};

export default NomosPage;
