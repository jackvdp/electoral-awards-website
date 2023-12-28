import NextLink from 'components/reuseable/links/NextLink'
import styles from './Home.module.css'

const HomeHeader: React.FC = () => {
    return (
        <section
            className={`wrapper image-wrapper bg-image bg-overlay text-white ${styles.fullHeight} ${styles.centeredSection} ${styles.blurSection}`}
            style={{ backgroundImage: 'url(/img/photos/unitednations.jpeg)' }}
        >
            <div className="container pt-10 pt-md-20 pb-10 pb-md-20 text-center">
                <div className="row">
                    <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-6 mx-auto">
                        <h1 className="display-1 text-white mb-3">Electoral Stakeholders&apos; Network</h1>
                        <p className="lead fs-lg px-md-3 px-lg-7 px-xl-9 px-xxl-10">
                            Connecting Leaders in Electoral Management
                        </p>
                        <NextLink title="Register" href="/register" className="btn btn-soft-blue rounded-pill mt-2" />
                        <p className="lead fs-md px-md-3 px-lg-7 px-xl-9 px-xxl-10 py-4">
                            <p className={styles.subtitleText}>Already a member? <NextLink title="Sign in" className={`hover more link-aqua`} href="/register"/></p>
                        </p>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default HomeHeader