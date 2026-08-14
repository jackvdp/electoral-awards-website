import Head from 'next/head';
import {useRouter} from 'next/router';
import type {AppProps} from 'next/app';
import {Fragment, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {Analytics} from '@vercel/analytics/react';
import ThemeProvider from 'theme/ThemeProvider';
import {AuthProvider} from 'auth/AuthProvider';
import {trackError} from 'helpers/analytics';

const ChatWidget = dynamic(() => import('components/common/ChatWidget'), { ssr: false });

// Bootstrap and custom scss
import 'assets/scss/style.scss';
// animate css
import 'animate.css';
// import swiper css
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
// video player css
import 'plyr-react/plyr.css';
// glightbox css
import 'glightbox/dist/css/glightbox.css';
// custom scrollcue css
import 'plugins/scrollcue/scrollCue.css';

function MyApp({Component, pageProps}: AppProps) {
    const {pathname} = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // load bootstrap functionality
            (() => {
                const bootstrap = require('bootstrap');

                // Enables multilevel dropdown
                (function (bs) {
                    const CLASS_NAME = 'has-child-dropdown-show';

                    bs.Dropdown.prototype.toggle = (function (_original) {
                        return function () {
                            document.querySelectorAll('.' + CLASS_NAME).forEach(function (e) {
                                e.classList.remove(CLASS_NAME);
                            });
                            // @ts-ignore
                            let dd = this._element.closest('.dropdown').parentNode.closest('.dropdown');
                            for (; dd && dd !== document; dd = dd.parentNode.closest('.dropdown')) {
                                dd.classList.add(CLASS_NAME);
                            }
                            // @ts-ignore
                            return _original.call(this);
                        };
                    })(bs.Dropdown.prototype.toggle);

                    document.querySelectorAll('.dropdown').forEach(function (dd) {
                        dd.addEventListener('hide.bs.dropdown', function (e) {
                            // @ts-ignore
                            if (this.classList.contains(CLASS_NAME)) {
                                // @ts-ignore
                                this.classList.remove(CLASS_NAME);
                                e.preventDefault();
                            }
                            e.stopPropagation();
                        });
                    });
                })(bootstrap);
            })();
        }
    }, []);

    // Report uncaught browser errors and unhandled promise rejections
    useEffect(() => {
        const onError = (event: ErrorEvent) => {
            trackError('window', event.error ?? event.message, {page: window.location.pathname});
        };
        const onRejection = (event: PromiseRejectionEvent) => {
            trackError('unhandledrejection', event.reason, {page: window.location.pathname});
        };
        window.addEventListener('error', onError);
        window.addEventListener('unhandledrejection', onRejection);
        return () => {
            window.removeEventListener('error', onError);
            window.removeEventListener('unhandledrejection', onRejection);
        };
    }, []);

    // scroll animation added
    useEffect(() => {
        (async () => {
            const scrollCue = (await import('plugins/scrollcue')).default;
            scrollCue.init({interval: -400, duration: 700, percentage: 0.8});
            scrollCue.update();
        })();
    }, [pathname]);

    return (
        <Fragment>
            <AuthProvider>
                <ThemeProvider>
                    <div className="page-loader"/>
                    <Component {...pageProps} />
                    <ChatWidget />
                    <Analytics />
                </ThemeProvider>
            </AuthProvider>
        </Fragment>
    );
}

export default MyApp;
