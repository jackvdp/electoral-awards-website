import { FC, Fragment } from 'react';
import Accordion from 'components/reuseable/accordion';
// -------- data -------- //
import { accordionList1 } from 'data/faq';

const FAQ: FC = () => {
  return (
    <Fragment>
      <h2 className="text-uppercase text-muted mb-3 text-center">About</h2>
      <p className="mb-10 px-lg-12 px-xl-15 text-center">
        Welcome to the 19th International Electoral Affairs Symposium &amp; Awards Ceremony, an extraordinary four-day event held from <b>13th to 16th November 2023</b>.<br />
        Organized by the <b>International Centre for Parliamentary Studies</b> in collaboration with the <b>Portuguese National Electoral Commission</b>, this symposium will draw together leading figures in the world of electoral affairs.<br />
      </p>

      <div className="accordion-wrapper" id="accordion">
        <div className="row">
          {accordionList1.map((items, i) => {
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
