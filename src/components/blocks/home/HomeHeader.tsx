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
                <div className="container pt-6 pt-md-20 pb-6 pb-md-20">
                    <div className="row justify-content-center">
                        <div className="col-lg-9 col-xl-8 text-center mt-md-10 mt-6">
                            <p className="text-uppercase ls-xl text-white mb-3 fw-bold" style={{letterSpacing: '0.2em', fontSize: '0.85rem'}}>
                                Electoral Stakeholders&apos; Network
                            </p>
                            <h1 className="display-1 text-white mb-4">
                                22nd International Electoral Awards &amp; Symposium
                            </h1>
                            <p className="lead text-white mb-3" style={{fontSize: '1.5rem'}}>
                                25&ndash;28 November 2026 &middot; Manila, Philippines
                            </p>
                            <p className="lead fs-lg text-white px-lg-10 mb-5" style={{opacity: 0.9}}>
                                The only international electoral symposium of its kind this year. Join electoral leaders, technology providers, and practitioners from around the world for keynotes, panels, breakout sessions, and the prestigious Awards Ceremony.
                            </p>

                            <div className="d-flex justify-content-center gap-3">
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

                            {!isLoggedIn && (
                                <p className={`lead fs-lg mt-5 ${styles.subtitleText}`}>
                                    Already a member?{' '}
                                    <a
                                        data-bs-toggle="modal"
                                        data-bs-target="#modal-signin"
                                        className="hover more link-aqua"
                                    >
                                        Sign in
                                    </a>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeHeader;