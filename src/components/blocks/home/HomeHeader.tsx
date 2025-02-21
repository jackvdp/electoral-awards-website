import React from 'react';
import NextLink from 'components/reuseable/links/NextLink';
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
                    <div className="row">
                        <div className="col-md-8 col-lg-7 col-xl-6 col-xxl-6 mt-10">
                            <h1 className="display-1 text-white mb-3 text-start">
                                Electoral Stakeholders&apos; Network
                            </h1>
                            <p className="lead fs-lg text-start">
                                Connecting Leaders in Electoral Management
                            </p>

                            <p className="text-start">
                                The Electoral Stakeholders&apos; Network connects electoral professionals, policymakers,
                                and
                                innovators to strengthen democracy worldwide. Through symposiums, research, and awards,
                                we foster knowledge-sharing, international cooperation, and solutions for electoral
                                integrity, transparency, and voter participation.
                            </p>

                            {!isLoggedIn && (
                                <div className="d-flex gap-2">
                                    <NextLink
                                        title="Register"
                                        href="/register"
                                        className="btn btn-soft-blue rounded-pill mt-2"
                                    />
                                    <NextLink
                                        title="View Events"
                                        href="/events"
                                        className="btn btn-blue rounded-pill mt-2"
                                    />
                                </div>
                            )}

                            {isLoggedIn && (
                                <div className="d-flex gap-2">
                                    <NextLink
                                        title="Awards"
                                        href="/awards"
                                        className="btn btn-soft-blue rounded-pill mt-2"
                                    />
                                    <NextLink
                                        title="View Events"
                                        href="/events"
                                        className="btn btn-blue rounded-pill mt-2"
                                    />
                                </div>
                            )}

                            {!isLoggedIn && (
                                <p className={`lead fs-md py-4 text-start ${styles.subtitleText}`}>
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