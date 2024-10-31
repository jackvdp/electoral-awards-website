import React from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper';
import { useAuth } from 'auth/AuthProvider';
import styles from './Home.module.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import Image from 'next/image';

const HomeHeader = () => {
    const { isLoggedIn } = useAuth();

    const backgroundImages = [
        '/img/photos/hero1.jpeg',
        '/img/photos/hero2.jpg',
        '/img/photos/hero3.jpg',
        '/img/photos/hero4.jpg'
    ];

    return (
        <section className={styles.headerSection + " text-white"}>
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
                            src={image}
                            width={1200}
                            height={800}
                            priority={index === 0}
                            layout='fill'  // Add this prop to allow the image to fill its container
                            sizes="100vw"  // Add this to help Next.js optimize the image
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Overlay */}
            <div className={styles.overlay} />

            {/* Content */}
            <div className={styles.contentWrapper}>
                <div className="container pt-10 pt-md-20 pb-10 pb-md-20 text-center">
                    <div className="row">
                        <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-6 mx-auto">
                            <h1 className="display-1 text-white mb-3">
                                Electoral Stakeholders&apos; Network
                            </h1>
                            <p className="lead fs-lg px-md-3 px-lg-7 px-xl-9 px-xxl-10">
                                Connecting Leaders in Electoral Management
                            </p>

                            {!isLoggedIn && (
                                <>
                                    <div className="d-flex justify-content-center gap-2">
                                        <NextLink
                                            title="Register"
                                            href="/register"
                                            className="btn btn-soft-blue rounded-pill mt-2"
                                        />
                                        <NextLink
                                            title="Awards"
                                            href="/awards"
                                            className="btn btn-blue rounded-pill mt-2"
                                        />
                                    </div>

                                    <p className={`lead fs-md px-md-3 px-lg-7 px-xl-9 px-xxl-10 py-4 ${styles.subtitleText}`}>
                                        Already a member?{' '}
                                        <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#modal-signin"
                                            className="hover more link-aqua"
                                        >
                                            Sign in
                                        </a>
                                    </p>
                                </>
                            )}

                            {isLoggedIn && (
                                <div className="d-flex justify-content-center gap-2">
                                    <NextLink
                                        title="Events"
                                        href="/events"
                                        className="btn btn-soft-blue rounded-pill mt-2"
                                    />
                                    <NextLink
                                        title="Articles"
                                        href="/articles"
                                        className="btn btn-outline-white rounded-pill mt-2"
                                    />
                                    <NextLink
                                        title="Awards"
                                        href="/awards"
                                        className="btn btn-yellow rounded-pill mt-2"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeHeader;