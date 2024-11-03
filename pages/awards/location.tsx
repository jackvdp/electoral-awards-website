import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';

const LocationPage: NextPage = () => {
  return (
    <Fragment>
      <PageProgress />

      {/* ========== header section ========== */}
      <Navbar />

      <main className="content-wrapper">
        {/* ========== page title section ========== */}
        <section
          className="wrapper image-wrapper bg-image bg-overlay bg-overlay-400 text-white"
          style={{ backgroundImage: 'url(/img/photos/hilton.webp)' }}
        >
          <div className="container pt-17 pb-20 pt-md-19 pb-md-21 text-center">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <h1 className="display-1 mb-3 text-white">Symposium & Awards Ceremony Location</h1>
                <p>The four-day event will be hosted at the <strong>Embassy Suites by Hilton Hotel</strong>. To secure your reservation, please contact the hotel using the email address listed below.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="wrapper bg-light angled upper-end">
          <div className="container pb-11">
            {/* ========== contact info section ========== */}
            <div className="row mb-14 mb-md-16">
              <div className="col-xl-10 mx-auto mt-n19">
                <div className="card">
                  <div className="row gx-0">
                    <div className="col-lg-6 align-self-stretch">
                      <div className="map map-full rounded-top rounded-lg-start">
                        <iframe
                          allowFullScreen
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.1720780852!2d-69.9271658!3d18.475863099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89c31662d929%3A0xdd3ae3e6278698d7!2sEmbassy%20Suites%20by%20Hilton%20Santo%20Domingo!5e0!3m2!1sen!2suk!4v1730368014096!5m2!1sen!2suk"
                          style={{ width: '100%', height: '100%', border: 0 }}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="p-10 p-md-11 p-lg-14">
                        <div className="d-flex flex-row">
                          <div>
                            <div className="icon text-primary fs-28 me-4 mt-n1">
                              <i className="uil uil-location-pin-alt" />
                            </div>
                          </div>
                          <div className="align-self-start justify-content-start">
                            <h5 className="mb-1">Location</h5>
                            <address>
                              Ave.Tiradentes 32<br/>
                              Santo Domingo, 10119<br/>
                              Dominican Republic
                            </address>
                          </div>
                        </div>

                        <div className="d-flex flex-row">
                          <div>
                            <div className="icon text-primary fs-28 me-4 mt-n1">
                              <i className="uil uil-money-bill" />
                            </div>
                          </div>
                          {/* <div className="align-self-start justify-content-start">
                            <h5 className="mb-1">Room Rate</h5>
                            <p>
                              €120 for a single room/€140 for a double room
                            </p>
                          </div> */}
                        </div>

                        <div className="d-flex flex-row">
                          <div>
                            <div className="icon text-primary fs-28 me-4 mt-n1">
                              <i className="uil uil-phone-volume" />
                            </div>
                          </div>
                          <div>
                            <h5 className="mb-1">Phone</h5>
                            <p>
                              +1 809 685 0001
                            </p>
                          </div>
                        </div>

                        <div className="d-flex flex-row">
                          <div>
                            <div className="icon text-primary fs-28 me-4 mt-n1">
                              <i className="uil uil-envelope" />
                            </div>
                          </div>
                          <div>
                            <h5 className="mb-1">To book:</h5>
                            <p className="mb-0">
                              <a className="text-blue link-body" href="https://www.hilton.com/en/attend-my-event/sdqsdes-cps-3e53939b-1088-43ac-ae2b-67c2c34d6ac6/">
                                Follow the link here to book your room.
                              </a>
                              {" "}Please email electoral@parlicentre.org after booking to confirm your reservation.
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* ========== footer section ========== */}
      <Footer />
    </Fragment>
  );
};

export default LocationPage;
