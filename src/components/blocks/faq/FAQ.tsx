import { FC, Fragment } from 'react';
import Accordion from 'components/reuseable/accordion';
// -------- data -------- //
import { FAQs } from 'data/faq';

const FAQ: FC = () => {
  return (
    <Fragment>
      <h2 className="text-uppercase text-muted mb-3 text-center">About</h2>
      <p className="mb-5 px-lg-12 px-xl-15">
        Welcome to the 19th International Electoral Affairs Symposium &amp; Awards Ceremony, a four-day event held from <b>13th to 16th November 2023.</b>
      </p>
      <p className="mb-5 px-lg-12 px-xl-15">
        This event is organized by the <b>International Centre for Parliamentary Studies</b> in collaboration with the <b>Portuguese National Electoral Commission</b>, and will draw together leading figures in the world of electoral affairs, and recognise excellence in electoral management.
      </p>
      <p className="mb-10 px-lg-12 px-xl-15">
        Be part of the dynamic dialogue, participate in enlightening panel discussions, and join us in celebrating the significant contributions to electoral democracy at the prestigious Awards Ceremony. Don't miss this exclusive opportunity to engage, share, and learn with global peers.
      </p >

      <div className="accordion-wrapper" id="accordion">
        <div className="row">
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
