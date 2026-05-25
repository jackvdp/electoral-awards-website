import {NextPage} from 'next';
import {Fragment} from 'react';
import {Navbar} from 'components/blocks/navbar';
import {Footer} from 'components/blocks/footer';
import {awards} from 'data/winners24';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import WinnerCard from 'components/elements/winners/WinnerCard';
import PageProgress from 'components/common/PageProgress';
import CustomHead from "components/common/CustomHead";

const Winners: NextPage = () => {
    return (
        <Fragment>
            <CustomHead
                title="Winners – 20th International Electoral Awards"
                description="Celebrating excellence in electoral management. Recognizing outstanding contributions and innovations in election administration and democratic processes."
            />
            <PageProgress/>

            <Navbar/>

            <SimpleBanner title={"Winners of the International Electoral Awards 2024"}></SimpleBanner>

            <main className="content-wrapper">
                <section className="wrapper bg-light px-md-20 px-2 py-md-10 py-5 container">

                    <div className='text-center py-md-4 py-2 px-md-10 px-5'>
                        The Awarding Committee are delighted to announce the winners of the 2024 International Electoral
                        Awards, as well as recognise those for Outstanding Achievement:
                    </div>

                    <div className='row d-flex'>
                        {awards.map((award, index) => (
                            <div key={index} className='col-md-6 col-12 py-2'>
                                <WinnerCard awardName={award.awardName} winner={award.winner}
                                            runnersUp={award.runnersUp}/>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            <Footer/>
        </Fragment>
    );
};

export default Winners;