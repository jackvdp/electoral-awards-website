import { FC } from 'react';
import NextLink from 'components/reuseable/links/NextLink';

const CTA: FC = () => {
    return (
        <section
            className="wrapper image-wrapper bg-auto no-overlay bg-image text-center mb-14 bg-map"
            style={{ backgroundImage: 'url(/img/map.png)' }}
        >
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-xl-5 mx-auto">
                        <h2 className="display-4 mb-3 text-center">Want to attend?</h2>

                        <p className="lead mb-5 px-md-16 px-lg-3">
                            Register now to engage in insightful discussions, connect with electoral professionals from around the globe, and recognise excelence in electoral management.
                        </p>

                        <NextLink href="/register" title="Register" className="btn btn-lg btn-primary rounded-pill mx-1" />

                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;