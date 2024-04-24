import NextLink from 'components/reuseable/links/NextLink'
import styles from './Home.module.css'
import { useAuth } from 'auth/AuthProvider'

const HomeHeader: React.FC = () => {
    const { isLoggedIn } = useAuth()

    return (
        <section
            className={`wrapper image-wrapper bg-image bg-overlay text-white ${styles.bgImage} ${styles.fullHeight} ${styles.centeredSection} ${styles.blurSection}`}
        >
            <div className="container pt-10 pt-md-20 pb-10 pb-md-20 text-center">
                <div className="row">
                    <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-6 mx-auto">
                        <h1 className="display-1 text-white mb-3">Electoral Stakeholders&apos; Network</h1>
                        <p className="lead fs-lg px-md-3 px-lg-7 px-xl-9 px-xxl-10">
                            Connecting Leaders in Electoral Management
                        </p>
                        {!isLoggedIn && <NextLink title="Register" href="/register" className="btn btn-soft-blue rounded-pill mt-2" />}
                        {!isLoggedIn && <p className={`lead fs-md px-md-3 px-lg-7 px-xl-9 px-xxl-10 py-4 ${styles.subtitleText}`}>
                            Already a member? <a
                                data-bs-toggle="modal"
                                data-bs-target="#modal-signin"
                                className={`hover more link-aqua`}
                            >Sign in</a>
                        </p>}

                        {
                            isLoggedIn && (
                                <div className="d-flex justify-content-center gap-2">
                                    <NextLink title="Events" href="/events" className="btn btn-soft-blue rounded-pill mt-2" />
                                    <NextLink title="Articles" href="/articles" className="btn btn-outline-white rounded-pill mt-2" />
                                    <NextLink title="Awards" href="/awards" className="btn btn-yellow rounded-pill mt-2" />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </section >
    )
}

export default HomeHeader