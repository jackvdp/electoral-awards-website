import { FC } from 'react';
import NextLink from 'components/reuseable/links/NextLink';

const CTA: FC = () => {
    return (
        <section
            className="wrapper image-wrapper bg-auto no-overlay bg-image text-center mb-14 bg-map"
            style={{ backgroundImage: 'url(/img/illustrations/map.png)' }}
        >
            <div className="container">
                <div className="row">
                    <div className="py-md-18 col-lg-6 mx-auto">
                        <h2 className="display-4 mb-3 text-center">Want to join?</h2>

                        <p className="lead mb-5 px-md-16 px-lg-3">
                            Join our community, enjoy access to industry leading events and connect with global experts in electoral management – Sign up now!
                        </p>

                        <NextLink href="/register" title="Register" className="btn btn-lg btn-primary rounded-pill mx-1" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;