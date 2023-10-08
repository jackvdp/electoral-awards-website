import { FC, Fragment } from 'react';
import Accordion from 'components/reuseable/accordion';
// -------- data -------- //
import { FAQs } from 'data/faq';

const FAQ: FC = () => {
  return (
    <Fragment>
      <h2 className="text-muted text-center">FAQ</h2>

      <div className="accordion-wrapper" id="accordion">
        <div className="row gy-6 gy-xl-0 p-6">
          {FAQs.map((items, i) => {
            return (
              <div className="col-md-6" key={i}>
                {items.map((item) => (
                  <Accordion key={item.no} {...item} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
};

export default FAQ;
