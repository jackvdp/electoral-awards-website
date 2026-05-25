import {NextPage} from 'next';
import {Fragment} from 'react';
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import {awards} from 'data/winners25';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import WinnerCard from 'components/elements/winners/WinnerCard';
import PageProgress from 'components/common/PageProgress';
import CustomHead from "components/common/CustomHead";
import Link from "next/link";

const Winners: NextPage = () => {
    return (
        <Fragment>
            <CustomHead
                title="Winners – International Electoral Awards"
                description="Celebrating excellence in electoral management. Recognizing outstanding contributions and innovations in election administration and democratic processes."
            />
            <PageProgress/>

            <Navbar/>

            <SimpleBanner title={"Winners of the International Electoral Awards"}></SimpleBanner>

            <main className="content-wrapper">
                <section className="wrapper bg-light px-md-20 px-2 py-md-10 py-5 container">

                    <div className='text-center py-md-4 py-2 px-md-10 px-5'>
                        The most recent winners of the International Electoral Awards (2025), as well as those recognised for Outstanding Achievement:
                    </div>

                    <div className='row d-flex'>
                        {awards.map((award, index) => (
                            <div key={index} className='col-md-6 col-12 py-2'>
                                <WinnerCard awardName={award.awardName} winner={award.winner}
                                            runnersUp={award.runnersUp}/>
                            </div>
                        ))}
                    </div>

                    <div className='text-center py-md-4 py-2 mt-5'>
                        <p>View winners from previous years:</p>
                        <ul className="list-unstyled">
                            <li><Link className="text-decoration-none" href="/awards/2025/winners">2025 Winners</Link></li>
                            <li><Link className="text-decoration-none" href="/awards/2024/winners">2024 Winners</Link></li>
                        </ul>
                    </div>
                </section>

            </main>

            <Footer/>
        </Fragment>
    );
};

export default Winners;
