import { NextPage } from 'next';
import { Fragment } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import SimpleBanner from 'components/blocks/banner/SimpleBanner';
import { AwardCategory, categories } from 'data/award-categories';
import Accordion from 'components/reuseable/accordion';
import { DropdownTabs } from 'components/reuseable/Dropdown';
import PageProgress from 'components/common/PageProgress';

const Categories: NextPage = () => {

    const bodyContent = (category: AwardCategory) => {
        let content = category.description;

        if (category.context) {
            content += "\n\n**Context** \n\n" + category.context;
        }

        if (category.criteria) {
            content += "\n\n**Criteria** \n\n" + category.criteria;
        }

        return content;
    };

    const tabItems = categories.map((category, i) => ({
        title: category.name,
        content: (
            <div className="accordion-wrapper" id={`accordion-${i}`}>
                <div className="row">
                    <div key={i}>
                        <Accordion
                            no={i.toString()}
                            body={bodyContent(category)}
                            heading={category.name}
                            expand={false}
                        />
                    </div>
                </div>
            </div>
        ),
        icon: <i className="uil uil-trophy pe-1" />
    }))

    return (
        <Fragment>
            <PageProgress/>

            <Navbar />

            <SimpleBanner title={"Award Categories"} />

            <main className="content-wrapper">
                <section className="wrapper bg-light px-md-20 px-5 py-md-10 py-5 ">

                    <DropdownTabs items={tabItems} />

                </section>
            </main>

            <Footer />
        </Fragment>
    );
};

export default Categories;