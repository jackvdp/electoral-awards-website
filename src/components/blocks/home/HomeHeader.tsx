import React from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import RegisterLink from 'components/reuseable/links/RegisterLink';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, EffectFade} from 'swiper';
import {useAuth} from "auth/useAuth";
import styles from './Home.module.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import Image from 'next/image';

const HomeHeader = () => {
    const {isLoggedIn} = useAuth();

    const backgroundImages = [
        '/img/photos/hero.jpeg',
        '/img/photos/hero10.jpeg',
        '/img/photos/hero11.jpeg',
        '/img/photos/hero1.jpeg',
        '/img/photos/hero5.jpg',
    ];

    return (
        <>
            {/* Hero */}
            <section className={`${styles.headerSection} text-white`}>
                {/* Swiper Background */}
                <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    loop={true}
                    slidesPerView={1}
                    speed={1000}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: false
                    }}
                    className={styles.backgroundSwiper}
                >
                    {backgroundImages.map((image, index) => (
                        <SwiperSlide key={index} className={styles.slide}>
                            <Image
                                className={styles.slideImage}
                                alt={`Slide ${index + 1}`}
                                src={image}
                                priority={index === 0}
                                loading={index === 0 ? 'eager' : undefined}
                                layout='fill'
                                sizes="100vw"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Overlay */}
                <div className={styles.overlay}/>

                {/* Content */}
                <div className={styles.contentWrapper}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-10 col-xl-9 text-center">
                                <p className="text-uppercase text-white mb-3 fw-bold" style={{letterSpacing: '0.15em', fontSize: '0.85rem', opacity: 0.85}}>
                                    Electoral Members&apos; Network
                                </p>
                                <h1 className="display-1 text-white mb-4" style={{fontWeight: 700}}>
                                    22nd International Electoral Awards &amp; Symposium
                                </h1>

                                <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                                    <NextLink
                                        title="Awards &amp; Symposium"
                                        href="/awards"
                                        className="btn btn-lg btn-white rounded-pill"
                                    />
                                    {!isLoggedIn ? (
                                        <RegisterLink
                                            title="Register"
                                            className="btn btn-lg btn-outline-white rounded-pill"
                                        />
                                    ) : (
                                        <NextLink
                                            title="View Events"
                                            href="/events"
                                            className="btn btn-lg btn-outline-white rounded-pill"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Bar */}
            <div className={styles.infoBar}>
                <div className="container">
                    <div className="row align-items-center justify-content-center text-center text-md-start">
                        <div className="col-md-auto mb-2 mb-md-0">
                            <div className="d-flex align-items-center justify-content-center">
                                <i className="uil uil-calendar-alt me-2" style={{fontSize: '1.1rem'}} />
                                <span>29 November &ndash; 3 December 2026</span>
                            </div>
                        </div>
                        <div className="col-md-auto mb-2 mb-md-0">
                            <div className="d-flex align-items-center justify-content-center">
                                <i className="uil uil-location-point me-2" style={{fontSize: '1.1rem'}} />
                                <span>The Manila Hotel, Philippines</span>
                            </div>
                        </div>
                        <div className="col-md-auto mb-2 mb-md-0">
                            <div className="d-flex align-items-center justify-content-center">
                                <i className="uil uil-users-alt me-2" style={{fontSize: '1.1rem'}} />
                                <span>Co-hosted with COMELEC</span>
                            </div>
                        </div>
                        <div className="col-md-auto ms-md-auto">
                            {!isLoggedIn ? (
                                <RegisterLink
                                    title="Register Now"
                                    className="btn btn-sm btn-white rounded-pill"
                                />
                            ) : (
                                <NextLink
                                    title="View Events"
                                    href="/events"
                                    className="btn btn-sm btn-white rounded-pill"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeHeader;