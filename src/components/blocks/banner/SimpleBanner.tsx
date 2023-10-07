const SimpleBanner: React.FC<SimpleBannerProp> = ({title}) => {

    return (
        <section
            className="wrapper image-wrapper bg-image bg-overlay text-white"
            style={{ backgroundImage: 'url(/img/photos/bg22.png)' }}
        >
            <div className="container py-10 text-center">
                <div className="row">
                    <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-6 mx-auto">
                        <h1 className="display-1 text-white">{title}</h1>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SimpleBanner

interface SimpleBannerProp {
    title: String
}