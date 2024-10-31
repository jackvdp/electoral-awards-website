import { FC, Fragment } from 'react';
import Accordion from 'components/reuseable/accordion';
// -------- data -------- //
import { FAQs } from 'data/faq';

const FAQ: FC = () => {
  return (
    <Fragment>
      <h2 className="text-muted text-center">FAQs</h2>

      <div className="accordion-wrapper" id="accordion">
        <div className="row gy-md-6 gy-xl-0 p-md-6">
          {FAQs.map((item, i) => {
            return (
              <div className="col-md-6" key={i}>
                <Accordion key={item.no} {...item} />
              </div>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
};

export default FAQ;
